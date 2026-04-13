/**
 * noticias.js - Tablón Dinámico
 * Central Training Murcia
 * Generación de mural de noticias desde un Archivo JSON (Fetch API)
 */

document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('noticias-container');
    if (!container) return;

    fetch('/noticias.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(noticiasData => {
            console.log("Dados de Noticias carregados com sucesso:", noticiasData);
            container.innerHTML = ''; // Limpiar el contenedor estático

            noticiasData.forEach(noticia => {
                let catClass = '';
                const categoriaLower = noticia.categoria.toLowerCase();
                
                if (categoriaLower.includes('aviso')) {
                    catClass = 'aviso';
                } else if (categoriaLower.includes('evento')) {
                    catClass = 'evento';
                }

                const cardHtml = `
                    <article class="card-tablon ${catClass}">
                        <span class="tablon-fecha">${noticia.data_display}</span>
                        <h3 class="tablon-titulo">${noticia.titulo}</h3>
                        <p class="tablon-desc">${noticia.descricao}</p>
                    </article>
                `;
                container.insertAdjacentHTML('beforeend', cardHtml);
            });
        })
        .catch(error => {
            console.error('CRÍTICO: Fallo al cargar el json de noticias.', error);
            container.innerHTML = `<p style="color: rgba(255,255,255,0.7); text-align: center; width: 100%;">No se pudo cargar el mural de noticias.</p>`;
        });
});
