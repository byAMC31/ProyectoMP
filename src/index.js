const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const sequelize = require('./config/database'); 
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


// Configurar dotenv
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());

const urlS = `http://${process.env.DB_HOST}:${process.env.PORT}`;

const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "API de Usuarios",
        version: "1.0.0",
        description: "Documentación de la API de Usuarios con Swagger",
      },
      servers: [
        {
          url: "http://localhost:3000", 
          description: "Servidor de desarrollo",
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT", 
          },
        },
      },
      security: [
        {
          BearerAuth: [], // Hace referencia al esquema de seguridad BearerAuth
        },
      ],
    },
    apis: ["./src/routes/userRoutes.js", "./src/routes/loginRoutes.js"], 
  };
  
 



// Generación de la documentación
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Rutas para servir la UI de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
const userRoutes = require('./routes/userRoutes');
//app.use('/api/users', userRoutes);
app.use('/api/v1/users', userRoutes);

const loginRoutes = require('./routes/loginRoutes');  // Importa las rutas de login
app.use('/api/v1/login', loginRoutes);  // Establece la ruta para el inicio de sesión

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

// Exportar la instancia de la app para las pruebas
module.exports = app;
