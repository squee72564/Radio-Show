import type { Metadata } from "next";
import NavigationHeader from "@/components/nav-header";

export const metadata: Metadata = {
  title: "Information",
  description: "Radio Show Info"
};

export default function InfoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavigationHeader />
      {children}
    </>
  );
}
