import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import TransactionButtons from '../components/molecules/TransactionButtons';
import VaultService from '../services/VaultService';
import TransactionService from '../services/TransactionService';
import TransactionTable from '../components/atoms/Tables/TransactionTable';
import DateSelectorTable from '../components/atoms/Tables/DateSelectorTable';

Modal.setAppElement('#root');

const LoadingMessage = styled.p`
    margin-top: 10px;
`;

const Transaction = () => {
    const [years, setYears] = useState([]);
    const [error, setError] = useState(null);
    const [expandedYear, setExpandedYear] = useState(new Date().getFullYear());
    const [expandedMonth, setExpandedMonth] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [yearTransactions, setYearTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [vaultNames, setVaultNames] = useState({});
    const [vaults, setVaults] = useState([]);

    useEffect(() => {
        const fetchVaults = async () => {        
            const response = await VaultService.fetchVaults();
            setVaults(response.data);
        };
        
        fetchVaults();
        
        const fetchTransactionYears = async () => {
            try {
                const response = await TransactionService.fetchTransactionYears();
                if (!response.ok) {
                    throw new Error('Error al obtener los años de transacciones');
                }
                const data = await response.json();
                const uniqueYears = [...new Set(data)];
                setYears(uniqueYears);
            } catch (error) {
                console.error('Error:', error);
                setError('No se pudieron obtener los años');
            }
        };

        fetchTransactionYears();
    }, []);

    useEffect(() => {
        if (expandedYear) {
            fetchTransactionsForYear(expandedYear);
        }
    }, [expandedYear]);

    const formatDate = (dateString) => {
        const dateParts = dateString.split('T')[0].split('-');
        const year = dateParts[0].substring(2);
        const month = dateParts[1];
        const day = dateParts[2];
        return `${day}/${month}/${year}`;
    };

    const fetchTransactionsForYear = async (year, month = null) => {
        setLoading(true);
        try {
            const yearResponse = await TransactionService.fetchTransactionsForYear(year);
            if (!yearResponse.ok) {
                throw new Error('Error al obtener las transacciones del año');
            }
            const yearData = await yearResponse.json();

            const yearTransactionsWithNames = await Promise.all(
                yearData.map(async (transaction) => {
                    const sourceVaultName = await fetchVaultName(transaction.vaultSource.id);
                    let destinationVaultName = '';
                    if (transaction.type === 'TRANSFER') {
                        destinationVaultName = await fetchVaultName(transaction.vaultDestination.id);
                    }
                    return {
                        ...transaction,
                        sourceVaultName,
                        destinationVaultName,
                    };
                })
            );
            setYearTransactions(yearTransactionsWithNames);

            if (month !== null) {
                const monthResponse = await TransactionService.fetchTransactionsForMonthAndYear(month, year);
                if (!monthResponse.ok) {
                    throw new Error('Error al obtener las transacciones del mes');
                }
                const monthData = await monthResponse.json();

                const monthTransactionsWithNames = await Promise.all(
                    monthData.map(async (transaction) => {
                        const sourceVaultName = await fetchVaultName(transaction.vaultSource.id);
                        let destinationVaultName = '';
                        if (transaction.type === 'TRANSFER') {
                            destinationVaultName = await fetchVaultName(transaction.vaultDestination.id);
                        }
                        return {
                            ...transaction,
                            sourceVaultName,
                            destinationVaultName,
                        };
                    })
                );
                setTransactions(monthTransactionsWithNames);
                setExpandedMonth(month);
            } else {
                setTransactions(yearTransactionsWithNames);
                setExpandedMonth(null);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudieron obtener las transacciones');
        }
        setLoading(false);
    };

    const handleYearClick = (year) => {
        if (expandedYear !== year) {
            setExpandedYear(year);
            setExpandedMonth(null);
        }
    };

    const handleMonthClick = (month, year, event) => {
        event.stopPropagation();
        fetchTransactionsForYear(year, month);
    };

    const fetchVaultName = async (vaultId) => {
        if (vaultNames[vaultId]) {
            return vaultNames[vaultId];
        }

        try {
            const response = await VaultService.fetchVaultById(vaultId);
            const vault = response.data;
            setVaultNames((prevVaultNames) => ({
                ...prevVaultNames,
                [vaultId]: vault.name,
            }));
            return vault.name;
        } catch (error) {
            console.error('Error:', error);
            return 'Vault no encontrado';
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <TransactionButtons vaults={vaults} fetchVaults={VaultService.fetchVaults} />

            {error && <p>{error}</p>}
            
            <DateSelectorTable 
                years={years}
                expandedYear={expandedYear}
                expandedMonth={expandedMonth}
                yearTransactions={yearTransactions}
                onYearClick={handleYearClick}
                onMonthClick={handleMonthClick}
            />

            {loading ? (
                <LoadingMessage>Cargando transacciones...</LoadingMessage>
            ) : (
                <div>
                    {transactions.length > 0 ? (
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '100px',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
                                <h3>Ingresos</h3>
                                <TransactionTable 
                                    transactions={transactions} 
                                    type="INCOME" 
                                    formatDate={formatDate} 
                                />
                            </div>
                            <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
                                <h3>Gastos</h3>
                                <TransactionTable 
                                    transactions={transactions} 
                                    type="EXPENSE" 
                                    formatDate={formatDate} 
                                />
                            </div>
                            <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
                                <h3>Transferencias</h3>
                                <TransactionTable 
                                    transactions={transactions} 
                                    type="TRANSFER" 
                                    formatDate={formatDate} 
                                />
                            </div>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', margin: '20px 0', fontStyle: 'italic' }}>
                            Aún no se han registrado transacciones este mes
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Transaction;
