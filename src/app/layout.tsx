import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AWS Student Builders Group REC",
  description: "Cloud learning community for students — courses, events, certifications and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
