package com.aruizgg.walleto.service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.aruizgg.walleto.model.Transaction;
import com.aruizgg.walleto.model.Vault;
import com.aruizgg.walleto.repository.TransactionRepository;
import com.aruizgg.walleto.repository.VaultRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.Date;

public class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private VaultRepository vaultRepository;

    @InjectMocks
    private TransactionService transactionService;

    private Vault vault;
    private Transaction transaction;
    private final Long vaultId = 1L;
    private final BigDecimal amount = new BigDecimal("100.00");
    private final String description = "Test transaction";
    private final Date date = new Date();

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        vault = new Vault();
        vault.setId(vaultId);
        vault.setAmount(new BigDecimal("500.00"));
        vault.setCurrency("$");
        vault.setDeleted(false);

        transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setDate(date);
    }

    @Test
    public void testCreateIncome() {
        when(vaultRepository.findById(vaultId)).thenReturn(Optional.of(vault));
        when(vaultRepository.save(any(Vault.class))).thenReturn(vault);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        Transaction result = transactionService.createIncome(vaultId, amount, description, date);

        assertNotNull(result);
        assertEquals("INCOME", result.getType());
        assertEquals(amount, result.getAmount());
        assertEquals(description, result.getDescription());
        verify(vaultRepository, times(1)).save(vault);
        verify(transactionRepository, times(1)).save(result);
    }

    @Test
    public void testCreateIncome_VaultNotFound() {
        when(vaultRepository.findById(vaultId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.createIncome(vaultId, amount, description, date);
        });

        assertEquals("Transaction failed: Vault Not Found", exception.getMessage());
    }

    @Test
    public void testCreateExpense() {
        when(vaultRepository.findById(vaultId)).thenReturn(Optional.of(vault));
        when(vaultRepository.save(any(Vault.class))).thenReturn(vault);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        Transaction result = transactionService.createExpense(vaultId, amount, description, date);

        assertNotNull(result);
        assertEquals("EXPENSE", result.getType());
        assertEquals(amount, result.getAmount());
        assertEquals(description, result.getDescription());
        verify(vaultRepository, times(1)).save(vault);
        verify(transactionRepository, times(1)).save(result);
    }

    @Test
    public void testCreateExpense_InsufficientBalance() {
        vault.setAmount(new BigDecimal("50.00")); // Insufficient balance

        when(vaultRepository.findById(vaultId)).thenReturn(Optional.of(vault));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.createExpense(vaultId, amount, description, date);
        });

        assertEquals("Transaction failed: Insufficient balance in the vault", exception.getMessage());
    }

    @Test
    public void testCreateTransfer() {
        Vault destinationVault = new Vault();
        destinationVault.setId(2L);
        destinationVault.setAmount(new BigDecimal("300.00"));
        destinationVault.setCurrency("$");
        destinationVault.setDeleted(false);

        when(vaultRepository.findById(vaultId)).thenReturn(Optional.of(vault));
        when(vaultRepository.findById(2L)).thenReturn(Optional.of(destinationVault));
        when(vaultRepository.save(any(Vault.class))).thenReturn(vault);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(transaction);

        Transaction result = transactionService.createTransfer(vaultId, 2L, amount, description, date);

        assertNotNull(result);
        assertEquals("TRANSFER", result.getType());
        assertEquals(amount, result.getAmount());
        assertEquals(description, result.getDescription());
        verify(vaultRepository, times(2)).save(any(Vault.class));
        verify(transactionRepository, times(1)).save(result);
    }

    @Test
    public void testCreateTransfer_SourceVaultNotFound() {
        when(vaultRepository.findById(vaultId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.createTransfer(vaultId, 2L, amount, description, date);
        });

        assertEquals("Transaction failed: Source vault Not Found", exception.getMessage());
    }

    @Test
    public void testCreateTransfer_DestinationVaultNotFound() {
        when(vaultRepository.findById(vaultId)).thenReturn(Optional.of(vault));
        when(vaultRepository.findById(2L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.createTransfer(vaultId, 2L, amount, description, date);
        });

        assertEquals("Transaction failed: Destination vault Not Found", exception.getMessage());
    }

    @Test
    public void testCreateTransfer_VaultsDeleted() {
        vault.setDeleted(true);
        Vault destinationVault = new Vault();
        destinationVault.setId(2L);
        destinationVault.setDeleted(true);

        when(vaultRepository.findById(vaultId)).thenReturn(Optional.of(vault));
        when(vaultRepository.findById(2L)).thenReturn(Optional.of(destinationVault));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.createTransfer(vaultId, 2L, amount, description, date);
        });

        assertEquals("Transaction failed: Source vault is Deleted", exception.getMessage());
    }

    @Test
    public void testCreateTransfer_InsufficientBalance() {
        Vault destinationVault = new Vault();
        destinationVault.setId(2L);
        destinationVault.setAmount(new BigDecimal("300.00"));
        destinationVault.setCurrency("$");
        destinationVault.setDeleted(false);

        vault.setAmount(new BigDecimal("50.00")); // Insufficient balance

        when(vaultRepository.findById(vaultId)).thenReturn(Optional.of(vault));
        when(vaultRepository.findById(2L)).thenReturn(Optional.of(destinationVault));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.createTransfer(vaultId, 2L, amount, description, date);
        });

        assertEquals("Transaction failed: Insufficient balance in the vault", exception.getMessage());
    }

    @Test
    public void testCreateTransfer_NotSameCurrency() {
        Vault destinationVault = new Vault();
        destinationVault.setId(2L);
        destinationVault.setAmount(new BigDecimal("300.00"));
        destinationVault.setCurrency("€"); // Different currency
        destinationVault.setDeleted(false);

        when(vaultRepository.findById(vaultId)).thenReturn(Optional.of(vault));
        when(vaultRepository.findById(2L)).thenReturn(Optional.of(destinationVault));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            transactionService.createTransfer(vaultId, 2L, amount, description, date);
        });

        assertEquals("Transaction failed: You cant transfer money between vaults with diferent currencies", exception.getMessage());
    }
}
