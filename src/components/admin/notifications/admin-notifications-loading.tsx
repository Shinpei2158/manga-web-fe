export function AdminNotificationsLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="animate-pulse">
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="mt-4 h-8 w-20 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-36 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="h-11 rounded-xl bg-slate-200 lg:col-span-5" />
            <div className="h-11 rounded-xl bg-slate-200 lg:col-span-2" />
            <div className="h-11 rounded-xl bg-slate-200 lg:col-span-2" />
            <div className="h-11 rounded-xl bg-slate-200 lg:col-span-2" />
            <div className="h-11 rounded-xl bg-slate-200 lg:col-span-1" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="animate-pulse space-y-3 p-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-3 rounded-xl border border-slate-100 p-4"
            >
              <div className="col-span-3 h-5 rounded bg-slate-200" />
              <div className="col-span-3 h-5 rounded bg-slate-100" />
              <div className="col-span-2 h-5 rounded bg-slate-100" />
              <div className="col-span-2 h-5 rounded bg-slate-100" />
              <div className="col-span-2 h-5 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
