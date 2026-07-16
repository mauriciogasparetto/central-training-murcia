/**
 * horarios.js - Tabla Dinámica de Horarios
 * Central Training Murcia - Sede La Flota
 * Generación de matriz CSS Grid desde un Archivo JSON (Fetch API)
 */

document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('horarios-table-container');
    if (!container) return;

    // =========================================================================
    // 1. CARGA DE DATOS (Fetch API) Y RENDERIZADO DEL GRID
    // =========================================================================

    // Fuente por sede: data-horarios-src en el contenedor; fallback = La Flota
    fetch(container.dataset.horariosSrc || '/horarios.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(horariosData => {
            console.log("Dados de Horarios carregados com sucesso:", horariosData);
            const daysHeaders = ["DISCIPLINAS", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

            // Construimos la estructura inicial (Contenedor Wrapper y base Grid)
            let htmlContent = `
              <div class="horarios-wrapper">
                <div class="horarios-grid">
            `;

            // Inyectamos la Cabecera (Headers Fijos)
            daysHeaders.forEach((day, index) => {
                // La primera columna de cabecera tiene doble clase sticky (top y left)
                const extraClass = index === 0 ? "col-sticky" : "";
                htmlContent += `<div class="grid-cell grid-header ${extraClass}">${day}</div>`;
            });

            // Inyectamos las filas iterando sobre los datos cargados del JSON
            horariosData.forEach((row, rowIndex) => {
                // Alternar zebrado lógico (filas pares impar) para el estilo premium
                const rowClass = rowIndex % 2 === 0 ? "row-even" : "row-odd";

                // Primera celda: Disciplina (siempre pegajosa a la izquierda)
                htmlContent += `<div class="grid-cell col-sticky ${rowClass}">${row.disciplina}</div>`;

                // Celdas de los respectivos días
                row.dias.forEach((clasesDia) => {
                    // Envolvemos los horarios de cada día para estructurarlos limpiamente
                    const parsedContent = clasesDia ? `<div class="horario-item">${clasesDia}</div>` : '';
                    htmlContent += `<div class="grid-cell ${rowClass}">${parsedContent}</div>`;
                });
            });

            // Cerramos los contenedores de la matriz
            htmlContent += `
                </div>
              </div>
            `;

            // Inyectamos todo finalmente en el DOM
            container.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('CRÍTICO: Fallo al cargar el archivo JSON de horarios.', error);
            container.innerHTML = `<p style="color: rgba(255,255,255,0.7); padding: 20px; text-align: center; border: 1px dashed rgba(255,255,255,0.3);">No se pudieron cargar los horarios en este momento. Por favor contacte con soporte.</p>`;
        });
});
