import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Research | IBOL - Intelligent Bioinformatics and Omics Laboratory",
  description: "Join us to add some impact on bioinformatics field",
};

export default function ResearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
