import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { Castoro } from "next/font/google";
import { IBM_Plex_Sans_Thai} from "next/font/google"

const inter = Inter({ subsets: ['latin']})
const castoro = Castoro({ weight: "400" , subsets: ['latin']} )
const iBMPlexSansThai = IBM_Plex_Sans_Thai({subsets: ['thai'], weight: "400"})

export const metadata: Metadata = {
  title: "DataWow Test",
  description: "Full stack blog web application",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={`${inter.className} ${castoro.className} ${iBMPlexSansThai.className}`}>
      {children}
      </body>
      </html>
  );
}
