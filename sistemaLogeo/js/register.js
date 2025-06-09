document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('newUsername').value.trim();
        const email = document.getElementById('newEmail').value.trim();
        const password = document.getElementById('newPassword').value.trim();
        
        if (!username || !email || !password) {
            registerError.textContent = 'Todos los campos son obligatorios.';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Verificar si el usuario ya existe
        const userExists = users.some(u => u.username === username || u.email === email);

        if (userExists) {
            registerError.textContent = 'El nombre de usuario o el email ya están registrados.';
            return;
        }

        // Agregar el nuevo usuario
        const newUser = { username, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Notificar al usuario y redirigir
        alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        window.location.href = 'index.html';
    });

    // Lógica para mostrar/ocultar contraseña
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('newPassword');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? 'Mostrar' : 'Ocultar';
        });
    }
});