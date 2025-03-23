package com.aruizgg.walleto.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "vaults")
public class Vault {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 255)
    private String description; // Campo opcional

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency = "€"; // Valor por defecto

    @Column (nullable = false)
    private boolean isDeleted = false;

    // Constructores
    public Vault() {
    }

    public Vault(String name, String description, BigDecimal amount, String currency) {
        this.name = name;
        this.description = description;
        this.amount = amount;
        // Si no se proporciona currency, se usará "€"
        this.currency = (currency != null && !currency.isEmpty()) ? currency : "€";
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        // Si se recibe un valor nulo o vacío, se establece el valor por defecto
        this.currency = (currency != null && !currency.isEmpty()) ? currency : "€";
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}

