import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Online Polling App",
  description: "Vote and create polls easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Navbar />
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
