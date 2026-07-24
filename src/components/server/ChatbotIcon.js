import React from 'react';

/**
 * ChatbotIcon - Destino Río Cuarto
 * Implementado como burbuja flotante con primer plano del asistente y enlace a WhatsApp.
 * Incluye indicador en línea animado (pulso activo).
 */
export default function ChatbotIcon() {
  return (
    <div className="position-fixed bottom-0 end-0 m-4 z-max" style={{ zIndex: 999999 }}>
      <a
        href="https://api.whatsapp.com/send?phone=5493586093011"
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none d-block position-relative"
        title="Consultar por WhatsApp"
      >
        <div className="chatbot-bubble">
          <img 
            src="/bot.png" 
            alt="Asistente Río Cuarto"
            className="chatbot-face-zoom"
          />
        </div>

        {/* Indicador verde en línea con animación de pulso radar */}
        <div className="chatbot-online-indicator">
          <span className="chatbot-online-pulse"></span>
          <span className="chatbot-online-dot"></span>
        </div>
      </a>
    </div>
  );
}


