"use client";

import { useRef, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import {
  FileSpreadsheet,
  X,
  AlertCircle,
  CheckCircle2,
  Download,
  Info,
  UploadCloud,
  Loader2,} from "lucide-react";

export interface ColumnConfig<T = Record<string, any>> {
  key: keyof T & string;
  label: string;
  required?: boolean;
  unique?: boolean;
  validate?: (value: any, row: T) => string | null | undefined;
  sampleValue?: string | number;
}

export interface RowError {
  row: number;
  message: string;
}

export interface BulkUploadModalProps<T = Record<string, any>> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  columns: ColumnConfig<T>[];
  sampleFileName?: string;
  maxFileSizeMB?: number;
  existingData?: T[];
  onImport: (rows: T[]) => Promise<void> | void;
}

type View = "upload" | "error" | "success" | "example";

const MAX_ERRORS_PREVIEW = 3;

export default function BulkUploadModal<T = Record<string, any>>({
  open,
  onClose,
  title = "Upload Employee Data",
  description = "Upload an Excel file to import employee data in bulk.",
  columns,
  sampleFileName = "Example_File.xlsx",
  maxFileSizeMB = 10,
  existingData = [],
  onImport,
}: BulkUploadModalProps<T>) {
  const [view, setView] = useState<View>("upload");
  const [fileName, setFileName] = useState("");
  const [uploadedAt, setUploadedAt] = useState("");
  const [rows, setRows] = useState<T[]>([]);
  const [errors, setErrors] = useState<RowError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setView("upload");
    setFileName("");
    setRows([]);
    setErrors([]);
    setIsProcessing(false);
    setIsImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const normalize = (v: any) => String(v ?? "").trim().toLowerCase();

  const validateRows = (parsed: Record<string, any>[]): { valid: T[]; errs: RowError[] } => {
    const errs: RowError[] = [];
    const valid: T[] = [];
    const uniqueCols = columns.filter((c) => c.unique);

    const normalizedRows = parsed.map((rawRow) => {
      const row: Record<string, any> = {};
      for (const col of columns) {
        const match = Object.keys(rawRow).find(
          (k) =>
            k.trim().toLowerCase() === col.label.trim().toLowerCase() ||
            k.trim().toLowerCase() === col.key.toString().toLowerCase()
        );
        row[col.key] = match ? rawRow[match] : undefined;
      }
      return row;
    });

    const duplicateRowIndices = new Map<number, string[]>();

    for (const col of uniqueCols) {
      const seen = new Map<string, number>();
      const existingValues = new Set(
        existingData.map((r) => normalize((r as Record<string, any>)[col.key])).filter(Boolean)
      );

      normalizedRows.forEach((row, idx) => {
        const raw = row[col.key];
        const value = normalize(raw);
        if (!value) return;

        const isDupeInFile = seen.has(value);
        const isDupeInExisting = existingValues.has(value);

        if (isDupeInFile || isDupeInExisting) {
          const list = duplicateRowIndices.get(idx) ?? [];
          list.push(col.label);
          duplicateRowIndices.set(idx, list);
        } else {
          seen.set(value, idx);
        }
      });
    }

    const rowSignature = (row: Record<string, any>) =>
      columns.map((c) => normalize(row[c.key])).join("||");

    const strictDupeIndices = new Set<number>();
    const seenStrict = new Map<string, number>();
    normalizedRows.forEach((row, idx) => {
      const sig = rowSignature(row);
      if (!sig.replace(/\|\|/g, "")) return;
      if (seenStrict.has(sig)) {
        strictDupeIndices.add(idx);
        strictDupeIndices.add(seenStrict.get(sig)!);
      } else {
        seenStrict.set(sig, idx);
      }
    });

    normalizedRows.forEach((row, idx) => {
      const rowNum = idx + 2;
      let rowHasError = false;

      for (const col of columns) {
        const value = row[col.key];

        if (col.required && (value === undefined || value === null || String(value).trim() === "")) {
          errs.push({ row: rowNum, message: `${col.label} is missing` });
          rowHasError = true;
          continue;
        }
        if (col.validate) {
          const err = col.validate(value, row as T);
          if (err) {
            errs.push({ row: rowNum, message: err });
            rowHasError = true;
          }
        }
      }

      const dupeCols = duplicateRowIndices.get(idx);
      if (dupeCols?.length) {
        errs.push({
          row: rowNum,
          message: `Duplicate ${dupeCols.join(", ")} — already used in another row or existing record`,
        });
        rowHasError = true;
      }

      if (strictDupeIndices.has(idx)) {
        errs.push({
          row: rowNum,
          message: `Strict duplicate — this row is identical to another row`,
        });
        rowHasError = true;
      }

      if (!rowHasError) valid.push(row as T);
    });

    return { valid, errs };
  };

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setErrors([{ row: 0, message: "Only .xlsx or .xls files are supported." }]);
      setView("error");
      return;
    }
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setErrors([{ row: 0, message: `File exceeds ${maxFileSizeMB}MB limit.` }]);
      setView("error");
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);
    setUploadedAt(
      new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });

      const { valid, errs } = validateRows(parsed);
      setRows(valid);
      setErrors(errs);
      setView(errs.length > 0 ? "error" : "success");
    } catch (e) {
      setErrors([{ row: 0, message: "Could not read the file. Please check the format." }]);
      setView("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const downloadWorkbook = async (workbook: ExcelJS.Workbook, fileNameToSave: string) => {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileNameToSave;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadExample = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sheet1");

    sheet.columns = columns.map((c) => ({ header: c.label, key: c.key, width: 22 }));

    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell: any) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });

    await downloadWorkbook(workbook, sampleFileName);
  };

  const downloadErrorReport = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Errors");

    sheet.columns = [
      { header: "Row", key: "row", width: 10 },
      { header: "Error", key: "error", width: 60 },
    ];
    sheet.getRow(1).eachCell((cell: any) => {
      cell.font = { bold: true };
    });

    errors.forEach((e) => {
      sheet.addRow({ row: e.row === 0 ? "-" : e.row, error: e.message });
    });

    await downloadWorkbook(workbook, `${fileName.replace(/\.[^.]+$/, "")}_Errors.xlsx`);
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      await onImport(rows);
      handleClose();
    } finally {
      setIsImporting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div className="flex gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                view === "error"
                  ? "bg-red-50"
                  : view === "success"
                  ? "bg-green-50"
                  : "bg-emerald-50"
              }`}
            >
              {view === "error" ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : view === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {view === "error"
                  ? "Upload Failed"
                  : view === "success"
                  ? "Upload Successful"
                  : title}
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {view === "error"
                  ? "We found some errors in your file. Please fix them and try again."
                  : view === "success"
                  ? "Your file has been uploaded and processed successfully."
                  : description}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          {view === "upload" && (
            <>
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/40 px-6 py-10 text-center"
              >
                {isProcessing ? (
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                ) : (
                  <UploadCloud className="h-8 w-8 text-blue-500" />
                )}
                <p className="mt-3 text-sm text-gray-700">
                  {isProcessing ? "Reading file..." : "Drag and drop your Excel file here"}
                </p>
                {!isProcessing && (
                  <>
                    <p className="my-1 text-xs text-gray-400">or</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Choose File
                    </button>
                  </>
                )}
                <p className="mt-3 text-xs text-gray-400">
                  Only .xlsx or .xls files are supported. Max file size: {maxFileSizeMB}MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden h-8"
                  onChange={onFileInputChange}
                />
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" /> Make sure your file follows the required format.
                </span>
                <button
                  onClick={downloadExample}
                  className="flex items-center gap-1 font-medium text-blue-600 hover:underline"
                >
                  <Download className="h-3.5 w-3.5" /> Download Template
                </button>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-800">Import Guidelines</p>
                <ul className="grid grid-cols-1 gap-1.5 text-xs text-gray-600 sm:grid-cols-2">
                  <li>✓ First row must contain column headers</li>
                  <li>✓ Ensure all required fields are filled</li>
                  <li>✓ Do not modify the column names</li>
                  <li>✓ Remove any extra rows or columns</li>
                </ul>
              </div>
            </>
          )}

          {view === "error" && (
            <>
              <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                <p className="text-sm font-medium text-red-700">
                  {errors.length} error{errors.length !== 1 ? "s" : ""} found in the uploaded file
                </p>
                <p className="mt-0.5 text-xs text-red-500">
                  Please download the error report to see all the issues.
                </p>
              </div>

              {fileName && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{fileName}</p>
                      <p className="text-xs text-gray-400">Uploaded on {uploadedAt}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-red-500">
                    {rows.length + errors.length} Rows • {errors.length} Errors
                  </span>
                </div>
              )}

              <div className="mt-3">
                <p className="mb-1 text-sm font-medium text-gray-800">Common Errors Found</p>
                <ul className="space-y-1 text-xs text-gray-600">
                  {errors.slice(0, MAX_ERRORS_PREVIEW).map((e, i) => (
                    <li key={i}>
                      • {e.row > 0 ? `Row ${e.row}: ` : ""}
                      {e.message}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
                <span className="text-gray-500">Download the error report for complete details.</span>
                <button
                  onClick={downloadErrorReport}
                  className="flex items-center gap-1 font-medium text-blue-600 hover:underline"
                >
                  <Download className="h-3.5 w-3.5" /> Download Error Report
                </button>
              </div>
            </>
          )}

          {view === "success" && (
            <>
              <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-sm text-green-700">
                All data is valid and ready to be imported.
              </div>

              <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-100 p-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{fileName}</p>
                    <p className="text-xs text-gray-400">Uploaded on {uploadedAt}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-600">
                  {rows.length} Rows • 0 Errors
                </span>
              </div>

              <p className="mt-4 mb-2 text-sm font-medium text-gray-800">Summary</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <SummaryStat value={rows.length} label="Total Rows" color="text-blue-600" />
                <SummaryStat value={rows.length} label="Valid Rows" color="text-green-600" />
                <SummaryStat value={0} label="Errors" color="text-red-500" />
                <SummaryStat value={0} label="Warnings" color="text-amber-500" />
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  <strong>Next Step:</strong> Click on &apos;Import Data&apos; to import {rows.length}{" "}
                  records into the system.
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 p-4">
          <button
            onClick={view === "error" ? reset : handleClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {view === "error" ? "Cancel" : "Cancel"}
          </button>
          {view === "upload" && (
            <button
              disabled
              className="cursor-not-allowed rounded-lg bg-blue-300 px-4 py-2 text-sm font-medium text-white"
            >
              Upload
            </button>
          )}
          {view === "error" && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Upload Corrected File
            </button>
          )}
          {view === "success" && (
            <button
              onClick={handleImport}
              disabled={isImporting}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {isImporting && <Loader2 className="h-4 w-4 animate-spin" />}
              Import Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-lg border border-gray-100 py-2">
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}