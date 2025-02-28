const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { Op } = require('sequelize');
const { validateEmail, validatePassword } = require('../utils/validations');


const registerUser = async (req, res) => {
  const { email, password, nombre, apellido } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'El correo electrónico no es válido.' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'La contraseña no cumple con los requisitos de seguridad.' });
  }

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Verificar si ya existe alguien con el mismo nombre y apellido
    const nameExists = await User.findOne({ where: { nombre, apellido } });
    if (nameExists) {
      return res.status(400).json({ error: 'Ya existe un usuario con el mismo nombre y apellido.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await User.create({
      email,
      password: hashedPassword,
      nombre,
      apellido
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      nombre: newUser.nombre,
      apellido: newUser.apellido
    });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};





// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Obtener todos los usuarios
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};





// Obtener un usuario por su ID
const getUserById = async (req, res) => {
  const { id } = req.params;  // Obtener el ID desde los parámetros de la URL
  try {
    const user = await User.findByPk(id); // Buscar usuario por ID
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);  // Devolver el usuario si se encuentra
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};




// Eliminar un usuario por su ID
const deleteUser = async (req, res) => {
  const { id } = req.params;  // Obtener el ID desde los parámetros de la URL
  try {
    const user = await User.findByPk(id);  // Buscar el usuario por su ID
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Eliminar el usuario. Si tienes relaciones en cascada
    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};



// Actualizar un usuario 
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email } = req.body;

  try {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    console.log(`Buscando usuario con ID: ${userId}`);
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si otro usuario tiene el mismo nombre y apellido
    console.log(`Buscando duplicados: ${nombre} ${apellido}`);
    const existingUserByName = await User.findOne({
      where: {
        nombre,
        apellido,
        id: { [Op.ne]: userId }, // Excluir el usuario actual
      },
    });

    if (existingUserByName) {
      console.log('Usuario duplicado encontrado');
      return res.status(400).json({ message: 'Ya existe un usuario con ese nombre y apellido' });
    }

    // Verificar si otro usuario ya tiene el mismo email
    if (email) {
      console.log(`Verificando si el email ya está en uso: ${email}`);
      const existingUserByEmail = await User.findOne({
        where: {
          email,
          id: { [Op.ne]: userId }, // Excluir el usuario actual
        },
      });

      if (existingUserByEmail) {
        console.log('Email ya registrado por otro usuario');
        return res.status(400).json({ message: 'El email ya está registrado por otro usuario' });
      }
    }

    console.log(`Actualizando usuario ID ${userId}`);
    const [updatedRows] = await User.update(
      { nombre, apellido, email },
      { where: { id: userId } }
    );

    if (updatedRows === 0) {
      console.log('No se realizaron cambios en el usuario');
      return res.status(400).json({ message: 'No se realizaron cambios en el usuario' });
    }

    console.log('Usuario actualizado correctamente');
    res.json({ message: 'Usuario actualizado correctamente' });

  } catch (error) {
    console.error('Error en la actualización:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};



//Actualiza la contraseña
const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Validar que la nueva contraseña tenga el formato correcto
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: 'La nueva contraseña no cumple con los requisitos de seguridad.' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la contraseña actual es correcta
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña y registrar la fecha del cambio
    await user.update({
      password: hashedPassword,
      passwordChangedAt: new Date(),  // Registrar el cambio de contraseña
    });

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
};




module.exports = { registerUser, getAllUsers, getUserById, deleteUser, updateUser,updateUserPassword };
