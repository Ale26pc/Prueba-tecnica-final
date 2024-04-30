document.addEventListener("DOMContentLoaded", function() {
    obtenerDispositivosPorBloque();
    obtenerDispositivosPorOficina();
    obtenerArticulosSinAsignar();
});

// Función para obtener y mostrar los datos de dispositivos por bloque
function obtenerDispositivosPorBloque() {
    fetch('http://localhost:3000/api/reportes/dispositivosPorBloque')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById("tableBloques").getElementsByTagName('tbody')[0];
            data.forEach(row => {
                const newRow = table.insertRow();
                newRow.innerHTML = `<td>${row.bloque}</td><td>${row.cantidad}</td>`;
            });
        })
        .catch(error => console.error('Error al obtener dispositivos por bloque:', error));
}

// Función para obtener y mostrar los datos de dispositivos por oficina
function obtenerDispositivosPorOficina() {
    fetch('http://localhost:3000/api/reportes/dispositivosPorOficina')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById("tableOficinas").getElementsByTagName('tbody')[0];
            data.forEach(row => {
                const newRow = table.insertRow();
                newRow.innerHTML = `<td>${row.oficina_id}</td><td>${row.bloque}</td><td>${row.numero}</td><td>${row.cantidad}</td>`;
            });
        })
        .catch(error => console.error('Error al obtener dispositivos por oficina:', error));
}

// Función para obtener y mostrar los datos de artículos sin asignar
function obtenerArticulosSinAsignar() {
    fetch('http://localhost:3000/api/reportes/articulosSinAsignar')
        .then(response => response.json())
        .then(data => {
            const table = document.getElementById("tableArticulos").getElementsByTagName('tbody')[0];
            data.forEach(row => {
                const newRow = table.insertRow();
                newRow.innerHTML = `<td>${row.id}</td><td>${row.serial}</td><td>${row.tipo}</td><td>${row.marca}</td><td>${row.modelo}</td>`;
            });
        })
        .catch(error => console.error('Error al obtener artículos sin asignar:', error));
}

