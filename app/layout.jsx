import "./globals.css";

export const metadata = {
  title: "Unified Educator Funnel",
  description: "Preview and webhook endpoints for the WhatsApp educator funnel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

