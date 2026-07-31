"use client";

import { ReactNode } from "react";

// ---- Types ----
export interface DataTableColumn<T> {
    key: string;
    header: ReactNode;
    align?: "left" | "center" | "right";
    headerClassName?: string;
    cellClassName?: string;
    render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
    title: ReactNode;
    filters?: ReactNode;
    footer?: ReactNode;
    columns: DataTableColumn<T>[];
    data: T[];
    keyExtractor: (row: T) => string | number;
    rowActions?: (row: T) => ReactNode;
    emptyMessage?: ReactNode;
}

const ALIGN_CLASS: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

export default function DataTable<T>({
    title,
    filters,
    footer,
    columns,
    data,
    keyExtractor,
    rowActions,
    emptyMessage = "No records found.",
}: DataTableProps<T>) {
    return (
        <div className="bg-white border border-zinc-200 shadow-sm rounded-xl overflow-hidden flex flex-col flex-1">
            {/* HEADER */}
            <div className="flex items-center justify-between p-3 border-b border-zinc-100">
                <h2 className="text-[13px] font-bold text-zinc-800 flex items-center gap-2">
                    {title}
                </h2>
                {filters && <div className="flex items-center gap-2">{filters}</div>}
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <div className="w-full overflow-x-auto">
                    <table className="w-full table-auto border-collapse text-left">
                        <thead className="bg-zinc-50/50">
                            <tr className="border-b border-zinc-100">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={`py-2 px-3 whitespace-nowrap text-[10px] font-bold uppercase text-zinc-500 ${
                                            ALIGN_CLASS[col.align ?? "left"]
                                        } ${col.headerClassName ?? ""}`}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                                {rowActions && (
                                    <th className="py-2 px-3 whitespace-nowrap text-center text-[10px] font-bold uppercase text-zinc-500">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>

                        <tbody className="text-[11px]">
                            {data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={columns.length + (rowActions ? 1 : 0)}
                                        className="py-6 px-3 text-center text-zinc-400 text-[11px]"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}

                            {data.map((row) => (
                                <tr
                                    key={keyExtractor(row)}
                                    className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`py-2 px-3 whitespace-nowrap ${
                                                ALIGN_CLASS[col.align ?? "left"]
                                            } ${col.cellClassName ?? ""}`}
                                        >
                                            {col.render(row)}
                                        </td>
                                    ))}
                                    {rowActions && (
                                        <td className="py-2 px-3 whitespace-nowrap">
                                            <div className="flex justify-center">
                                                {rowActions(row)}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FOOTER */}
            {footer && (
                <div className="p-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                    {footer}
                </div>
            )}
        </div>
    );
}