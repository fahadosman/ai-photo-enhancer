import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border p-5">
        <h2 className="mb-6 font-display text-lg font-semibold">Dashboard</h2>
        <nav className="flex flex-col gap-3 text-sm text-secondary">
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/history">History</Link>
          <Link href="/dashboard/settings">Settings</Link>
          <Link href="/dashboard/api-keys">API Keys</Link>
          <Link href="/dashboard/billing">Billing</Link>
        </nav>
      </aside>
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
