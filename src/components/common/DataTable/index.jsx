import React from 'react';

const DataTable = ({ columns = [], data = [] }) => (
  <div className="data-table">
    <table>
      <thead>
        <tr>{columns.map(c => <th key={c.key}>{c.title}</th>)}</tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>{columns.map(c => <td key={c.key}>{row[c.key]}</td>)}</tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default DataTable;