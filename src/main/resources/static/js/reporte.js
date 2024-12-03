document.addEventListener('DOMContentLoaded', async function () 
{
    const token = localStorage.getItem('token');
    const ingresosTotalesElement = document.getElementById('ingresos-totales');
    const clientesTotalesElement = document.getElementById('clientes-totales');

    if (!token) {
        console.error('No se encontró el token en el localStorage.');
        return;
    }

    //ingresos totales
    try {
        const response = await fetch('http://localhost:5555/rentas/getall', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de renta.');
        }

        const rentas = await response.json();
        console.log('Datos obtenidos:', rentas);

        const totalIngresos = rentas.reduce((acc, renta) => acc + (renta.precio || 0), 0);

        ingresosTotalesElement.textContent = `$${totalIngresos.toFixed(2)}`;

        // Rentas por método de pago
        const rentasPorMetodo = rentas.reduce((acc, renta) => {
            const metodo = renta.metodopago || 'No especificado'; 
            acc[metodo] = (acc[metodo] || 0) + 1;
            return acc;
        }, {});

        const rentasMetodoList = document.getElementById('rentas-metodo-pago');
        rentasMetodoList.innerHTML = '';

        for (const [metodo, cantidad] of Object.entries(rentasPorMetodo)) {
            rentasMetodoList.innerHTML += `
                <div class="flex items-center gap10">
                    <div class="block-legend">
                        <div class="dot t1"></div>
                        <div class="text-tiny">${metodo}</div>
                    </div>
                    <div class="body-title">${cantidad} rentas</div>
                </div>
            `;
        }

        // Habitaciones más rentadas
        const habitacionesRentadas = rentas.reduce((acc, renta) => {
            const habitacionId = renta.habitacion?.id || 'Desconocida'; 
            acc[habitacionId] = (acc[habitacionId] || 0) + 1;
            return acc;
        }, {});

        const topHabitaciones = Object.entries(habitacionesRentadas)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const habitacionesList = document.getElementById('habitaciones-mas-rentadas');
        habitacionesList.innerHTML = '';

        for (const [habitacion, cantidad] of topHabitaciones) {
            habitacionesList.innerHTML += `
                <div class="flex items-center gap10">
                    <div class="block-legend">
                        <div class="dot t2"></div>
                        <div class="text-tiny">Habitación ${habitacion}</div>
                    </div>
                    <div class="body-title">${cantidad} rentas</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al calcular los ingresos totales:', error);
    }

    //Clients totales
    try
    {
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
        console.log('Datos obtenidos:', clientes);

        const totalClientes = clientes.length;

        if (clientesTotalesElement) {
            clientesTotalesElement.textContent = totalClientes.toLocaleString(); 
        }

    } catch (error) {
        console.error('Error al actualizar los clientes totales:', error);
    }
});
