import type { Metadata } from "next";
import { Bricolage_Grotesque, Google_Sans_Flex } from "next/font/google";
import Providers from "@/components/providers";
import { fontClasses } from "@/components/shared/fontClasses";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glucotrac",
  description: "Medication reminders, refill alerts and symptom tracking for people living with diabetes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fontClasses}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}