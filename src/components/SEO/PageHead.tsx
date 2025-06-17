
import { Helmet } from 'react-helmet-async';

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const PageHead: React.FC<PageHeadProps> = ({
  title = "Senhor Sorriso - Clínica Odontológica",
  description = "Aplicativo oficial da rede Senhor Sorriso - Agendamento online, chat IA e avaliação gratuita",
  keywords = "dentista, odontologia, agendamento, consulta, dentes, sorriso, saúde bucal",
  image = "https://senhorsorrisso.com.br/images/og-image.jpg",
  url = "https://senhorsorrisso.com.br",
  type = "website"
}) => {
  const fullTitle = title.includes('Senhor Sorriso') ? title : `${title} | Senhor Sorriso`;

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
    </Helmet>
  );
};
