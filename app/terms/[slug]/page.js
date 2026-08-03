import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import PolicyPage from "@/components/policies/PolicyPage";
import { getPolicyBySlug, policies } from "@/data/policies";

export async function generateStaticParams() {
  return policies.map((policy) => ({
    slug: policy.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);

  if (!policy) {
    return {
      title: "Policy Not Found | Crestfall",
    };
  }

  return {
    title: `${policy.title} | Crestfall`,
    description: policy.summary,
  };
}

export default async function PolicyDetailPage({ params }) {
  const { slug } = await params;
  const policy = getPolicyBySlug(slug);

  if (!policy) {
    notFound();
  }

  return (
    <>
      <SiteHeader />

      <SiteShell eyebrow={policy.category} title={policy.title}>
        <PolicyPage policy={policy} />
      </SiteShell>
    </>
  );
}