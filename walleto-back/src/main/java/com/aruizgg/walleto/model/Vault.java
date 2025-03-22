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

    public String getname() {
        return name;
    }

    public void setname(String name) {
        this.name = name;
    }

    public String getdescription() {
        return description;
    }

    public void setdescription(String description) {
        this.description = description;
    }

    public BigDecimal getamount() {
        return amount;
    }

    public void setamount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getcurrency() {
        return currency;
    }

    public void setcurrency(String currency) {
        // Si se recibe un valor nulo o vacío, se establece el valor por defecto
        this.currency = (currency != null && !currency.isEmpty()) ? currency : "€";
    }
}

