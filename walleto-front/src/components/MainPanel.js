import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DolarToEuro from '../utils/DolarToEuro';

const PanelContainer = styled.div`
   display: grid;
  grid-template-columns: 1fr 5fr;  /* Dos columnas iguales */
  grid-template-rows: 1fr 3fr;     /* Dos filas iguales */
  gap: 10px;                     /* Espacio entre celdas */
  padding: 10px;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  border-style: solid; 
  width: 100%
`;

const TotalDisplay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 20px 0;
`;

const MainPanel = () => {
    const [vaults, setVaults] = useState([]);
    const [loading, setLoading] = useState(true);

    // Suponemos un tipo de cambio fijo para convertir dólares a euros.
    // Puedes ajustar este valor o hacerlo dinámico si lo necesitas.
    const conversionRate = DolarToEuro()

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

    // Se suma la cantidad de cada vault, convirtiendo a € si es necesario.
    const totalEuros = vaults.reduce((acc, vault) => {
        const cantidad = parseFloat(vault.cantidad);
        if (isNaN(cantidad)) return acc;
        if (vault.moneda === '€') {
            return acc + cantidad;
        } else if (vault.moneda === '$') {
            return acc + cantidad * conversionRate;
        }
        return acc;
    }, 0);

    return (
        <PanelContainer>
            <h1>Liquidez Total: {loading ? (
                "Cargando..."
            ) : (
                <TotalDisplay>{totalEuros.toFixed(2)} €</TotalDisplay>
            )}</h1>
            
        </PanelContainer>
    );
};

export default MainPanel;
