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
                    vault.setNombre(vaultDetails.getNombre());
                    vault.setDescripcion(vaultDetails.getDescripcion());
                    vault.setCantidad(vaultDetails.getCantidad());
                    vault.setMoneda(vaultDetails.getMoneda());
                    Vault updatedVault = vaultRepository.save(vault);
                    return ResponseEntity.ok(updatedVault);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteVault(@PathVariable Long id) {
        return vaultRepository.findById(id)
                .map(vault -> {
                    vaultRepository.deleteById(id);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
