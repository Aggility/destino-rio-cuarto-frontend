'use client';
import React from 'react';

export default function ContactButtons({ phone, whatsapp }) {
  const handleCall = () => {
    if (phone) window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = () => {
    if (whatsapp) {
      const cleanPhone = whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanPhone}`, '_blank');
    }
  };

  return (
    <div className="d-flex flex-wrap gap-3 mt-4">
        <button 
          onClick={handleCall}
          className="btn d-flex align-items-center gap-2 rounded-pill font-inter fw-bold shadow-sm transition-all hover-lift" 
          style={{ padding: '12px 28px', backgroundColor: 'white', color: '#111827', border: 'none' }}
        >
            Contactar <i className="bi bi-telephone text-muted ms-1"></i>
        </button>
        <button 
          onClick={handleWhatsApp}
          className="btn btn-success d-flex align-items-center gap-2 rounded-pill font-inter fw-bold shadow-sm transition-all hover-lift" 
          style={{ padding: '12px 28px', backgroundColor: '#25D366', border: 'none' }}
        >
            WhatsApp <i className="bi bi-whatsapp"></i>
        </button>
    </div>
  );
}
