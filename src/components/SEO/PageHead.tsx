
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

  // Website Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "DentalClinic",
    "name": "Senhor Sorriso",
    "url": "https://senhorsorrisso.com.br",
    "logo": "https://senhorsorrisso.com.br/images/logo.png",
    "description": "Rede de clínicas odontológicas com atendimento de qualidade e tecnologia avançada",
    "telephone": "+55-11-99999-9999",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressRegion": "SP"
    },
    "sameAs": [
      "https://www.instagram.com/senhorsorrisso",
      "https://www.facebook.com/senhorsorrisso"
    ]
  };

  // Enhanced Site Navigation with more structure
  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Senhor Sorriso Main Navigation",
    "url": "https://senhorsorrisso.com.br",
    "hasPart": [
      {
        "@type": "SiteNavigationElement",
        "name": "Início",
        "description": "Página inicial do aplicativo Senhor Sorriso",
        "url": "https://senhorsorrisso.com.br/"
      },
      {
        "@type": "SiteNavigationElement", 
        "name": "Agendar Consulta",
        "description": "Agendamento online de consultas odontológicas",
        "url": "https://senhorsorrisso.com.br/schedule"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Chat Odontológico",
        "description": "Assistente virtual especializado em odontologia",
        "url": "https://senhorsorrisso.com.br/chat"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Nossas Clínicas",
        "description": "Localização e informações das unidades",
        "url": "https://senhorsorrisso.com.br/clinics"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Emergência",
        "description": "Atendimento de emergência odontológica",
        "url": "https://senhorsorrisso.com.br/emergency"
      },
      {
        "@type": "SiteNavigationElement",
        "name": "Perfil",
        "description": "Área do usuário e histórico de consultas",
        "url": "https://senhorsorrisso.com.br/profile"
      }
    ]
  };

  // WebSite Schema for search functionality
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Senhor Sorriso",
    "url": "https://senhorsorrisso.com.br",
    "description": "Aplicativo oficial da rede Senhor Sorriso para agendamento e atendimento odontológico",
    "publisher": {
      "@type": "Organization",
      "name": "Senhor Sorriso"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://senhorsorrisso.com.br/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Breadcrumbs structured data if provided
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
      <meta name="language" content="pt-BR" />
      <meta name="geo.region" content="BR" />
      <meta name="geo.country" content="Brazil" />
      <link rel="canonical" href={url} />
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Structured Data - Website */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      
      {/* Structured Data - Site Navigation */}
      <script type="application/ld+json">
        {JSON.stringify(siteNavigationSchema)}
      </script>
      
      {/* Structured Data - Breadcrumbs */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};
