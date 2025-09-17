import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Online Polling",
  description: "Create, vote and manage polls with JWT protection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
