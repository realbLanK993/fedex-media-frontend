import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GenericObject {
  [key: string]: any;
}

/**
 * Escapes a cell value for CSV format.
 * If the value contains a comma, newline, or double quote, it will be enclosed in double quotes.
 * Existing double quotes within the value will be escaped by doubling them.
 * @param cellValue The value of the cell.
 * @returns The CSV-escaped string.
 */
function escapeCsvCell(cellValue: any): string {
  if (cellValue === null || cellValue === undefined) {
    return "";
  }
  const stringValue = String(cellValue);

  // If the string contains a comma, a double quote, a newline, or a carriage return
  if (/[",\n\r]/.test(stringValue)) {
    // Escape internal double quotes by replacing them with two double quotes
    // and then wrap the entire string in double quotes.
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Converts an array of JSON objects to a CSV string and triggers a download.
 * @param jsonData Array of objects to convert.
 * @param filename The desired filename for the downloaded CSV (e.g., "data.csv").
 * @param customHeaders Optional array of strings for custom headers. If not provided, headers are derived from the first object's keys.
 */
export function downloadJsonAsCsv<T extends GenericObject>(
  jsonData: T[],
  filename: string,
  customHeaders?: string[]
): void {
  if (!jsonData || jsonData.length === 0) {
    console.warn("No data provided to download.");
    // Optionally, you could download an empty file or a file with only headers
    // For now, we just return.
    // To download an empty file with headers (if customHeaders provided):
    // if (customHeaders && customHeaders.length > 0) {
    //   const emptyCsvContent = customHeaders.map(escapeCsvCell).join(',') + '\n';
    //   triggerCsvDownload(emptyCsvContent, filename);
    // }
    return;
  }

  // Determine headers
  // Use customHeaders if provided, otherwise derive from the first object
  const headers =
    customHeaders && customHeaders.length > 0
      ? customHeaders
      : Object.keys(jsonData[0]);

  // Convert headers to a CSV row
  const headerRow = headers.map(escapeCsvCell).join(",");

  // Convert data objects to CSV rows
  const dataRows = jsonData.map((rowObject) => {
    return headers
      .map((header) => {
        // Ensure that the value exists, otherwise use an empty string
        const cellValue = rowObject.hasOwnProperty(header)
          ? rowObject[header]
          : "";
        return escapeCsvCell(cellValue);
      })
      .join(",");
  });

  // Combine header and data rows
  const csvContent = [headerRow, ...dataRows].join("\n");

  triggerCsvDownload(csvContent, filename);
}

/**
 * Helper function to trigger the browser download.
 * @param csvContent The CSV string content.
 * @param filename The filename for the download.
 */
function triggerCsvDownload(csvContent: string, filename: string): void {
  // Create a Blob with the CSV data and UTF-8 encoding
  // Adding BOM for better Excel compatibility with UTF-8 characters
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  // Create a link element
  const link = document.createElement("a");

  if (link.download !== undefined) {
    // Check if HTML5 download attribute is supported
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      filename.endsWith(".csv") ? filename : `${filename}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
  } else {
    // Fallback for older browsers (less common now)
    // This might open the CSV in the browser window instead of downloading
    console.warn("Download attribute not supported. Attempting fallback.");
    (window.navigator as any).msSaveBlob?.(blob, filename); // For IE
    // For other very old browsers, this might be the best you can do,
    // or you'd need a server-side solution.
  }
}
