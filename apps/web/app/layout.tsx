import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-white text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
