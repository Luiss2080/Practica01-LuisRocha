// Importa el módulo 'inquirer' para interactuar con el usuario desde la consola.
const inquirer = require('inquirer'); 

// Extiende funcionalidades con colores para el texto en consola.
require('colors'); 

// Define un conjunto de preguntas para mostrar al usuario en un menú principal.
const preguntas = [
    {
        type: 'list', // Tipo de entrada, en este caso, una lista para seleccionar opciones.
        name: 'opcion', // Nombre de la respuesta seleccionada, que se usará para obtener el valor.
        message: '¿Qué desea hacer?', // Mensaje que se muestra al usuario.
        choices: [ // Opciones disponibles en el menú.
            { value: 1, name: `${'1.'.green} Buscar ciudad` }, // Opción 1: Buscar ciudad, con número en color verde.
            { value: 2, name: `${'2.'.green} Historial` }, // Opción 2: Ver historial.
            { value: 0, name: `${'0.'.green} Salir` }, // Opción 0: Salir del programa.
        ]
    }
];

// Muestra el menú principal y retorna la opción seleccionada por el usuario.
const inquirerMenu = async () => {
    console.clear(); // Limpia la consola para una mejor visualización.
    console.log('=========================='.green); // Encabezado decorativo con texto verde.
    console.log('  Seleccione una opción'.white); // Título del menú en blanco.
    console.log('==========================\n'.green); // Línea decorativa final.
    const { opcion } = await inquirer.prompt(preguntas); // Muestra el menú y espera una respuesta.
    return opcion; // Devuelve la opción seleccionada.
}

// Pausa la ejecución hasta que el usuario presione "Enter".
const pausa = async () => {
    const question = [
        {
            type: 'input', // Tipo de entrada de texto.
            name: 'enter', // Nombre de la respuesta, aunque no se usa aquí.
            message: `Presione ${'enter'.green} para continuar` // Mensaje indicando al usuario qué hacer.
        }
    ];
    console.log('\n'); // Imprime una línea vacía para separar visualmente.
    await inquirer.prompt(question); // Espera a que el usuario presione "Enter".
}

// Solicita al usuario ingresar un texto con validación.
const leerInput = async (message) => {
    const question = [
        {
            type: 'input', // Tipo de entrada de texto.
            name: 'desc', // Nombre del valor ingresado.
            message, // Mensaje personalizado que se muestra al usuario.
            validate(value) { // Valida que el usuario haya ingresado algo.
                if (value.length === 0) { // Si no hay texto, retorna un mensaje de error.
                    return 'Por favor ingrese un valor';
                }
                return true; // Si hay texto, pasa la validación.
            }
        }
    ];
    const { desc } = await inquirer.prompt(question); // Espera la respuesta del usuario.
    return desc; // Devuelve el valor ingresado.
}

// Muestra una lista de lugares y permite seleccionar uno.
const listarLugares = async (lugares = []) => {
    const choices = lugares.map((lugar, i) => { // Mapea los lugares para crear opciones en formato lista.
        const idx = `${i + 1}.`.green; // Número de la opción en color verde.
        return {
            value: lugar.id, // Valor asociado a la opción.
            name: `${idx} ${lugar.nombre}` // Texto mostrado para la opción.
        }
    });
    choices.unshift({ // Inserta una opción para cancelar al inicio de la lista.
        value: '0',
        name: '0.'.green + ' Cancelar'
    });
    const preguntas = [
        {
            type: 'list', // Tipo de entrada, lista desplegable.
            name: 'id', // Nombre del valor seleccionado.
            message: 'Seleccione lugar:', // Mensaje mostrado al usuario.
            choices // Opciones generadas dinámicamente.
        }
    ]
    const { id } = await inquirer.prompt(preguntas); // Muestra la lista y espera la respuesta.
    return id; // Devuelve el id del lugar seleccionado.
}

// Solicita confirmación al usuario con una pregunta de tipo "sí" o "no".
const confirmar = async (message) => {
    const question = [
        {
            type: 'confirm', // Entrada de tipo confirmación.
            name: 'ok', // Nombre de la respuesta.
            message // Mensaje personalizado mostrado al usuario.
        }
    ];
    const { ok } = await inquirer.prompt(question); // Espera la respuesta del usuario.
    return ok; // Devuelve el valor booleano de la confirmación.
}

// Muestra una lista de tareas con opción de seleccionar múltiples elementos.
const mostrarListadoChecklist = async (tareas = []) => {
    const choices = tareas.map((tarea, i) => { // Mapea las tareas para crear opciones.
        const idx = `${i + 1}.`.green; // Número de la opción en color verde.
        return {
            value: tarea.id, // Valor asociado a la opción.
            name: `${idx} ${tarea.desc}`, // Texto mostrado para la opción.
            checked: (tarea.completadoEn) ? true : false // Marca la tarea si está completada.
        }
    });
    const pregunta = [
        {
            type: 'checkbox', // Tipo de entrada, permite múltiples selecciones.
            name: 'ids', // Nombre del array con las opciones seleccionadas.
            message: 'Selecciones', // Mensaje mostrado al usuario.
            choices // Opciones generadas dinámicamente.
        }
    ]
    const { ids } = await inquirer.prompt(pregunta); // Muestra la lista y espera las respuestas.
    return ids; // Devuelve un array con los valores seleccionados.
}

// Exporta las funciones definidas para que puedan ser utilizadas en otros archivos.
module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}
