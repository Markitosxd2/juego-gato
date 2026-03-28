        // Referencias a elementos del HTML
        var canvas = document.getElementById("lienzo");
        var ctx = canvas.getContext("2d");
        var inputFila = document.getElementById("tamano");
        var mensaje = document.getElementById("mensaje");
        var empezar = document.getElementById("configuracion");
        var nuevoJuego = document.getElementById("nuevoJuego");

        // Variables globales
        var fila;
        var tamCuadro;
        var gato;
        var turno = 1;
        var juegoTerminado = false;

        // Inicializa el arreglo del juego con ceros
        function inicia(){
            gato = new Array(fila);
            for(let i = 0; i<fila; i++){
                gato[i] = new Array(fila);
                for(let j = 0; j<fila; j++){
                    gato[i][j]= 0;
                }
            }
        }

        // Limpia el canvas y reinicia el juego
        function limpia() {
            ctx.beginPath();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fill();
            juegoTerminado = false;
            turno = 1;
            canvas.style.display = "none";
            mensaje.textContent = "";
            nuevoJuego.style.display = "none";
            empezar.style.display = "block";
        }

        // Muestra el estado actual del juego en la consola
        function showGato(){
            for(let i = 0; i<fila; i++){
                for(let j = 0; j<fila; j++){
                    console.log(gato[i][j] + "\t");
                }
                console.log("\n");
            }
        }

        // Dibuja el tablero y prepara el juego
        function dibuja() {
            fila = inputFila.value;
            if(fila<3 || fila>7){
                mensaje.textContent = "Ingrese un número entre el 3 y el 7 para jugar";
            }else{
                inicia()
                tamCuadro = canvas.width/fila;
                nuevoJuego.style.display = "block";
                empezar.style.display = "none";
                ctx.restore();
                ctx.beginPath();
                    for(let i = 1; i<fila; i++){
                        ctx.moveTo(i*tamCuadro,0);
                        ctx.lineTo(i*tamCuadro, canvas.width);
                        ctx.moveTo(0,i*tamCuadro);
                        ctx.lineTo(canvas.width, i*tamCuadro);
                        ctx.lineWidth = 5;
                    }
                ctx.stroke();
                ctx.save();
                mensaje.textContent = "Turno del jugador: Tache";
                canvas.style.display = "block";
                inicia();
                showGato();
            }
        }

        // Dibuja una "X" en la posición dada
        function tache(px,py){
            ctx.beginPath();
                // Línea diagonal de izquierda a derecha
                ctx.moveTo((px*tamCuadro)+(tamCuadro*.1),(py*tamCuadro)+(tamCuadro*.1));
                ctx.lineTo((px*tamCuadro)+(tamCuadro*.9),(py*tamCuadro)+(tamCuadro*.9));
                // Línea diagonal de derecha a izquierda
                ctx.moveTo((px*tamCuadro)+(tamCuadro*.9),(py*tamCuadro)+(tamCuadro*.1));
                ctx.lineTo((px*tamCuadro)+(tamCuadro*.1),(py*tamCuadro)+(tamCuadro*.9));
                ctx.strokeStyle = "#0000aa"
            ctx.stroke();
        }

        // Dibuja un círculo en la posición dada
        function circulo(px,py){
            ctx.beginPath();
                ctx.arc((px*tamCuadro)+(tamCuadro/2),(py*tamCuadro)+(tamCuadro/2),tamCuadro*.4,0,Math.PI*2);
                ctx.strokeStyle = "#00ff00";
            ctx.stroke();
        }

        // Obtiene la posición del mouse relativa al canvas
        function getMousePos(evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: Math.floor(evt.clientX - rect.left),
                y: Math.floor(evt.clientY - rect.top)
            };
        }

        // Maneja el evento de clic en el canvas para colocar una figura
        function position(){
            var pos = getMousePos(event);
            var px = Math.floor(pos.x/tamCuadro)
            var py = Math.floor(pos.y/tamCuadro);

            if(!juegoTerminado){
                if(gato[py][px] == 0){
                    mensaje.textContent = "Turno del jugador: " + (turno%2 == 0 ? "Tache" : "Circulo");
                    if(turno%2 == 0){
                        gato[py][px] = 2;
                        circulo(px,py);
                        showGato();
                        valida(2, "Circulo");
                    }else{
                        gato[py][px] = 1;
                        tache(px,py);
                        showGato();
                        valida(1, "Tache");
                    }
                }else{
                    alert("Casilla ocupada, elige otra");
                }
            }else{
                alert("Juego terminado, inicia uno nuevo");
            }
        }

        // Valida si un jugador ha ganado después de cada movimiento
        function valida(jugador, ganador){
            var band = false;
            var band2 = false;

            // Valida filas
            for(let i = 0; i<fila;i++){
                for(let j = 0; j<fila;j++){
                    if(gato[i][j] == jugador){
                        band = true;
                    }else{
                        band = false;
                        break;
                    }
                }
                if(band){
                    band2 = true;
                    // Dibuja una línea roja sobre la fila ganadora
                    ctx.beginPath();
                        ctx.moveTo(0,(i*tamCuadro)+(tamCuadro/2));
                        ctx.lineTo(canvas.width,(i*tamCuadro)+(tamCuadro/2));
                        ctx.strokeStyle="#ff0000";
                    ctx.stroke();
                    break;
                }
            }

            // Valida columnas
            if(!band2){
                for(let i = 0; i<fila;i++){
                    for(let j = 0; j<fila;j++){
                        if(gato[j][i] == jugador){
                            band = true;
                        }else{
                            band = false;
                            break;
                        }
                    }
                    if(band){
                        band2 = true;
                        // Dibuja una línea roja sobre la columna ganadora  
                        ctx.beginPath();
                            ctx.moveTo((i*tamCuadro)+(tamCuadro/2),0);
                            ctx.lineTo((i*tamCuadro)+(tamCuadro/2),canvas.width);
                            ctx.strokeStyle="#ff0000";
                        ctx.stroke();
                        break;
                    }
                }
                
                // Valida diagonales (izquierda a derecha)
                if(!band2){
                    for(let i = 0; i<fila;i++){
                        if(gato[i][i] == jugador){
                            band = true;
                        }else{
                            band = false;
                            break;
                        }
                    }
                    band2 = band;
                    if(band2){
                        // Dibuja una línea roja sobre la diagonal ganadora
                        ctx.beginPath();
                            ctx.moveTo(0,0);
                            ctx.lineTo(canvas.width,canvas.width);
                            ctx.strokeStyle="#ff0000";
                        ctx.stroke();
                    }
                }

                // Valida diagonales (derecha a izquierda)
                if(!band2){
                    for(let i = 0, a = fila-1; i<fila && a>=0; i++ , a--){
                        if(gato[a][i] == jugador){
                            band = true;
                        }else{
                            band = false;
                            break;
                        }
                    }
                    band2 = band;
                    if(band2){
                        // Dibuja una línea roja sobre la diagonal ganadora
                        ctx.beginPath();
                            ctx.moveTo(0,canvas.width);
                            ctx.lineTo(canvas.width,0);
                            ctx.strokeStyle="#ff0000";
                        ctx.stroke();
                    }
                }
            }

            if(band2){
                    mensaje.textContent = ganador + " gana!";
                    juegoTerminado = true;
            } else if(turno == fila*fila){
                juegoTerminado = true;
                mensaje.textContent = "Tablas!";
            }else{
                turno++;
            }
    }
