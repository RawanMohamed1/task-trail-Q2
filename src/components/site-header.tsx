export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900">
            MF
          </div>
          <span className="text-sm font-semibold">Marlow &amp; Finch</span>
        </div>

        <nav className="flex items-center gap-6 text-sm text-neutral-500">
          <span className="text-neutral-900 dark:text-neutral-100">Enquiries</span>
        </nav>
      </div>
    </header>
  );
}
