import express from 'express';
import fetch from 'node-fetch';
import mysql from 'mysql';
import cors from 'cors'; // Importa el middleware cors

const app = express();
const PORT = 3000;

// Middleware para permitir CORS
app.use(cors());

// Crear una conexión a la base de datos MySQL
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1001893103",
  database: "basedatos"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Conectado a la base de datos MySQL!");
});

// Middleware para permitir CORS 
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Ruta para obtener los datos de la API externa y guardarlos en la base de datos
app.get('/api/articulos', async (req, res) => {
  try {
    const response = await fetch('http://consultas.cuc.edu.co/api/v1.0/articulos', {
      headers: {
        'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJ1c2VybmFtZSI6InBydWViYTIwMjJAY3VjLmVkdS5jbyIsImV4cCI6MTY0OTQ1MzA1NCwiY29ycmVvIjoicHJ1ZWJhMjAyMkBjdWMuZWR1LmNvIn0.MAoFJE2SBgHvp9BS9fyBmb2gZzD0BHGPiyKoAo_uYAQ'
      }
    });
    const data = await response.json();

    // Insertar los datos en la base de datos
    data.forEach(item => {
        const { id, serial, fecha_ingreso, fecha_garantia, tipo, marca, modelo } = item;

        // Reformatear las fechas en el formato 'YYYY-MM-DD'
        const formatted_fecha_ingreso = formatDate(fecha_ingreso);
        const formatted_fecha_garantia = formatDate(fecha_garantia);

        // Verificar si todos los campos importantes están presentes
        if (id && serial && fecha_ingreso && fecha_garantia && tipo && marca && modelo) {
            var sql = `INSERT INTO articulos (id, serial, fecha_ingreso, fecha_garantia, tipo, marca, modelo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            con.query(sql, [id, serial, formatted_fecha_ingreso, formatted_fecha_garantia, tipo, marca, modelo], function (err, result) {
                if (err) console.error("Error al insertar el artículo:", err);
                else console.log("Artículo insertado:", id, marca, modelo);
            });
        } else {
            console.log("Los datos del artículo no están completos:", item);
        }
    });
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Hubo un error al obtener los datos.' });
  }
});

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(express.json());

// Ruta api asignar
app.post('/api/asignar', (req, res) => {
  const { articuloId, oficinaId } = req.body;

  // Verificar si el artículo ya está asignado a una oficina
  const sqlCheck = 'SELECT * FROM asignaciones WHERE articulo_id = ?';
  con.query(sqlCheck, [articuloId], (err, results) => {
    if (err) {
      console.error('Error al verificar la asignación del artículo:', err);
      res.status(500).json({ error: 'Error al verificar la asignación del artículo' });
      return;
    }

    if (results.length > 0) {
      // El artículo ya está asignado a una oficina
      res.status(400).json({ error: 'El artículo ya está asignado a una oficina' });
    } else {
      // Asignar el artículo a la oficina
      const sqlInsert = 'INSERT INTO asignaciones (articulo_id, oficina_id) VALUES (?, ?)';
      con.query(sqlInsert, [articuloId, oficinaId], (err, result) => {
        if (err) {
          console.error('Error al asignar el artículo:', err);
          res.status(500).json({ error: 'Error al asignar el artículo' });
          return;
        }

        res.json({ message: 'Artículo asignado con éxito' });
      });
    }
  });
});

// Endpoint para obtener los detalles de una oficina
app.get('/api/oficinas/:id', (req, res) => {
  const id = req.params.id;

  // Consulta SQL para obtener los detalles de la oficina
  const sql = `SELECT bloque, numero FROM oficinas WHERE id = ${mysql.escape(id)}`;

  // Ejecutar la consulta
  con.query(sql, (err, result) => {
      if (err) {
          console.error('Error al obtener los detalles de la oficina:', err);
          res.status(500).json({ error: 'Error al obtener los detalles de la oficina' });
      } else {
          res.json(result[0]);
      }
  });
});

// Ruta para eliminar una asignación
app.post('/api/eliminar', (req, res) => {
  const { articuloId } = req.body;

  const sqlDelete = 'DELETE FROM asignaciones WHERE articulo_id = ?';
  con.query(sqlDelete, [articuloId], (err, result) => {
    if (err) {
      console.error('Error al eliminar la asignación:', err);
      res.status(500).json({ error: 'Error al eliminar la asignación' });
      return;
    }

    if (result.affectedRows === 0) {
      // No se encontró la asignación con el ID especificado
      res.status(404).json({ error: 'Asignación no encontrada' });
    } else {
      // Eliminación exitosa
      res.json({ message: 'Asignación eliminada correctamente' });
    }
  });
});

// Función para reformatear las fechas en el formato 'YYYY-MM-DD'
function formatDate(dateString) {
  const [day, month, year] = dateString.split('/');
  if (day && month && year) {
      return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } else {
      console.error("Fecha no válida:", dateString);
      return null; // Retorna null si la fecha no es válida
  }
}

app.get('/api/reportes/dispositivosPorBloque', (req, res) => {
  const sql = 'SELECT bloque, COUNT(*) as cantidad FROM oficinas JOIN asignaciones ON oficinas.id = asignaciones.oficina_id GROUP BY bloque';
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/api/reportes/dispositivosPorOficina', (req, res) => {
  const sql = 'SELECT oficina_id, bloque, numero, COUNT(*) as cantidad FROM oficinas JOIN asignaciones ON oficinas.id = asignaciones.oficina_id GROUP BY oficina_id';
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/api/reportes/articulosSinAsignar', (req, res) => {
  const sql = 'SELECT a.* FROM articulos a LEFT JOIN asignaciones b ON a.id = b.articulo_id WHERE b.articulo_id IS NULL;';
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error al obtener artículos sin asignar:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json(result);
  });
});

 //endpoint API PUNTO 4
 app.get('/api/asignaciones/:bloque/:numero', (req, res) => {
  const bloque = req.params.bloque;
  const numero = req.params.numero; 

  const sql = `SELECT a.serial, a.fecha_ingreso, a.fecha_garantia, a.marca, a.modelo FROM articulos a JOIN asignaciones b ON a.id = b.articulo_id JOIN oficinas c ON b.oficina_id = c.id WHERE c.bloque = ? AND c.numero = ?`;
  con.query(sql, [bloque, numero], (err, result) => {
    if (err) {
      console.error('Error al obtener los artículos asignados:', err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json({
      bloque: bloque,
      numero: numero,
      articulos: result
    });
  });
});

//URL DE EJEMPLO PARA PROBAR ENDPOINT 
//http://localhost:3000/api/asignaciones/BloqueA/Oficina1

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
