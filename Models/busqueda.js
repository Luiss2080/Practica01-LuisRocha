// Importa el módulo 'fs' para interactuar con el sistema de archivos (leer/escribir archivos).
const fs = require('fs'); 
// Importa 'axios' para realizar solicitudes HTTP a APIs externas.
const axios = require('axios');

// Define la clase 'Busquedas' que gestionará la búsqueda de lugares y su clima.
class Busquedas {

    historial = [];  // Historial de lugares buscados.
    dbPath = './db/database.json';  // Ruta donde se almacenará el historial de búsquedas.

    constructor() {
        this.leerDB();  // Llama al método para leer el historial desde la base de datos al iniciar.
    }

    // Getter que devuelve el historial con los nombres de los lugares capitalizados.
    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');  // Divide el lugar en palabras.

            // Aseguramos que cada palabra es una cadena no vacía y válida.
            palabras = palabras.map(p => {
                // Verificamos que 'p' es una cadena no vacía.
                if (typeof p === 'string' && p.trim().length > 0) {
                    return p[0].toUpperCase() + p.substring(1);  // Capitaliza la primera letra.
                }
                return '';  // Si no es una cadena válida, devolvemos una cadena vacía.
            });

            return palabras.join(' ');  // Une las palabras capitalizadas en una sola cadena.
        });
    }

    // Getter que devuelve los parámetros necesarios para realizar la consulta a la API de Mapbox.
    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY || 'pk.eyJ1IjoibHVpc3M5OTAiLCJhIjoiY200MjI2MHh0MXNscDJscHl4ODY3bWViZSJ9.P9bFBngyAcpWhLC7-dlqXA',  // Token de acceso a la API de Mapbox.
            'limit': 10,  // Límite de resultados a mostrar.
            'language': 'es'  // Idioma de la consulta.
        };
    }

    // Getter que devuelve los parámetros necesarios para la consulta a la API de OpenWeatherMap.
    get paramsWeather() {
        return {
            appid: '9393cf72fe220417868cc3df405d806b',  // Clave de la API de OpenWeatherMap.
            units: 'metric',  // Unidades de temperatura en grados Celsius.
            lang: 'es'  // Idioma de la consulta.
        };
    }

    // Método que obtiene información sobre una ciudad utilizando la API de Mapbox.
    async ciudad(lugar = '') {
        try {
            // Petición HTTP a la API de Mapbox con la información de la ciudad solicitada.
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();  // Realiza la solicitud y espera la respuesta.
            return resp.data.features.map(lugar => ({  // Mapea los resultados de la búsqueda.
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],  // Longitud.
                lat: lugar.center[1],  // Latitud.
            }));
        } catch (error) {
            console.error('Error al obtener la ciudad:', error);  // Si hay un error, se captura y se imprime.
            return [];  // Retorna un arreglo vacío si no se obtiene la ciudad.
        }
    }

    // Método que obtiene el clima de un lugar utilizando la API de OpenWeatherMap.
    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,  // URL base para obtener el clima.
                params: { ...this.paramsWeather, lat, lon }  // Pasa los parámetros necesarios para la consulta.
            });
            const resp = await instance.get();  // Realiza la solicitud y espera la respuesta.
            const { weather, main } = resp.data;  // Extrae la información relevante de la respuesta.
            return {
                desc: weather[0].description,  // Descripción del clima.
                min: main.temp_min,  // Temperatura mínima.
                max: main.temp_max,  // Temperatura máxima.
                temp: main.temp  // Temperatura actual.
            };
        } catch (error) {
            console.error('Error al obtener el clima:', error);  // Captura errores de la solicitud.
            return null;  // Retorna null si no se pudo obtener el clima.
        }
    }

    // Método para agregar un lugar al historial, evitando duplicados.
    agregarHistorial(lugar = '') {
        // Evita agregar duplicados, comparando el lugar con los ya existentes en el historial.
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        // Si no existe, lo agrega al principio del historial.
        this.historial.unshift(lugar.toLocaleLowerCase());
        // Guarda el historial actualizado en el archivo JSON.
        this.guardarDB();
    }

    // Método para guardar el historial en el archivo de base de datos (JSON).
    guardarDB() {
        const payload = {
            historial: this.historial  // Objeto que contiene el historial.
        };
        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(payload));  // Escribe el objeto en el archivo JSON.
        } catch (error) {
            console.error('Error al guardar en la base de datos:', error);  // Si ocurre un error, lo captura e imprime.
        }
    }

    // Método que lee el archivo de base de datos y carga el historial en la clase.
    leerDB() {
        // Si el archivo no existe, no hace nada.
        if (!fs.existsSync(this.dbPath)) return;

        try {
            // Lee el archivo de base de datos y lo convierte en objeto.
            const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
            const data = JSON.parse(info);
            this.historial = data.historial;  // Carga el historial desde el archivo.
        } catch (error) {
            console.error('Error al leer la base de datos:', error);  // Si hay un error al leer, lo captura.
        }
    }
}

// Exporta la clase 'Busquedas' para ser utilizada en otros archivos.
module.exports = Busquedas;
