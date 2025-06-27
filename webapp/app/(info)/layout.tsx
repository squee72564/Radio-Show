import type { Metadata } from "next";
import NavigationHeader from "@/components/nav-header";

export const metadata: Metadata = {
  title: "MugenBeat - Information",
  description: "MugenBeat Info"
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
