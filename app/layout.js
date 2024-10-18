import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProviderWrapper } from "./ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rate My Professor AI Assistant",
  description: "Discover and rate professors with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </body>
    </html>
  );
}
