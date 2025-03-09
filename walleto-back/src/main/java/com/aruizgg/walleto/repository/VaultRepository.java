package com.aruizgg.walleto.repository;

import com.aruizgg.walleto.model.Vault;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VaultRepository extends JpaRepository<Vault, Long> {
}

