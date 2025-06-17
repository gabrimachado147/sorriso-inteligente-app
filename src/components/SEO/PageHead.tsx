
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export const PageHead: React.FC<PageHeadProps> = ({
  title = "Senhor Sorriso - Clínica Odontológica",
  description = "Aplicativo oficial da rede Senhor Sorriso - Agendamento online, chat IA e avaliação gratuita",
  keywords = "dentista, odontologia, agendamento, consulta, dentes, sorriso, saúde bucal",
  image = "https://senhorsorrisso.com.br/images/og-image.jpg",
  url = "https://senhorsorrisso.com.br",
  type = "website",
  breadcrumbs = []
}) => {
  const fullTitle = title.includes('Senhor Sorriso') ? title : `${title} | Senhor Sorriso`;

  // Navegação estruturada para todas as páginas
  const siteNavigation = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Senhor Sorriso Navigation",
    "url": "https://senhorsorrisso.com.br",
    "hasPart": [
      {
        "@type": "SiteNavigationElement",
        "name": "Início",
        "url": "https://senhorsorrisso.com.br/"
      },
      {
        "@type": "SiteNavigationElement", 
        "name": "Agendar Consulta",
        "url": "https://senhorsorrisso.com.br/schedule"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Chat Odontológico",
        "url": "https://senhorsorrisso.com.br/chat"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Nossas Clínicas",
        "url": "https://senhorsorrisso.com.br/clinics"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Emergência",
        "url": "https://senhorsorrisso.com.br/emergency"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Perfil",
        "url": "https://senhorsorrisso.com.br/profile"
      }
    ]
  };

  // Breadcrumbs estruturados se fornecidos
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Senhor Sorriso" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@senhorsorrisso" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Senhor Sorriso" />
      <link rel="canonical" href={url} />
      
      {/* Dados estruturados - Navegação do site */}
      <script type="application/ld+json">
        {JSON.stringify(siteNavigation)}
      </script>
      
      {/* Dados estruturados - Breadcrumbs */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};
