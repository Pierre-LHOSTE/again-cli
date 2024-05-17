import Message from "@/src/components/message/Message";
import Notification from "@/src/components/message/Notification";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "overlayscrollbars/overlayscrollbars.css";
import { AntdConfig } from "./AntdConfig";
import StyledComponentsRegistry from "./AntdRegistry";

const inter = Inter({ subsets: ["latin"] });

// TODO: Update metadata
export const metadata: Metadata = {
  title: "Project name",
  description: "Project description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <AntdConfig>
            {children}
            <>
              <Message />
              <Notification />
            </>
          </AntdConfig>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
