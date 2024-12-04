// Importa los módulos necesarios: 'fs' para operaciones con el sistema de archivos, 
// 'axios' para hacer solicitudes HTTP, y las funciones de 'inquirer' y la clase 'Busquedas'.
const fs = require('fs');
const axios = require('axios');
const { leerInput, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./Models/busqueda');

// Requiere el módulo 'colors' para añadir colores a las salidas en la consola.
require('colors');

// Función principal asíncrona donde se maneja la lógica del programa.
const main = async () => {
    const busquedas = new Busquedas();  // Crea una nueva instancia de la clase Busquedas.
    
    // Limpia la consola para que no haya información previa visible.
    console.clear();
    
    // Muestra un encabezado para el menú de entrada, con colores.
    console.log('=========================='.green);
    console.log('  Escriba una ciudad'.red);
    console.log('==========================\n'.green);

    // Pide al usuario que ingrese el nombre de una ciudad.
    const termino = await leerInput('Ciudad: ');

    // Muestra en consola el término ingresado por el usuario (opcional).
    console.log(termino);

    // Llama a la función 'ciudad' de la clase Busquedas para buscar lugares relacionados con el término ingresado.
    const lugares = await busquedas.ciudad(termino);

    // Muestra una lista de lugares para que el usuario seleccione uno.
    const id = await listarLugares(lugares);

    // Encuentra el lugar seleccionado en la lista de lugares usando el ID.
    const lugarSel = lugares.find(l => l.id === id);

    // Llama a la función 'climaLugar' para obtener el clima del lugar seleccionado.
    const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

    // Limpia la consola antes de mostrar los resultados finales.
    console.clear();

    // Muestra la información obtenida de la ciudad y el clima en la consola.
    console.log('\nInformación de la ciudad\n'.green);
    console.log('Ciudad:', lugarSel.nombre.green);
    console.log('Lat:', lugarSel.lat);
    console.log('Lng:', lugarSel.lng);
    console.log('Temperatura:', clima.temp);
    console.log('Mínima:', clima.min);
    console.log('Máxima:', clima.max);
    console.log('Como está el clima:', clima.desc.green);
}

// Llama a la función principal para iniciar la ejecución del programa.
main();
