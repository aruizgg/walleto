import axios from 'axios';

class CurrencyConverter {
  
  static async DolarToEuro(){
    var rate;
        try {
          const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
          rate = response.data.rates.EUR;
        } catch (error) {
          console.error('Error al obtener la tasa de conversión:', error);
        }
    return rate;
  };
}

export default CurrencyConverter;
