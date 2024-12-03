window.onload = function() {
    var usuarioName = localStorage.getItem("name");

    if (usuarioName) {
        document.getElementById("usuario").value = usuarioName;
    }

    var btnCierre = document.getElementById("cierre");
    var btnApertura = document.getElementById("apertura");

    var montoiniciotittle = document.getElementById("monto-inicio-title");
    var montoinicio = document.getElementById("monto-inicio");
    var fechaaperturatittle = document.getElementById("fecha-apertura-title");
    var fechaapertura = document.getElementById("fecha-apertura");
    var horaaperturatittle = document.getElementById("hora-apertura-title");
    var horaapertura = document.getElementById("hora-apertura");

    var montocierretittle = document.getElementById("monto-cierre-title");
    var montocierre = document.getElementById("monto-cierre");

    const now = new Date();

    const fecha = now.toLocaleDateString('en-CA'); 

    const hora = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); 

    document.getElementById("fecha-apertura").value = fecha;
    document.getElementById("hora-apertura").value = hora;

    if (localStorage.getItem('aperturaId')) 
    {
        btnApertura.style.display = "none";
        montoiniciotittle.style.display = "none";
        montoinicio.style.display = "none";
        fechaaperturatittle.style.display = "none";
        fechaapertura.style.display = "none";
        horaaperturatittle.style.display = "none";
        horaapertura.style.display = "none";

        btnCierre.style.display = "inline-block";
        montocierretittle.style.display = "inline-block";
        montocierre.style.display = "inline-block";
    } 
    else 
    {
        btnCierre.style.display = "none";
        montocierretittle.style.display = "none";
        montocierre.style.display = "none";
    }

    function recargarTabla() 
    {
        const tableContent = document.getElementById('table-content');
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token no encontrado en el localStorage');
            return;
        }

        fetch('http://localhost:5555/caja/getall', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(response => response.json())
        .then(data => 
        {
            tableContent.innerHTML = '';

            data.forEach(item => 
            {
                const li = document.createElement('li');
                li.classList.add('user-item', 'gap14');

                li.innerHTML = `
                    <div class="flex items-center justify-between gap20 flex-grow">
                        <div class="body-text">${item.usuario.name}</div>
                        <div class="body-text">${item.fechaapertura}</div>
                        <div class="body-text">${item.horaapertura}</div>
                        <div class="body-text">${item.montoi}</div>
                        <div class="body-text">${item.fechacierre || 'N/A'}</div>
                        <div class="body-text">${item.horacierre || 'N/A'}</div>
                        <div class="body-text">${item.montof || 'N/A'}</div>
                    </div>
                `;
                tableContent.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos de caja:', error);
        });
    }

    btnApertura.onclick = function ()
    {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token no encontrado en el localStorage');
            return;
        }
    
        const montoiValue = parseFloat(montoinicio.value);
        if (isNaN(montoiValue) || montoiValue < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Monto inválido',
                text: 'El monto inicial no puede ser menor que 0.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
    
        fetch('http://localhost:5555/caja/getall', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(response => response.json())
        .then(data => {
            const cajaCerradaHoy = data.some(item => item.fechaapertura === fechaapertura.value);
            if (cajaCerradaHoy) {
                Swal.fire({
                    icon: 'error',
                    title: 'Caja ya cerrada',
                    text: 'Ya se cerró la caja hoy, vuelva mañana.',
                    confirmButtonText: 'Aceptar'
                });
                return Promise.reject('Caja cerrada hoy');
            }

            let aperturaId;
            if (localStorage.getItem('aperturaId')) {
                console.log('El item "aperturaId" ya existe');
                aperturaId = localStorage.getItem('aperturaId');
            } else {
                aperturaId = data.length + 1;
                localStorage.setItem('aperturaId', aperturaId);
                console.log('El item "aperturaId" ha sido creado con el valor:', aperturaId);
            }

            const cajaData = {
                id: aperturaId,
                montoi: montoiValue, // Usamos el valor numérico validado
                fechaapertura: fechaapertura.value,
                horaapertura: horaapertura.value
            };

            console.log(cajaData);

            return fetch('http://localhost:5555/caja/apertura', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cajaData),
            });
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Caja aperturada',
                    text: 'La caja fue aperturada correctamente.',
                    confirmButtonText: 'Aceptar'
                });

                recargarTabla();

                btnApertura.style.display = "none";
                montoiniciotittle.style.display = "none";
                montoinicio.style.display = "none";
                fechaaperturatittle.style.display = "none";
                fechaapertura.style.display = "none";
                horaaperturatittle.style.display = "none";
                horaapertura.style.display = "none";

                btnCierre.style.display = "inline-block";
                montocierretittle.style.display = "inline-block";
                montocierre.style.display = "inline-block";
            } else {
                return response.json().then(errData => {
                    throw new Error(`Error ${response.status}: ${errData.message || response.statusText}`);
                });
            }
        })
        .catch(error => {
            if (error !== 'Caja cerrada hoy') {
                console.error('Error al procesar la operación:', error);
            }
        });
    };

    btnCierre.onclick = function () 
    {
        const now = new Date();
        const fechacierre = now.toLocaleDateString('en-CA'); 
        const horacierre = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); 
    
        btnApertura.style.display = "inline-block";
        montoiniciotittle.style.display = "inline-block";
        montoinicio.style.display = "inline-block";
        fechaaperturatittle.style.display = "inline-block";
        fechaapertura.style.display = "inline-block";
        horaaperturatittle.style.display = "inline-block";
        horaapertura.style.display = "inline-block";
    
        btnCierre.style.display = "none";
        montocierretittle.style.display = "none";
        montocierre.style.display = "none";
    
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error('Token no encontrado en el localStorage');
            return;
        }
    
        const montofValue = parseFloat(montocierre.value);
        if (isNaN(montofValue) || montofValue < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Monto inválido',
                text: 'El monto final no puede ser menor que 0.',
                confirmButtonText: 'Aceptar'
            });
            return;
       }
    
        const cajaData = {
            id: localStorage.getItem('aperturaId'),
            montof: montofValue, 
            fechacierre: fechacierre,
            horacierre: horacierre,
        };
    
        fetch('http://localhost:5555/caja/cierre', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cajaData),
        })
        .then(response => {
            if (response.ok) {
                console.log("Eliminando aperturaId del localStorage...");
                localStorage.removeItem('aperturaId');
                recargarTabla();
            } else {
                return response.json().then(errData => {
                    throw new Error(`Error ${response.status}: ${errData.message || response.statusText}`);
                });
            }
        })
        .catch(error => {
            console.error('Error al procesar la operación de cierre:', error);
        });
    };

    recargarTabla();
};