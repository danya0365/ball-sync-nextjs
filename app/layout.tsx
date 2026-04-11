
import { AppLayout } from "@/src/presentation/components/layout/AppLayout";
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
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AppLayout>
            {children}
          </AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
