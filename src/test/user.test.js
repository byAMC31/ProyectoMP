const request = require('supertest');
const app = require('../index');  // Asegúrate de que la ruta sea correcta
const User = require('../models/userModel');

describe('Pruebas de los endpoints de usuarios', () => {
  
    let token; // Variable para almacenar el token de autenticación
    let userId; // ID del usuario de prueba

  // Limpiar la base de datos antes de cada prueba
  beforeAll(async () => {
    await User.destroy({ where: {} }); // Limpiar la base de datos antes de las pruebas

     // Registrar un usuario para la prueba
     const userResponse = await request(app)
     .post('/api/users/register')
     .send({
       email: 'testuser52@example.com',
       password: 'Test123456!',
       nombre: 'Test',
       apellido: 'User'
     });

    userId = userResponse.body.id; // Guardar el ID del usuario registrado

    // Iniciar sesión para obtener el token
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        email: 'testuser52@example.com',
        password: 'Test123456!',
    });

    token = loginResponse.body.token; // Guardamos el token para futuras peticiones


  });



  // Test de registro de usuario exitoso
  test('Debe registrar un nuevo usuario', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'testuser@example.com',
        password: 'Test123!',
        nombre: 'Testing',
        apellido: 'Userr'
      });
    
    expect(response.status).toBe(201); // Esperamos que el código de estado sea 201
    expect(response.body.email).toBe('testuser@example.com');
    expect(response.body.nombre).toBe('Testing');
    expect(response.body.apellido).toBe('Userr');
  });






  // Test de registro de usuario con un email ya registrado
  test('Debe retornar un error si el email ya está registrado', async () => {
    // Primero registrar un usuario
    await request(app)
      .post('/api/users/register')
      .send({
        email: 'testuser22@example.com',
        password: 'Test123!',
        nombre: 'camilo',
        apellido: 'hernandez'
      });

    // Luego intentar registrar otro usuario con el mismo email
    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'testuser22@example.com',
        password: 'AnotherPass123!',
        nombre: 'Another',
        apellido: 'User'
      });

    // Verificamos que el código de estado sea 400 (error) y que el mensaje sea el correcto
    expect(response.status).toBe(400); // Esperamos un error de email duplicado
    expect(response.body.error).toBe('El correo electrónico ya está registrado.');
  });




// Test de validación de contraseña en el registro
  test('Debe retornar un error si la contraseña no cumple con los requisitos de seguridad', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        email: 'userNuevo@example.com',
        password: 'test',  // Contraseña que no cumple con los requisitos
        nombre: 'Adrian',
        apellido: 'Martinez',
      });

    expect(response.status).toBe(400); // Esperamos un error 400
    expect(response.body.error).toBe('La contraseña no cumple con los requisitos de seguridad.');
  });




//Test de login 
test('Debe iniciar sesión correctamente y retornar un token', async () => {
    // Primero registrar un usuario
    await request(app)
      .post('/api/users/register')
      .send({
        email: 'testuser4@example.com',
        password: 'Test1234!',
        nombre: 'Test4',
        apellido: 'User4'
      });

    // Posteriormente probar con el usuario registrado
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'testuser4@example.com',
        password: 'Test1234!'
      });
  
    expect(response.status).toBe(200); // Debería retornar un código 200 si el login fue exitoso
    expect(response.body.token).toBeDefined(); // El token JWT debe estar presente
  });
  


  test('Debe retornar un error si las credenciales son incorrectas', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'testuser4@example.com', // Usuario registrado previamente
        password: 'ContraseñaIncorrecta123!', // Contraseña incorrecta
      });
  
    expect(response.status).toBe(401); // Debería retornar 401 Unauthorized
    expect(response.body).toHaveProperty('message', 'Credenciales incorrectas'); // Mensaje esperado
  });
  



// Test para actualizar un usuario que no existe
test('Debe retornar un error si el usuario que se desea actualizar no existe', async () => {
    // ID que sabemos que no existe en la base de datos
    const nonExistentUserId = 99999;
    // Intentar actualizar un usuario con un ID inexistente
    const response = await request(app)
      .put(`/api/users/${nonExistentUserId}`)  // Usamos el ID de usuario inexistente
      .set('Authorization', `Bearer ${token}`)  // Agregar el token a la cabecera
      .send({
        nombre: 'UpdatedName',
        apellido: 'UpdatedLastName',
        email: 'updateduser@example.com'
      });
    expect(response.status).toBe(404);  // Debería retornar un error 404 porque el usuario no existe
    expect(response.body.message).toBe('Usuario no encontrado');  // El mensaje debe ser "Usuario no encontrado"
  });
  






  
