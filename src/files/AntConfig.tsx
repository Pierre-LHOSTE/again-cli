"use client";
import darkTheme from "@/styles/themes/dark";
import lightTheme from "@/styles/themes/light";
import { ConfigProvider } from "antd";
import { useEffect, useState } from "react";

export default function AntConfig({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    setIsDarkTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  return (
    <ConfigProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      {children}
    </ConfigProvider>
  );
}
