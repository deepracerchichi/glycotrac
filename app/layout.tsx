import type { Metadata } from "next";
import { Bricolage_Grotesque, Google_Sans_Flex } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const googleSans = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
  title: "glycotrac",
  description: "Medication reminders, refill alerts and symptom tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${googleSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}