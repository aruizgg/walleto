package com.aruizgg.walleto.controller;

import com.aruizgg.walleto.model.Vault;
import com.aruizgg.walleto.repository.VaultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vaults")
@CrossOrigin(origins = "http://localhost:3000")
public class VaultController {

    @Autowired
    private VaultRepository vaultRepository;

    @GetMapping
    public List<Vault> getAllVaults() {
        return vaultRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Vault> getVault(@PathVariable Long id) {
        return vaultRepository.findById(id);
    }

    @PostMapping
    public Vault createVault(@RequestBody Vault vault) {
        return vaultRepository.save(vault);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vault> updateVault(@PathVariable Long id, @RequestBody Vault vaultDetails) {
        return vaultRepository.findById(id)
                .map(vault -> {
                    vault.setName(vaultDetails.getName());
                    vault.setDescription(vaultDetails.getDescription());
                    vault.setAmount(vaultDetails.getAmount());
                    vault.setCurrency(vaultDetails.getCurrency());
                    Vault updatedVault = vaultRepository.save(vault);
                    return ResponseEntity.ok(updatedVault);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Vault> deleteVault(@PathVariable Long id) {
        return vaultRepository.findById(id)
                .map(vault -> {
                    vault.setDeleted(true);
                    Vault updatedVault = vaultRepository.save(vault);
                    return ResponseEntity.ok(updatedVault);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
