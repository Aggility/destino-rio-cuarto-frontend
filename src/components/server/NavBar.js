'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * NavBar - Destino Río Cuarto
 * Basado en Figma ID 3781:19192 (Height 97px, Solid Background)
 * Actualizado: Sidebar móvil ingresa desde la derecha y se oculta al seleccionar una opción.
 */
export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  // Cerrar si la pantalla se hace grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bloquear el scroll del body cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const navLinks = [
    { label: 'Eventos', href: '/eventos' },
    { label: 'Actividades', href: '/actividades' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Calendario', href: '/calendario' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark w-100 position-sticky top-0" style={{
      minHeight: '97px',
      backgroundColor: '#1F2A37',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1040
    }}>
      <div className="container-xxl d-flex align-items-center h-100 px-lg-5">

        {/* LOGO */}
        <Link href="/" className="navbar-brand d-flex align-items-center" onClick={closeMenu}>
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

        {/* Toggler (Mobile) */}
        <button className="navbar-toggler border-0 shadow-none d-lg-none" type="button" onClick={() => setIsOpen(true)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* DESKTOP MENU - Visible sólo en vista grande */}
        <div className="collapse navbar-collapse d-none d-lg-block">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-3">
            {navLinks.map((link) => (
              <li key={link.href} className="nav-item">
                <Link href={link.href} className="nav-link text-white fw-medium opacity-90 transition-all hover-opacity-100 px-3" style={{ fontSize: '16px' }}>
                  {link.label}
                </Link>
              </li>
            ))}

          </ul>
        </div>

        {/* --- MOBILE SIDEBAR SECTION --- */}
        {/* Backdrop (Fondo semitransparente oscuro) */}
        {isOpen && (
          <div className="position-fixed top-0 start-0 w-100 h-100 bg-black opacity-50 d-lg-none"
            style={{ zIndex: 1040, transition: 'opacity 0.3s ease-in-out' }}
            onClick={closeMenu}></div>
        )}

        {/* Sidebar deslizable (Offcanvas custom) */}
        <div className="position-fixed top-0 end-0 h-100 d-flex flex-column d-lg-none shadow-premium"
          style={{
            width: '280px',
            backgroundColor: '#1F2A37',
            zIndex: 1050,
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease-in-out',
          }}>
          {/* Header de la sidebar */}
          <div className="d-flex justify-content-between align-items-center p-4 border-bottom border-secondary border-opacity-50">
            <Link href="/" className="navbar-brand d-flex align-items-center" onClick={closeMenu}>
              <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3 shadow-premium" style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: '20px' }}></i>
              </div>
              <div className="d-flex flex-column justify-content-center">
                <span className="fw-bold text-white h5 mb-0 font-inter" style={{ letterSpacing: '-0.5px', lineHeight: 1 }}>
                  Destino
                </span>
                <span className="fw-medium text-white-50 font-inter" style={{ fontSize: '13px', letterSpacing: '0.2px' }}>
                  Río Cuarto
                </span>
              </div>
            </Link>
            <button className="btn p-0 border-0 shadow-none d-flex align-items-center justify-content-center" onClick={closeMenu}>
              <i className="bi bi-x-lg text-white opacity-75 hover-opacity-100 transition-all" style={{ fontSize: '24px' }}></i>
            </button>
          </div>

          {/* Opciones */}
          <div className="d-flex flex-column flex-grow-1 overflow-auto p-4">
            <ul className="navbar-nav flex-column gap-3 mb-auto">
              <li className="nav-item">
                <Link href="/"
                  onClick={closeMenu}
                  className="nav-link text-white fw-medium fs-5 border-bottom border-light border-opacity-10 pb-2">
                  Inicio
                </Link>
              </li>
              {navLinks.map((link) => (
                <li key={link.href} className="nav-item">
                  <Link href={link.href}
                    onClick={closeMenu}
                    className="nav-link text-white fw-medium fs-5 border-bottom border-light border-opacity-10 pb-2">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>
    </nav>
  );
}
