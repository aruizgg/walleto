import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import ComponentTextButton from '../atoms/Buttons/TextButton';
import OneVaultTransactionForm from '../atoms/forms/OneVaultTransactionForm';
import TwoVaultTransactionForm from '../atoms/forms/TwoVaultTransactionForm';
import TransactionService from '../../services/TransactionService';

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
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
        TransactionService.postIncome(transactionData.vaultId, parseFloat(transactionData.amount), transactionData.date, transactionData.description)
      } else if (transactionType === 'expense') {
        TransactionService.postExpense(transactionData.vaultId, parseFloat(transactionData.amount), transactionData.date, transactionData.description)
      } else if (transactionType === 'transfer') {
        TransactionService.postIncome(transactionData.sourceVaultId, transactionData.destinationVaultId, parseFloat(transactionData.amount),  transactionData.date, transactionData.description)
      }
      closeTransactionModal();
      fetchVaults();
    } catch (error) {
      console.error('Error al enviar la transacción:', error);
    }
  };

  return (
    <>
      <ButtonContainer>
        <ComponentTextButton onClick={() => openTransactionModal("income")}>Añadir Ingreso</ComponentTextButton>
        <ComponentTextButton onClick={() => openTransactionModal("expense")}>Añadir Gasto</ComponentTextButton>
        <ComponentTextButton onClick={() => openTransactionModal("transfer")}>Transferir</ComponentTextButton>
      </ButtonContainer>

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
            <OneVaultTransactionForm
              transactionData={transactionData}
              handleTransactionChange={handleTransactionChange}
              vaults={vaults}
            />
          )}
          {transactionType === 'transfer' && (
            <TwoVaultTransactionForm
              transactionData={transactionData}
              handleTransactionChange={handleTransactionChange}
              vaults={vaults}
            />
          )}
          <div style={{ marginTop: '10px' }}>
            <ComponentTextButton type="submit">Enviar</ComponentTextButton>
            <ComponentTextButton type="button" onClick={closeTransactionModal}>
              Cancelar
            </ComponentTextButton>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default TransactionButtons;
