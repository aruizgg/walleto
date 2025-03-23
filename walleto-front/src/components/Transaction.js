import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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
    const [expandedYear, setExpandedYear] = useState(new Date().getFullYear()); // Año actual por defecto
    const [expandedMonth, setExpandedMonth] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [vaultNames, setVaultNames] = useState({});

    useEffect(() => {
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
            // Fetch transactions for the initial expanded year
            fetchTransactionsForYear(expandedYear);
        }
    }, [expandedYear]);

    const fetchTransactionsForYear = async (year, month = null) => {
        setLoading(true);
        try {
            let url = `http://localhost:8080/api/transactions/by-year?year=${year}`;
            if (month !== null) {
                url = `http://localhost:8080/api/transactions/by-month-year?month=${month}&year=${year}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al obtener las transacciones');
            }
            const data = await response.json();

            const transactionsWithVaultNames = await Promise.all(
                data.map(async (transaction) => {
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

            setTransactions(transactionsWithVaultNames);
            if (month !== null) {
                setExpandedMonth(month); // Mantener el mes seleccionado visible
            }
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudieron obtener las transacciones');
        }
        setLoading(false);
    };

    const handleYearClick = (year) => {
        setExpandedYear((prevYear) => (prevYear === year ? null : year));
        setExpandedMonth(null); // Resetear el mes expandido al cambiar de año
    };

    const handleMonthClick = async (month, year) => {
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
        if (transactions.length === 0) {
            return false;
        }

        const transactionsForMonth = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === monthIndex && transactionDate.getFullYear() === expandedYear;
        });

        return transactionsForMonth.length > 0;
    };

    return (
        <div>
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
                                                                onClick={() => handleMonthClick(i + 1, year)}
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
                transactions.length > 0 && (
                    <div>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Descripción</th>
                                    <th>Cantidad</th>
                                    <th>Vault de origen</th>
                                    <th>Vault de destino</th>
                                    <th>Dia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.type}</td>
                                        <td>{transaction.description}</td>
                                        <td>{transaction.amount}</td>
                                        <td>{transaction.sourceVaultName}</td>
                                        <td>{transaction.type === 'TRANSFER' ? transaction.destinationVaultName : ''}</td>
                                        <td>{transaction.date.split('T')[0].split('-')[2]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )
            )}
        </div>
    );
};

export default Transaction;
