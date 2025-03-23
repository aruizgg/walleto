package com.aruizgg.walleto.controller;

import com.aruizgg.walleto.model.Vault;
import com.aruizgg.walleto.repository.TransactionRepository;
import com.aruizgg.walleto.repository.VaultRepository;
import com.aruizgg.walleto.request.TransactionRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class TransactionControllerTest {

    @Autowired
    private VaultRepository vaultRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private VaultController vaultController;

    @Autowired
    private TransactionController transactionController;

    @BeforeEach
    void setup() {
        transactionRepository.deleteAll();
        vaultRepository.deleteAll();
    }

    @AfterEach
    void afterTest() {
        transactionRepository.deleteAll();
        vaultRepository.deleteAll();
    }

    private void createVault(String name, String description, BigDecimal amount, String currency ) {
        Vault vault = new Vault(name, description, amount, currency);
        vaultController.createVault(vault);
    }

    @Test
    void createIncome() {
        TransactionRequest transactionRequest = new TransactionRequest();

        createVault("Vault 1", "", BigDecimal.ONE, "$");
        Long sourceVaultId = vaultController.getAllVaults().get(0).getId();

        transactionRequest.setVaultSourceId(sourceVaultId);
        transactionRequest.setAmount(BigDecimal.ONE);
        transactionRequest.setDescription("");
        transactionRequest.setDate(new Date());

        transactionController.createIncome(transactionRequest);

        assertThat(vaultController.getVault(sourceVaultId).get().getAmount().toString()).isEqualTo("2.00");
    }

    @Test
    void createExpense() {
        TransactionRequest transactionRequest = new TransactionRequest();

        createVault("Vault 1", "", BigDecimal.ONE, "$");
        Long sourceVaultId = vaultController.getAllVaults().get(0).getId();

        transactionRequest.setVaultSourceId(sourceVaultId);
        transactionRequest.setAmount(BigDecimal.ONE);
        transactionRequest.setDescription("");
        transactionRequest.setDate(new Date());

        transactionController.createExpense(transactionRequest);

        assertThat(vaultController.getVault(sourceVaultId).isPresent());
        assertThat(vaultController.getVault(sourceVaultId).get().getAmount().toString()).isEqualTo("0.00");
    }

    @Test
    void createTransfer() {
        TransactionRequest transactionRequest = new TransactionRequest();

        createVault("Vault 1", "", BigDecimal.ONE, "$");
        createVault("Vault 2", "", BigDecimal.ONE, "$");
        Long sourceVaultId = vaultController.getAllVaults().get(0).getId();
        Long destinationVaultId = vaultController.getAllVaults().get(1).getId();

        transactionRequest.setVaultSourceId(sourceVaultId);
        transactionRequest.setVaultDestinationId(destinationVaultId);
        transactionRequest.setAmount(BigDecimal.ONE);
        transactionRequest.setDescription("");
        transactionRequest.setDate(new Date());

        transactionController.createTransfer(transactionRequest);

        assertThat(vaultController.getVault(sourceVaultId).isPresent());
        assertThat(vaultController.getVault(destinationVaultId).isPresent());
        assertThat(vaultController.getVault(sourceVaultId).get().getAmount().toString()).isEqualTo("0.00");
        assertThat(vaultController.getVault(destinationVaultId).get().getAmount().toString()).isEqualTo("2.00");
    }
}
