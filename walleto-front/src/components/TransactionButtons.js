import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import axios from 'axios';

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

const TransactionButtons = ({ vaults, fetchVaults }) => {
  const [transactionModalOpen, setTransactionModalOpen] = React.useState(false);
  const [transactionType, setTransactionType] = React.useState('');
  const [transactionData, setTransactionData] = React.useState({
    vaultId: '',
    amount: '',
    description: '',
    date: '',
    sourceVaultId: '',
    destinationVaultId: ''
  });

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
    <>
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
    </>
  );
};

export default TransactionButtons;
