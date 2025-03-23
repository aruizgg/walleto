package com.aruizgg.walleto.controller;

import com.aruizgg.walleto.model.Vault;
import com.aruizgg.walleto.repository.TransactionRepository;
import com.aruizgg.walleto.repository.VaultRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class VaultControllerIntegrationTest {

    @Autowired
    private VaultRepository vaultRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private VaultController vaultController;

    private final RestTemplate restTemplate = new RestTemplate();

    private Vault testVault;

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

    @Test
    void getAllVaults_EmptyTest() {
        List<Vault> response = vaultController.getAllVaults();

        assertThat(response).isNotNull();
        assertThat(response).isEmpty();
    }

    @Test
    void getAllVaultsTest() {
        createVault("Vault 1", "", 1000 );
        createVault("Vault 2", "", 1000 );
        createVault("Vault 3", "", 1000 );

        List<Vault> response = vaultController.getAllVaults();

        assertThat(response).isNotNull();
        assertThat(response).hasSize(3);
    }

    @Test
    void getVaultByIdTest() {
        createVault("Vault 1", "", 1000 );
        createVault("Vault 2", "", 123.45 );
        createVault("Vault 3", "", 1000 );

        List<Vault> response = vaultController.getAllVaults();

        long id = response.get(1).getId();

        Optional<Vault> responseVault = vaultController.getVault(id);

        assertThat(responseVault).isNotNull();
        assertThat(responseVault.isPresent()).isTrue();
        assertThat(responseVault.get().getName()).isEqualTo("Vault 2");
        assertThat(responseVault.get().getAmount()).isEqualTo(BigDecimal.valueOf(123.45));
        assertThat(responseVault.get().getCurrency()).isEqualTo("€");
        assertThat(responseVault.get().getDescription()).isEqualTo("");
    }

    @Test
    void updateVaultTest() {
        createVault("Vault 1", "", 1000.32 );

        List<Vault> response = vaultController.getAllVaults();

        assertThat(response).isNotNull();
        assertThat(response.get(0).getName()).isEqualTo("Vault 1");
        assertThat(response.get(0).getAmount()).isEqualTo(BigDecimal.valueOf(1000.32));
        assertThat(response.get(0).getCurrency()).isEqualTo("€");
        assertThat(response.get(0).getDescription()).isEqualTo("");

        Vault updatedVault = new Vault("Vault 2", "Updated", BigDecimal.valueOf(98.22), "$");

        ResponseEntity<Vault> updateResponse = vaultController.updateVault(response.get(0).getId(), updatedVault);

        assertThat(updateResponse.getStatusCode().is2xxSuccessful()).isTrue();

        response = vaultController.getAllVaults();

        assertThat(response).isNotNull();
        assertThat(response.get(0).getName()).isEqualTo("Vault 2");
        assertThat(response.get(0).getAmount()).isEqualTo(BigDecimal.valueOf(98.22));
        assertThat(response.get(0).getCurrency()).isEqualTo("$");
        assertThat(response.get(0).getDescription()).isEqualTo("Updated");
    }

    @Test
    void deleteVaultTest() {
        createVault("Vault 1", "", 1000.32 );

        List<Vault> response = vaultController.getAllVaults();

        assertThat(response).isNotNull();
        assertThat(response.get(0).isDeleted()).isFalse();

        ResponseEntity<Vault> deleteResponse = vaultController.deleteVault(response.get(0).getId());

        assertThat(Objects.requireNonNull(deleteResponse.getBody()).isDeleted()).isTrue();
    }

    private void createVault(String name, String description, double amount ) {
        Vault vault = new Vault(name, description, BigDecimal.valueOf(amount), "€");
        vaultController.createVault(vault);
    }
}

