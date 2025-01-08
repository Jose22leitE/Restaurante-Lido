const { admin, db } = require('../config/firebase');

// Registro de usuario
exports.registerUser = async (req, res) => {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const userRecord = await admin.auth().createUser({
            email: correo,
            password: password,
            displayName: nombre,
        });

        await db.collection('users').doc(userRecord.uid).set({
            nombre,
            correo,
            createdAt: new Date(),
        });

        res.status(201).json({ message: 'Usuario registrado con éxito.', uid: userRecord.uid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Inicio de sesión
exports.loginUser = async (req, res) => {
    const { correo, password } = req.body;

    if (!correo || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    }

    try {
        const user = await admin.auth().getUserByEmail(correo);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Nota: Firebase Auth no permite verificar contraseñas directamente desde el backend.
        // Necesitarías usar el SDK en el frontend para manejar el inicio de sesión.
        res.status(200).json({ message: 'Inicio de sesión exitoso.', uid: user.uid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};