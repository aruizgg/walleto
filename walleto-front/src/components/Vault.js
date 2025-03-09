import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

// Configura el elemento raíz para accesibilidad
Modal.setAppElement('#root');

const Vaults = () => {
  const [vaults, setVaults] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVault, setCurrentVault] = useState({
    id: null,
    nombre: '',
    descripcion: '',
    cantidad: '',
    moneda: '€'
  });

  useEffect(() => {
    getVaults();
  }, []);

  const getVaults = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/vaults');
      setVaults(response.data);
    } catch (error) {
      console.error('Error al obtener vaults:', error);
    }
  };

  // Abre el modal para crear o editar
  const openModal = (vault = null) => {
    if (vault) {
      // Edición: solo se editarán nombre, descripción y moneda.
      setIsEditing(true);
      setCurrentVault({
        id: vault.id,
        nombre: vault.nombre,
        descripcion: vault.descripcion,
        cantidad: vault.cantidad, // se mantiene pero no se editará
        moneda: vault.moneda
      });
    } else {
      // Nuevo vault: se permite ingresar todos los campos.
      setIsEditing(false);
      setCurrentVault({
        id: null,
        nombre: '',
        descripcion: '',
        cantidad: '',
        moneda: '€'
      });
    }
    setModalIsOpen(true);
  };

  // Cierra el modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Maneja los cambios en el formulario del modal
  const handleModalChange = (e) => {
    setCurrentVault({
      ...currentVault,
      [e.target.name]: e.target.value
    });
  };

  // Envía el formulario del modal para crear o actualizar
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Solo actualiza nombre, descripción y moneda
        const updatedVault = {
          nombre: currentVault.nombre,
          descripcion: currentVault.descripcion,
          cantidad: currentVault.cantidad,
          moneda: currentVault.moneda
        };
        await axios.put(`http://localhost:8080/api/vaults/${currentVault.id}`, updatedVault);
      } else {
        const payload = {
          ...currentVault,
          cantidad: parseFloat(currentVault.cantidad)
        };
        await axios.post('http://localhost:8080/api/vaults', payload);
      }
      closeModal();
      getVaults();
    } catch (error) {
      console.error('Error al guardar vault:', error);
    }
  };

  // Eliminar un vault
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/vaults/${id}`);
      getVaults();
    } catch (error) {
      console.error('Error al eliminar vault:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Vaults</h2>

      {/* Tabla de vaults */}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Vault</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Moneda</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vaults.map((vault) => (
            <tr key={vault.id}>
              <td>{vault.nombre}</td>
              <td>{vault.descripcion}</td>
              <td>{vault.cantidad}</td>
              <td>{vault.moneda}</td>
              <td>
                <button onClick={() => openModal(vault)} style={{ marginRight: '8px' }}>
                  Modificar
                </button>
                <button onClick={() => handleDelete(vault.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón para añadir un nuevo vault */}
      <button onClick={() => openModal()}>Añadir Vault</button>

      {/* Modal para crear o editar vault */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Formulario de Vault"
        style={{
          content: { maxWidth: '500px', margin: 'auto' }
        }}
      >
        <h3>{isEditing ? 'Modificar Vault' : 'Añadir Nuevo Vault'}</h3>
        <form onSubmit={handleModalSubmit}>
          <div>
            <label>Nombre: </label>
            <input
              type="text"
              name="nombre"
              value={currentVault.nombre}
              onChange={handleModalChange}
              required
            />
          </div>
          <div>
            <label>Descripción: </label>
            <input
              type="text"
              name="descripcion"
              value={currentVault.descripcion}
              onChange={handleModalChange}
              maxLength="255"
            />
          </div>
          {/* Si es creación se muestra el campo cantidad */}
          {!isEditing && (
            <div>
              <label>Cantidad: </label>
              <input
                type="number"
                name="cantidad"
                step="0.01"
                max="99999999.99"
                value={currentVault.cantidad}
                onChange={handleModalChange}
                required
              />
            </div>
          )}
          <div>
            <label>Moneda: </label>
            <input
              type="text"
              name="moneda"
              value={currentVault.moneda}
              onChange={handleModalChange}
              required
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <button type="submit">{isEditing ? 'Actualizar Vault' : 'Crear Vault'}</button>
            <button type="button" onClick={closeModal} style={{ marginLeft: '10px' }}>Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vaults;
