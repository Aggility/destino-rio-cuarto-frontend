import React from 'react';
import Link from 'next/link';

/**
 * Footer Simplificado - Destino Río Cuarto
 * Solo Logo y Redes Sociales.
 */
export default function Footer() {
  return (
    <footer className="footer py-5" style={{ 
      backgroundColor: '#1F2A37', 
      color: '#FFFFFF',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div className="container-xxl px-lg-5">
        <div className="d-flex flex-column align-items-center text-center">
          
          {/* Logo */}
          <div className="d-flex align-items-center mb-4">
            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: '24px' }}></i>
            </div>
            <span className="fw-bold text-white h4 mb-0 font-inter" style={{ letterSpacing: '-1.2px' }}>
              Destino <span className="fw-medium text-white-50">Río Cuarto</span>
            </span>
          </div>

          {/* Socials */}
          <div className="d-flex gap-4 mb-4">
            <Link href="#" className="text-white opacity-75 fs-3 transition-all hover-scale"><i className="bi bi-instagram"></i></Link>
            <Link href="#" className="text-white opacity-75 fs-3 transition-all hover-scale"><i className="bi bi-facebook"></i></Link>
            <Link href="#" className="text-white opacity-75 fs-3 transition-all hover-scale"><i className="bi bi-twitter-x"></i></Link>
            <Link href="#" className="text-white opacity-75 fs-3 transition-all hover-scale"><i className="bi bi-youtube"></i></Link>
          </div>

          {/* Copyright Sutil */}
          <p className="mb-0 opacity-40 small font-inter">
            © 2026 Secretaría de Deporte y Turismo. Gobierno de Río Cuarto.
          </p>

        </div>
      </div>
    </footer>
  );
}
