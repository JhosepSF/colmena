document.addEventListener("DOMContentLoaded", () => {
    const userTableBody = document.getElementById("userTableBody");
    const editUserModal = document.getElementById("editUserModal");

    // Función para obtener usuarios desde el servidor
    function fetchUsers() {
        fetch('http://localhost:5555/usuarios/all')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios');
                }
                return response.json();
            })
            .then(data => {
                renderUserTable(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Renderizar la tabla de usuarios
    function renderUserTable(users) {
        userTableBody.innerHTML = "";
        users.forEach(user => {
            const row = `
                <li class="user-item gap14">
                    <div class="flex items-center justify-between gap20 flex-grow">
                        <div class="body-text">${user.id}</div>
                        <div class="body-text">${user.name}</div>
                        <div class="body-text">${user.lastname}</div>
                        <div class="body-text">${user.role}</div>
                        <div class="list-icon-function">
                            <div class="item edit">
                                <i class="icon-edit-3" onclick="editUser(${user.id})"></i>
                            </div>
                            <div class="item trash">
                                <i class="icon-trash-2" onclick="deleteUser(${user.id})"></i>
                            </div>
                        </div>
                    </div>
                </li>
            `;
            userTableBody.innerHTML += row;
        });
    }

    // Función para obtener datos del usuario para editar
    window.editUser = function(id) {
        fetch(`http://localhost:5555/usuarios/get/${id}`)
            .then(response => response.json())
            .then(user => {
                // Rellenar el formulario con los datos del usuario
                document.getElementById("editName").value = user.name;
                document.getElementById("editLastname").value = user.lastname;
                document.getElementById("editAddress").value = user.address;

                editingUserId = user.id;
                editUserModal.style.display = "block";
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Función para eliminar usuario
    window.deleteUser = function(id) {
        fetch(`http://localhost:5555/usuarios/delete/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Usuario eliminado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    fetchUsers(); // Volver a obtener la lista de usuarios
                });
            } else {
                throw new Error('Error al eliminar usuario');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Inicializar la tabla de usuarios
    fetchUsers();
});

// Función para cerrar el modal de edición
function closeEditModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

// Función para guardar los cambios del usuario editado
function saveEdit() {
    const name = document.getElementById('editName').value;
    const lastname = document.getElementById('editLastname').value;
    const address = document.getElementById('editAddress').value;

    fetch(`http://localhost:5555/usuarios/update/${editingUserId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, lastname, address })
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Usuario actualizado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                closeEditModal();
                window.location.reload();
            });
        } else {
            throw new Error('Error al actualizar el usuario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}