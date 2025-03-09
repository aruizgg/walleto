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
    private String nombre;

    @Column(length = 255)
    private String descripcion; // Campo opcional

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal cantidad;

    @Column(nullable = false)
    private String moneda = "€"; // Valor por defecto

    // Constructores
    public Vault() {
    }

    public Vault(String nombre, String descripcion, BigDecimal cantidad, String moneda) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        // Si no se proporciona moneda, se usará "€"
        this.moneda = (moneda != null && !moneda.isEmpty()) ? moneda : "€";
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getCantidad() {
        return cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        // Si se recibe un valor nulo o vacío, se establece el valor por defecto
        this.moneda = (moneda != null && !moneda.isEmpty()) ? moneda : "€";
    }
}

