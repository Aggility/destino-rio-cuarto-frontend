import { Inter, Roboto } from "next/font/google";
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

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${roboto.variable}`}>
      <body className="d-flex flex-column min-vh-100">
        <NavBar />
        <main className="flex-grow-1">
          {children}
        </main>
        <Footer />
        
        {/* Bootstrap JS para interactividad */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossOrigin="anonymous"
          async
        />
      </body>
    </html>
  );
}
