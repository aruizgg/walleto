package com.aruizgg.walleto.service;

import com.aruizgg.walleto.model.Transaction;
import com.aruizgg.walleto.model.Vault;
import com.aruizgg.walleto.repository.TransactionRepository;
import com.aruizgg.walleto.repository.VaultRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private static final String INCOME = "INCOME";
    private static final String EXPENSE = "EXPENSE";
    private static final String TRANSFER = "TRANSFER";

    private static final String VAULT_NOT_FOUND = "Transaction failed: Vault Not Found";
    private static final String SOURCE_VAULT_NOT_FOUND = "Transaction failed: Source vault Not Found";
    private static final String DESTINATION_VAULT_NOT_FOUND = "Transaction failed: Destination vault Not Found";

    private static final String VAULT_IS_DELETED = "Transaction failed: Vault is Deleted";
    private static final String SOURCE_VAULT_IS_DELETED = "Transaction failed: Source vault is Deleted";
    private static final String DESTINATION_VAULT_IS_DELETED = "Transaction failed: Destination vault is Deleted";

    private static final String INSUFFICIENT_BALANCE = "Transaction failed: Insufficient balance in the vault";

    private static final String NOT_SAME_CURRENCY = "Transaction failed: You cant transfer money between vaults with diferent currencies";

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private VaultRepository vaultRepository;

    public Transaction createIncome(Long vaultId, BigDecimal amount, String description, Date date) {

        Vault vault = vaultRepository.findById(vaultId)
                .orElseThrow(() -> new RuntimeException(VAULT_NOT_FOUND));

        if (vault.isDeleted()) {
            throw new RuntimeException(VAULT_IS_DELETED);
        }

        // Actualiza el saldo del vault destino
        vault.setAmount(vault.getAmount().add(amount));
        vaultRepository.save(vault);

        // Crea y guarda la transacción
        Transaction transaction = new Transaction();
        transaction.setType(INCOME);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setVaultSource(vault);
        transaction.setDate(date);
        transactionRepository.save(transaction);
        return transaction;
    }

    public Transaction createExpense(Long vaultId, BigDecimal amount, String description, Date date) {

        Vault vault = vaultRepository.findById(vaultId)
                .orElseThrow(() -> new RuntimeException(VAULT_NOT_FOUND));

        if (vault.isDeleted()) {
            throw new RuntimeException(VAULT_IS_DELETED);
        }

        // Verifica que el vault tenga fondos suficientes
        if (vault.getAmount().compareTo(amount) < 0) {
            throw new RuntimeException(INSUFFICIENT_BALANCE);
        }
        // Actualiza el saldo del vault origen
        vault.setAmount(vault.getAmount().subtract(amount));
        vaultRepository.save(vault);

        // Crea y guarda la transacción
        Transaction transaction = new Transaction();
        transaction.setType(EXPENSE);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setVaultSource(vault);
        transaction.setDate(date);
        transactionRepository.save(transaction);
        return transaction;
    }

    public Transaction createTransfer(Long vaultSourceId, Long vaultDestinationId, BigDecimal amount, String description, Date date) {

        Vault vaultSource = vaultRepository.findById(vaultSourceId)
                .orElseThrow(() -> new RuntimeException(SOURCE_VAULT_NOT_FOUND));
        Vault vaultDestination = vaultRepository.findById(vaultDestinationId)
                .orElseThrow(() -> new RuntimeException(DESTINATION_VAULT_NOT_FOUND));

        if (vaultSource.isDeleted()) {
            throw new RuntimeException(SOURCE_VAULT_IS_DELETED);
        }

        if (vaultDestination.isDeleted()) {
            throw new RuntimeException(DESTINATION_VAULT_IS_DELETED);
        }

        if(vaultSource.getCurrency().compareTo(vaultDestination.getCurrency()) != 0) {
            throw new RuntimeException(NOT_SAME_CURRENCY);
        }

        // Verifica fondos en el vault origen
        if (vaultSource.getAmount().compareTo(amount) < 0) {
            throw new RuntimeException(INSUFFICIENT_BALANCE);
        }

        // Actualiza saldos
        vaultSource.setAmount(vaultSource.getAmount().subtract(amount));
        vaultDestination.setAmount(vaultDestination.getAmount().add(amount));
        vaultRepository.save(vaultSource);
        vaultRepository.save(vaultDestination);

        // Crea y guarda la transacción
        Transaction transaction = new Transaction();
        transaction.setType(TRANSFER);
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setVaultSource(vaultSource);
        transaction.setVaultDestination(vaultDestination);
        transaction.setDate(date);
        transactionRepository.save(transaction);

        return transaction;
    }

    public List<Transaction> getTransactionsByMonthAndYear(int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        return transactionRepository.findByDateBetween(
                Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant())
        );
    }

    public List<Transaction> getTransactionsByYear(int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);

        return transactionRepository.findByDateBetween(
                Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant())
        );
    }

    public List<Integer> getAvailableTransactionYears() {
        List<Date> transactionDates = transactionRepository.findDistinctYears();

        return transactionDates.stream()
                .map(date -> date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getYear())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}

