/** Minimal RFC 4180-style CSV parse (handles quoted fields and doubled quotes). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;

  const pushCell = () => {
    row.push(cur);
    cur = "";
  };

  const pushRow = () => {
    if (row.length === 1 && row[0] === "" && rows.length === 0) {
      row = [];
      return;
    }
    if (row.some((c) => c.length > 0) || row.length > 1) {
      rows.push(row);
    }
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (inQuotes) {
      if (c === '"') {
        const next = text[i + 1];
        if (next === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      pushCell();
    } else if (c === "\n") {
      pushCell();
      pushRow();
    } else if (c === "\r") {
      if (text[i + 1] === "\n") i++;
      pushCell();
      pushRow();
    } else {
      cur += c;
    }
  }

  pushCell();
  if (row.length && row.some((c) => c.length > 0)) {
    rows.push(row);
  }

  return rows;
}

export function rowsToObjects(
  rows: string[][],
): Record<string, string>[] {
  if (rows.length === 0) return [];
  const header = rows[0]!.map((h) => h.trim().toLowerCase());
  const out: Record<string, string>[] = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r]!;
    const obj: Record<string, string> = {};
    for (let c = 0; c < header.length; c++) {
      obj[header[c]!] = cells[c]?.trim() ?? "";
    }
    out.push(obj);
  }
  return out;
}
