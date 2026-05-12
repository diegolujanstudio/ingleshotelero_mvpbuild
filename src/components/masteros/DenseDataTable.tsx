"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DenseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  pageSize?: number;
  emptyMessage?: string;
  initialSorting?: SortingState;
  onRowClick?: (row: T) => void;
  className?: string;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
}

/**
 * Brand-tokenized TanStack Table wrapper.
 *
 * Editorial-dense: 8px row padding, hairline divisions, ivory-soft hover.
 * Pagination is client-side at `pageSize` (default 50). Sort indicators are
 * lucide chevrons. Active row hover ink-tints.
 */
export function DenseDataTable<T>({
  data,
  columns,
  pageSize = 50,
  emptyMessage = "Sin resultados.",
  initialSorting = [],
  onRowClick,
  className,
  globalFilter,
  onGlobalFilterChange,
}: DenseDataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const table = useReactTable<T>({
    data,
    columns,
    state: { sorting, globalFilter: globalFilter ?? "" },
    onSortingChange: setSorting,
    onGlobalFilterChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const total = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="overflow-x-auto rounded-md border border-hair bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-hair bg-ivory-soft">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={cn(
                        "px-3 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted",
                        canSort && "cursor-pointer select-none hover:text-espresso",
                      )}
                      style={{ width: header.getSize?.() }}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {canSort &&
                          (sorted === "asc" ? (
                            <ChevronUp className="h-3 w-3" aria-hidden />
                          ) : sorted === "desc" ? (
                            <ChevronDown className="h-3 w-3" aria-hidden />
                          ) : (
                            <ChevronsUpDown className="h-3 w-3 opacity-40" aria-hidden />
                          ))}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center font-sans text-t-caption text-espresso-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(
                    "border-b border-hair last:border-0",
                    onRowClick
                      ? "cursor-pointer hover:bg-ink-tint/40"
                      : "hover:bg-ivory-soft",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 py-2 font-sans text-t-body text-espresso"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
          {total} {total === 1 ? "fila" : "filas"} · Página {pageIndex + 1} de {Math.max(pageCount, 1)}
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-pill border border-hair bg-white px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft transition hover:border-espresso/40 hover:text-espresso disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-pill border border-hair bg-white px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-soft transition hover:border-espresso/40 hover:text-espresso disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
