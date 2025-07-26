import NewsletterNavbar from "@/components/layout/newsletter";

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[70px]">
      <NewsletterNavbar />
      <main>{children}</main>
    </div>
  );
}
