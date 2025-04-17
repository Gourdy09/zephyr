import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Zephyr",
  description: "Login or signup to Zephyr",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-background">
      <div>{children}</div>
    </div>
  );
}