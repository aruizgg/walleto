import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import styled from 'styled-components';
import DolarToEuro from '../utils/DolarToEuro';

Modal.setAppElement('#root');

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const TotalDisplay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
`;

const DropdownContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const DropdownItem = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;

  &:last-child {
    border-bottom: none;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const MainPanel = () => {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // Estados para el modal de transacciones
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState(''); // "income", "expense" o "transfer"
  const [transactionData, setTransactionData] = useState({
    vaultId: '',
    amount: '',
    description: '',
    date: '', // Se asignará automáticamente
    sourceVaultId: '',
    destinationVaultId: ''
  });

  // Tasa de conversión de dólares a euros
  const conversionRate = DolarToEuro();

  const fetchVaults = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/vaults');
      setVaults(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener vaults:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaults();
  }, []);

  // Calcula el total en euros, convirtiendo las cantidades que estén en dólares.
  const totalEuros = vaults.reduce((acc, vault) => {
    const amount = parseFloat(vault.amount);
    if (isNaN(amount)) return acc;
    if (!vault.deleted) {
      if (vault.currency === '€') {
        return acc + amount;
      } else if (vault.currency === '$') {
        return acc + amount * conversionRate;
      }
    }
    return acc;
  }, 0);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  // Abre el modal de transacción, asignando automáticamente la fecha actual.
  const openTransactionModal = (type) => {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    setTransactionType(type);
    setTransactionData({
      vaultId: '',
      amount: '',
      description: '',
      date: today,
      sourceVaultId: '',
      destinationVaultId: ''
    });
    setTransactionModalOpen(true);
  };

  const closeTransactionModal = () => {
    setTransactionModalOpen(false);
  };

  // Maneja los cambios en los campos del modal de transacción
  const handleTransactionChange = (e) => {
    setTransactionData({
      ...transactionData,
      [e.target.name]: e.target.value
    });
  };

  // Función para enviar la transacción a la API
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (transactionType === 'income') {
        const payload = {
          vaultSourceId: transactionData.vaultId,
          amount: parseFloat(transactionData.amount),
          date: transactionData.date,
          description: transactionData.description
        };
        await axios.post('http://localhost:8080/api/transactions/income', payload);
      } else if (transactionType === 'expense') {
        const payload = {
          vaultSourceId: transactionData.vaultId,
          amount: parseFloat(transactionData.amount),
          date: transactionData.date,
          description: transactionData.description
        };
        await axios.post('http://localhost:8080/api/transactions/expense', payload);
      } else if (transactionType === 'transfer') {
        const payload = {
          vaultSourceId: transactionData.sourceVaultId,
          vaultDestinationId: transactionData.destinationVaultId,
          amount: parseFloat(transactionData.amount),
          date: transactionData.date,
          description: transactionData.description
        };
        await axios.post('http://localhost:8080/api/transactions/transfer', payload);
      }
      closeTransactionModal();
      fetchVaults();
    } catch (error) {
      console.error('Error al enviar la transacción:', error);
    }
  };

  // Funciones para abrir modales de cada acción
  const handleAddIncome = () => {
    openTransactionModal("income");
  };

  const handleAddExpense = () => {
    openTransactionModal("expense");
  };

  const handleTransfer = () => {
    openTransactionModal("transfer");
  };

  return (
    <PanelContainer>
      <h1>
        Liquidez Total:{' '}
        {loading ? (
          'Cargando...'
        ) : (
          <TotalDisplay onClick={toggleDropdown}>
            {totalEuros.toFixed(2)} €
          </TotalDisplay>
        )}
      </h1>

      {showDropdown && (
        <DropdownContainer>
          {vaults.filter(vault => !vault.deleted).map(vault => (
            <DropdownItem key={vault.id}>
              <span>{vault.name}</span>
              <span>
                {vault.amount} {vault.currency}
              </span>
            </DropdownItem>
          ))}
        </DropdownContainer>
      )}

      <ButtonContainer>
        <ActionButton onClick={handleAddIncome}>Añadir Ingreso</ActionButton>
        <ActionButton onClick={handleAddExpense}>Añadir Gasto</ActionButton>
        <ActionButton onClick={handleTransfer}>Transferir</ActionButton>
      </ButtonContainer>

      {/* Modal de transacción */}
      <Modal
        isOpen={transactionModalOpen}
        onRequestClose={closeTransactionModal}
        contentLabel="Transacción"
        overlayClassName="custom-modal-overlay"
        className="custom-modal-content"
      >
        <h3>
          {transactionType === 'income' && 'Añadir Ingreso'}
          {transactionType === 'expense' && 'Añadir Gasto'}
          {transactionType === 'transfer' && 'Transferir'}
        </h3>
        <form onSubmit={handleTransactionSubmit}>
          {(transactionType === 'income' || transactionType === 'expense') && (
            <>
              <div>
                <label>Selecciona Vault:</label>
                <select
                  name="vaultId"
                  value={transactionData.vaultId}
                  onChange={handleTransactionChange}
                  required
                >
                  <option value="">--Selecciona un Vault--</option>
                  {vaults
                    .filter(vault => !vault.deleted)
                    .map(vault => (
                      <option key={vault.id} value={vault.id}>
                        {vault.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label>Monto:</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={transactionData.amount}
                  onChange={handleTransactionChange}
                  required
                />
              </div>
              <div>
                <label>Fecha:</label>
                <input
                  type="date"
                  name="date"
                  value={transactionData.date}
                  onChange={handleTransactionChange}
                  required
                />
              </div>
              <div>
                <label>Descripción:</label>
                <input
                  type="text"
                  name="description"
                  value={transactionData.description}
                  onChange={handleTransactionChange}
                />
              </div>
            </>
          )}

          {transactionType === 'transfer' && (
            <>
              <div>
                <label>Vault Origen:</label>
                <select
                  name="sourceVaultId"
                  value={transactionData.sourceVaultId}
                  onChange={handleTransactionChange}
                  required
                >
                  <option value="">--Selecciona Vault Origen--</option>
                  {vaults
                    .filter(vault => !vault.deleted)
                    .map(vault => (
                      <option key={vault.id} value={vault.id}>
                        {vault.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label>Vault Destino:</label>
                <select
                  name="destinationVaultId"
                  value={transactionData.destinationVaultId}
                  onChange={handleTransactionChange}
                  required
                >
                  <option value="">--Selecciona Vault Destino--</option>
                  {vaults
                    .filter(vault => !vault.deleted)
                    .map(vault => (
                      <option key={vault.id} value={vault.id}>
                        {vault.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label>Monto:</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={transactionData.amount}
                  onChange={handleTransactionChange}
                  required
                />
              </div>
              <div>
                <label>Fecha:</label>
                <input
                  type="date"
                  name="date"
                  value={transactionData.date}
                  onChange={handleTransactionChange}
                  required
                />
              </div>
              <div>
                <label>Descripción:</label>
                <input
                  type="text"
                  name="description"
                  value={transactionData.description}
                  onChange={handleTransactionChange}
                />
              </div>
            </>
          )}
          <div style={{ marginTop: '10px' }}>
            <button type="submit">Enviar</button>
            <button type="button" onClick={closeTransactionModal} style={{ marginLeft: '10px' }}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </PanelContainer>
  );
};

export default MainPanel;
