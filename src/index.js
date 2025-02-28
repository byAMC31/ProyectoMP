const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database'); 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());



// Rutas
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const loginRoutes = require('./routes/loginRoutes');  // Importa las rutas de login
app.use('/api/login', loginRoutes);  // Establece la ruta para el inicio de sesión


// Función para verificar la conexión a la base de datos y sincronizar las tablas
const dbConnection = async () => {
  try {
    // Verificar la conexión
    await sequelize.authenticate();
    console.log('Database online');
    
    // Sincronizar las tablas con la base de datos
    await sequelize.sync({ force: false }); // `force: true` borra y recrea las tablas
    console.log('Tablas sincronizadas exitosamente');
  } catch (error) {
    console.error('Error al conectar o sincronizar la base de datos:', error);
    throw new Error('No se pudo conectar a la base de datos');
  }
};




// Iniciar el servidor después de verificar la conexión a la base de datos
const PORT = process.env.PORT || 3000;
dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo iniciar el servidor:', error.message);
  });
