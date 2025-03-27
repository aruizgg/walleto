import React from 'react';

const OneVaultTransactionForm = ({ transactionData, handleTransactionChange, vaults }) => {
  return (
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
  );
};

export default OneVaultTransactionForm;
