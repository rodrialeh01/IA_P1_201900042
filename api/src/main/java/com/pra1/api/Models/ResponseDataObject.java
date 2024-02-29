package com.pra1.api.Models;

import java.util.List;

public class ResponseDataObject {
    private List<Cara> caras;
    private int cantidad_caras;
    private Contenido contenido;

    public ResponseDataObject() {
    }

    public int getCantidad_caras() {
        return cantidad_caras;
    }

    public void setCantidad_caras(int cantidad_caras) {
        this.cantidad_caras = cantidad_caras;
    }

    public List<Cara> getCaras() {
        return caras;
    }

    public void setCaras(List<Cara> caras) {
        this.caras = caras;
    }

    public Contenido getContenido() {
        return contenido;
    }

    public void setContenido(Contenido contenido) {
        this.contenido = contenido;
    }
}
