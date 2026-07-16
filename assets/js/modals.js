/**
 * modals.js - Lógica Senior para Bottom Sheets / Modales
 * Uso de Delegación de Eventos para máximo rendimiento (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos Globales del DOM
    const modalOverlay = document.getElementById('modal-disciplina');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const ctaButton = document.getElementById('modal-cta');

    // Si no existe el modal en el DOM, abortamos para evitar errores
    if (!modalOverlay) return;

    // -----------------------------------------------------------------------
    // ABRIR MODAL (DELEGACIÓN DE EVENTOS EN EL DOCUMENTO)
    // -----------------------------------------------------------------------
    document.addEventListener('click', (event) => {
        // [PATTERN: Early Return] Isolamento de Propagação para Âncoras Nativas
        if (event.target.closest('a[href^="#"]')) return;
        // 1. Verificar si el clic se hizo en un elemento con data-target="modal-disciplina"
        // closest() busca hacia arriba en el árbol DOM si pinchamos en un hijo (ej. el h3 dentro de la card)
        const trigger = event.target.closest('[data-target="modal-disciplina"]');

        if (trigger) {
            event.preventDefault();

            // 2. Extraer datos directamente de la Card clickeada
            const disciplinaType = trigger.getAttribute('data-disciplina');
            const iconElement = trigger.querySelector('.card-icon') || trigger.querySelector('.bg-image');
            const sourceImg = iconElement ? iconElement.src : '';
            const sourceTitle = trigger.querySelector('.card-title').textContent;
            const sourceDesc = trigger.querySelector('.card-desc').textContent;

            // 3. Inyectar los datos en el Modal
            modalImg.src = sourceImg;
            modalImg.alt = `Icono de ${sourceTitle}`;
            modalTitle.textContent = sourceTitle;
            modalDesc.textContent = sourceDesc;

            // Personalizar el WhatsApp de CTA según la disciplina y la sede
            // (data-sede / data-whatsapp en <body>; fallback = La Flota)
            const sede = document.body.dataset.sede || 'La Flota';
            const waNumber = document.body.dataset.whatsapp || '34633882718';
            const msgTexto = encodeURIComponent(`Hola, quiero probar una clase gratis de ${sourceTitle} en ${sede}`);
            ctaButton.href = `https://wa.me/${waNumber}?text=${msgTexto}`;

            // 4. Mostrar el Modal y bloquear scroll
            modalOverlay.classList.add('is-active');
            document.body.classList.add('modal-open');

            // Accesibilidad: Hacer que el modal gane el foco al abrir
            modalOverlay.focus();
        }
    });

    // -----------------------------------------------------------------------
    // CERRAR MODAL (CLICS INTERNOS Y EXTERNOS)
    // -----------------------------------------------------------------------
    const closeModal = () => {
        modalOverlay.classList.remove('is-active');
        document.body.classList.remove('modal-open');
    };

    // Escuchar clics específicamente dentro del overlay
    modalOverlay.addEventListener('click', (event) => {
        // Cerrar si hace clic en el botón [X] o directamente en el overlay oscuro (fuera del '.modal-content')
        if (
            event.target.classList.contains('close-modal') ||
            event.target === modalOverlay
        ) {
            closeModal();
        }
    });

    // -----------------------------------------------------------------------
    // ACCESIBILIDAD: Cierre con teclado (Escape)
    // -----------------------------------------------------------------------
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('is-active')) {
            closeModal();
        }
    });

});
