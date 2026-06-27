'use client';

import React, { useState } from 'react';

export default function EventContactButton({ contacts }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!contacts || contacts.length === 0) return null;

    // Filter and normalize contacts to show in the modal
    const normalizedContacts = [];

    contacts.forEach(contact => {
        // Some APIs use direct fields on the address/contact object
        if (contact.phone || contact.telephone) {
            normalizedContacts.push({ icon: 'bi-telephone', label: 'Teléfono', value: contact.phone || contact.telephone, href: `tel:${contact.phone || contact.telephone}` });
        }
        if (contact.mobile) {
            normalizedContacts.push({ icon: 'bi-phone', label: 'Móvil', value: contact.mobile, href: `tel:${contact.mobile}` });
        }
        if (contact.whatsapp || contact.wsp) {
            const num = contact.whatsapp || contact.wsp;
            normalizedContacts.push({ icon: 'bi-whatsapp', label: 'WhatsApp', value: num, href: `https://wa.me/${num.replace(/[^0-9]/g, '')}` });
        }
        if (contact.email || contact.mail) {
            normalizedContacts.push({ icon: 'bi-envelope', label: 'Email', value: contact.email || contact.mail, href: `mailto:${contact.email || contact.mail}` });
        }
        if (contact.instagram) {
            normalizedContacts.push({ icon: 'bi-instagram', label: 'Instagram', value: contact.instagram, href: contact.instagram.includes('http') ? contact.instagram : `https://instagram.com/${contact.instagram.replace('@', '')}` });
        }
        if (contact.facebook) {
            normalizedContacts.push({ icon: 'bi-facebook', label: 'Facebook', value: contact.facebook, href: contact.facebook.includes('http') ? contact.facebook : `https://facebook.com/${contact.facebook}` });
        }
        if (contact.website || contact.web) {
            const web = contact.website || contact.web;
            normalizedContacts.push({ icon: 'bi-globe', label: 'Sitio Web', value: web, href: web.includes('http') ? web : `https://${web}` });
        }
        
        // Sometimes the API uses a type/value pattern
        if (contact.type && contact.value) {
            const type = String(contact.type).toLowerCase();
            let icon = 'bi-link';
            let label = contact.type || 'Enlace';
            let href = contact.value;

            if (type.includes('phone') || type.includes('tel')) {
                icon = 'bi-telephone';
                label = 'Teléfono';
                href = `tel:${contact.value}`;
            } else if (type.includes('whatsapp') || type.includes('wsp')) {
                icon = 'bi-whatsapp';
                label = 'WhatsApp';
                href = `https://wa.me/${contact.value.replace(/[^0-9]/g, '')}`;
            } else if (type.includes('mail') || type.includes('email')) {
                icon = 'bi-envelope';
                label = 'Email';
                href = `mailto:${contact.value}`;
            } else if (type.includes('instagram') || type.includes('ig')) {
                icon = 'bi-instagram';
                label = 'Instagram';
                href = contact.value.includes('http') ? contact.value : `https://instagram.com/${contact.value.replace('@', '')}`;
            } else if (type.includes('facebook') || type.includes('fb')) {
                icon = 'bi-facebook';
                label = 'Facebook';
                href = contact.value.includes('http') ? contact.value : `https://facebook.com/${contact.value}`;
            } else if (type.includes('web')) {
                icon = 'bi-globe';
                label = 'Sitio Web';
                href = contact.value.includes('http') ? contact.value : `https://${contact.value}`;
            }

            normalizedContacts.push({ icon, label, value: contact.value, href });
        }
        
        // If the object has no identifiable fields but is just a string or has a name
        if (normalizedContacts.length === 0 && (typeof contact === 'string' || contact.name)) {
            const val = typeof contact === 'string' ? contact : contact.name;
            normalizedContacts.push({ icon: 'bi-info-circle', label: 'Info', value: val, href: '#' });
        }
    });

    // If still no valid contacts found but the array had elements, just show generic items to prevent an empty popup
    if (normalizedContacts.length === 0 && contacts.length > 0) {
        contacts.forEach((c, idx) => {
            normalizedContacts.push({
                icon: 'bi-person-lines-fill',
                label: `Contacto ${idx + 1}`,
                value: c.name || c.value || c.address || 'Información de contacto',
                href: '#'
            });
        });
    }

    if (normalizedContacts.length === 0) return null;

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="btn btn-primary w-100 mt-4 font-inter fw-bold py-3 shadow-sm rounded-3 d-flex justify-content-center align-items-center gap-2 hover-lift transition-all"
                style={{ backgroundColor: '#f54286', borderColor: '#f54286', fontSize: '16px' }}
            >
                <i className="bi bi-person-lines-fill fs-5"></i>
                Contacto
            </button>

            {isOpen && (
                <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={() => setIsOpen(false)}></div>
            )}
            
            {isOpen && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1055 }} onClick={(e) => {
                    if (e.target.classList.contains('modal')) setIsOpen(false);
                }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header bg-light border-0 px-4 pt-4 pb-3">
                                <h5 className="modal-title font-inter fw-bold text-gray-900 d-flex align-items-center">
                                    <i className="bi bi-person-lines-fill me-2 fs-4" style={{ color: '#f54286' }}></i>
                                    Información de Contacto
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
                            </div>
                            <div className="modal-body px-4 pb-4">
                                <div className="d-flex flex-column gap-3">
                                    {normalizedContacts.map((field, idx) => (
                                        <a 
                                            key={idx} 
                                            href={field.href}
                                            target={field.href !== '#' ? "_blank" : "_self"}
                                            rel="noopener noreferrer"
                                            className="d-flex align-items-center gap-3 p-3 text-decoration-none text-dark bg-white border rounded-3 hover-lift transition-all"
                                        >
                                            <div className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', backgroundColor: '#fce8ef', color: '#f54286' }}>
                                                <i className={`bi ${field.icon} fs-4`}></i>
                                            </div>
                                            <div className="d-flex flex-column overflow-hidden">
                                                <span className="font-inter small text-muted text-uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>{field.label}</span>
                                                <span className="font-inter fw-medium text-truncate">{field.value}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
