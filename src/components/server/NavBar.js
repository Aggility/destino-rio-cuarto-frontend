import Link from 'next/link';
import Image from 'next/image';

/**
 * NavBar - Destino Río Cuarto
 * Basado en Figma ID 3781:19192 (Height 97px, Solid Background)
 * Actualizado: No es más transparente (Navbar precede al Hero, no se superpone).
 */
export default function NavBar() {
  const navLinks = [
    { label: 'Eventos', href: '/eventos' },
    { label: 'Actividades', href: '/actividades' },
    { label: 'Turismo Ciudad', href: '/turismo' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Calendario', href: '/calendario' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark w-100" style={{ 
      height: '97px',
      backgroundColor: '#1F2A37', /* Indigo / Gray-800 — Figma Navbar Solid color */
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <div className="container-xxl d-flex align-items-center h-100 px-lg-5">
        
        {/* LOGO (ID 3781:19192) */}
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 shadow-premium" style={{ width: '48px', height: '48px' }}>
             <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: '24px' }}></i>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <span className="fw-bold text-white h4 mb-0 font-inter" style={{ letterSpacing: '-0.8px', lineHeight: 1 }}>
              Destino
            </span>
            <span className="fw-medium text-white-50 small font-inter" style={{ fontSize: '14px', letterSpacing: '0.5px' }}>
              Río Cuarto
            </span>
          </div>
        </Link>

        <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-3">
            {navLinks.map((link) => (
              <li key={link.href} className="nav-item">
                <Link href={link.href} className="nav-link text-white fw-medium opacity-90 transition-all hover-opacity-100 px-3" style={{ fontSize: '16px' }}>
                  {link.label}
                </Link>
              </li>
            ))}
            
            {/* CTA BUTTON */}
            <li className="nav-item ms-lg-3">
              <Link href="/publicar" className="btn btn-outline-light px-4 py-2 border-2 rounded-2 fw-semibold shadow-premium transition-all hover-lift">
                Publicá Acá
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
