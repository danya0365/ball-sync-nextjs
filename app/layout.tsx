
import { Navbar } from "@/src/presentation/components/layout/Navbar";
import { Sidebar } from "@/src/presentation/components/layout/Sidebar";
import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "../public/styles/index.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BallSync - Football API Hub",
  description: "ศูนย์รวมข้อมูลฟุตบอลแบบเรียลไทม์ผ่าน API สำหรับนักพัฒนา",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${notoSansThai.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Main App Layout Container */}
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1">
              <Navbar />
              <main className="flex-1 p-6 lg:p-8 bg-surface-50 dark:bg-[#09090b] border-l border-border rounded-tl-xl mt-16 lg:mt-0">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
