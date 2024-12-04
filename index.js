// Carga las variables de entorno desde un archivo .env
require('dotenv').config() 

// Importa funciones necesarias desde el archivo 'inquirer.js' y la clase 'Busquedas' desde 'Models/busqueda'.
const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./Models/busqueda');

// Función principal asíncrona donde se maneja el flujo del programa.
const main = async() => {
    const busquedas = new Busquedas();  // Crea una nueva instancia de la clase Busquedas.
    let opt;  // Variable para almacenar la opción seleccionada por el usuario.
    
    // Bucle principal que se ejecuta hasta que el usuario seleccione la opción 0 (Salir).
    do {
        // Muestra el menú y guarda la opción seleccionada por el usuario.
        opt = await inquirerMenu();       

        switch(opt) {
            case 1:
                // Si la opción es 1, pide al usuario que ingrese el nombre de la ciudad.
                const termino = await leerInput('Ciudad: ');

                // Llama a la función ciudad() para buscar lugares que coincidan con el término ingresado.
                const lugares = await busquedas.ciudad(termino);

                // Muestra una lista de lugares para que el usuario seleccione uno.
                const id = await listarLugares(lugares);

                // Si el usuario selecciona '0' (Cancelar), continúa con el siguiente ciclo del bucle.
                if (id === '0') continue;

                // Encuentra el lugar seleccionado a partir del ID.
                const lugarSel = lugares.find(l => l.id === id);

                // Agrega el lugar seleccionado al historial de búsquedas.
                busquedas.agregarHistorial(lugarSel.nombre);

                // Obtiene el clima del lugar seleccionado (usando latitud y longitud).
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                // Muestra la información obtenida en la consola.
                console.clear();  // Limpia la consola antes de mostrar la nueva información.
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como está el clima:', clima.desc.green);
            break;

            case 2:
                // Si la opción es 2, muestra el historial de búsquedas, capitalizado.
                busquedas.historialCapitalizado.forEach( (lugar, i) =>  {
                    const idx = `${ i + 1 }.`.green;  // Prepara el índice para mostrarlo con color verde.
                    console.log(`${ idx } ${ lugar } `);  // Muestra cada lugar del historial.
                })
            break;
        }

        // Si la opción no es 0 (Salir), espera que el usuario presione Enter para continuar.
        if (opt !== 0) await pausa();

    } while (opt !== 0)  // El bucle sigue ejecutándose mientras la opción no sea 0 (Salir).
}

// Llama a la función principal para iniciar la ejecución del programa.
main();
