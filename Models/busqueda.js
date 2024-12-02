const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');

            // Aseguramos que cada palabra es una cadena no vacía y válida
            palabras = palabras.map(p => {
                // Verificamos que 'p' es una cadena no vacía
                if (typeof p === 'string' && p.trim().length > 0) {
                    return p[0].toUpperCase() + p.substring(1);  // Capitaliza la primera letra
                }
                return '';  // Si no es una cadena válida, devolvemos una cadena vacía
            });

            return palabras.join(' ');  // Unimos las palabras capitalizadas en una sola cadena
        });
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY || 'pk.eyJ1IjoibHVpc3M5OTAiLCJhIjoiY200MjI2MHh0MXNscDJscHl4ODY3bWViZSJ9.P9bFBngyAcpWhLC7-dlqXA',  
            'limit': 10, 
            'language': 'es'
        };
    }

    get paramsWeather() {
        return {
            appid: '9393cf72fe220417868cc3df405d806b',  
            units: 'metric', 
            lang: 'es'
        };
    }

    async ciudad(lugar = '') {
        try {
            // Petición http a Mapbox API
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {
            console.error('Error al obtener la ciudad:', error);
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon }
            });
            const resp = await instance.get();
            const { weather, main } = resp.data;
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };
        } catch (error) {
            console.error('Error al obtener el clima:', error);
            return null;  // Devolvemos null si no se pudo obtener el clima
        }
    }

    agregarHistorial(lugar = '') {
        // Evita agregar duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        // Si no existe en el historial, lo agrega al principio
        this.historial.unshift(lugar.toLocaleLowerCase());
        // Grabar en la base de datos (archivo JSON)
        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial
        };
        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(payload));  // Escribe el archivo
        } catch (error) {
            console.error('Error al guardar en la base de datos:', error);
        }
    }

    leerDB() {
        // Si el archivo no existe, retorna sin hacer nada
        if (!fs.existsSync(this.dbPath)) return;

        try {
            // Lee el archivo de la base de datos
            const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
            const data = JSON.parse(info);
            this.historial = data.historial;  // Carga el historial desde el archivo
        } catch (error) {
            console.error('Error al leer la base de datos:', error);
        }
    }
}

module.exports = Busquedas;
