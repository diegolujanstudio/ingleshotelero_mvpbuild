import { requireSuperAdmin } from "@/lib/masteros/auth";
import { MasterosShell } from "@/components/masteros/Shell";
import { META } from "@/content/masteros";

export const metadata = {
  title: META.title,
  description: META.description,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MasterosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense-in-depth alongside middleware. Redirects to /__notfound if not super_admin.
  const user = await requireSuperAdmin();

  return (
    <MasterosShell email={user.email}>
      {children}
    </MasterosShell>
  );
}
