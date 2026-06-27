'use client';
import React from 'react';
import HomeSectionSlider from './HomeSectionSlider';

export default function EventGallerySlider({ gallery }) {
    if (!gallery || gallery.length === 0) return null;

    // Normalize image URLs
    const images = gallery.map(g => {
        if (typeof g === 'string') return g;
        if (typeof g === 'object') {
            return g.large || g.medium || g.original || g.small || null;
        }
        return null;
    }).filter(Boolean);

    if (images.length === 0) return null;

    return (
        <div className="mt-5 pt-4 border-top">
            <HomeSectionSlider title="Galería de Imágenes">
                {images.map((src, idx) => (
                    <div 
                        key={idx} 
                        className="flex-shrink-0 position-relative rounded-4 overflow-hidden shadow-sm" 
                        style={{ width: 'clamp(260px, 80vw, 450px)', height: 'clamp(200px, 55vw, 320px)', scrollSnapAlign: 'start' }}
                    >
                        <img 
                            src={src} 
                            alt={`Imagen de la galería ${idx + 1}`} 
                            className="w-100 h-100" 
                            style={{ objectFit: 'cover' }} 
                        />
                    </div>
                ))}
            </HomeSectionSlider>
        </div>
    );
}
