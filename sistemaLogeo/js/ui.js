document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-password').forEach(button => {
    const targetId = button.dataset.target;
    const input = document.getElementById(targetId);
    const icon = button.querySelector('img');

    if (input && icon) {
      button.addEventListener('click', () => {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        icon.src = isHidden ? 'img/eye.svg' : 'img/hide.svg';
        icon.alt = isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña';
      });
    }
  });
});
