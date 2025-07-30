const pool = require('../database/db');

module.exports = {
    crear: async ({ de_usuario_id, para_usuario_id, tipo, imagen_id, solicitud_id }) => {
        await pool.query(
            `INSERT INTO notificaciones (de_usuario_id, para_usuario_id, tipo, imagenes_id, solicitud_id, visto, fecha)
     VALUES (?, ?, ?, ?, ?, false, NOW())`,
            [de_usuario_id, para_usuario_id, tipo, imagen_id, solicitud_id]
        );
    },

    obtenerPorUsuario: async (usuarioId) => {
    const [rows] = await pool.query(`
        SELECT n.*, u.username, u.foto_perfil
        FROM notificaciones n
        JOIN usuarios u ON n.de_usuario_id = u.usuario_id
        LEFT JOIN solicitudes_seguimiento s
          ON s.de_usuario_id = n.de_usuario_id 
         AND s.para_usuario_id = n.para_usuario_id
         AND n.tipo = 'solicitud'
        WHERE n.para_usuario_id = ?
          AND (n.tipo != 'solicitud' OR s.estado = 'pendiente')
        ORDER BY n.fecha DESC
    `, [usuarioId]);
    return rows;
},


    marcarComoVistas: async (usuarioId) => {
        await pool.query(
            'UPDATE notificaciones SET visto = 1 WHERE para_usuario_id = ?',
            [usuarioId]
        );
    },


    contarNoLeidas: async (usuarioId) => {
        const [rows] = await pool.query(
            'SELECT COUNT(*) AS total FROM notificaciones WHERE para_usuario_id = ? AND visto = FALSE',
            [usuarioId]
        );
        return rows[0].total;
    },
    //por el momento no lo uso
    obtenerNotificacionesNoVistas: async (usuarioId) => {
        const [notificaciones] = await pool.query(
            `SELECT n.*, u.username, u.foto_perfil 
     FROM notificaciones n
     JOIN usuarios u ON n.de_usuario_id = u.usuario_id
     WHERE n.para_usuario_id = ? AND n.visto = 0
     ORDER BY n.fecha DESC
     LIMIT 5`, // opcional: limitar cantidad
            [usuarioId]
        );
        return notificaciones;
    },
    //este es el que uso para las notificaciones
    obtenerNotificacionesPorUsuario: async (usuarioId) => {
        const [rows] = await pool.query(
            `SELECT n.*, u.username, u.foto_perfil
            FROM notificaciones n
            JOIN usuarios u ON n.de_usuario_id = u.usuario_id
            LEFT JOIN solicitudes_seguimiento s 
            ON s.de_usuario_id = n.de_usuario_id 
            AND s.para_usuario_id = n.para_usuario_id
            WHERE n.para_usuario_id = ? 
            AND n.visto = 0
            AND (n.tipo != 'solicitud' OR s.estado = 'pendiente')
            ORDER BY n.fecha DESC
            LIMIT 5`,

            [usuarioId]
        );
        return rows;
    },



};
