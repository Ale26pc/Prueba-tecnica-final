document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/articulos')
    .then(response => response.json())
    .then(data => {
        const articulosBody = document.getElementById('articulos-body');

        data.forEach(item => {
            const { id, serial, fecha_ingreso, fecha_garantia, tipo, marca, modelo } = item;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${id}</td>
                <td>${serial}</td>
                <td>${fecha_ingreso}</td>
                <td>${fecha_garantia}</td>
                <td>${tipo}</td>
                <td>${marca}</td>
                <td>${modelo}</td>
            `;
            articulosBody.appendChild(row);
        });
    })
    
    .catch(error => console.error('Error:', error));
});

