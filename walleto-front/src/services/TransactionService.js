// TransactionService.js
import axios from 'axios';

class TransactionService {
  static async postIncome(vaultId, amount, date, description) {
    const payload = {
      vaultSourceId: vaultId,
      amount: parseFloat(amount),
      date,
      description
    };
    return await axios.post('http://localhost:8080/api/transactions/income', payload);
  }

  static async postExpense(vaultId, amount, date, description) {
    const payload = {
      vaultSourceId: vaultId,
      amount: parseFloat(amount),
      date,
      description
    };
    return await axios.post('http://localhost:8080/api/transactions/expense', payload);
  }

  static async postTransfer(sourceVaultId, destinationVaultId, amount, date, description) {
    const payload = {
      vaultSourceId: sourceVaultId,
      vaultDestinationId: destinationVaultId,
      amount: parseFloat(amount),
      date,
      description
    };
    return await axios.post('http://localhost:8080/api/transactions/transfer', payload);
  }
}

export default TransactionService;
