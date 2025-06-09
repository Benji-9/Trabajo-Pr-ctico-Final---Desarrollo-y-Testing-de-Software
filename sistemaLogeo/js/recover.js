        document.getElementById('recoverForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('recoverEmail').value;
            
            if (!email) {
                alert('Por favor, ingresa tu dirección de email');
                return;
            }
            
            // Hide form and show success message
            document.getElementById('recover-view').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            
            console.log('Password recovery requested for:', email);
        });