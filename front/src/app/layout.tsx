import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import Header from "./compo/Header";
import Footer from "./compo/Footer";
import LayoutWrapper from "./LayoutWrapper";

import {ThemeProvider} from "./compo/theme-provider";

const Roboto_mono = Roboto_Mono({
  
  subsets: ["latin"],
  display: "swap",
});



export const metadata: Metadata = {
  title: "Lexora",
  description: "This a E-commerce platform where users can buy and sell written by Legends books",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={Roboto_mono.className}
      >
      <ThemeProvider >
      <LayoutWrapper>
      <Header/>
        {children}
        <Footer/>
      </LayoutWrapper>
      </ThemeProvider>

      </body>
    </html>
  );
}
