import { ArrowLeft } from "lucide-react";

export default function StudioBackLinkView({
  href = "/studio",
  label = "Back",
  className = "",
  LinkComponent = "a",
}) {
  return (
    <LinkComponent
      href={href}
      className={`cf-btn cf-btn--secondary w-fit ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </LinkComponent>
  );
}
