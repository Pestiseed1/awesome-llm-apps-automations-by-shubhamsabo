export const metadata = { title: 'Compliance Automation Dashboard' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 24 }}>{children}</body>
    </html>
  );
}
