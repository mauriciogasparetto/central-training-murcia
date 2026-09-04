/**
 * carrusel.js - Controles del carrusel de instalaciones
 * Central Training Murcia - Vanilla JS, cero dependencias
 *
 * El desplazamiento sigue siendo scroll-snap nativo (swipe fluido, sin librerías);
 * aquí sólo añadimos las señales que el móvil no da: barra de progreso, contador
 * "n / total", flechas en escritorio y un empujón inicial que sugiere el gesto.
 */

document.addEventListener('DOMContentLoaded', () => {

    const track = document.querySelector('.carrusel-instalaciones');
    // Si la página no tiene galería (La Flota, Gateway), abortamos
    if (!track) return;

    const barra = document.querySelector('.carrusel-progreso span');
    const contador = document.querySelector('.carrusel-contador');
    const btnPrev = document.querySelector('.carrusel-nav--prev');
    const btnNext = document.querySelector('.carrusel-nav--next');

    const slides = track.querySelectorAll('.carrusel-slide');
    const total = slides.length;
    if (!total) return;

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ancho de un slide + gap: se recalcula en cada uso porque depende del viewport
    const paso = () => {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return slides[0].getBoundingClientRect().width + gap;
    };

    const update = () => {
        const scrollable = track.scrollWidth - track.clientWidth;

        const ratio = scrollable > 0 ? track.scrollLeft / scrollable : 0;

        if (barra) {
            // Pulgar proporcional a la parte visible, como una scrollbar: su
            // tamaño ya dice cuántas fotos quedan fuera de pantalla
            const proporcion = Math.max(0.12, track.clientWidth / track.scrollWidth);
            const libre = barra.parentElement.clientWidth * (1 - proporcion);
            barra.style.width = `${proporcion * 100}%`;
            barra.style.transform = `translateX(${ratio * libre}px)`;
        }

        if (contador) {
            // Al final mostramos el total: en escritorio caben varias fotos a la
            // vez y el índice de la primera visible se quedaría corto
            const indice = track.scrollLeft >= scrollable - 1
                ? total
                : Math.min(total, Math.round(track.scrollLeft / paso()) + 1);
            contador.textContent = `${indice} / ${total}`;
        }

        // Tolerancia de 1px: el scroll fraccionario nunca llega al máximo exacto
        if (btnPrev) btnPrev.disabled = track.scrollLeft <= 1;
        if (btnNext) btnNext.disabled = track.scrollLeft >= scrollable - 1;
    };

    // El scroll dispara muchísimo: agrupamos las lecturas en un frame
    let pendiente = false;
    track.addEventListener('scroll', () => {
        if (pendiente) return;
        pendiente = true;
        requestAnimationFrame(() => {
            pendiente = false;
            update();
        });
    }, { passive: true });

    window.addEventListener('resize', update);

    const mover = (direccion) => track.scrollBy({
        left: direccion * paso(),
        behavior: sinMovimiento ? 'auto' : 'smooth'
    });

    if (btnPrev) btnPrev.addEventListener('click', () => mover(-1));
    if (btnNext) btnNext.addEventListener('click', () => mover(1));

    // Pista de swipe: al entrar la sección en pantalla, el carrusel se asoma y
    // vuelve. Una sola vez, y sólo si el usuario aún no lo ha tocado.
    if (!sinMovimiento && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();

                if (track.scrollLeft > 0) return;

                // scroll-snap "mandatory" adopta cualquier scroll como definitivo:
                // sin desactivarlo, el pequeño empujón queda enganchado en la
                // siguiente foto en vez de volver. Lo restauramos al terminar.
                track.style.scrollSnapType = 'none';
                track.scrollBy({ left: 28, behavior: 'smooth' });
                setTimeout(() => {
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                    setTimeout(() => { track.style.scrollSnapType = ''; }, 450);
                }, 450);
            });
        }, { threshold: 0.35 });

        observer.observe(track);
    }

    update();
});
