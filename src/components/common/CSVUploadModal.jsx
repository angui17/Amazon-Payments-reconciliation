import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import { mapToOrders, mapToPayments, mapToRefunds } from '../../utils/csvMapper'

const CSVUploadModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewHtml, setPreviewHtml] = useState(null)
  const [progress, setProgress] = useState(0)
  const [steps, setSteps] = useState({
    upload: 'pending',
    read: 'pending',
    parse: 'pending',
    process: 'pending',
    db: 'pending',
    complete: 'pending'
  })
  const [results, setResults] = useState(null)
  const { addRows } = useData()

  const reset = () => {
    setSelectedFile(null)
    setPreviewHtml(null)
    setProgress(0)
    setSteps({ upload: 'pending', read: 'pending', parse: 'pending', process: 'pending', db: 'pending', complete: 'pending' })
    setResults(null)
  }

  const handleFile = (file) => {
    setSelectedFile(file)
    showCSVPreview(file)
  }

  const showCSVPreview = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      const lines = content.split('\n').slice(0, 11)
      // build simple HTML preview
      if (lines.length > 0) {
        const headerRow = lines[0].split(',').map(h => `<th>${h.trim()}</th>`).join('')
        let body = ''
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue
          const cells = lines[i].split(',').map(c => `<td>${c.trim()}</td>`).join('')
          body += `<tr>${cells}</tr>`
        }
        setPreviewHtml(`<thead><tr>${headerRow}</tr></thead><tbody>${body}</tbody>`)
      }
    }
    reader.readAsText(file)
  }

  const updateStep = (key, status) => setSteps(s => ({ ...s, [key]: status }))
  const updateProgress = (p) => setProgress(p)

  const delay = (ms) => new Promise(res => setTimeout(res, ms))

  const readFileAsText = (file) => new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = (e) => resolve(e.target.result)
    r.onerror = reject
    r.readAsText(file)
  })

  function parseAmazonCSV(csvContent) {
    // robust CSV parsing: handle quoted fields containing commas
    const normalizeNewlines = (s) => s.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    const content = normalizeNewlines(csvContent || '')
    const allLines = content.split('\n')

    // find header line (looks for 'date/time' header) or fallback to first non-empty
    let headerIndex = allLines.findIndex(l => /date\s*\/\s*time|date\/time|date,time|date time/i.test(l))
    if (headerIndex === -1) headerIndex = allLines.findIndex(l => l.trim() !== '')
    if (headerIndex === -1) return []

    const splitCSVLine = (line) => {
      const out = []
      let cur = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') {
          // handle escaped double quotes
          if (inQuotes && line[i + 1] === '"') {
            cur += '"'
            i++
            continue
          }
          inQuotes = !inQuotes
          continue
        }
        if (ch === ',' && !inQuotes) {
          out.push(cur)
          cur = ''
          continue
        }
        cur += ch
      }
      out.push(cur)
      return out.map(s => s.trim())
    }

    const headers = splitCSVLine(allLines[headerIndex]).map(h => h.replace(/"/g, '').replace(/\//g, '').replace(/\s/g, '').toUpperCase())
    const data = []
    for (let i = headerIndex + 1; i < allLines.length; i++) {
      const line = allLines[i]
      if (!line || !line.trim()) continue
      const cols = splitCSVLine(line)
      const record = {}
      for (let j = 0; j < headers.length; j++) {
        const key = headers[j] || `COL_${j}`
        let val = cols[j] === undefined ? '' : cols[j]
        // strip surrounding quotes
        if (val && val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1)
        }
        record[key] = val
      }
      // normalize common numeric/empty fields
      if (record.QUANTITY === '') record.QUANTITY = '0'
      data.push(record)
    }
    return data
  }

  const processCSVFile = async () => {
    if (!selectedFile) return
    updateProgress(10); updateStep('upload', 'processing')
    await delay(600)
    updateStep('upload', 'completed'); updateProgress(20)

    updateStep('read', 'processing')
    const content = await readFileAsText(selectedFile)
    updateStep('read', 'completed'); updateProgress(30)

    updateStep('parse', 'processing')
    await delay(300)
    const parsed = parseAmazonCSV(content)
    updateStep('parse', 'completed'); updateProgress(50)

    updateStep('process', 'processing')
    // simulate processing each record
    for (let i = 0; i < parsed.length; i++) {
      await delay(20)
      const p = 50 + Math.floor(((i + 1) / Math.max(1, parsed.length)) * 30)
      updateProgress(p)
    }
    updateStep('process', 'completed'); updateProgress(80)

    updateStep('db', 'processing')
    await delay(600)
    updateStep('db', 'completed'); updateProgress(95)

    updateStep('complete', 'processing')
    await delay(200)
    updateStep('complete', 'completed'); updateProgress(100)

    setResults({ fileName: selectedFile.name, total: parsed.length, sample: parsed.slice(0, 3) })
    try {
      // map parsed rows into `orders` shape and add to DataContext
      const orders = parsed.map((r, i) => mapToOrders(r, i)).filter(Boolean)
      if (orders.length) addRows(orders)
      // other pages (payments/refunds) can be mapped similarly when needed
    } catch (e) {
      // ignore mapping errors
    }
  }

  if (!isOpen) return null

  return (
    <div className={`csv-upload-modal ${isOpen ? 'active' : ''}`} role="dialog" aria-modal="true">
      <div className="csv-upload-content">
        <div className="csv-upload-header">
          <h3>Upload Amazon CSV File</h3>
          <button className="close-modal" onClick={() => { reset(); onClose && onClose() }}>&times;</button>
        </div>

        <div className="csv-upload-body">
          <div className="file-upload-area" onClick={() => document.getElementById('csv-file-input')?.click()}>
            <h3>Select CSV File</h3>
            <p>Drag & drop your Amazon settlement report CSV file here or click to browse</p>
            <p className="kpi-label">Expected format: Settlement report from Amazon Seller Central</p>
            <button className="btn btn-primary" style={{ marginTop: 15 }} onClick={() => document.getElementById('csv-file-input')?.click()}>
              <span>📁</span> Browse File
            </button>
            <input id="csv-file-input" type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.length) handleFile(e.target.files[0]) }} />
          </div>

          {selectedFile && (
            <div id="file-info" style={{ display: 'block', marginTop: 20 }}>
              <h4>Selected File</h4>
              <p><strong>File Name:</strong> {selectedFile.name}</p>
              <p><strong>File Size:</strong> {(selectedFile.size/1024/1024).toFixed(2)} MB</p>
              <p><strong>File Type:</strong> {selectedFile.type || 'text/csv'}</p>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={processCSVFile}>Process File</button>
            </div>
          )}

          {previewHtml && (
            <div className="csv-preview" style={{ display: 'block', marginTop: 20 }}>
              <h4>CSV Preview (First 10 rows)</h4>
              <div className="table-container">
                <table className="csv-preview-table" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </div>
            </div>
          )}

          {progress > 0 && (
            <div className="csv-upload-progress" style={{ display: 'block', marginTop: 20 }}>
              <h4>Processing Progress</h4>
              <div className="progress-info">
                <span>Processing CSV file...</span>
                <span className="progress-percentage">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {results && (
            <div id="processing-results" style={{ display: 'block', marginTop: 20 }}>
              <h4>Processing Results</h4>
              <div>
                <p><strong>File:</strong> {results.fileName}</p>
                <p><strong>Total Records Processed:</strong> {results.total}</p>
                <p><strong>Status:</strong> <span className="status-badge status-success">Success</span></p>
              </div>
              {results.sample && (
                <div style={{ marginTop: 12 }}>
                  <h5>Sample Data (First 3 records)</h5>
                  <pre style={{ background: '#f9f9f9', padding: 12, borderRadius: 6, fontSize: 12 }}>{JSON.stringify(results.sample, null, 2)}</pre>
                </div>
              )}
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary" onClick={() => { reset(); onClose && onClose() }}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CSVUploadModal