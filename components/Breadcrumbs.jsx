import Link from "next/link";

function labelFromSegment(segment) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Breadcrumbs({ currentTitle, path = [] }) {
  const crumbs = [{ label: "Archive", href: "/" }, ...path];

  return (
    <nav className="mb-8 text-xs uppercase tracking-[0.25em] text-[#7b5525]">
      {crumbs.map((crumb, index) => (
            <span key={`${crumb.href ?? crumb.label}-${index}`}>
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-[#17120d]">
              {crumb.label}
            </Link>
          ) : (
            <span>{crumb.label}</span>
          )}

          <span className="mx-3 text-[#a88957]">/</span>
        </span>
      ))}

      <span>{currentTitle}</span>
    </nav>
  );
}