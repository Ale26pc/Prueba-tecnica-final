// Función para enviar la solicitud de asignación al servidor
const asignarProducto = async (articuloId, oficinaId) => {
    try {
        // Verificar si los campos de entrada están vacíos
        if (!articuloId || !oficinaId) {
            throw new Error('Por favor, completa todos los campos.');
        }

        const response = await fetch('http://localhost:3000/api/asignar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                articuloId: articuloId,
                oficinaId: oficinaId
            })
        });

        const data = await response.json();
        if (response.status === 400) {
            // El servidor devuelve un error con un mensaje específico
            alert(data.error);
        } else {
            // La asignación se realizó con éxito
            alert('Artículo asignado a una oficina');
            // Limpiar los campos de entrada después de una asignación exitosa
            document.getElementById('articuloId').value = '';
            document.getElementById('oficinaId').value = '';
        }
    } catch (error) {
        console.error('Error al asignar el producto:', error.message);
        // Mostrar mensaje de error al usuario utilizando una alerta
        alert('El artículo ya está asignado a una oficina');
    }
};

// Event listener para el campo de entrada de la oficina
document.getElementById('oficinaId').addEventListener('change', async () => {
    // Obtener el ID de la oficina
    const oficinaId = document.getElementById('oficinaId').value;

    try {
        // Realizar la solicitud al servidor para obtener los detalles de la oficina
        const response = await fetch(`http://localhost:3000/api/oficinas/${oficinaId}`);
        const data = await response.json();

        // Actualizar los campos de bloque y número de oficina con los datos obtenidos
        document.getElementById('bloque').value = data.bloque;
        document.getElementById('numeroOficina').value = data.numero;
    } catch (error) {
        console.error('Error al obtener los detalles de la oficina:', error);
    }
});

// Event listener para el botón de asignar
document.getElementById('asignarBtn').addEventListener('click', () => {
    // Obtener los valores de los campos de entrada
    const articuloId = document.getElementById('articuloId').value;
    const oficinaId = document.getElementById('oficinaId').value;
    // Llamar a la función para asignar el producto
    asignarProducto(articuloId, oficinaId);
});
$(document).ready(function() {
    // Manejar el clic en el botón de eliminar
    $('#retirarBtn').click(function() {
      // Obtener el ID del artículo a retirar
      var articuloId = $('#retirarArticuloId').val();
  
      // Realizar la solicitud POST a la API para eliminar la asignación
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/api/eliminar', // La ruta en tu servidor para eliminar la asignación
        contentType: 'application/json',
        data: JSON.stringify({ articuloId: articuloId }), // Enviar el número del artículo al servidor
        success: function(response) {
          // Mostrar un mensaje de éxito
          alert('Asignación eliminada correctamente');
          // Limpiar el campo de entrada
          $('#retirarArticuloId').val('');
          // Puedes agregar aquí cualquier otra acción que desees realizar después de eliminar la asignación
        },
        error: function(xhr, status, error) {
          // Mostrar un mensaje de error si ocurre algún problema
          alert('Error al eliminar la asignación: ' + xhr.responseText);
        }
      });
    });
  });