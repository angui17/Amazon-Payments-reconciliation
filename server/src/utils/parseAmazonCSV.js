// Basic CSV parsing helper (server-side)
function parseAmazonCSV(csvContent) {
  const lines = csvContent.split('\n');
  let flag = 0;
  let readContents = '';
  for (let line of lines) {
    if (line.toLowerCase().includes('date/time')) {
      flag = 1;
    }
    if (flag === 1) {
      if (!readContents) readContents = line.replace(/","/g, '"|"').replace(/'/g, '');
      else readContents += '\n' + line.replace(/","/g, '"|"').replace(/'/g, '');
    }
  }
  const rows = readContents.split('\n');
  if (!rows || rows.length === 0) return [];
  const headers = rows[0].split('|').map(h => h.replace(/"/g, '').replace(/\//g, '').replace(/\s/g, '').toUpperCase());
  const data = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue;
    const row = rows[i].split('|');
    const record = {};
    for (let j = 0; j < headers.length && j < row.length; j++) {
      record[headers[j]] = row[j].replace(/"/g, '');
    }
    if (record.QUANTITY === '') record.QUANTITY = '0';
    data.push(record);
  }
  return data;
}

module.exports = { parseAmazonCSV };
