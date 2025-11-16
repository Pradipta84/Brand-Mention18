import { AppShell } from "@/components/layout/app-shell";
import { PropsWithChildren } from "react";

export default function MarketingLayout({ children }: PropsWithChildren) {
  return <AppShell>{children}</AppShell>;
}

