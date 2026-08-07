import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NOVA ACCOUNT VAULT — Internal Credential Vault',
  description: 'Fast, secure, internal account vault for NOVA operators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-[#080B12] text-[#F5F7FA] antialiased selection:bg-[#4F7CFF] selection:text-white">
        {children}
      </body>
    </html>
  );
}
