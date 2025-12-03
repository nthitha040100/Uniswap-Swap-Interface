import type { Metadata } from "next";
import "./globals.css";
import { GlobalProvider } from "./providers/GlobalProviders";

export const metadata: Metadata = {
  title: "Swap Widget",
  description: "Swap interface using uniswap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
