import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import axios from 'axios';
import TransactionButtons from '../components/molecules/TransactionButtons';

Modal.setAppElement('#root');

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px;
`;

const TableCell = styled.td`
    padding: 10px;
    border: 1px solid #ddd;
    cursor: pointer;
`;

const ExpandedTable = styled.table`
    border-collapse: collapse;
    width: 100%;
    margin-top: 10px;
`;

const ExpandedTableCell = styled.td`
    padding: 5px;
    border: 1px solid #ddd;
    cursor: pointer;
    background: ${(props) => (props.hasTransactions ? 'inherit' : '#f0f0f0')};
    ${(props) => props.isExpanded && `
        background-color: #e0f0ff; /* Color azul claro */
    `}
`;

const LoadingMessage = styled.p`
    margin-top: 10px;
`;

const MonthContainer = styled.div`
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
            try {
                const response = await axios.get('http://localhost:8080/api/vaults');
                setVaults(response.data);
            } catch (error) {
                console.error('Error al obtener vaults:', error);
            }
        };
        
        fetchVaults();
        
        const fetchTransactionYears = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/transactions/transaction-years');
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
            const yearResponse = await fetch(`http://localhost:8080/api/transactions/by-year?year=${year}`);
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
                let url = `http://localhost:8080/api/transactions/by-month-year?month=${month}&year=${year}`;
                const monthResponse = await fetch(url);
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
            const response = await fetch(`http://localhost:8080/api/vaults/${vaultId}`);
            if (!response.ok) {
                throw new Error('Error al obtener el nombre del vault');
            }
            const vault = await response.json();
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

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const isMonthWithTransactions = (monthIndex) => {
        if (yearTransactions.length === 0) {
            return false;
        }

        const transactionsForMonth = yearTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === monthIndex && transactionDate.getFullYear() === expandedYear;
        });

        return transactionsForMonth.length > 0;
    };

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

    return (
        <div style={{ width: "100%" }}>
            <TransactionButtons vaults={vaults} fetchVaults={fetchVaults} />

            {error && <p>{error}</p>}
            <Table>
                <tbody>
                    <tr>
                        {years.length > 0 ? (
                            years.map((year, index) => (
                                <TableCell key={index} onClick={() => handleYearClick(year)}>
                                    {year}
                                    {expandedYear === year && (
                                        <MonthContainer>
                                            <ExpandedTable>
                                                <tbody>
                                                    <tr>
                                                        {months.map((month, i) => (
                                                            <ExpandedTableCell
                                                                key={i}
                                                                onClick={(e) => handleMonthClick(i + 1, year, e)}
                                                                hasTransactions={isMonthWithTransactions(i)}
                                                                isExpanded={expandedMonth === i + 1}
                                                            >
                                                                {month}
                                                            </ExpandedTableCell>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </ExpandedTable>
                                        </MonthContainer>
                                    )}
                                </TableCell>
                            ))
                        ) : (
                            <TableCell>No se encontraron años de transacciones</TableCell>
                        )}
                    </tr>
                </tbody>
            </Table>

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
                            {/* Tabla de INCOME */}
                            <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
                                <h3>Ingresos</h3>
                                {transactions.filter(t => t.type === 'INCOME').length > 0 ? (
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Día</th>
                                                <th>Vault</th>
                                                <th>Descripción</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions
                                                .filter(transaction => transaction.type === 'INCOME')
                                                .map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td>{formatDate(transaction.date)}</td>
                                                        <td>{transaction.sourceVaultName}</td>
                                                        <td>{transaction.description}</td>
                                                        <td>{transaction.amount + " " + transaction.vaultSource.currency}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p>No hay ingresos este periodo</p>
                                )}
                            </div>

                            {/* Tabla de EXPENSE */}
                            <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
                                <h3>Gastos</h3>
                                {transactions.filter(t => t.type === 'EXPENSE').length > 0 ? (
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Día</th>
                                                <th>Vault</th>
                                                <th>Descripción</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions
                                                .filter(transaction => transaction.type === 'EXPENSE')
                                                .map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td>{formatDate(transaction.date)}</td>
                                                        <td>{transaction.sourceVaultName}</td>
                                                        <td>{transaction.description}</td>
                                                        <td>{transaction.amount + " " + transaction.vaultSource.currency}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p>No hay gastos este periodo</p>
                                )}
                            </div>

                            {/* Tabla de TRANSFER */}
                            <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
                                <h3>Transferencias</h3>
                                {transactions.filter(t => t.type === 'TRANSFER').length > 0 ? (
                                    <Table>
                                        <thead>
                                            <tr>
                                            <th>Día</th>
                                            <th>Origen</th>
                                                <th>Destino</th>
                                                <th>Descripción</th>
                                                <th>Cantidad</th>              
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions
                                                .filter(transaction => transaction.type === 'TRANSFER')
                                                .map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td>{formatDate(transaction.date)}</td>
                                                        <td>{transaction.sourceVaultName}</td>
                                                        <td>{transaction.destinationVaultName}</td>
                                                        <td>{transaction.description}</td>
                                                        <td>{transaction.amount + " " + transaction.vaultSource.currency}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p>No hay transferencias este periodo</p>
                                )}
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