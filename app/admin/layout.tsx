import { AdminSidebar } from "./components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-muted/40">
            <AdminSidebar />
            <main className="md:pl-64 min-h-screen transition-all duration-200">
                <div className="container py-8 px-4 md:px-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
