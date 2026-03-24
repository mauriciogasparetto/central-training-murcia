# Central Training Murcia - Ecosistema Web

## Arquitectura del Proyecto

Este proyecto es la base (Boilerplate) para la nueva presencia digital de **Central Training Murcia**, una red de gimnasios premium de Artes Marciales y Cross Training. 

### Principios de Desarrollo (Reglas Fundamentales)
- **100% Serverless / Archivos Estáticos:** HTML5 Semántico, CSS3 Puro, JavaScript Vanilla (ES6+).
- **Cero Frameworks y Cero Dependencias Pesadas:** No se utilizan librerías preprocesadoras ni frameworks pesados para garantizar la máxima velocidad.
- **Mobile-First Real:** Diseñado priorizando la experiencia táctil y el flujo en dispositivos móviles, escalando progresivamente a pantallas mayores.
- **Rendimiento Máximo (Core Web Vitals):** Objetivo estricto de First Contentful Paint y Largest Contentful Paint por debajo de 2 segundos.
- **Idioma y Copy:** Todo el código fuente (comentarios, nombres de variables), meta etiquetas y el contenido visual (copy) está redactado exclusivamente en Español de España (es-ES) con un enfoque en la conversión (CRO).

### Estructura de Directorios

```text
/site_ct_murcia
├── index.html                 # Portal Gateway - Split Screen Header interactivo
├── /la-flota                 
│   └── index.html             # Landing Sede La Flota (Artes Marciales - Dark Mode)
├── /ronda-sur
│   └── index.html             # Landing Sede Ronda Sur (Artes Marciales & Cross Training)
├── /tienda
│   └── index.html             # Promóximamente (Botón directo a WhatsApp)
├── /assets
│   ├── /css
│   │   ├── variables.css      # Sistema de diseño: Colores, tipografía y espaciado
│   │   ├── global.css         # Reseteos, tipografía base y componentes comunes accesibles
│   │   └── home-split.css     # Lógica y animaciones CSS del Portal Gateway
│   ├── /js
│   │   ├── main.js            # Controladores del DOM global y menús de navegación
│   │   └── modals.js          # Control de Bottom Sheets (Móvil) / Modales (Desktop) para disciplinas
│   ├── /img                   # Imágenes y recursos estáticos
│   └── /video                 # Videos de fondo optimizados para la cabecera (playsinline, muted)
├── manifest.json              # Configuración PWA base
├── robots.txt                 # Reglas de SEO para indexación
└── README.md                  # Esta documentación
```

### Notas sobre Escalabilidad y Mantenimiento

- **Estilos:** Se hace un uso intensivo de variables de CSS (`:root`) para mantener la consistencia en el esquema de colores y facilitar la re-utilización de variables en el "Dark Mode" de la Sede La Flota.
- **Interactividad CSS vs JS:** Se delegan los efectos de transición o *hover* estrictamente a CSS3. JavaScript se reserva exclusivamente para las interacciones obligatorias de estado (abrir modales, carga de bases de datos/Google Sheets).
- **Accesibilidad y SEO:** Todas las imágenes o iconos deben contar con un texto alternativo adecuado, y la jerarquía de etiquetas de encabezado dependerá de la correcta indexación de cara a buscadores.
