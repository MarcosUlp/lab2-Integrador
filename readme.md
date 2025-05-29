Requerimientos
- Los usuarios registrardos,pueden completar y modificar su perfil y contraseña SIEMPRE
- classPerfil{
    informacion personal
    intereses
    antecedentes
    imagenPrincipal          se mostrara cada vez que el usuario realice accion dentro de la plataforma
}
- **Crear** albumen personalizados para organizar y mostrar creaciones.

- cada album tiene: **titulo y entre 1 y 20 imagenes**, se podra destacar una obra como una serie completa

- **todas las imagenes**, (excepto la de perfil) debe estar asociada a un album.

- Opcional: cada imagen puede tener **titulo o descripcion** ("caption") que ofrezca detalles

- todo usuario que tenga aceso a una imagen **podra comentar** la misma

- Compartir de manera controlada, **se eligen los contactos para compartir** manteniendo control.

- Se pueden **enviar solicutes** de seguimiento, el destinatario podra **aceptar o rechazar la solicitud.**en caso de ser aceptada el sistema creara un nuevo album en el perfil del usuario que envio la solicitud con el nombre del que la acepto. el album contendra las imagenes del usuario seguido.
esta relacion es **unidireccional**

- **SISTEMA DE NOTIFICACIONES** en tiempo real:

    **Notificacion solicitud de seguimiento** 
    Cuando un usuario recibe una solicitud de seguimiento le debe aparecer una notificacion instantanea
    desde la notificacion se podra acceder a la opcion de **aceptar o rechazar**
    una vez respondido se debera notificar al usuario que envio la solicitud (aceptada-rechazada)

    **Notificacion de nuevos comentarios**
    Cuando una imagen recibe un comentario, en ese momento le tiene que llegar una notificacion inmediata al autor de la imagen indicando:
    - Quien comento
    - en que imagen
    - una porcion del comentario(primeros caracteres seguido de puntos suspensivos(opcional)).
    Panel de notificaciones, con enlace para ver la imagen comentada

    **Indicadores de actididad no vista**
    - Contador visual en icono de notificaciones indicando la cantidad de actividades pendientes (nuevas solicitudes, comentarios)
    - cuando el usuario la revisa, la notificacion debe **marcarse como leida**

las notificaciones se implementan usando **tecnologias de tiempo real** (websockets o similar) los avisos llegan **sin recargar la pagina**

**ETIQUETA (TAGS)**

se podra etiquetar las obras con tecnicas, materiales, o estilos predefinidos (macrame, acrilico, reciclado). este requerimiento se apoyarán sobre una barra de busqueda que permita filtrar, imagenes, usuarios o albumes por **nombre o etiquetas**

**funcionalidades obligatorias minimas 2**

*Estadisticas del perfil basicas:* Cantidad de imagenes subidas, reacciones, comentarios 
*Sistema de reporte o denuncias:* los usuarios pueden reportar contenido ofensivo o inapropiado

Paginas dinamicas con uso de plantillas


**ARQUITECTURA MVC**

/artesanos.com
├── controllers/
│   ├── usuarioController.js
│   ├── imagenController.js
│   ├── amistadController.js
│   └── albumController.js
├── models/
│   ├── Usuario.js
│   ├── Imagen.js
│   ├── Album.js
│   └── Amistad.js
├── routes/
│   ├── usuarioRoutes.js
│   ├── imagenRoutes.js
│   ├── amistadRoutes.js
│   └── albumRoutes.js
├── views/
│   └── (si usás HTML, ejs o algún motor de templates)
├── public/
│   └── (CSS, imágenes, JS frontend)
├── database/
│   └── db.js (conexión a MySQL/MariaDB)
├── app.js (main Express app)
└── package.json


**dia 1**

../models/usuario:                   aqui se genera la conexion a la bd  (create, select)

../controllers/usuarioController:    aqui se registra o logea un usuario generando token para mantener  la sesion

../middleware/auth:                  autentificacion del token 
                                    
../controllers/userController:       Basico con login y registro

../routes/userRoutes                 Rutas para userController





con respecto al manejo de "solicitudes_seguimiento" y "seguidores" **Entidad debil??**
- Segun el modelado de ER puro son entidades debiles las que no tienen PK propia, y depuenden de una fuerte con clave compuesta
- pero si son tablas dependientes de usuario, 

son las dos tablas dependientes de "usuarios", ya que ninguna puede existir sin ellos
- solicitud_seguimiento: representa un pedido que puede estar pendiente, aceptado, rechazado
- seguidores: representa el vinculo final, solo existe si la solicitud fue aceptada.

Problema: hay que oblligar a que haya una solicitud antes de que alguien este en seguidores.

Lo vamos a manejar del backend: 
seguidores no va a tener referencia directa a solicitud_seguimiento.
- en el codigo back, al aceptar una solicitud: 
    - se cambia el estado a 'aceptado' en solicitudes_seguimiento
    - insertar en seguidores con los mismos de_usuario_id (como seguidor) y para_usuario_id (como seguido)
BONUS
 evitar duplicados: que no se puedan enviar varias solicitudes pendientes al mismo usuario
 validar reciprocidad: que un usuario no pueda autoseguirse
 Rechazo automatico: si alguien rechaza una solicitud no se genera la relacion en seguidores




