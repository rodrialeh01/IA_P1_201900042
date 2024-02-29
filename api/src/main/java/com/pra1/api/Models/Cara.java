package com.pra1.api.Models;

import java.util.LinkedList;

public class Cara {
    private LinkedList<Coordenadas> cuadro;

    public Cara(LinkedList<Coordenadas> cuadro) {
        this.cuadro = cuadro;
    }

    public LinkedList<Coordenadas> getCuadro() {
        return cuadro;
    }

    public void setCuadro(LinkedList<Coordenadas> cuadro) {
        this.cuadro = cuadro;
    }
}
