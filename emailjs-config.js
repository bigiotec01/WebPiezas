// EmailJS configuration — shared across all pages
const EJS_PUBLIC_KEY  = '6XoYx1ojjPOG2McJe';
const EJS_SERVICE_ID  = 'service_tfsdktr';
const EJS_TEMPLATE_ID = 'template_rfla0nf';

emailjs.init({ publicKey: EJS_PUBLIC_KEY });

window.notifyAdminChat = function(nombre, mensaje) {
  emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, {
    nombre:  nombre,
    mensaje: mensaje,
    hora:    new Date().toLocaleString('es', { dateStyle:'short', timeStyle:'short' }),
    link:    'https://piezas.bigios.com/admin.html'
  }).catch(() => {});
};

window.notifyAdminCotizacion = function(taller, pieza, marca, modelo) {
  emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, {
    nombre:  taller,
    mensaje: marca + ' ' + modelo + ' — ' + pieza,
    hora:    new Date().toLocaleString('es', { dateStyle:'short', timeStyle:'short' }),
    link:    'https://piezas.bigios.com/admin.html'
  }).catch(() => {});
};
