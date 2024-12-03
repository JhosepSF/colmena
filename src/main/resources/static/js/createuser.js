document.addEventListener("DOMContentLoaded", () => {
    const addUserForm = document.getElementById("addUserForm");
    const roleSelect = document.getElementById("roleSelect");

    // Función para obtener los roles desde el servidor y poblar el select
    function fetchRoles() {
        fetch('http://localhost:5555/rol/all')
            .then(response => response.json())
            .then(data => {
                data.forEach(role => {
                    const option = document.createElement('option');
                    option.value = role.id;
                    option.text = role.name;
                    roleSelect.add(option);
                });
            })
            .catch(error => console.error('Error al cargar los roles:', error));
    }

    // Llamar a la función para cargar los roles cuando se carga la página
    fetchRoles();

    addUserForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Capturamos los valores de los campos de password y rol
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("password-c").value;
        const selectedRole = document.getElementById("roleSelect").value;

        // Comprobar si las contraseñas coinciden
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Aceptar'
            });
            return; // Detener el envío del formulario
        }

        // Capturamos los demás valores del formulario
        const requestData = {
            name: document.getElementById("name").value,
            lastname: document.getElementById("lastname").value,
            address: document.getElementById("address").value,
            username: document.getElementById("username").value,
            password: password,
            rol: selectedRole
        };

        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        // Enviar los datos al servidor con el token en el header Authorization
        fetch('http://localhost:5555/usuarios/new', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Incluir el token en el header Authorization
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario creado',
                    text: 'El usuario ha sido creado exitosamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
	                // Redirigir o recargar la tabla de roles
	                window.location.href = '/dashboard/usuarios/'; // Cambiar esta URL según corresponda
	            });
            } else {
                throw new Error('Error en el envío del formulario');
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al crear el usuario. Inténtalo de nuevo.',
                confirmButtonText: 'Aceptar'
            });
            console.error('Error:', error);
        });
    });
});