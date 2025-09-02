import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Access Viewer Pro — Pre‑Survey",
  description: "AI-powered site access pre‑survey: routes, weather, risks, and crew recommendations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-800/60 sticky top-0 z-20 backdrop-blur bg-slate-950/60">
          <div className="container-slim py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-brand-600 grid place-items-center font-bold">AV</div>
              <div>
                <h1 className="text-lg font-semibold">Access Viewer Pro</h1>
                <p className="text-xs text-slate-400 -mt-0.5">Pre‑Survey (Sandbox)</p>
              </div>
            </div>
            <a href="https://github.com" target="_blank" className="btn btn-ghost">Docs</a>
          </div>
        </header>
        <main className="container-slim py-6">{children}</main>
        <footer className="container-slim py-10 text-center text-xs text-slate-500">
          Built for crews who hate surprises.
        </footer>
      </body>
    </html>
  );
}
