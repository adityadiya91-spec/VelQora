import { useState } from "react";
import { Search } from "lucide-react";
import { InputBox } from "@/components/design/InputBox";
import { cn } from "@/lib/utils";

export function AdminTable({
  title,
  subtitle,
  actions,
  searchPlaceholder = "Search...",
  searchKey,
  columns = [],
  data = [],
  onRowClick,
  className,
}) {
  const [query, setQuery] = useState("");

  const filtered = data.filter((item) => {
    if (!query) return true;
    if (searchKey && item[searchKey]) {
      return String(item[searchKey]).toLowerCase().includes(query.toLowerCase());
    }
    return JSON.stringify(item).toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className={cn("rounded-2xl border border-white/10 bg-[#121622] shadow-2xl overflow-hidden text-white", className)}>
      <div className="p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {title ? <h3 className="font-heading text-lg font-extrabold text-white">{title}</h3> : null}
          {subtitle ? <p className="text-xs text-slate-400 mt-1">{subtitle}</p> : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-full md:w-64">
            <InputBox
              icon={<Search size={15} className="text-slate-400" />}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="py-0 px-3 bg-[#0B101D] border-white/10 text-white placeholder:text-slate-500 rounded-xl"
              inputClassName="py-2.5 text-xs text-white"
            />
          </div>
          {actions}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0B101D] border-b border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400">
            <tr>
              {columns.map((col, idx) => (
                <th key={col.key || idx} className={cn("px-5 py-3.5", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-8 text-center text-xs text-slate-400">
                  No records match your query.
                </td>
              </tr>
            ) : (
              filtered.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "transition hover:bg-white/5",
                    onRowClick ? "cursor-pointer" : ""
                  )}
                >
                  {columns.map((col, cIdx) => (
                    <td key={col.key || cIdx} className={cn("px-5 py-4 text-xs font-medium text-slate-200", col.className)}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;

