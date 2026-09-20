import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  category?: string;
}

export function SEO({
  title = 'Pizza Pro Shergarh | Best Hot & Fresh Pizza, Burgers & Shawarma Delivery',
  description = 'Order hot & fresh pizzas, crispy burgers, zinger rolls, shawarma, and combo deals online from Pizza Pro Shergarh. Fast 30-minute home delivery across Shergarh & Hujra Road.',
  canonicalUrl = 'https://pizzapro.pk',
  category,
}: SEOProps) {
  useEffect(() => {
    // Dynamic Title update based on active view/category
    const fullTitle = category
      ? `${category} Menu | Pizza Pro Shergarh`
      : title;
    
    document.title = fullTitle;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update OG Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Update Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [title, description, canonicalUrl, category]);

  return null;
}
