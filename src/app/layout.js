import { Inter, Roboto } from "next/font/google";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "bootstrap-icons/font/bootstrap-icons.css"; // Importamos icons por separado para asegurar visibilidad
import "@/styles/globals.scss";
import NavBar from "@/components/server/NavBar";
import Footer from "@/components/server/Footer";

// Definición de fuentes sugeridas por el usuario
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: 'swap',
});

export const metadata = {
  title: {
    template: '%s | Destino Río Cuarto',
    default: 'Destino Río Cuarto — Portal Turístico y de Eventos',
  },
  description: "Explora Río Cuarto: Agenda de eventos, servicios, organizaciones y actividades turísticas de la ciudad.",
};

import GeolocationPopup from "@/components/client/GeolocationPopup";
import ChatbotIcon from "@/components/server/ChatbotIcon";

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${roboto.variable}`}>
      <body className="d-flex flex-column min-vh-100">
        <NavBar />
        <main className="flex-grow-1">
          {children}
        </main>
        <Footer />
        <GeolocationPopup />
        <ChatbotIcon />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-0JRF2QMXT6`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0JRF2QMXT6', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
