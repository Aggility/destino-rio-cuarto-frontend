import React from 'react';

/**
 * ChatbotIcon - Destino Río Cuarto
 * Sincronizado con Figma ID 3843:11721 (81px x 81px)
 */
export default function ChatbotIcon() {
  return (
    <div className="position-fixed bottom-0 end-0 m-4 z-index-100 animate-bounce-subtle">
      <button className="btn p-0 border-0 shadow-premium hover-scale transition-all" style={{ 
        width: '81px', 
        height: '81px',
        backgroundColor: '#1A56D8', // Indigo Primary
        borderRadius: '24px', // Figma Rounded style
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-white d-flex flex-column align-items-center">
          <i className="bi bi-chat-left-dots-fill" style={{ fontSize: '32px' }}></i>
        </div>
      </button>
      
      {/* Tooltip optional style from Figma */}
      <div className="position-absolute top-0 end-0 translate-middle-y mt-neg-2 me-neg-1">
        <span className="badge rounded-circle bg-danger p-2 border border-white border-2">
          <span className="visually-hidden">Mensaje nuevo</span>
        </span>
      </div>
    </div>
  );
}
