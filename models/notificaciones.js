const pool = require('../database/db');

module.exports = {
    crear : async ({ de_usuario_id, para_usuario_id, tipo, imagen_id }) => {
        await pool.query(
            `INSERT INTO notificaciones (de_usuario_id, para_usuario_id, tipo, imagen_id, leida, fecha)
     VALUES (?, ?, ?, ?, false, NOW())`,
            [de_usuario_id, para_usuario_id, tipo, imagen_id]
        );
    },

    obtenerPorUsuario: async (usuarioId) => {
        const [rows] = await pool.query(
            'SELECT * FROM notificaciones WHERE usuario_id = ? ORDER BY fecha DESC',
            [usuarioId]
        );
        return rows;
    },

    marcarComoVistas: async (usuarioId) => {
        await pool.query(
            'UPDATE notificaciones SET visto = TRUE WHERE usuario_id = ?',
            [usuarioId]
        );
    },

    contarNoVistas: async (usuarioId) => {
        const [rows] = await pool.query(
            'SELECT COUNT(*) AS total FROM notificaciones WHERE usuario_id = ? AND visto = FALSE',
            [usuarioId]
        );
        return rows[0].total;
    }
};
