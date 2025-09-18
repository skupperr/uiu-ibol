import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "People | IBOL - Intelligent Bioinformatics and Omics Laboratory",
  description: "Join us to add some impact on bioinformatics field",
};

export default function PeopleLayout({
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
