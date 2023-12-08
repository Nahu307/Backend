const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password, role: 'usuario' });
        await newUser.save();
        res.redirect('/login'); // Redirigir a la página de login después del registro exitoso
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ username: user.username, role: user.role }, 'secretKey');
        res.json({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    registerUser,
    login
};
