// Función para obtener el mes actual
function obtenerMesActual() {
    const fechaActual = new Date();
    return fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
}

// Función para filtrar los cumpleaños del mes actual
function filtrarCumpleanosDelMes(cumpleanos) {
    const mesActual = obtenerMesActual();
    return cumpleanos.filter(persona => {
        const fechaCumple = new Date(persona.fecha);
        return fechaCumple.getMonth() + 1 === mesActual;
    });
}

// Función para mostrar los cumpleaños en la página
function mostrarCumpleanos(cumpleanos) {
    const listaCumpleanos = document.getElementById("cumpleanos-lista");
    const cumpleanosDelMes = filtrarCumpleanosDelMes(cumpleanos);

    if (cumpleanosDelMes.length === 0) {
        // Mostrar mensaje si no hay cumpleaños
        listaCumpleanos.innerHTML = `
            <div class="cumpleanos__mensaje">
                🎉 ¡No hay cumpleaños este mes! 🎉
            </div>
        `;
        return;
    }

    // Generar tarjetas si hay cumpleaños
    let html = "";
    cumpleanosDelMes.forEach(persona => {
        const fecha = new Date(persona.fecha);
        const dia = fecha.getDate();
        const mes = fecha.toLocaleString("es-ES", { month: "long" }); // Nombre del mes en español
        html += `
            <div class="cumpleanos__tarjeta">
                <div class="cumpleanos__icono">🎂</div>
                <div class="cumpleanos__detalles">
                    <div class="cumpleanos__nombre">${persona.nombre}</div>
                    <div class="cumpleanos__fecha">${dia} de ${mes}</div>
                </div>
            </div>
        `;
    });

    listaCumpleanos.innerHTML = html;
}

// Cargar los cumpleaños desde el archivo JSON
fetch('scripts/data/cumpleaños.json') // Ruta al archivo JSON
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }
        return response.json();
    })
    .then(data => {
        // Llamar a la función para mostrar los cumpleaños
        mostrarCumpleanos(data);
    })
    .catch(error => {
        console.error('Error al cargar los cumpleaños:', error);
        // Mostrar un mensaje de error en la página
        const listaCumpleanos = document.getElementById("cumpleanos-lista");
        listaCumpleanos.innerHTML = `
            <div class="cumpleanos__mensaje">
                ❌ Error al cargar los cumpleaños. Por favor, inténtalo de nuevo más tarde.
            </div>
        `;
    });