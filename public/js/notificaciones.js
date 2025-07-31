// public/js/notificacionesSocket.js
console.log('👀 notificaciones.js cargado');
const socket = io();
const userId = window.USER_ID;
console.log('Usuario conectado al socket:', userId);

// Registramos el usuario actual cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {

  console.log('Registrando usuario en socket del lado del cliente:', userId);

  // Suponiendo que agregás esto al layout
  if (userId) {
    socket.emit('registrarUsuario', userId);
  }

  // Cuando recibimos una nueva notificación:
  socket.on('nueva_notificacion', (notif) => {
    console.log('esta es la notificacion ', notif);
    const container = document.getElementById('notificaciones-container');
    const dropdown = document.getElementById('dropdown-notificaciones');

    if (!container || !dropdown) return;

    // Mostrar el dropdown si está oculto (opcional)
    // dropdown.style.display = 'block';

    let mensaje = '';
    let acciones = '';

    if (notif.tipo === 'comentario') {
      mensaje = 'Comentó tu imagen: ' + notif.mensaje;
    } else if (notif.tipo === 'solicitud') {
      mensaje = 'te envió una solicitud';
      acciones = `
        <div class="acciones-solicitud">
          <button class="btn-aceptar" data-id="${notif.solicitud_id}">Aceptar</button>
          <button class="btn-rechazar" data-id="${notif.solicitud_id}">Rechazar</button>
        </div>`;
    } else {
      mensaje = 'hizo una acción';
    }

    const foto = notif.foto_perfil || '/imagenes/default.png';

    const html = `
      <div class="notificacion-item">
        <img src="${foto}" alt="Perfil" class="mini-foto">
        <strong>${notif.username}</strong>: ${mensaje}
        ${acciones}
      </div>`;

    container.insertAdjacentHTML('afterbegin', html);
  });
});

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-aceptar') || e.target.classList.contains('btn-rechazar')) {
    const solicitudId = e.target.dataset.id;
    const accion = e.target.classList.contains('btn-aceptar') ? 'aceptar' : 'rechazar';

    const res = await fetch(`/solicitudes/${accion}/${solicitudId}`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (res.ok) {
      const notificacionItem = e.target.closest('.notificacion-item');

      // Reemplaza el contenido por un mensaje
      notificacionItem.innerHTML = `
        <div class="mensaje-solicitud">
          Solicitud ${accion === 'aceptar' ? 'aceptada' : 'rechazada'} ✔️
        </div>
      `;

      // Borra el mensaje luego de 3 segundos
      setTimeout(() => {
        notificacionItem.remove();
      }, 3000);
    } else {
      alert('Error al procesar la solicitud');
    }
  }
});