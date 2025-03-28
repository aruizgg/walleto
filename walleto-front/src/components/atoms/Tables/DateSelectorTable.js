import React from 'react';
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

const MonthContainer = styled.div`
    margin-top: 10px;
`;

const DateSelectorTable = ({ 
    years, 
    expandedYear, 
    expandedMonth, 
    yearTransactions,
    onYearClick, 
    onMonthClick 
}) => {
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

    return (
        <Table>
            <tbody>
                <tr>
                    {years.length > 0 ? (
                        years.map((year, index) => (
                            <TableCell key={index} onClick={() => onYearClick(year)}>
                                {year}
                                {expandedYear === year && (
                                    <MonthContainer>
                                        <ExpandedTable>
                                            <tbody>
                                                <tr>
                                                    {months.map((month, i) => (
                                                        <ExpandedTableCell
                                                            key={i}
                                                            onClick={(e) => onMonthClick(i + 1, year, e)}
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
    );
};

export default DateSelectorTable;
