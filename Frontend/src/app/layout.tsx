import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";


export const metadata: Metadata = {
  title: "Home | IBOL - Intelligent Bioinformatics and Omics Laboratory",
  description: "Join us to add some impact on bioinformatics field",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body className="bg-[--color-1]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
