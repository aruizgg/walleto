import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DolarToEuro = () => {
  const [rate, setRate] = useState(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        // Obtenemos las tasas de cambio usando la API gratuita de ExchangeRate-API
        // Este endpoint devuelve las tasas para USD; luego extraemos la de EUR
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const euroRate = response.data.rates.EUR;
        setRate(euroRate);
      } catch (error) {
        console.error('Error al obtener la tasa de conversión:', error);
      }
    };

    fetchRate();
  }, []);

  return (
    rate
  );
};

export default DolarToEuro;
