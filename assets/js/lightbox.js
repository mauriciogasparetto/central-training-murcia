/**
 * lightbox.js - Lightbox nativo para el carrusel de instalaciones
 * Central Training Murcia - Vanilla JS, cero dependencias
 * Overlay creado una única vez bajo demanda (primer clic) y reutilizado.
 */

document.addEventListener('DOMContentLoaded', () => {

    const carrusel = document.querySelector('.carrusel-instalaciones');
    // Si la página no tiene galería (La Flota, Gateway), abortamos
    if (!carrusel) return;

    let overlay = null;

    const buildOverlay = () => {
        overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Imagen ampliada');
        overlay.innerHTML = `
            <button class="lightbox-close" type="button" aria-label="Cerrar imagen ampliada">&times;</button>
            <img class="lightbox-img" src="" alt="">
            <p class="lightbox-caption"></p>
        `;
        document.body.appendChild(overlay);

        // Cerrar: clic fuera de la imagen (el overlay mismo) o en el botón [X]
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay || event.target.closest('.lightbox-close')) {
                close();
            }
        });
    };

    const open = (img) => {
        if (!overlay) buildOverlay();

        const caption = img.closest('figure')?.querySelector('figcaption');
        overlay.querySelector('.lightbox-img').src = img.currentSrc || img.src;
        overlay.querySelector('.lightbox-img').alt = img.alt;
        overlay.querySelector('.lightbox-caption').textContent = caption ? caption.textContent : img.alt;

        overlay.classList.add('is-open');
        document.body.classList.add('lightbox-open');
        overlay.querySelector('.lightbox-close').focus();
    };

    const close = () => {
        overlay.classList.remove('is-open');
        document.body.classList.remove('lightbox-open');
        // El carrusel tiene tabindex="0": el foco vuelve a un elemento enfocable
        carrusel.focus();
    };

    // Delegación: un único listener para todas las imágenes del carrusel
    carrusel.addEventListener('click', (event) => {
        const img = event.target.closest('img');
        if (img) open(img);
    });

    // Accesibilidad: Escape cierra (guardado por estado propio; convive con
    // los handlers de Escape de nav.js y modals.js)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
            close();
        }
    });
});
