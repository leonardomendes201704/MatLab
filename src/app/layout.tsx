import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matemática Quest",
  description: "Reforço matemático gamificado para alunos do 7º ano.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
