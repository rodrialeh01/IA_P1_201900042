package com.pra1.api.Controllers;

import com.google.cloud.vision.v1.*;
import com.pra1.api.Models.Cara;
import com.pra1.api.Models.Contenido;
import com.pra1.api.Models.ResponseDataObject;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import com.google.cloud.vision.v1.Feature.Type;
import com.google.protobuf.ByteString;

import com.pra1.api.Models.Coordenadas;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/analizar")
public class VisionController {

    @PostMapping
    public ResponseDataObject analyzeImage(@RequestParam("file") MultipartFile file) throws Exception {
        try (ImageAnnotatorClient vision = ImageAnnotatorClient.create()) {

            ByteString imgBytes = ByteString.copyFrom(file.getBytes());

            // Builds the image annotation request
            List<AnnotateImageRequest> requests1 = new ArrayList<>();
            List<AnnotateImageRequest> requests2 = new ArrayList<>();
            Image img = Image.newBuilder().setContent(imgBytes).build();
            Feature feat1 = Feature.newBuilder().setType(Type.FACE_DETECTION).build();
            Feature feat2 = Feature.newBuilder().setType(Type.SAFE_SEARCH_DETECTION).build();
            AnnotateImageRequest request1 = AnnotateImageRequest.newBuilder().addFeatures(feat1).setImage(img).build();
            AnnotateImageRequest request2 = AnnotateImageRequest.newBuilder().addFeatures(feat2).setImage(img).build();
            requests1.add(request1);
            requests2.add(request2);

            // Detección Caras
            BatchAnnotateImagesResponse response1 = vision.batchAnnotateImages(requests1);
            List<AnnotateImageResponse> responses1 = response1.getResponsesList();
            LinkedList<Cara> caras = new LinkedList<>();
            ResponseDataObject fd = new ResponseDataObject();
            for (AnnotateImageResponse res : responses1) {
                if (res.hasError()) {
                    System.out.format("Error: %s%n", res.getError().getMessage());
                    return new ResponseDataObject(); // Devuelve una lista vacía si hay un error
                }
                for (FaceAnnotation annotation : res.getFaceAnnotationsList()) {
                    LinkedList<Coordenadas> coordenadas = new LinkedList<>();
                    for(Vertex v : annotation.getFdBoundingPoly().getVerticesList()){
                        Coordenadas c = new Coordenadas(v.getX(),v.getY());
                        coordenadas.add(c);
                    }
                    Cara cara = new Cara(coordenadas);
                    caras.add(cara);
                }
            }
            fd.setCantidad_caras(caras.size());
            fd.setCaras(caras);

            //Detección Labels
            BatchAnnotateImagesResponse response2 = vision.batchAnnotateImages(requests2);
            List<AnnotateImageResponse> responses2 = response2.getResponsesList();
            for (AnnotateImageResponse res : responses2) {
                if (res.hasError()) {
                    System.out.format("Error: %s%n", res.getError().getMessage());
                    return new ResponseDataObject(); // Devuelve una lista vacía si hay un error
                }

                SafeSearchAnnotation annotation = res.getSafeSearchAnnotation();
                Contenido c = new Contenido();
                System.out.println(annotation);
                switch (annotation.getAdult().toString()){
                    case "VERY_UNLIKELY":
                        c.setAdulto(0);
                        break;
                    case "UNLIKELY":
                        c.setAdulto(20);
                        break;
                    case "POSSIBLE":
                        c.setAdulto(35);
                        break;
                    case "LIKELY":
                        c.setAdulto(60);
                        break;
                    case "VERY_LIKELY":
                        c.setAdulto(80);
                        break;
                }
                System.out.println(annotation.getAdult().toString());
                switch (annotation.getMedical().toString()){
                    case "VERY_UNLIKELY":
                        c.setMedico(0);
                        break;
                    case "UNLIKELY":
                        c.setMedico(20);
                        break;
                    case "POSSIBLE":
                        c.setMedico(35);
                        break;
                    case "LIKELY":
                        c.setMedico(60);
                        break;
                    case "VERY_LIKELY":
                        c.setMedico(80);
                        break;
                }
                System.out.println(annotation.getMedical().toString());
                switch (annotation.getViolence().toString()){
                    case "VERY_UNLIKELY":
                        c.setViolencia(0);
                        break;
                    case "UNLIKELY":
                        c.setViolencia(20);
                        break;
                    case "POSSIBLE":
                        c.setViolencia(35);
                        break;
                    case "LIKELY":
                        c.setViolencia(60);
                        break;
                    case "VERY_LIKELY":
                        c.setViolencia(80);
                        break;
                }
                System.out.println(annotation.getViolence().toString());
                switch (annotation.getSpoof().toString()){
                    case "VERY_UNLIKELY":
                        c.setParodia(0);
                        break;
                    case "UNLIKELY":
                        c.setParodia(20);
                        break;
                    case "POSSIBLE":
                        c.setParodia(35);
                        break;
                    case "LIKELY":
                        c.setParodia(60);
                        break;
                    case "VERY_LIKELY":
                        c.setParodia(80);
                        break;
                }
                System.out.println(annotation.getSpoof().toString());
                switch (annotation.getRacy().toString()){
                    case "VERY_UNLIKELY":
                        c.setPicante(0);
                        break;
                    case "UNLIKELY":
                        c.setPicante(20);
                        break;
                    case "POSSIBLE":
                        c.setPicante(35);
                        break;
                    case "LIKELY":
                        c.setPicante(60);
                        break;
                    case "VERY_LIKELY":
                        c.setPicante(80);
                        break;
                }
                System.out.println(annotation.getRacy().toString());
                fd.setContenido(c);
            }

            return fd;
        }
    }

}
