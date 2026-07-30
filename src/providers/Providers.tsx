"use client";

import { ThemeProvider } from "./ThemeProvider";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({
  children,
}: ProvidersProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}