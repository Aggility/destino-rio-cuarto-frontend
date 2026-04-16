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
    <div className="d-flex flex-row align-items-center gap-2 mt-3 w-100 overflow-hidden">
        <button 
          onClick={handleCall}
          className="btn d-flex align-items-center justify-content-center gap-2 rounded-pill font-inter fw-bold shadow-sm transition-all hover-lift flex-grow-1" 
          style={{ padding: '10px 15px', backgroundColor: 'white', color: '#111827', border: '1px solid #e5e7eb', fontSize: '14px' }}
        >
            Llamar <i className="bi bi-telephone text-muted"></i>
        </button>
        <button 
          onClick={handleWhatsApp}
          className="btn btn-success d-flex align-items-center justify-content-center gap-2 rounded-pill font-inter fw-bold shadow-sm transition-all hover-lift flex-grow-1" 
          style={{ padding: '10px 15px', backgroundColor: '#25D366', border: 'none', fontSize: '14px' }}
        >
            WhatsApp <i className="bi bi-whatsapp"></i>
        </button>
    </div>
  );
}
