/**
 * horarios.js - Tabla Dinámica de Horarios
 * Central Training Murcia - Sede La Flota
 * Generación de matriz CSS Grid desde un Array de Datos (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('horarios-table-container');
    if (!container) return;

    // =========================================================================
    // 1. MOCK DATA (Extraído de la imagen y con actualizaciones aplicadas)
    // =========================================================================

    // Función helper para no repetir el HTML de NOGI e Iniciantes manualmente
    const nogi = (time) => `${time} <span class="text-danger">NOGI</span>`;
    const ini = (time) => `<span class="text-info">Iniciantes</span><br>${time}`;
    const avz = (time) => `Avanzados<br>${time}`;
    const tlv = (time) => `Todos Los Niveles<br>${time}`;

    // Estructura: Todas las disciplinas evaluadas por cada día de la semana.
    // Días válidos indexados: 0:Lunes, 1:Martes, 2:Miercoles, 3:Jueves, 4:Viernes, 5:Sabado
    const horariosData = [
        {
            disciplina: "BOXEO",
            dias: ["", "11:00", "", "11:00", "", "Open Mat<br>11:00-13:30"]
        },
        {
            disciplina: "KEMPO-KARATE",
            dias: ["", "17:30", "", "17:30", "", ""]
        },
        {
            disciplina: "KARATE GOYU RYU",
            dias: ["7:00", "", "7:00", "", "7:00", ""]
        },
        {
            /* REGLA APLICADA: "DF. PERSONAL" cambiado a "Defensa Personal" y L/X añadidos 10:00 */
            disciplina: "DEFENSA PERSONAL",
            dias: ["10:00", "", "10:00", "", "", ""]
        },
        {
            disciplina: "ENTR. FUNCIONAL",
            dias: ["16:00", "", "16:00", "", "16:00", ""]
        },
        {
            disciplina: "MUAY THAI",
            dias: ["10:00<br>21:00", "10:00<br>20:00<br>21:00", "21:00", "10:00<br>20:00<br>21:00", "10:00", "Open Mat<br>11:00-13:30"]
        },
        {
            disciplina: "KICK BOXING",
            dias: [
                `${ini("19:00")}<br>${avz("20:00")}`,
                "",
                `${ini("19:00")}<br>${avz("20:00")}`,
                "",
                tlv("19:00"),
                "Open Mat<br>11:00-13:30"
            ]
        },
        {
            disciplina: "MMA",
            dias: [
                tlv("11:00"),
                `${ini("19:00")}<br>${avz("20:00")}`,
                tlv("11:00"),
                `${ini("19:00")}<br>${avz("20:00")}`,
                tlv("19:00"),
                "Open Mat<br>11:00-13:30"
            ]
        },
        {
            /* REGLA APLICADA: Nuevos horarios exactos de Capoeira ignorando foto antigua */
            disciplina: "CAPOEIRA",
            dias: [
                "17:00 Niños<br>18:00 Jóvenes y Adultos<br>19:00 Jóvenes y Adultos",
                "",
                "17:00 Niños<br>18:00 Jóvenes y Adultos<br>19:00 Jóvenes y Adultos",
                "",
                "",
                "11:30 - 12:30<br>Jóvenes y Adultos"
            ]
        },
        {
            disciplina: "BRAZILIAN JIU-JITSU",
            dias: [
                "11:00<br>12:00<br>17:00 Kids 1<br>20:00<br>Avanzados<br>21:00",
                `10:00<br>11:00<br>12:00<br>17:00 Kids 2<br>${ini("18:00")}<br>19:00<br>20:00<br>21:00`,
                `${nogi("11:00")}<br>${nogi("12:00")}<br>17:00 Kids 1<br>${nogi("20:00")}<br>Avanzados<br>${nogi("21:00")}`,
                `${nogi("10:00")}<br>11:00<br>12:00<br>17:00 Kids 2<br>${ini("18:00")}<br>19:00<br>20:00<br>${nogi("21:00")}`,
                "11:00<br>18:00<br>LUCHA OLÍMPICA Y JUDO NOGI",
                "Open Mat<br>11:00-13:30"
            ]
        },
        {
            disciplina: "JUDO",
            dias: [
                "4 a 5 años<br>16:00<br>6 a 8 años<br>17:00<br>9 a 12 años<br>18:00<br>Adultos<br>10:00<br>19:00",
                "", // Martes vacio
                "4 a 5 años<br>16:00<br>6 a 8 años<br>17:00<br>9 a 12 años<br>18:00<br>Adultos<br>10:00<br>19:00",
                "", // Jueves vacio
                "Adultos<br>10:00<br>19:00",
                "Open Mat<br>11:00-13:30"
            ]
        }
    ];

    const daysHeaders = ["DISCIPLINAS", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

    // =========================================================================
    // 2. RENDERIZADO DEL GRID
    // =========================================================================

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

    // Inyectamos las filas iterando sobre nuestros Mock Data
    horariosData.forEach((row, rowIndex) => {
        // Alternar zebrado lógico (filas pares impar) para el estilo premium
        const rowClass = rowIndex % 2 === 0 ? "row-even" : "row-odd";

        // Primera celda: Disciplina (siempre pegajosa a la izquierda)
        htmlContent += `<div class="grid-cell col-sticky ${rowClass}">${row.disciplina}</div>`;

        // Celdas de los respectivos días
        row.dias.forEach((clasesDia) => {
            // Envolvemos los horarios de cada día para estructurarlos limpiamente
            // Hacemos split por <br> y asignamos margin o classes si hace falta:
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

});
