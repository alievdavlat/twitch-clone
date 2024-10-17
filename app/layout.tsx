import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ConvexClientProvider } from '@/components/providers/auth-provider';
import { Toaster } from 'sonner'
import "@uploadthing/react/styles.css";
import UploadthingProvider from "@/components/providers/uploadthing-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Twitch-by-sliev",
  description: "best stream platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ConvexClientProvider
      >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UploadthingProvider/>
            {children}
            <Toaster  theme='light' position='bottom-center'/>
          </ThemeProvider>
      </body>
        </ConvexClientProvider>
    </html>
  );
}
