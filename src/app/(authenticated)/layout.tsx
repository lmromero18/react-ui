import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppSidebar } from "@/app/components/app-sidebar";
import { Header } from "@/app/components/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen overflow-hidden w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
