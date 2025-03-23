package com.aruizgg.walleto.request;

import java.math.BigDecimal;
import java.util.Date;

public class TransactionRequest {
    private Long vaultSourceId;
    private Long vaultDestinationId;
    private BigDecimal amount;
    private Date date;
    private String description;

    // Getters y setters
    public Long getVaultSourceId() {
        return vaultSourceId;
    }

    public void setVaultSourceId(Long vaultSourceId) {
        this.vaultSourceId = vaultSourceId;
    }

    public Long getVaultDestinationId() {
        return vaultDestinationId;
    }

    public void setVaultDestinationId(Long vaultDestinationId) {
        this.vaultDestinationId = vaultDestinationId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

