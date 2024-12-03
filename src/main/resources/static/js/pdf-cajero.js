//Botones
function generarPDF(event) 
{
	event.preventDefault();
	const usuarioDiv = document.getElementById('boleta');

	html2canvas(usuarioDiv).then(canvas => {
		const imgData = canvas.toDataURL('image/png');
		const pdf = new jsPDF('portrait', 'cm', 'a5');
		const imgProps = pdf.getImageProperties(imgData);
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
		
		pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
		pdf.save('documento.pdf');
	});
}

let regresar = document.getElementById("btn-regresar");
regresar.addEventListener("click", function ()
{
    const token = localStorage.getItem('token');
    
    const fetchOptions = {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${token}`
        }
    };
    
    fetch('http://localhost:5555/dashboard/cajero/facturacion/lista', fetchOptions)
    .then(() =>
    {             
        window.location.href = "/dashboard/cajero/facturacion/lista";
    });
});

//Relleno de datos
document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    console.log(id);

    const token = localStorage.getItem('token');

    if (id && token) {
        fetch(`http://localhost:5555/rentas/get/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la renta');
            }
            return response.json();
        })
        .then(renta => {
            console.log(renta);

            // Asignar valores a los elementos con ID
            document.getElementById("codigo-boleta").textContent = `Boleta N° ${renta.id}`;
            document.getElementById("fecha-boleta").textContent = renta.fecha;
            document.getElementById("cliente-boleta").textContent = renta.cliente.nombre;
            document.getElementById("dniruc-boleta").textContent = renta.cliente.dniruc;
            document.getElementById("direccion-boleta").textContent = renta.cliente.direccion || "Sin dirección";

            document.getElementById("descripcion-boleta").textContent = `${renta.habitacion.nombre} - ${renta.habitacion.tipo}`;
            document.getElementById("precio-unitario-boleta").textContent = `S/ ${renta.habitacion.precio.toFixed(2)}`;
            document.getElementById("total-boleta").textContent = `S/ ${renta.precio.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Error al obtener la renta:', error);
            const boletaContainer = document.getElementById('boleta');
            if (boletaContainer) {
                boletaContainer.innerHTML = `<p>No se pudo cargar la información.</p>`;
            }
        });
    } else {
        console.error('El id de la renta o el token no se encuentran en el localStorage');
        const boletaContainer = document.getElementById('boleta');
        if (boletaContainer) {
            boletaContainer.innerHTML = `<p>No se ha encontrado el id de la renta o el token.</p>`;
        }
    }
});