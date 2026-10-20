# Los Compaitos · demo comercial

Sitio estático sin dependencias de producción. Página informativa, carta digital fiel a la estructura del PDF y página independiente de pedidos con catálogo de 53 opciones y carrito para solicitar pedidos por WhatsApp, taquizas y QR. Sin reseñas ni punto de venta.

## Vista local

Desde esta carpeta: `python3 -m http.server 4173 --directory dist`. Abrir http://localhost:4173.

## Cambios compartidos

Editar `dist/config.js`:

- `BUSINESS.theme`: `halloween`, `original` o `navidad`. Publicar para aplicar a todos.
- `BUSINESS.branches`: direcciones, teléfonos y búsquedas de Maps.
- `BUSINESS.whatsapp`: número central con código de país, sin signos.
- `MENU`: productos, precios y categorías. Los identificadores actuales dependen del orden: no reordenar para no alterar carritos guardados; al ampliar a edición frecuente, migrar a identificadores estables explícitos.

El selector «Explora el look» es una vista previa guardada solo en este navegador, compartida entre página y menú por localStorage. No es un panel de administración ni cambia lo que ven otros usuarios. Para volver al tema publicado, borrar `compaitos-theme` del almacenamiento local.

## Pedidos

El carrito calcula productos en MXN, permite cantidades de 1 a 99, conserva la selección localmente y abre un mensaje en el WhatsApp central del impreso (246 118 7019). Permite recoger sin cargo o entrega a domicilio con $20 MXN de envío, configurables en `BUSINESS.deliveryFee`. La entrega exige dirección. Incluye sucursal, nombre, productos, subtotal, envío, total y notas; la dirección solo se comparte al elegir domicilio. El usuario debe enviarlo manualmente. La taquería confirma disponibilidad, precio y preparación. No se registra una venta ni se procesa un pago. No se borra el carrito al abrir WhatsApp porque todavía no hay confirmación.

Taquizas: fecha, personas y ubicación se incorporan al mensaje de solicitud. No se almacenan datos personales en servidor.

## QR y publicación

Desarrollo y revisión exclusivamente locales. No publicar en Sites. Solo desplegar en el servidor del propietario cuando él lo apruebe expresamente.

`dist/qr.html` permite revisar la hoja del QR. `assets/menu-qr.svg` apunta a `http://localhost:4173/menu.html`: solo funciona en esta computadora; no sirve para escanear desde otro teléfono. Regenerarlo con el dominio del servidor del propietario después de aprobar la publicación.

La página utiliza enlaces de búsqueda de Google Maps a partir del PDF, no coordenadas verificadas. No inventa horarios. Confirmar precios, teléfonos, horarios, ubicaciones y condiciones de taquizas antes de lanzamiento comercial.

## Imagen

`dist/assets/pastor-hero.webp`: imagen publicitaria ilustrativa generada con la herramienta integrada de imagegen, optimizada a WebP (aprox. 338 KB). No representa una fotografía real del negocio. Prompt completo en `IMAGE-PROMPT.md`. La tipografía usa Google Fonts con alternativas locales; se requiere conexión para las fuentes remotas.

## Validación

`tests/browser.cjs` usa Playwright y Chrome. Ejecutar con `PLAYWRIGHT_MODULE=/ruta/a/playwright node tests/browser.cjs` o instalar Playwright como herramienta de desarrollo. Verifica búsquedas, catálogo, carrito, total, mensaje de WhatsApp interceptado (sin envío), temporadas, taquizas y anchos 320/390/768/1440. Capturas en `qa/` (no se publican).

## Servicio comercial

Base elegida por el usuario: $250 MXN al mes. Implementación inicial pendiente de definir. Diez clientes = $2,500 mensuales brutos. Acotar mantenimiento y cambios incluidos; este proyecto no incluye un panel autoadministrable ni soporte ilimitado.

El logo en `dist/assets/logo-los-compaitos.png` se extrajo de la primera página del PDF original, conservando el fondo de la fotografía. Los productos por kilo permiten incrementos de 0.5 kg con precio proporcional.

## Páginas separadas

- `/menu.html`: carta digital de consulta, en dos caras como el PDF, con categorías, precios y logo. Sin carrito ni botones para agregar. El QR abre esta página.
- `/pedidos.html`: cantidades, medios kilos, envío de $20, dirección y resumen de WhatsApp.
- `/assets/menu-original.pdf`: PDF original disponible para consulta.

La carta y los pedidos comparten precios desde `config.js`. La carta conserva la composición en escritorio y apila las secciones en celular para facilitar la lectura.
