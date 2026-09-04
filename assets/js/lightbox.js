/**
 * lightbox.js - Lightbox nativo para el carrusel de instalaciones
 * Central Training Murcia - Vanilla JS, cero dependencias
 * Overlay creado una única vez bajo demanda (primer clic) y reutilizado.
 * Navegación entre todas las fotos: flechas, teclado y swipe.
 */

document.addEventListener('DOMContentLoaded', () => {

    const carrusel = document.querySelector('.carrusel-instalaciones');
    // Si la página no tiene galería (La Flota, Gateway), abortamos
    if (!carrusel) return;

    const fotos = Array.from(carrusel.querySelectorAll('img'));
    if (!fotos.length) return;

    let overlay = null;
    let indice = 0;
    // Foto que abrió el lightbox: al cerrar le devolvemos el foco, para no perder
    // el sitio en una galería de 19 fotos
    let disparador = null;

    const buildOverlay = () => {
        overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Imagen ampliada');
        overlay.innerHTML = `
            <button class="lightbox-close" type="button" aria-label="Cerrar imagen ampliada">&times;</button>
            <button class="lightbox-nav lightbox-nav--prev" type="button" aria-label="Foto anterior">&lsaquo;</button>
            <img class="lightbox-img" src="" alt="">
            <button class="lightbox-nav lightbox-nav--next" type="button" aria-label="Foto siguiente">&rsaquo;</button>
            <p class="lightbox-caption"></p>
            <p class="lightbox-contador" aria-live="polite"></p>
        `;
        document.body.appendChild(overlay);

        // Cerrar: clic fuera de la imagen (el overlay mismo) o en el botón [X]
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay || event.target.closest('.lightbox-close')) {
                close();
                return;
            }
            if (event.target.closest('.lightbox-nav--prev')) mover(-1);
            if (event.target.closest('.lightbox-nav--next')) mover(1);
        });

        // Swipe horizontal sobre la foto (móvil)
        let inicioX = null;
        const img = overlay.querySelector('.lightbox-img');

        img.addEventListener('touchstart', (event) => {
            inicioX = event.changedTouches[0].clientX;
        }, { passive: true });

        img.addEventListener('touchend', (event) => {
            if (inicioX === null) return;
            const desplazamiento = event.changedTouches[0].clientX - inicioX;
            inicioX = null;
            if (Math.abs(desplazamiento) > 40) mover(desplazamiento < 0 ? 1 : -1);
        }, { passive: true });
    };

    // Las fotos grandes pasan de 300 KB: precargamos las vecinas para que el
    // salto sea instantáneo
    const precargar = (i) => {
        const vecina = fotos[(i + fotos.length) % fotos.length];
        if (vecina) new Image().src = vecina.currentSrc || vecina.src;
    };

    const show = (i) => {
        indice = (i + fotos.length) % fotos.length;
        const foto = fotos[indice];
        const caption = foto.closest('figure')?.querySelector('figcaption');

        overlay.querySelector('.lightbox-img').src = foto.currentSrc || foto.src;
        overlay.querySelector('.lightbox-img').alt = foto.alt;
        overlay.querySelector('.lightbox-caption').textContent = caption ? caption.textContent : foto.alt;
        overlay.querySelector('.lightbox-contador').textContent = `${indice + 1} / ${fotos.length}`;

        precargar(indice + 1);
        precargar(indice - 1);
    };

    const mover = (direccion) => show(indice + direccion);

    const open = (img) => {
        if (!overlay) buildOverlay();

        disparador = img;
        show(fotos.indexOf(img));

        overlay.classList.add('is-open');
        document.body.classList.add('lightbox-open');
        overlay.querySelector('.lightbox-close').focus();
    };

    const close = () => {
        overlay.classList.remove('is-open');
        document.body.classList.remove('lightbox-open');

        if (disparador && disparador.isConnected) {
            // <img> no es enfocable: le prestamos un tabindex y lo retiramos al salir,
            // para no dejar paradas de tabulación extra en el carrusel.
            // Referencia fija: si se abre otra foto antes del blur, limpiamos ésta.
            const foto = disparador;
            foto.setAttribute('tabindex', '-1');
            foto.addEventListener('blur', () => foto.removeAttribute('tabindex'), { once: true });
            foto.focus({ preventScroll: true });
        } else {
            // Fallback: el carrusel tiene tabindex="0"
            carrusel.focus();
        }
    };

    // Delegación: un único listener para todas las imágenes del carrusel
    carrusel.addEventListener('click', (event) => {
        const img = event.target.closest('img');
        if (img) open(img);
    });

    // Accesibilidad: Escape cierra y las flechas navegan (guardado por estado
    // propio; convive con los handlers de Escape de nav.js y modals.js)
    document.addEventListener('keydown', (event) => {
        if (!overlay || !overlay.classList.contains('is-open')) return;

        if (event.key === 'Escape') close();
        if (event.key === 'ArrowLeft') mover(-1);
        if (event.key === 'ArrowRight') mover(1);

        // Focus trap: aria-modal="true" promete que el fondo queda fuera de alcance,
        // pero por sí solo no lo impide. Ciclamos entre los tres botones del overlay.
        if (event.key === 'Tab') {
            const botones = overlay.querySelectorAll('button');
            const primero = botones[0];
            const ultimo = botones[botones.length - 1];

            if (event.shiftKey && document.activeElement === primero) {
                event.preventDefault();
                ultimo.focus();
            } else if (!event.shiftKey && document.activeElement === ultimo) {
                event.preventDefault();
                primero.focus();
            } else if (!overlay.contains(document.activeElement)) {
                // El foco se escapó (p. ej. venía del fondo): lo traemos de vuelta
                event.preventDefault();
                primero.focus();
            }
        }
    });
});
