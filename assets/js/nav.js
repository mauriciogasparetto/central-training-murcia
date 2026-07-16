/**
 * nav.js - Menú hamburguesa accesible (Overlay Mobile)
 * Central Training Murcia - Sedes con tema claro (ej. Ronda Sur)
 * El atributo aria-expanded es la única fuente de verdad del estado:
 * el CSS del icono (X) se engancha a él, nunca se desincroniza de la a11y.
 */

document.addEventListener('DOMContentLoaded', () => {

    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('main-nav');

    // Si la página no tiene hamburguesa (La Flota, Gateway), abortamos
    if (!toggle || !nav) return;

    const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        nav.classList.toggle('is-open', open);
        document.body.classList.toggle('nav-open', open);
    };

    toggle.addEventListener('click', () => {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Cerrar al pulsar un enlace (anclas internas de la misma página)
    nav.addEventListener('click', (event) => {
        if (event.target.closest('a.nav-link')) setOpen(false);
    });

    // Accesibilidad: Escape cierra y devuelve el foco al botón
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && nav.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });

    // Si se cruza el breakpoint de desktop con el menú abierto, resetear estado
    window.matchMedia('(min-width: 992px)').addEventListener('change', (mq) => {
        if (mq.matches) setOpen(false);
    });
});
