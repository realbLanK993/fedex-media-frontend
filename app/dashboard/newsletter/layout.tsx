import NewsletterNavbar from "@/components/layout/newsletter";
import SecondaryNavbar from "@/components/layout/second-nav";

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-320px)]">
      <div className="h-[70px]">
        <SecondaryNavbar>
          <div className="max-w-4xl mx-auto w-full">
            <NewsletterNavbar />
          </div>
        </SecondaryNavbar>


      </div>
      <main className="h-full">{children}</main>
    </div>
  );
}
