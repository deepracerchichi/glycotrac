import type { Metadata, Viewport } from "next";
import Providers from "@/components/providers";
import { fontClasses } from "@/components/shared/fontClasses";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Glycotrac", template: "%s · Glycotrac" },
  description: "Medication reminders, refill alerts and health tracking for people living with diabetes.",
};

export const viewport: Viewport = {
  themeColor: "#2b1740",
  width: "device-width",
  initialScale: 1,
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
