import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DolarToEuro from '../lib/utils/DolarToEuro';
import TransactionButtons from '../components/molecules/TransactionButtons';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const TotalDisplay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  user-select: none;
`;

const DropdownContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const DropdownItem = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;

  &:last-child {
    border-bottom: none;
  }
`;

const MainPanel = () => {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // Tasa de conversión de dólares a euros
  const conversionRate = DolarToEuro();

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

  // Calcula el total en euros, convirtiendo las cantidades que estén en dólares.
  const totalEuros = vaults.reduce((acc, vault) => {
    const amount = parseFloat(vault.amount);
    if (isNaN(amount)) return acc;
    if (!vault.deleted) {
      if (vault.currency === '€') {
        return acc + amount;
      } else if (vault.currency === '$') {
        return acc + amount * conversionRate;
      }
    }
    return acc;
  }, 0);

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <PanelContainer>
      <h1>
        Liquidez Total:{' '}
        {loading ? (
          'Cargando...'
        ) : (
          <TotalDisplay onClick={toggleDropdown}>
            {totalEuros.toFixed(2)} €
          </TotalDisplay>
        )}
      </h1>

      {showDropdown && (
        <DropdownContainer>
          {vaults.filter(vault => !vault.deleted).map(vault => (
            <DropdownItem key={vault.id}>
              <span>{vault.name}</span>
              <span>
                {vault.amount} {vault.currency}
              </span>
            </DropdownItem>
          ))}
        </DropdownContainer>
      )}

      <TransactionButtons vaults={vaults} fetchVaults={fetchVaults} />
    </PanelContainer>
  );
};

export default MainPanel;
