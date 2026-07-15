"use client";

import Image from "next/image";

const PORTFOLIO_URL = "https://edgardo-portfolio.vercel.app/";
const GITHUB_URL = "https://github.com/maliceedg";

export function AppShell({
  hasReport,
  isExportingPptx,
  onExportPdf,
  onExportPptx,
  onReset,
  children,
}: {
  hasReport: boolean;
  isExportingPptx: boolean;
  onExportPdf: () => void;
  onExportPptx: () => void;
  onReset: () => void;
  children: React.ReactNode;
}) {
  return (
    <div id="app-shell" className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-surface-variant bg-surface/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 md:px-12">
          <div className="flex min-w-0 items-center gap-3">
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Edgardo Gonzalez — portfolio"
              className="shrink-0 rounded-lg outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Image src="/logo.svg" alt="" width={88} height={45} priority className="h-9 w-auto" />
            </a>
            <h1 className="truncate text-xl font-bold text-primary md:text-2xl">Lighthouse Insights</h1>
          </div>
          {hasReport ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={onExportPdf}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-surface-low"
              >
                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                <span className="hidden sm:inline">Export PDF</span>
              </button>
              <button
                type="button"
                onClick={onExportPptx}
                disabled={isExportingPptx}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-surface-tint disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">slideshow</span>
                <span className="hidden sm:inline">{isExportingPptx ? "Exporting…" : "Export PPTX"}</span>
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-surface-low"
              >
                <span className="material-symbols-outlined text-base">restart_alt</span>
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 md:px-12">{children}</main>

      <footer className="border-t border-border/80 py-5 text-sm text-on-surface-variant">
        <div className="mx-auto max-w-[1440px] px-4 md:px-12">
          <p>
            Built by{" "}
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 transition hover:text-primary hover:underline"
            >
              Edgardo Gonzalez
            </a>
            <span className="mx-2 text-border" aria-hidden>
              ·
            </span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 transition hover:text-primary hover:underline"
            >
              @maliceedg
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
