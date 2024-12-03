document.addEventListener("DOMContentLoaded", () => {
    const roleTableBody = document.getElementById("rolestable");
    const editUserModal = document.getElementById("editUserModal");
    const editUserForm = document.getElementById("editUserForm");

    let editingRoleId = null;

    // Función para obtener roles desde el servidor
    function fetchRoles() {
        fetch('http://localhost:5555/rol/all')
            .then(response => response.json())
            .then(data => {
                renderRoleTable(data);
            })
            .catch(error => console.error('Error:', error));
    }

    // Renderizar la tabla de roles
    function renderRoleTable(roles) {
        roleTableBody.innerHTML = ""; // Limpiar el contenido anterior
        roles.forEach((role, index) => {
            const roleRow = `
                <li class="roles-item">
                    <div class="body-text">${index + 1}</div>
                    <div class="body-text">${role.name}</div>
                    <div class="body-text">${role.descripcion}</div>
                    <div class="list-icon-function">
                        <div class="item edit" onclick="editRole(${role.id})">
                            <i class="icon-edit-3"></i>
                        </div>
                        <div class="item trash" onclick="deleteRole(${role.id})">
                            <i class="icon-trash-2"></i>
                        </div>
                    </div>
                </li>`;
            roleTableBody.innerHTML += roleRow;
        });
    }

    // Función para abrir modal de edición
    window.editRole = function(id) {
        fetch(`http://localhost:5555/rol/get/${id}`)
            .then(response => response.json())
            .then(role => {
                document.getElementById("editName").value = role.name;
                document.getElementById("editDescripcion").value = role.descripcion;
                editingRoleId = role.id;
                editUserModal.style.display = "block";
            })
            .catch(error => console.error('Error:', error));
    };

    // Función para guardar los cambios del rol editado
    window.saveEdit = function() {
        const name = document.getElementById("editName").value.trim();
        const descripcion = document.getElementById("editDescripcion").value.trim();

        if (!name || !descripcion) {
            Swal.fire({
                title: 'Error',
                text: 'Todos los campos deben estar llenos.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        const updatedRole = {
            name: name,
            descripcion: descripcion,
            estado: 1
        };

        // Hacer la petición POST para actualizar el rol
        fetch(`http://localhost:5555/rol/update/${editingRoleId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRole)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Rol actualizado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    fetchRoles(); // Recargar la tabla
                    editUserModal.style.display = "none"; // Cerrar modal
                });
            } else {
                throw new Error('Error al actualizar el rol');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el rol',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        });
    };

    // Cerrar modal
    document.querySelector(".close").addEventListener("click", () => {
        editUserModal.style.display = "none";
    });

    // Inicializar tabla de roles
    fetchRoles();
});

// Función para crear un nuevo rol
function createRol() {
    const name = document.getElementById("name").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!name || !descripcion) {
        Swal.fire({
            title: 'Error',
            text: 'Todos los campos deben estar llenos.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const newRole = {
        name: name,
        descripcion: descripcion,
        estado: 1
    };

    fetch('http://localhost:5555/rol/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRole)
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                title: '¡Éxito!',
                text: 'Rol creado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = '/dashboard/roles/';
            });
        } else {
            throw new Error('Error al crear el rol');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo crear el rol',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
}

// Función para eliminar un rol con confirmación
function deleteRole(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de que deseas eliminar este rol?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`http://localhost:5555/rol/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Rol eliminado correctamente',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                    window.location.reload();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar el rol',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            })
        }
    });
}
