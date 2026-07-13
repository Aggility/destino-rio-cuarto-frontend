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
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=GTM-MF9KXZNK`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MF9KXZNK');
            `,
          }}
        />
        <NavBar />
        <main className="flex-grow-1">
          {children}
        </main>
        <Footer />
        <GeolocationPopup />
        <ChatbotIcon />


      </body>
    </html>
  );
}
