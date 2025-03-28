import React, { useState } from 'react';
import styled from 'styled-components';

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px;
`;

const TableRow = styled.tr`
    position: relative;
    &:hover {
        background-color: #f5f5f5;
    }
`;

const Tooltip = styled.div`
    position: absolute;
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s;

    ${TableRow}:hover & {
        opacity: 1;
        visibility: visible;
    }
`;

const TransactionTable = ({ transactions, type, formatDate }) => {
    const [hoveredRow, setHoveredRow] = useState(null);

    const filteredTransactions = transactions.filter(t => t.type === type);

    if (filteredTransactions.length === 0) {
        return <p>No hay {type.toLowerCase()}s este periodo</p>;
    }

    return (
        <Table>
            <thead>
                <tr>
                    <th>Día</th>
                    <th>{type === 'TRANSFER' ? 'Origen' : 'Vault'}</th>
                    {type === 'TRANSFER' && <th>Destino</th>}
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
                {filteredTransactions.map((transaction) => (
                    <TableRow 
                        key={transaction.id}
                        onMouseEnter={() => setHoveredRow(transaction.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                    >
                        <td>{formatDate(transaction.date)}</td>
                        <td>{transaction.sourceVaultName}</td>
                        {type === 'TRANSFER' && <td>{transaction.destinationVaultName}</td>}
                        <td>{transaction.amount + " " + transaction.vaultSource.currency}</td>
                        {hoveredRow === transaction.id && transaction.description && transaction.description.trim() !== '' && (
                            <Tooltip>{transaction.description}</Tooltip>
                        )}
                    </TableRow>
                ))}
            </tbody>
        </Table>
    );
};

export default TransactionTable;
