document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');

    // La función de validación se mantiene igual
    function validatePassword(password) {
        const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return regex.test(password);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('newUsername').value.trim();
            const email = document.getElementById('newEmail').value.trim();
            const password = document.getElementById('newPassword').value.trim();
            
            registerError.textContent = '';

            if (!username || !email || !password) {
                registerError.textContent = 'Todos los campos son obligatorios.';
                return;
            }

            if (!validatePassword(password)) {
                registerError.textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.';
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(u => u.username === username || u.email === email);

            if (userExists) {
                registerError.textContent = 'El nombre de usuario o el email ya están registrados.';
                return;
            }

            const newUser = { username, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
            window.location.href = 'index.html';
        });
    }

});