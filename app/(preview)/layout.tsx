import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { Roboto } from "next/font/google";
import { ThemeToggle } from "@/components/themeToggle";

const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700", "900"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-pdf-support.vercel.app"),
  title: "PDF Support Preview",
  description: "Experimental preview of PDF support with the AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className={`${roboto.className}`}>
      <body className="bg-gradient-to-br from-stone-50 to-stone-300 dark:from-emerald-800 dark:to-emerald-950">
        <ThemeProvider attribute="class" enableSystem>
          <Toaster position="top-center" richColors />
          {children}
          <ThemeToggle className="absolute top-4 right-4 cursor-pointer" />
        </ThemeProvider>
      </body>
    </html>
  );
}
