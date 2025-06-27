// Función para comezar la partida y mostrar la configuración de la partida

let modo_juego; 
let num_jugadores; 
let jugadores; 
let jugadoract; 
let ronda;
let pregunta;
let expresion;
let crear_ranking;

function show_config() {
    document.getElementById("Iniciar_Cfg").style.display = "none";
    document.getElementById("cfg_partida").style.display = "block";
}

function cfg_validation() {
     modo_juego = parseInt(document.getElementById("Modos_juego").value);
     num_jugadores = parseInt(document.getElementById("numero_jugadores").value);
     jugadores = [];

    for (let i = 1; i <= num_jugadores; i++) {
        let intro_nombre = prompt("Introduce el nombre del jugador " + i + ": ");

        if (!intro_nombre || intro_nombre.trim() === '') {
            alert("Alerta: Debes introducir un nombre para el jugador " + i);
            return false;
        }
        jugadores.push({intro_nombre: intro_nombre, puntos: 0});
    }
    return true;

}

function Iniciar_Partida () {
    if (cfg_validation()) {
        document.getElementById("cfg_partida").style.display = "none";
        document.getElementById("mostrar_ranking").style.display = "block";
        ronda = 1;
        jugadoract = 0;
        pregunta = crear_preguntas(modo_juego * num_jugadores);
        mostrar_tabla();
        info_partida();
        show_pregunta();   
    }
}

function crear_preguntas(numero_preguntas) {
    let pregunta = [];

    for (let i = 0; i < numero_preguntas; i++ ) {
        let expresion = crear_expresion();
        pregunta.push({expresion: expresion, intro_respuesta: eval(expresion)})
    }
    return pregunta;
}

function crear_expresion() {
    expresion = "";

    let Numero_operandos = Math.floor(Math.random() * 5) + 4;

    for(let i = 0; i < Numero_operandos; i++) {
        let operandos = Math.floor(Math.random() * 11) + 2;
        let operadores = Math.random() < 0.5 ? "+" : "*"
        expresion += operandos + (i < Numero_operandos - 1 ? " " + operadores + " " : "");
    }
    return expresion;
}

function mostrar_tabla () {
    let tabla = "<tr><th>Ronda</th>";

    jugadores.forEach( player => {
        tabla+= "<th>" + player.intro_nombre + "</th>";
    });

    tabla += "</tr>";

    for(let i = 1; i <= modo_juego; i++) {
        tabla += "<tr><td>" + i + "</td>";

        jugadores.forEach(player => {
            tabla += "<td>" + player.puntos + "</td>";
        });

        tabla += "</tr>";
    }
    document.getElementById("tabla-ranking").innerHTML = tabla;
}

function info_partida() {
    document.getElementById("informacion-partida").innerHTML = "Ronda: " + ronda + "/" + modo_juego + " - Jugador actual: " + jugadores[jugadoract].intro_nombre;
}

function show_pregunta() {
    let intro_respuesta = prompt("Ronda " + ronda + "\n\nPregunta para " + jugadores[jugadoract].intro_nombre + ":\n\n" + pregunta[(ronda - 1) * num_jugadores + jugadoract].expresion);
    if (intro_respuesta === null || isNaN(intro_respuesta)) {
        alert("Debes ingresar un número como respuesta.");
        mostrarPregunta();
    } else {
        let respuesta_usr = parseInt(intro_respuesta);
        let solucion = eval(pregunta[(ronda - 1) * num_jugadores + jugadoract].intro_respuesta);
    
        if (respuesta_usr === solucion) {
            jugadores[jugadoract].puntos += 1000;
            alert("Respuesta correcta! Sumas 1000 puntos.");
        } else {
            alert("Respuesta incorrecta. La respuesta correcta era: " + solucion);
        }
        jugadoract = (jugadoract + 1) % num_jugadores;
        if (jugadoract === 0) {
            ronda++;
            if (ronda > modo_juego) {
                fin_partida();
            } else {
                mostrar_tabla();
                info_partida();
            }
        }
        show_pregunta();
    }
}

function fin_partida() {
    let puntosMax = -1;
    let jugador_ganador = "";

    jugadores.forEach(player => {
        if (player.puntos > puntosMax) {
            puntosMax = player.puntos;
            jugador_ganador = player.intro_nombre;
        }
    });

    crear_ranking = jugadores.slice().sort((a,b) => b.puntos - a .puntos);

    let tabla_ranking = "<tr> <th>Posición</th> <th>Nombre</th> <th>Puntos Totales</th> </tr>";

    crear_ranking.forEach((player, num) => {
        tabla_ranking += "<tr> <td>" + (num + 1) + "</td> <td>" + player.intro_nombre + "</td> <td>" + player.puntos + "</td> </tr>";
    });

    document.getElementById("mostrar-ranking").innerHTML = tabla_ranking;
    document.getElementById("mostrar_ranking").style.display = "none";
    document.getElementById("cfg_ranking").style.display = "block";
}

function restart() {
    location.reload();
}

function next_round() {
    if (ronda <= modo_juego) {
        mostrar_tabla();
        info_partida();
        show_pregunta();
    }
    else {
        fin_partida();
    }
}
