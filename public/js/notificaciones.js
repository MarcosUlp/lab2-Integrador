document.addEventListener('DOMContentLoaded', () => {
  const btnNotificaciones = document.getElementById('btn-notificaciones');
  const dropdown = document.getElementById('dropdown-notificaciones');
  const notificacionesContainer = document.getElementById('notificaciones-container');

  let visible = false;

  btnNotificaciones.addEventListener('click', () => {
    visible = !visible;
    dropdown.style.display = visible ? 'block' : 'none';

    if (visible) {
      fetch('/notificaciones/api/recientes')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('🔍 Datos recibidos del fetch:', data);
          const notificaciones = data.notificaciones;
          console.log('🔍 Datos recibidos del fetch:', notificaciones);
          if (!Array.isArray(notificaciones)) {
            throw new Error('La respuesta no es un array de notificaciones');
          }

          if (notificaciones.length === 0) {
            notificacionesContainer.innerHTML = '<p>No hay notificaciones nuevas.</p>';
            return;
          }

          const html = notificaciones.map(notif => {
            let mensaje = '';
            let acciones = '';

            if (notif.tipo === 'comentario' && notifi) {
              mensaje = 'comentó una imagen';
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

            return `
              <div class="notificacion-item">
              <img src="${foto}" alt="Perfil" class="mini-foto">
              <strong>${notif.username}</strong>: ${mensaje}
              ${acciones}
              </div>`;
          }).join('');

          notificacionesContainer.innerHTML = html;

          // Botones de aceptar
          document.querySelectorAll('.btn-aceptar').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = btn.dataset.id;
              console.log('este es el id de la notificacion ', id);
              try {
                console.log('este es el id de la notificacion ', id);

                const res = await fetch(`/solicitudes/aceptar/${id}`, {
                  method: 'POST',
                  credentials: 'include' // 🔥 Esto es lo que te falta
                });

                if (!res.ok) {
                  const text = await res.text(); // para errores que no son JSON
                  console.error('Error al aceptar solicitud:', text);
                  return;
                }

                const result = await res.json();

                console.log('Solicitud aceptada:', result);

                btn.parentElement.innerHTML = '<span class="aceptada">Solicitud aceptada</span>';

              } catch (error) {
                console.error('Error al aceptar solicitud:', error);
              }
            });
          });

          // Botones de rechazar
          document.querySelectorAll('.btn-rechazar').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = btn.dataset.id;
              try {
                const res = await fetch(`/solicitudes/rechazar/${id}`, { method: 'POST' });
                const result = await res.json();
                console.log('Solicitud rechazada:', result);
                btn.parentElement.innerHTML = '<span class="rechazada">Solicitud rechazada</span>';
              } catch (error) {
                console.error('Error al rechazar solicitud:', error);
              }
            });
          });

        })

        .catch(error => {
          console.error('Error al cargar notificaciones:', error);
          notificacionesContainer.innerHTML = '<p>Error al cargar notificaciones.</p>';
        });
    }
  });

  // Cierra el dropdown si se hace clic afuera
  document.addEventListener('click', (e) => {
    if (!btnNotificaciones.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.style.display = 'none';
      visible = false;
    }
  });
});

