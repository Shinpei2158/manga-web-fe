import { BookOpen } from "lucide-react";

export function MangaDetailLoading() {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="min-h-full animate-pulse p-6 xl:p-8">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 h-8 w-1/3 rounded-xl bg-slate-200" />
          <div className="mb-5 flex flex-wrap gap-2">
            <div className="h-7 w-24 rounded-full bg-slate-200" />
            <div className="h-7 w-28 rounded-full bg-slate-200" />
            <div className="h-7 w-24 rounded-full bg-slate-200" />
          </div>
          <div className="h-14 rounded-[22px] bg-slate-100" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-36 rounded-[24px] border border-slate-200 bg-white shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MangaDetailEmptyState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 text-center">
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 shadow-sm">
        <BookOpen className="mx-auto h-10 w-10 text-slate-400" />
        <p className="mt-4 text-base font-semibold text-slate-900">
          No manga detail available
        </p>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Select a story from the table to review its overview, rights status,
          publication visibility, and enforcement status.
        </p>
      </div>
    </div>
  );
}
