import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPage from "@/components/catalog/CategoryPage";
import Footer from "@/components/Footer";
import { categories, getCategory } from "@/lib/catalog/categories";
import { getProducts } from "@/lib/catalog/products";
import { SITE_URL } from "@/lib/site";

type Params = { params: Promise<{ category: string }> };

// Every category is pre-rendered (/watches, /t-shirts, ...); anything else is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ category: c.slug }));

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  const title = `${category.name} — ${category.tagline} | AURUM`;
  return {
    title,
    description: category.description,
    // Absolute: a relative URL would drop the GitHub Pages base path.
    alternates: { canonical: `${SITE_URL}/${category.slug}` },
    openGraph: { title, description: category.description, url: `${SITE_URL}/${category.slug}`, type: "website" },
  };
}

export default async function Page({ params }: Params) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const products = getProducts(category.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/${category.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: category.name,
      itemListElement: products.slice(0, 12).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: `${p.brand} ${p.name}`,
          brand: p.brand,
          aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
          offers: { "@type": "Offer", price: p.price, priceCurrency: "USD", availability: "https://schema.org/InStock" },
        },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryPage category={category} products={products} />
      <Footer />
    </>
  );
}
