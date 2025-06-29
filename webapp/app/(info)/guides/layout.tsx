import type { Metadata } from "next";
import DynamicBreadcrumbs from "./dynamic-breadcrumbs";

export const metadata: Metadata = {
  title: "MugenBeat - Guides",
  description: "MugenBeat Guides"
};

export default function InfoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col p-6">
      <DynamicBreadcrumbs />
      {children}
    </div>
  );
}
