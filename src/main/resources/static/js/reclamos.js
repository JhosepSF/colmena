const reclamoModal = document.getElementById('modal-crear-reclamo');
const formCrearReclamo = document.getElementById('form-crear-reclamo');

document.addEventListener('DOMContentLoaded', async function ()
{
    cargarReclamos();

    formCrearReclamo.addEventListener('submit', async function (e) 
    {
        e.preventDefault();

        const descripcion = document.getElementById('descripcion-reclamo-crear').value;
        const cliente = document.getElementById('reclamoCliente').value;

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No se encontró el token en el localStorage.');
            return;
        }

        const reclamodata = {
            descripcion: descripcion,
            cliente: cliente,
        };

        try {
            const response = await fetch('http://localhost:5555/reclamos/save', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reclamodata),
            });

            if (!response.ok) {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un error al guardar el reclamo.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            } else {
                Swal.fire({
                    title: "Éxito",
                    text: "Reclamo registrado exitosamente",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }

            closeReclamoModal();
            await cargarReclamos();
        } catch (error) {
            console.error('Error al guardar el reclamo:', error);
        }
    });
});

function openReclamoModal() {
    cargarClientes();
    reclamoModal.style.display = 'block';
}

function closeReclamoModal() {
    reclamoModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === reclamoModal) {
        reclamoModal.style.display = 'none';
    }
};

async function cargarClientes() {
    const token = localStorage.getItem('token');
    const clienteSelect = document.getElementById('reclamoCliente');

    if (!token) {
        console.error('No se encontró el token en el localStorage.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5555/cliente/getall', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de clientes.');
        }

        const clientes = await response.json();

        clienteSelect.innerHTML = '<option value="" disabled selected>Seleccione un cliente</option>';

        clientes.forEach(cliente => {
            clienteSelect.innerHTML += `
                <option value="${cliente.dniruc}">${cliente.nombre} - DNI/RUC: ${cliente.dniruc}</option>
            `;
        });
    } catch (error) {
        console.error('Error al cargar los clientes:', error);
    }
}

async function cargarReclamos() {
    const token = localStorage.getItem('token');
    const reclamosTableBody = document.getElementById('reclamosTableBody');

    if (!token) {
        console.error('No se encontró el token en el localStorage.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5555/reclamos/getall', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de reclamos.');
        }

        const reclamos = await response.json();

        reclamosTableBody.innerHTML = ''; // Limpia la tabla antes de llenarla

        reclamos.forEach(reclamo => {
            reclamosTableBody.innerHTML += `
                <li class="attribute-item flex items-center justify-between gap20">
                    <div class="body-text">${reclamo.id}</div>
                    <div class="body-text">${reclamo.descripcion}</div>
                    <div class="body-text">${reclamo.cliente.nombre}</div>
                </li>
            `;
        });
    } catch (error) {
        console.error('Error al cargar los reclamos:', error);
    }
}