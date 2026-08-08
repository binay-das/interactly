import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "../context/auth-context";
import { ToastProvider } from "../context/toast-context";
import { ThemeProvider } from "../context/theme-context";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans"
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono"
});

export const metadata: Metadata = {
  title: "Interactly | Real-Time Live Quiz Engine",
  description: "Host interactive live quizzes with instant audience participation and analytics.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-(--background) text-(--foreground) min-h-screen transition-colors duration-150`}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
