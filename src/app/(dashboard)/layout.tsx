// This layout will be used for all pages in the dashboard group
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* TODO: Add Sidebar and Header for the dashboard */}
      {children}
    </section>
  );
}