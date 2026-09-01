import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>{children}</body>
    </html>
  );
}
