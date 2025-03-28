import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import basura from '../assets/svg/basura.svg';
import lapiz from '../assets/svg/lapiz.svg';
import agregar from '../assets/svg/agregar.svg';
import '../styles/App.css';
import ActionButton from '../components/atoms/Buttons/IconButton';
import styled from 'styled-components';
import '../styles/VaultModal.css';  // Importa el modal separado


// Configura el elemento raíz para accesibilidad
Modal.setAppElement('#root');

const VaultTable = styled.table`
    border-collapse: collapse;  /* Colapsa los bordes de las celdas */
  
  & td {
    padding: 10px;               /* Espacio interno */
    text-align: center;           /* Alineación de texto a la izquierda */
    vertical-align: middle;     /* Centra verticalmente el contenido */
  }
  
  & th {
    font-weight: 600;           /* Un poco más de grosor de fuente */
  }

  .name-col {
    width: 350px;               /* Controla el ancho de la columna de acciones */
    text-align: center;         /* Centra los iconos */
  }

  .desc-col {
    width: 750px;               /* Controla el ancho de la columna de acciones */
    text-align: center;         /* Centra los iconos */
  }

  .cantidad-col {
    width: 150px;               /* Controla el ancho de la columna de acciones */
    text-align: center;         /* Centra los iconos */
  }
  
  .acciones-col {
    width: 120px;               /* Controla el ancho de la columna de acciones */
    text-align: center;         /* Centra los iconos */
  }

`


const Vaults = () => {
    const [vaults, setVaults] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentVault, setCurrentVault] = useState({
        id: null,
        name: '',
        description: '',
        amount: '',
        currency: '€',
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
                name: vault.name,
                description: vault.description,
                amount: vault.amount, // se mantiene pero no se editará
                currency: vault.currency
            });
        } else {
            // Nuevo vault: se permite ingresar todos los campos.
            setIsEditing(false);
            setCurrentVault({
                id: null,
                name: '',
                description: '',
                amount: '',
                currency: '€'
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
                    name: currentVault.name,
                    description: currentVault.description,
                    amount: currentVault.amount,
                    currency: currentVault.currency
                };
                await axios.put(`http://localhost:8080/api/vaults/${currentVault.id}`, updatedVault);
            } else {
                const payload = {
                    ...currentVault,
                    cantidad: parseFloat(currentVault.amount)
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
            <h2>Gestión de Vaults {/* Botón para añadir un nuevo vault */}
                <ActionButton onClick={() => openModal()} src={agregar}
                    alt="Agregar nuevo Vault"></ActionButton></h2>

            {/* Tabla de vaults */}
            <VaultTable>
                <thead>
                    <tr>
                        <th className="name-col">Vault</th>
                        <th className="desc-col">Descripción</th>
                        <th className="cantidad-col">Cantidad</th>
                        <th className="acciones-col"></th>
                    </tr>
                </thead>
                <tbody>
                    {vaults.filter(vault => !vault.deleted).map((vault) => (
                        <tr key={vault.id} >
                            <td >{vault.name} </td>
                            <td>{vault.description}</td>
                            <td>{vault.amount} {vault.currency}</td>
                            <td className="acciones-col">
                                <ActionButton
                                    onClick={() => openModal(vault)}
                                    src={lapiz}
                                    alt="Editar"
                                />
                                <ActionButton
                                    onClick={() => handleDelete(vault.id)}
                                    src={basura}
                                    alt="Eliminar"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </VaultTable>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Formulario de Vault"
                overlayClassName="custom-modal-overlay"
                className="custom-modal-content"
            >
                <h3>{isEditing ? 'Modificar Vault' : 'Añadir Nuevo Vault'}</h3>
                <form onSubmit={handleModalSubmit}>
                    <div>
                        <label>Nombre: </label>
                        <input
                            type="text"
                            name="name"
                            value={currentVault.name}
                            onChange={handleModalChange}
                            maxLength="32"
                            required
                        />
                    </div>
                    <div>
                        <label>Descripción: </label>
                        <input
                            type="text"
                            name="description"
                            value={currentVault.description}
                            onChange={handleModalChange}
                            maxLength="255"
                        />
                    </div>
                    {/* Campo "Cantidad" siempre visible, pero deshabilitado si está en edición */}
                    <div>
                        <label>Cantidad: </label>
                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            max="99999999.99"
                            value={currentVault.amount}
                            onChange={handleModalChange}
                            disabled={isEditing}  // Deshabilita en edición
                            required
                        />
                    </div>
                    <div>
                        <label>Moneda: </label>
                        <select
                            name="currency"
                            value={currentVault.currency}
                            onChange={handleModalChange}
                            required
                        >
                            <option value="$">$</option>
                            <option value="€">€</option>
                        </select>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit">
                            {isEditing ? 'Actualizar Vault' : 'Crear Vault'}
                        </button>
                        <button type="button" onClick={closeModal} style={{ marginLeft: '10px' }}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>

        </div>
    );
};

export default Vaults;