// Test para prevenir la duplicación de nombre y apellido en otros registros al actualizar
test('Debe retornar un error si se intenta actualizar con un nombre y apellido ya existentes', async () => {
      // Registrar primer usuario
      const user1 = await request(app)
        .post('/api/users/register')
        .send({
          email: 'usuario1@example.com',
          password: 'Test1234!',
          nombre: 'Juan',
          apellido: 'Pérez'
        });
  
      // Registrar segundo usuario
      const user2 = await request(app)
        .post('/api/users/register')
        .send({
          email: 'usuario2@example.com',
          password: 'Test1234!',
          nombre: 'Carlos',
          apellido: 'Gómez'
        });
  

      // Iniciar sesión con el segundo usuario para obtener el token
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'usuario2@example.com',
          password: 'Test1234!',
        });
  
      const token = loginResponse.body.token;  // Obtenemos el token
  
      // Intentar actualizar el segundo usuario con el mismo nombre y apellido del primero
      const response = await request(app)
        .put(`/api/users/${user2.body.id}`)  // Usamos el ID del segundo usuario
        .set('Authorization', `Bearer ${token}`)  // Agregar el token a la cabecera
        .send({
          nombre: 'Juan',
          apellido: 'Pérez', // Nombre y apellido ya usados por user1
        });
  
      expect(response.status).toBe(400);  // Esperamos un error 400
      expect(response.body.message).toBe('Ya existe un usuario con ese nombre y apellido');
    });
  
 



    // Test para actualización exitosa de un usuario
    test('Debe actualizar correctamente el nombre, apellido y email de un usuario', async () => {
        // Registrar un usuario
        const user = await request(app)
          .post('/api/users/register')
          .send({
            email: 'usuario88@example.com',
            password: 'Test1234!',
            nombre: 'Pedro',
            apellido: 'López'
          });
    
        // Iniciar sesión para obtener el token
        const loginResponse = await request(app)
          .post('/api/login')
          .send({
            email: 'usuario88@example.com',
            password: 'Test1234!',
          });
    
        const token = loginResponse.body.token;  // Obtenemos el token
    
        // Actualizar el usuario registrado
        const response = await request(app)
          .put(`/api/users/${user.body.id}`)  // Usamos el ID del usuario registrado
          .set('Authorization', `Bearer ${token}`)  // Agregar el token en la cabecera
          .send({
            nombre: 'Adrian',
            apellido: 'Calderon',
            email: 'nuevoemail@example.com'
          });
    
        expect(response.status).toBe(200);  // Esperamos un código 200 de éxito
        expect(response.body.message).toBe('Usuario actualizado correctamente');
    
        // Verificar que los datos se actualizaron en la base de datos
        const updatedUser = await User.findByPk(user.body.id);
        expect(updatedUser.nombre).toBe('Adrian');
        expect(updatedUser.apellido).toBe('Calderon');
        expect(updatedUser.email).toBe('nuevoemail@example.com');
      });



    //Test para eliminar un usuario
    test('Debe eliminar un usuario correctamente', async () => {
        // Registrar un usuario
        const user = await request(app)
          .post('/api/users/register')
          .send({
            email: 'usuario555@example.com',
            password: 'Test1234!',
            nombre: 'flor',
            apellido: 'López'
          });
    
        // Iniciar sesión para obtener el token
        const loginResponse = await request(app)
          .post('/api/login')
          .send({
            email: 'usuario555@example.com',
            password: 'Test1234!',
          });
    
        const token = loginResponse.body.token;  // Obtenemos el token
    
        // Eliminar el usuario registrado
        const response = await request(app)
          .delete(`/api/users/${user.body.id}`)  // Usamos el ID del usuario registrado
          .set('Authorization', `Bearer ${token}`);  // Agregar el token en la cabecera
    
        expect(response.status).toBe(200);  // Esperamos un código 200 de éxito
        expect(response.body.message).toBe('Usuario eliminado exitosamente');
    
        // Verificar que el usuario ya no existe en la base de datos
        const deletedUser = await User.findByPk(user.body.id);
        expect(deletedUser).toBeNull();
      });


    //Test para eliminar un usuario que no existe
    test('Debe retornar un error si el usuario a eliminar no existe', async () => {
        const nonExistentUserId = 99999; 
    
          const response = await request(app)
          .delete(`/api/users/${nonExistentUserId}`)
          .set('Authorization', `Bearer ${token}`);  // Enviamos el token válido
    
        expect(response.status).toBe(404);  // Debe retornar un código 404
        expect(response.body.message).toBe('Usuario no encontrado');  // Mensaje esperado
      });




      // Test para obtener todos los usuarios
      test('Debe obtener todos los usuarios correctamente', async () => {
        const response = await request(app)
          .get('/api/users')  // Petición al endpoint
          .set('Authorization', `Bearer ${token}`);  // Agregar el token en la cabecera
    
        expect(response.status).toBe(200);  // Debe retornar código 200
        expect(Array.isArray(response.body)).toBe(true);  // La respuesta debe ser un array
        expect(response.body.length).toBeGreaterThanOrEqual(2);  // Debe haber al menos 2 usuarios
        expect(response.body[0]).toHaveProperty('email');  // Cada usuario debe tener un email
        expect(response.body[0]).toHaveProperty('nombre');  // Cada usuario debe tener un nombre
        expect(response.body[0]).toHaveProperty('apellido');  // Cada usuario debe tener un apellido
      });


      
      // Test para obtener un usuario por su ID
      test('Debe obtener un usuario por su ID correctamente', async () => {
        const response = await request(app)
          .get(`/api/users/${userId}`)  // Petición al endpoint con el ID
          .set('Authorization', `Bearer ${token}`);  // Agregar el token en la cabecera
    
        expect(response.status).toBe(200);  // Debe retornar código 200
        expect(response.body).toHaveProperty('id', userId);  // El ID debe coincidir
        expect(response.body).toHaveProperty('email', 'testuser52@example.com');  // Verificar el email
        expect(response.body).toHaveProperty('nombre', 'Test');  // Verificar el nombre
        expect(response.body).toHaveProperty('apellido', 'User');  // Verificar el apellido
      });



      // Test para obtener un usuario que no existe
      test('Debe retornar un error si el usuario no existe', async () => {
        const nonExistentUserId = 99999999; // ID de usuario que no existe en la BD
      
        const response = await request(app)
          .get(`/api/users/${nonExistentUserId}`) // Intentar obtener el usuario
          .set('Authorization', `Bearer ${token}`); // Enviar el token
      
        expect(response.status).toBe(404); // Debe retornar 404 Not Found
        expect(response.body).toHaveProperty('message', 'Usuario no encontrado'); // Mensaje de error esperado
      });
      
      

      test('Debe retornar un error si la contraseña actual es incorrecta', async () => {
        // Intentamos cambiar la contraseña con una contraseña actual incorrecta
        const response = await request(app)
          .put(`/api/users/${userId}/password`)  // ID del usuario que vamos a actualizar
          .set('Authorization', `Bearer ${token}`)  // Agregar el token al header
          .send({
            oldPassword: 'ContraseñaIncorrecta!',  // Contraseña incorrecta
            newPassword: 'NewPassword123!',  // Nueva contraseña
          });
      
        expect(response.status).toBe(400);  // El código de estado debe ser 400 (Bad Request)
        expect(response.body.message).toBe('La contraseña actual es incorrecta');  // Mensaje esperado
      });
      

  
      // Test para cambiar la contrasela
      test('Debe actualizar la contraseña correctamente', async () => {
        const response = await request(app)
          .put(`/api/users/${userId}/password`)  // Petición al endpoint con el ID
          .set('Authorization', `Bearer ${token}`)  // Agregar el token al header
        .send({
         oldPassword: 'Test123456!',  // Contraseña actual
         newPassword: 'NewPassword123!',  // Nueva contraseña
        });
          expect(response.status).toBe(200);  // El código de estado debe ser 200
          expect(response.body.message).toBe('Contraseña actualizada correctamente');  // Mensaje esperado
      });



       
      // Test para probar que el token se revocó cuando se cambió la contraseña
      test('Debe retornar error que el token no es válido', async () => {
        const response = await request(app)
        .get(`/api/users/${userId}`)  // Petición al endpoint con el ID
        .set('Authorization', `Bearer ${token}`);  // Agregar el token en la cabecera
        expect(response.status).toBe(401);  // Debe retornar código 401
        expect(response.body.message).toBe('El token ha sido revocado. Vuelve a iniciar sesión.');  // Mensaje esperado
      });







});
