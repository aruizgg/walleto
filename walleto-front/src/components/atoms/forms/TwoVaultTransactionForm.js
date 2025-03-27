import React from 'react';

const TwoVaultTransactionForm = ({ transactionData, handleTransactionChange, vaults }) => {
  return (
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
  );
};

export default TwoVaultTransactionForm;
