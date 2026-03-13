import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/app/Components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user?.role === "admin") redirect("/admin");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar 
        userName={session.user?.name} 
        userEmail={session.user?.email} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm">
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="truncate">
              <p className="font-medium text-sm truncate">
                {session.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user?.email || ""}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}