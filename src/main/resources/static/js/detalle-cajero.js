document.addEventListener("DOMContentLoaded", function() {
    const habitacionesRentadas = document.getElementById("habitacionesrentadas");
    const subtotalElement = document.getElementById("subtotal");
    const igvElement = document.getElementById("igv");
    const totalElement = document.getElementById("total");
    const totalResumen = document.getElementById("totalresumen");
    const ventacodigo1 = document.getElementById("ventaid1");
    const ventacodigo2 = document.getElementById("ventaid2");
    const ventacodigo3 = document.getElementById("ventaid3");

    const roomId = localStorage.getItem('roomId');
    
    fetch("http://localhost:5555/rentas/getall")
    .then((response) => response.json())
    .then((ventas) => {
        const nuevoCodigoVenta = `R-${ventas.length + 1}`;
        ventacodigo1.textContent = nuevoCodigoVenta;
        ventacodigo2.textContent = nuevoCodigoVenta;
        ventacodigo3.textContent = nuevoCodigoVenta;

        if (roomId) {
            fetch(`http://localhost:5555/habitacion/get/${roomId}`)
                .then((response) => response.json())
                .then((habitacion) => {
                    if (habitacion) {
                        const habitacionItem = `
                            <li class="product-item gap14">
                                <div class="image no-bg">
                                    <img src="/images/products/41.png" alt="">
                                </div>
                                <div class="flex items-center justify-between gap40 flex-grow">
                                    <div class="name">
                                        <div class="text-tiny mb-1">${habitacion.nombre}</div>
                                        <a href="product-list.html" class="body-title-2">Registrado por ${habitacion.usuario.name}</a>
                                    </div>
                                    <div class="name">
                                        <div class="text-tiny mb-1">Capacidad</div>
                                        <div class="body-title-2 centered">${habitacion.capacidad}</div>
                                    </div>
                                    <div class="name">
                                        <div class="text-tiny mb-1">Precio</div>
                                        <div class="body-title-2 centered">S/ ${habitacion.precio}</div>
                                    </div>
                                </div>
                            </li>
                        `;
                        habitacionesRentadas.innerHTML = habitacionItem;

                        // Calcular valores
                        const precioHabitacion = parseFloat(habitacion.precio);
                        const igv = precioHabitacion * 0.18;
                        const total = precioHabitacion + igv;

                        // Actualizar valores en el HTML
                        subtotalElement.textContent = `s/ ${precioHabitacion.toFixed(2)}`;
                        igvElement.textContent = `s/ ${igv.toFixed(2)}`;
                        totalElement.textContent = `s/ ${total.toFixed(2)}`;

                        //Resumen
                        // Obtener la fecha y hora actual
                        const now = new Date();

                        // Formatear la fecha como "DD/MM/YYYY"
                        const formattedDate = now.toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        });

                        // Formatear la hora como "HH:MM:SS"
                        const formattedTime = now.toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        });

                        // Asignar la fecha y la hora formateadas a los elementos HTML
                        document.getElementById("fecha").textContent = formattedDate;
                        document.getElementById("fechacompro").textContent = formattedDate;
                        document.getElementById("hora").textContent = formattedTime;

                        totalResumen.textContent = `s/ ${total.toFixed(2)}`;

                        cargarClientesHabitacion(roomId);
                    } else {
                        console.error("No se encontró la habitación");
                    }
                })
                .catch((error) => console.error("Error al obtener los datos de la habitación:", error));
        } else {
            console.error("No se encontró roomId en localStorage");
        }
    })
    .catch((error) => console.error("Error al obtener las ventas:", error));
});

// Función para cargar clientes de una habitación específica
function cargarClientesHabitacion(idHabitacion) 
{
    const selectDniRuc = document.getElementById('dniRuc');
    selectDniRuc.innerHTML = '<option value="">-- Seleccione --</option>';

    fetch(`http://localhost:5555/cliente/getxhabitacion/${idHabitacion}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                data.forEach(cliente => {
                    const option = document.createElement('option');
                    option.value = cliente.dniruc;
                    option.textContent = `${cliente.nombre} - DNI/RUC: ${cliente.dniruc}`;
                    selectDniRuc.appendChild(option);
                });
                document.getElementById('campo-dni-ruc').classList.remove('oculto');
            } else {
                Swal.fire({
                    title: 'Aviso',
                    text: 'No hay clientes registrados en esta habitación',
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            }
        })
        .catch(error => {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los clientes de la habitación',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        });
}
 // Función para mostrar u ocultar el campo de "Aplicativo"
function mostrarCampoPago()
{
    const seleccionPago = document.getElementById('opciones-pago').value;
    const campoAplicativo = document.getElementById('campo-aplicativo');

    if (seleccionPago === 'Aplicativo') 
    {
        campoAplicativo.style.display = 'flex';
    } 
    else 
    {
        campoAplicativo.style.display = 'none';
    }
}

 // Inicializa el campo como oculto
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('campo-aplicativo').style.display = 'none';
});

async function enviarDatosVenta() 
{
    const dniRuc = document.getElementById("dniRuc").value.trim();
    const opcionesPago = document.getElementById("opciones-pago").value;

    if ((dniRuc.length !== 8 && dniRuc.length !== 11) || isNaN(dniRuc)) {
        Swal.fire({
            title: "Error",
            text: "DNI debe tener 8 dígitos y RUC 11 dígitos.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }

    if (!opcionesPago) {
        Swal.fire({
            title: "Error",
            text: "Debe seleccionar una forma de pago.",
            icon: "error",
            confirmButtonText: "OK"
        });
        return;
    }
    
    const aperturaId = localStorage.getItem("aperturaId");

    const saleData = {
        id: parseInt(document.getElementById("ventaid1").textContent.replace("R-", "").trim()),
        cliente: dniRuc,
        metodopago: opcionesPago,
        habitacion: localStorage.getItem("roomId"),
        precio: parseFloat(document.getElementById("total").textContent.replace("s/", "").trim()),
        estado: "Pagado",
        fecha: document.getElementById("fecha").textContent,
        hora: document.getElementById("hora").textContent,
        caja: aperturaId
    };

    console.log(saleData);

    try
    {
        if (!aperturaId) 
        {
            Swal.fire({
                title: "Error",
                text: "No se encontró un ID de apertura. Por favor, inicie la caja antes de registrar la venta.",
                icon: "error",
                confirmButtonText: "OK"
            });
            return; 
        }

        const response = await fetch("http://localhost:5555/rentas/save", 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(saleData),
        });

        if (response.ok) 
        {
            Swal.fire({
                title: "Éxito",
                text: "Venta registrada exitosamente",
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => {
                window.location.href = `/dashboard/cajero/facturacion/pdf?id=${saleData.id}`;
            });
        } else {
            throw new Error("Error al guardar la venta");
        }
    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Hubo un problema al registrar la venta",
            icon: "error",
            confirmButtonText: "OK"
        });
        console.error("Error:", error);
    }
}

document.getElementById("btnimprimir").addEventListener("click", enviarDatosVenta);
