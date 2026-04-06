import React from 'react';
import Link from 'next/link';

/**
 * Footer - Destino Río Cuarto
 * Sincronizado con Figma ID 3781:19260 (Height 338px)
 */
export default function Footer() {
  const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Eventos', href: '/eventos' },
    { label: 'Actividades', href: '/actividades' },
    { label: 'Turismo Ciudad', href: '/turismo' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Contacto', href: '/contacto' },
  ];

  return (
    <footer className="footer py-5" style={{ 
      backgroundColor: '#1F2A37', 
      minHeight: '338px',
      color: '#FFFFFF'
    }}>
      <div className="container-xxl px-lg-5">
        <div className="row gy-5 align-items-center">
          
          {/* Logo & Desc (Figma ID 3413:6269) */}
          <div className="col-lg-12 text-center">
            <div className="d-flex justify-content-center align-items-center mb-4">
              <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: '24px' }}></i>
              </div>
              <span className="fw-bold text-white h4 mb-0 font-inter" style={{ letterSpacing: '-1.2px' }}>
                Destino <span className="fw-medium text-white-50">Río Cuarto</span>
              </span>
            </div>
            
            <p className="mb-4 d-inline-block opacity-75" style={{ 
              color: '#A4CAFE', 
              fontSize: '18px', 
              maxWidth: '600px',
              fontFamily: 'var(--font-roboto)'
            }}>
              Encontrá Cosas para Hacer en Gran Río Cuarto
            </p>
          </div>

          {/* Nav Links */}
          <div className="col-lg-12">
            <div className="d-flex flex-wrap justify-content-center gap-3 gap-md-5 mb-5 border-top border-white border-opacity-10 pt-5">
              {footerLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-decoration-none text-white opacity-80 transition-all hover-opacity-100 fw-medium">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials & Copyright */}
          <div className="col-lg-12 border-top border-white border-opacity-10 pt-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
              <p className="mb-0 opacity-60 small">
                © 2026 Destino Río Cuarto. Secretaría de Deporte y Turismo.
              </p>
              
              <div className="d-flex gap-3">
                <Link href="#" className="text-white opacity-75 fs-4"><i className="bi bi-instagram"></i></Link>
                <Link href="#" className="text-white opacity-75 fs-4"><i className="bi bi-facebook"></i></Link>
                <Link href="#" className="text-white opacity-75 fs-4"><i className="bi bi-twitter-x"></i></Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
