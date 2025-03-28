import axios from 'axios';

class VaultService {
  static async fetchVaults() {
    return await axios.get('http://localhost:8080/api/vaults');
  }

  static async fetchVaultById(vaultId) {
    return await axios.get(`http://localhost:8080/api/vaults/${vaultId}`);
  }
}

export default VaultService;
