// Obtener elementos
const modalCrearHabitacion = document.getElementById('modal-crear-habitacion');
const modalModificarHabitacion = document.getElementById('modal-habitacion');
const closeButtons = document.querySelectorAll('.close');
const crearButton = document.querySelector('.button-create');

// Función para abrir el modal de crear habitación
crearButton.addEventListener('click', function() {
    if (esAdministrador()) {
        modalCrearHabitacion.style.display = 'block';
    } else {
        Swal.fire({
            title: 'Error',
            text: 'No se puede crear una habitación si no eres administrador',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

// Función para cerrar el modal cuando se hace clic en la 'X'
closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        modalCrearHabitacion.style.display = 'none';
        modalModificarHabitacion.style.display = 'none';
    });
});

// Función para cerrar el modal si se hace clic fuera del contenido del modal
window.onclick = function(event) {
    if (event.target === modalCrearHabitacion || event.target === modalModificarHabitacion) {
        modalCrearHabitacion.style.display = 'none';
        modalModificarHabitacion.style.display = 'none';
    }
};

// Agregar funcionalidad a la búsqueda y al filtro por estado
document.addEventListener('DOMContentLoaded', function() {
    const filterSelect = document.querySelector('.select select');

    // Función para filtrar por estado
    filterSelect.addEventListener('change', function() {
        const selectedState = filterSelect.value;
        filtrarHabitacionesPorEstado(selectedState);
    });

    // Función para filtrar habitaciones por estado
    function filtrarHabitacionesPorEstado(estado) {
        fetch('http://localhost:5555/habitacion/getall')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(habitacion => habitacion.estado === estado);
                mostrarHabitaciones(filteredData);
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al filtrar habitaciones',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    }

    // Función para mostrar habitaciones filtradas o buscadas
    function mostrarHabitaciones(data) {
        const contenedorHabitaciones = document.querySelector('.habitaciones-grid');
        contenedorHabitaciones.innerHTML = '';

        data.forEach(habitacion => {
            const habitacionDiv = document.createElement('div');
            habitacionDiv.classList.add('habitacion-item');
            habitacionDiv.innerHTML = `
                <div class="habitacion-info">
                    <h4>${habitacion.nombre}</h4>
                    <p>Tipo: ${habitacion.tipo}</p>
                    <p>Capacidad: ${habitacion.capacidad}</p>
                    <p>Precio: S/${habitacion.precio}</p>
                    <p>Estado: ${habitacion.estado}</p>
                    <div class="list-icon-function centered">
                        <div class="item edit">
                            <i class="icon-edit-3" onclick="editUser(${habitacion.id})"></i>
                        </div>
                        <div class="item trash">
                            <i class="icon-trash-2" onclick="deleteUser(${habitacion.id})"></i>
                        </div>
                        <div class="item rent">
                            <i class="icon-key" onclick="rentRoom(${habitacion.id})"></i>
                        </div>
                        <div class="item clients">
                            <i class="icon-user" onclick="mostrarModalesRegistro(${habitacion.capacidad}, ${habitacion.id}, '${habitacion.estado}')"></i>
                        </div>
                    </div>
                </div>
            `;
            contenedorHabitaciones.appendChild(habitacionDiv);
        });
    }
});

// Función para obtener todas las habitaciones y mostrarlas en el HTML
function obtenerHabitaciones() {
    fetch('http://localhost:5555/habitacion/getall')
        .then(response => response.json())
        .then(data => {
            const contenedorHabitaciones = document.querySelector('.habitaciones-grid');
            contenedorHabitaciones.innerHTML = '';

            data.forEach(habitacion => {
                const habitacionDiv = document.createElement('div');
                habitacionDiv.classList.add('habitacion-item');
                habitacionDiv.innerHTML = `
                    <div class="habitacion-info">
                        <h4>${habitacion.nombre}</h4>
                        <p>Tipo: ${habitacion.tipo}</p>
                        <p>Capacidad: ${habitacion.capacidad}</p>
                        <p>Precio: S/${habitacion.precio}</p>
                        <p>Estado: ${habitacion.estado}</p>
                        <div class="list-icon-function centered">
                            <div class="item edit">
                                <i class="icon-edit-3" onclick="editUser(${habitacion.id})"></i>
                            </div>
                            <div class="item trash">
                                <i class="icon-trash-2" onclick="deleteUser(${habitacion.id})"></i>
                            </div>
                            <div class="item rent">
                                <i class="icon-key" onclick="rentRoom(${habitacion.id})"></i>
                            </div>
                            <div class="item clients">
                                <i class="icon-user" onclick="mostrarModalesRegistro(${habitacion.capacidad}, ${habitacion.id}, '${habitacion.estado}')"></i>
                            </div>
                        </div>
                    </div>
                `;
                contenedorHabitaciones.appendChild(habitacionDiv);
            });
        })
        .catch(error => {
            Swal.fire({
                title: 'Error',
                text: 'Error al obtener las habitaciones',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
}

// Función para verificar el rol de administrador
function esAdministrador() {
    const rol = localStorage.getItem('rol');
    return rol === 'ADMINISTRADOR';
}

// Función para editar una habitación
function editUser(id) {
    if (esAdministrador()) {
        fetch(`http://localhost:5555/habitacion/get/${id}`)
            .then(response => response.json())
            .then(habitacion => {
                document.getElementById('nombre-habitacion').value = habitacion.nombre;
                document.getElementById('tipo-habitacion').value = habitacion.tipo;
                document.getElementById('capacidad-habitacion').value = habitacion.capacidad;
                document.getElementById('precio-habitacion').value = habitacion.precio;
                document.getElementById('estado-habitacion').value = habitacion.estado;

                modalModificarHabitacion.style.display = 'block';

                const form = document.getElementById('form-habitacion');
                form.onsubmit = function(event) {
                    event.preventDefault();
                    guardarCambios(id);
                };
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al cargar la habitación para edición',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'No se puede modificar una habitación si no eres administrador',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

// Función para guardar los cambios de la habitación
function guardarCambios(id) {
    const nombre = document.getElementById('nombre-habitacion').value.trim();
    const tipo = document.getElementById('tipo-habitacion').value.trim();
    const capacidad = parseInt(document.getElementById('capacidad-habitacion').value);
    const precio = parseFloat(document.getElementById('precio-habitacion').value);
    const estado = document.getElementById('estado-habitacion').value;

    if (!nombre || !tipo || isNaN(capacidad) || isNaN(precio) || !estado) {
        Swal.fire({
            title: 'Error',
            text: 'Todos los campos deben estar completos.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (capacidad < 0 || precio < 0) {
        Swal.fire({
            title: 'Error',
            text: 'Capacidad y precio deben ser valores positivos.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const updatedHabitacion = { nombre, tipo, capacidad, precio, estado };


    fetch(`http://localhost:5555/habitacion/update/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedHabitacion)
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Habitación actualizada exitosamente',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            modalModificarHabitacion.style.display = 'none';
            obtenerHabitaciones();
        }
    })
    .catch(error => {
        Swal.fire({
            title: 'Error',
            text: 'Error al guardar los cambios',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}

// Llamar a la función para obtener habitaciones al cargar la página
window.onload = obtenerHabitaciones;

// Función para manejar la creación de una nueva habitación
document.getElementById('form-crear-habitacion').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre-habitacion-crear').value.trim();
    const tipo = document.getElementById('tipo-habitacion-crear').value.trim();
    const capacidad = parseInt(document.getElementById('capacidad-habitacion-crear').value);
    const precio = parseFloat(document.getElementById('precio-habitacion-crear').value);
    const estado = document.getElementById('estado-habitacion-crear').value;

    if (!nombre || !tipo || isNaN(capacidad) || isNaN(precio) || !estado) {
        Swal.fire({
            title: 'Error',
            text: 'Todos los campos deben estar completos.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    if (capacidad < 0 || precio < 0) {
        Swal.fire({
            title: 'Error',
            text: 'Capacidad y precio deben ser valores positivos.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    const request = { nombre, tipo, capacidad, precio, estado };

    fetch('http://localhost:5555/habitacion/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(request),
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                title: 'Éxito',
                text: 'Habitación creada exitosamente',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            modalCrearHabitacion.style.display = 'none';
            obtenerHabitaciones();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al crear la habitación',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
});

// Función para eliminar una habitación
function deleteUser(id) {
    if (esAdministrador()) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Estás seguro de que deseas eliminar esta habitación?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5555/habitacion/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                })
                .then(response => {
                    if (response.ok) {
                        Swal.fire({
                            title: 'Éxito',
                            text: 'Habitación eliminada exitosamente',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                        obtenerHabitaciones();
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Error al eliminar la habitación',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrió un error al eliminar la habitación',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                });
            }
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'No se puede eliminar una habitación si no eres administrador',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

function mostrarModalesRegistro(capacidad, idhabi, estado) 
{
    if (estado === "Ocupado")
    {
        Swal.fire({
            title: 'Error',
            text: 'Habitación ocupada',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
    else 
    {
        const contenedorModales = document.createElement('div');
        contenedorModales.id = 'modales-registro-container';
        document.body.appendChild(contenedorModales);

        for (let i = 1; i <= capacidad; i++) 
        {
            const modalPersona = document.getElementById("modal-persona").cloneNode(true);
            modalPersona.style.display = 'block';
            modalPersona.querySelector(".form-persona").setAttribute("data-persona-id", i);

            // Cambia el título del modal para mostrar el número de persona
            const titulo = modalPersona.querySelector("h2");
            titulo.textContent = `Registrar Persona ${i}`;

            // Cambiar los IDs para que sean únicos
            const dnirucField = modalPersona.querySelector('#dniruc');
            const buscarButton = modalPersona.querySelector('#buscar');
            const guardarButton = modalPersona.querySelector('#guardarcliente');
            const nombrerazonField = modalPersona.querySelector('#nombrerazon');
            const direccionField = modalPersona.querySelector('#direccion');

            dnirucField.id = `dniruc-${i}`;
            buscarButton.id = `buscar-${i}`;
            guardarButton.id = `guardarcliente-${i}`;
            nombrerazonField.id = `nombrerazon-${i}`;
            direccionField.id = `direccion-${i}`;

            // Evento para el botón de búsqueda
            buscarButton.addEventListener('click', function(event) {
                event.preventDefault();
                buscar(dnirucField.id, nombrerazonField.id);
            });

            // Evento para el botón de "Guardar"
            guardarButton.addEventListener('click', function(event) {
                event.preventDefault();
                guardarCliente(dnirucField.id, nombrerazonField.id, idhabi, modalPersona, direccionField.id);
            });

            // Botón de cerrar en este modal
            modalPersona.querySelector(".close").onclick = function() {
                modalPersona.style.display = "none";
            };

            // Agrega el modal clonado al contenedor
            contenedorModales.appendChild(modalPersona);
        }
    }
}

function buscar(dnirucId, nombrerazonId) 
{
    const dniruc = document.getElementById(dnirucId).value;

    if(dniruc.length === 8) 
    {
        busquedaByDniAPI(dniruc, nombrerazonId);
    } 
    else if(dniruc.length === 11) 
    {
        busquedaByRucAPI(dniruc, nombrerazonId);
    }
    else 
    {
        Swal.fire({
            title: 'Error',
            text: 'El campo debe estar rellenado con 8 o 11 dígitos',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

async function busquedaByRucAPI(ruc, nombrerazonId)
{
    try 
    {
        const response = await fetch(`https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Impob3NlcHNhbmZsb0BnbWFpbC5jb20ifQ.kl1A34r9TM7eoA3Sx7RefcKKcs0T6yfPMD-4WaBzLDg`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        console.log(data);
        document.getElementById(nombrerazonId).value = data.razonSocial || '';
    } 
    catch (error) 
    {
        console.error("Error en la solicitud en el API:", error);
        Swal.fire({
            title: "No se encontró el RUC!",
            icon: "info"
        });
    }
}

async function busquedaByDniAPI(dni, nombrerazonId) 
{
    try 
    {
        const response = await fetch(`https://dniruc.apisperu.com/api/v1/dni/${dni}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Impob3NlcHNhbmZsb0BnbWFpbC5jb20ifQ.kl1A34r9TM7eoA3Sx7RefcKKcs0T6yfPMD-4WaBzLDg`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log(data);
        document.getElementById(nombrerazonId).value = `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}` || '';
    } 
    catch (error) 
    {
        console.error("Error en la solicitud en el API:", error);
        Swal.fire({
            title: "No se encontró el DNI!",
            icon: "info"
        });
    }
}

async function guardarCliente(dnirucId, nombrerazonId, idhabi, modalPersona, direccionField) 
{
    const cliente = 
    {
        "dniruc": document.getElementById(dnirucId).value,
        "nombre": document.getElementById(nombrerazonId).value,
        "direccion": document.getElementById(direccionField).value,
        "habitacion": idhabi
    };

    console.log(cliente);
    
    try {
        const response = await fetch(`http://localhost:5555/cliente/new`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cliente),
        });

        if (!response.ok) 
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        Swal.fire({
            title: 'Éxito',
            text: 'Cliente agregado al cuarto exitosamente',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() =>
        {
            modalPersona.style.display = "none";
            window.location.reload();
        });

    } 
    catch (error) 
    {
        console.error('Error al crear cliente', error);
    }
}

function rentRoom(id) {
    localStorage.setItem('roomId', id); 
    window.location.href = '/dashboard/facturacion/detalle';
}