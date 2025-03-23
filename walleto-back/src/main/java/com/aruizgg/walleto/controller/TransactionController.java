package com.aruizgg.walleto.controller;

import com.aruizgg.walleto.model.Transaction;
import com.aruizgg.walleto.request.TransactionRequest;
import com.aruizgg.walleto.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Endpoint para crear un ingreso
    @PostMapping("/income")
    public ResponseEntity<Transaction> createIncome(@RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.createIncome(request.getVaultSourceId(), request.getAmount(), request.getDescription(), request.getDate());
        return ResponseEntity.ok(transaction);
    }

    // Endpoint para crear un gasto
    @PostMapping("/expense")
    public ResponseEntity<Transaction> createExpense(@RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.createExpense(request.getVaultSourceId(), request.getAmount(), request.getDescription(), request.getDate());
        return ResponseEntity.ok(transaction);
    }

    // Endpoint para crear una transferencia
    @PostMapping("/transfer")
    public ResponseEntity<Transaction> createTransfer(@RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.createTransfer(request.getVaultSourceId(), request.getVaultDestinationId(), request.getAmount(), request.getDescription(), request.getDate());
        return ResponseEntity.ok(transaction);
    }
}

