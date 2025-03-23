package com.aruizgg.walleto.repository;

import com.aruizgg.walleto.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByDateBetween(Date startDate, Date endDate);

    @Query("SELECT DISTINCT t.date FROM Transaction t")
    List<Date> findDistinctYears();
}

