
export function exportText(filename, content) {
  const blob = new Blob([content], {
    type: "text/plain;charset=utf-8"
  });

  downloadBlob(filename, blob);
}

export function exportJSON(filename, data) {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json;charset=utf-8" }
  );

  downloadBlob(filename, blob);
}

export function exportCSV(filename, rows) {
  const csv = rows.map(row =>
    row.map(value =>
      `"${String(value ?? "").replace(/"/g, '""')}"`
    ).join(",")
  ).join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8"
  });

  downloadBlob(filename, blob);
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
