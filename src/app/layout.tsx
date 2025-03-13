"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import { QueryClientProvider} from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ua">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
