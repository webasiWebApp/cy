import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — CY International",
  description: "Product management dashboard for CY International",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-root">
      {children}
    </div>
  );
}
