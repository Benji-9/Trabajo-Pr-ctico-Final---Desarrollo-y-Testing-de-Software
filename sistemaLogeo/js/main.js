// Generic password visibility toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inputGroup = button.parentElement;
            const passwordInput = inputGroup.querySelector('input[type="password"], input[type="text"]');
            
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                button.textContent = type === 'password' ? 'Show' : 'Hide';
            }
        });
    });
});