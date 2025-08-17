export default function SecondaryNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  return <nav className=" border-b p-4">{children}</nav>;
}
