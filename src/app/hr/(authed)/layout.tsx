import { requireHRUser } from "@/lib/hr/auth";
import { HRShell } from "@/components/hr/Shell";
import { META } from "@/content/hr";

export const metadata = {
  title: META.title,
  description: META.description,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function HRAuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireHRUser();
  return <HRShell email={user.email}>{children}</HRShell>;
}
