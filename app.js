// > cambiar "type": "module" para hacerlos funcionar <
// import express from 'express';
// import path from 'path';
// import Jimp from 'jimp';
// import { v4 as uuidv4 } from 'uuid'; 

const express = require('express');
const path = require('path');
const Jimp = require('jimp');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/procesar-imagen', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const image = await Jimp.read(imageUrl);

        image.greyscale().resize(350, Jimp.AUTO); // atributos para la imagen de respuesta 

        const imageName = uuidv4().slice(0,6) + '.jpg'; //.slice para limitar los carácteresdel UUID

        await image.writeAsync(path.join(__dirname, 'public', 'images', imageName));

        res.sendFile(path.join(__dirname, 'public', 'images', imageName)); //respuesta con la imagen editada
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar la imagen.');
    }
});

app.listen(port, () => {
    console.log(`Servidor inicializado en el puerto ${port}`);
});
