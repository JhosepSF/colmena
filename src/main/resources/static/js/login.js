document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('loginForm');
  
  // Manejo del envío del formulario
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.querySelector('input[name="password"]').value;

    // Obtener el token del reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    
    if (!recaptchaResponse) {
      Swal.fire({
        icon: 'error',
        title: 'Error en reCAPTCHA',
        text: 'Por favor, completa el reCAPTCHA'
      });
      return;
    }

    const requestBody = {
      username: username,
      password: password,
      recaptchaResponse: recaptchaResponse
    };

    fetch('http://localhost:5555/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(response => {
      const { status, body } = response;
      
      console.log(status);

      if (status === 200 && body.token) 
      {
        localStorage.setItem('token', body.token);
        localStorage.setItem('name', body.name);
        localStorage.setItem('rol', body.role);

        const fetchOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${body.token}`
          }
        };

        if(body.role === "ADMINISTRADOR")
        {
          fetch('http://localhost:5555/dashboard/', fetchOptions)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Login exitoso',
              text: 'Bienvenido ' + username
            });
            window.location.href = "/dashboard/";
          });
        }
        else if(body.role === "CAJERO")
        {
          fetch('http://localhost:5555/dashboard/cajero/', fetchOptions)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Login exitoso',
              text: 'Bienvenido ' + username
            });
            window.location.href = "/dashboard/cajero/";
          });
        }
        
      } else if (status === 423) {
        Swal.fire({
          icon: 'error',
          title: 'Cuenta bloqueada',
          text: body.message || 'Tu cuenta ha sido bloqueada debido a múltiples intentos fallidos.'
        });
      } else if (status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Credenciales incorrectas',
          text: body.message || 'Error en el login'
        });
      } else if (status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Cuenta inactiva',
          text: body.message || 'Tu cuenta está inactiva. Contacta al administrador.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error en el login',
          text: body.message || 'Error desconocido. Por favor, intenta de nuevo.'
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        text: 'No se pudo conectar con el servidor'
      });
    });
  });
});
