package com.aruizgg.walleto.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    //private String category;

    private String description;

    @Column(nullable = false)
    private Date date;

    @ManyToOne
    @JoinColumn(name = "vault_source_id")
    private Vault vaultSource;

    @ManyToOne
    @JoinColumn(name = "vault_destination_id")
    private Vault vaultDestination;

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Vault getVaultSource() {
        return vaultSource;
    }

    public void setVaultSource(Vault vaultSource) {
        this.vaultSource = vaultSource;
    }

    public Vault getVaultDestination() {
        return vaultDestination;
    }

    public void setVaultDestination(Vault vaultDestination) {
        this.vaultDestination = vaultDestination;
    }
}
