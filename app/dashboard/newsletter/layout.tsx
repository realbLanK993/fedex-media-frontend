import NewsletterNavbar from "@/components/layout/newsletter";
import SecondaryNavbar from "@/components/layout/second-nav";

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[70px]">
      <SecondaryNavbar>
        <NewsletterNavbar />
      </SecondaryNavbar>

      <main>{children}</main>
    </div>
  );
}
