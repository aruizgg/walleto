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

  static async fetchTransactionYears() {
    return await fetch('http://localhost:8080/api/transactions/transaction-years');
  }

  static async fetchTransactionsForYear(year) {
    return await fetch(`http://localhost:8080/api/transactions/by-year?year=${year}`);
  }

  static async fetchTransactionsForMonthAndYear(month, year) {
    return await fetch(`http://localhost:8080/api/transactions/by-month-year?month=${month}&year=${year}`);
  }

  static async fetchVaultName(vaultId) {
    return await fetch(`http://localhost:8080/api/vaults/${vaultId}`);
  }
}

export default TransactionService;
