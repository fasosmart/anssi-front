import { redirect } from 'next/navigation';

// This page will instantly redirect to the user's dashboard.
// We can add logic here later to redirect to different dashboards based on user role.
export default function DashboardRootPage() {
  redirect('/dashboard/user');
}