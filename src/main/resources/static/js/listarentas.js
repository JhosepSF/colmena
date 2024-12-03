document.addEventListener("DOMContentLoaded", function() {
    const rentasContainer = document.getElementById("rentas-container");

    // Función para obtener datos de ventas y renderizarlos
    async function cargarRentas() {
        try {
            const response = await fetch('http://localhost:5555/rentas/getall');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const rentas = await response.json();

            // Limpiar el contenedor antes de agregar datos nuevos
            rentasContainer.innerHTML = '';

            // Recorrer cada venta y crear el HTML
            rentas.forEach(renta => {
                const rentaItem = document.createElement('li');
                rentaItem.classList.add('product-item', 'gap14');
                rentaItem.innerHTML = `
                    <div class="image no-bg">
                        <img src="/images/products/51.png" alt="">
                    </div>
                    <div class="flex items-center justify-between gap20 flex-grow">
                        <div class="name">
                            <a href="product-list.html" class="body-title-2">${renta.habitacion.nombre}</a>
                        </div>
                        <div class="body-text">R-${renta.id}</div>
                        <div class="body-text">s/ ${renta.precio}</div>
                        <div class="body-text">${renta.fecha}</div>
                        <div class="body-text">${renta.hora}</div>
                        <div class="body-text">${renta.metodopago}</div>
                        <div>
                            <div class="block-available">${renta.estado}</div>
                        </div>
                        <div>
                            <button onclick="imprimirBoleta(${renta.id})" class="block-tracking">Imprimir</button>
                        </div>
                    </div>
                `;

                // Agregar el elemento de venta al contenedor
                rentasContainer.appendChild(rentaItem);
            });
        } catch (error) {
            console.error('Error al cargar las ventas:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los datos de ventas',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    cargarRentas();
});

function imprimirBoleta(rentaId) 
{
    if (rentaId)  
    {
        window.location.href = `/dashboard/facturacion/pdf?id=${rentaId}`;
    } 
    else {
        Swal.fire({
            title: "Error",
            text: "No se encontró el ID de la renta.",
            icon: "error",
            confirmButtonText: "OK"
        });
    }
}