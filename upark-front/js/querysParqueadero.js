let dataEstacionamientos = [];
let estacionamientoActivo =  null;
let reservasCajonActivo = [];
let todasLasReservas = [];
let formReserva = document.getElementById("form-reserva");

async function cargarEstacionamientos(){
    let limiteInferior = new Date();
    let limiteSuperior = new Date();

    limiteInferior.setHours(0,0,0,0)
    limiteSuperior.setHours(24,0,0,0)

    let li = ""
    li = "" + limiteInferior.getFullYear() + "-" + (limiteInferior.getMonth()+1) + "-" + limiteInferior.getDate() + " " + limiteInferior.getHours() + ":" + limiteInferior.getMinutes() + ":" + limiteInferior.getSeconds();

    let ls = ""
    ls = "" + limiteSuperior.getFullYear() + "-" + (limiteSuperior.getMonth()+1) + "-" + limiteSuperior.getDate() + " " + limiteSuperior.getHours() + ":" + limiteSuperior.getMinutes() + ":" + limiteSuperior.getSeconds();

    let reservasCajones = {
        limiteInferior: li, 
        limiteSuperior: ls,
    }

    try{
        let response = await fetch('http://localhost:3000/getEstacionamientos',{
            method: "GET",
            headers:{
                'Content-Type' : 'application/json'
            },
        });
        let responseReservas = await fetch('http://localhost:3000/getReservas',{
            method: "POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(reservasCajones),
        });
        if(response.status==200 && responseReservas.status == 200){
            data = await response.json();
            dataReservas = await responseReservas.json();

            for(let i=0; i<data.length; i++){
                for(let j=0; j<dataReservas.length; j++){
                    if(data[i].id == dataReservas[j].fkCajon){
                        data[i].ocupado = 0;
                    }
                }
            }

            dataEstacionamientos = data;
            todasLasReservas = dataReservas;

            let Zonas = [];

            let ZonaA = [];
            let ZonaB = [];

            Zonas.push(ZonaA);
            Zonas.push(ZonaB);

            for(let i=0; i<data.length; i++){
                if(data[i].ocupado == 0){
                    data[i].ocupado = "Si";
                }else{
                    data[i].ocupado = "No";
                }
                if(data[i].zona == "Zona A"){
                    ZonaA.push(data[i])
                }
                if(data[i].zona == "Zona B"){
                    ZonaB.push(data[i])
                }
            }
            crearTarjetas(Zonas)
        }
    }catch(e){
        console.error("error", e)
    }

}

function crearTarjetas(zonas) {

    console.log(zonas)

    let estacionamientos = document.getElementById("estacionamientos");
    estacionamientos.innerHTML = "";

    let content = "";

    for(let i=0;i<zonas.length;i++){
        content += `
            <div class="zona">
                <h2>${zonas[i][0].zona}</h2>
        `
        for(let j=0;j<zonas[i].length;j++){
            content += `
                <div class="tarjetaEspacio">
                    <div class="tarjetaEspacioHeader">
                        <i class="fas fa-car"></i>
                    </div>
                    <div class="tarjetaEspacioBody">
                        <p><strong>Espacio Numero: </strong>${zonas[i][j].numCajon}</p>
                        <p><strong>Ocupado: </strong>${zonas[i][j].ocupado}</p>
                        <button onclick="mostrarModal(this)" id="${zonas[i][j].id}">Reservar</button>
                    </div>
                </div>
            `
        }
        content += `
            </div>
        `
    }
    
    estacionamientos.innerHTML = content;

}

async function mostrarModal(obj) {
    let modal = document.getElementById("modal-reserva");
    modal.style.visibility = "visible";
    estacionamientoActivo = obj.id;

    const cajon = dataEstacionamientos.find(element => element.id == estacionamientoActivo);
    //console.log(cajon)

    let limiteInferior = new Date();
    let limiteSuperior = new Date();

    limiteInferior.setHours(0,0,0,0)
    limiteSuperior.setHours(24,0,0,0)

    let li = ""
    li = "" + limiteInferior.getFullYear() + "-" + (limiteInferior.getMonth()+1) + "-" + limiteInferior.getDate() + " " + limiteInferior.getHours() + ":" + limiteInferior.getMinutes() + ":" + limiteInferior.getSeconds();

    let ls = ""
    ls = "" + limiteSuperior.getFullYear() + "-" + (limiteSuperior.getMonth()+1) + "-" + limiteSuperior.getDate() + " " + limiteSuperior.getHours() + ":" + limiteSuperior.getMinutes() + ":" + limiteSuperior.getSeconds();

    let reservasCajon = {
        idCajon: estacionamientoActivo,
        limiteInferior: li, 
        limiteSuperior: ls,
    }

    try{
        let response = await fetch('http://localhost:3000/getReservasEspecificas',{
            method: "POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(reservasCajon),
        });
        if(response.status==200){
            let data = await response.json();
            reservasCajonActivo = data;
            modal.innerHTML = "";
            let content = "";
            if(data.length != 0){
                content += `
                    <div class="modal-reserva">
                        <i class="fas fa-window-close" onclick="cerrarModal()"></i>
                        <h2>Reserva en este espacio</h2>
                        <h3>${cajon.zona}</h3>
                        <p><strong>Espacio Pedido:</strong> ${cajon.numCajon}</p>
                        <h3>Reservas activas</h3>
                `;
                for(let i = 0; i < data.length; i++){
                    let fi = new Date(data[i].fechaIngreso) 
                    let ff = new Date(data[i].fechaSalida) 
                    content += `
                        <div class="reserva-activa">
                            <h4>Reservado entre:</h4>
                            <p><strong>Hora entrada:</strong> ${""+ fi.getHours() + ":" + fi.getMinutes()}</p>
                            <p><strong>Hora Salida:</strong> ${""+ ff.getHours() + ":" + ff.getMinutes()}</p>
                        </div>
                    `
                }
                content += `
                        <form id="form-reserva" class="formReservaa">
                            <h2>Formulario De Reserva</h2>
                            <input type="text" name="" id="fr-marca" placeholder="Marca del carro" required>
                            <input type="text" name="" id="fr-color" placeholder="Color del carro" required>
                            <input type="time" id ="fr-h-inicio" name="" min="8:00" max="18:00">
                            <input type="time" id ="fr-h-fin" name="" min="8:00" max="18:00">
                            <button type="button" onclick="validarFormReserva()">Hacer Reserva</button>
                        </form>
                    </div>
                `
                modal.innerHTML = content;
            }else{
                reservasCajonActivo = [],
                content += `
                    <div class="modal-reserva">
                        <i class="fas fa-window-close" onclick="cerrarModal()"></i>
                        <h2>Reserva en este espacio</h2>
                        <h3>${cajon.zona}</h3>
                        <p><strong>Espacio Pedido:</strong> ${cajon.numCajon}</p>
                        <h3>Reservas activas</h3>
                `;
                    content += `
                        <div class="reserva-activa">
                            <h4>No hay reservas en este Estacionamiento</h4>
                        </div>
                    `
                content += `
                        <form id="form-reserva" class="formReservaa">
                            <h2>Formulario De Reserva</h2>
                            <input type="text" name="" id="fr-marca" placeholder="Marca del carro" required>
                            <input type="text" name="" id="fr-color" placeholder="Color del carro" required>
                            <input type="time" id ="fr-h-inicio" name="" min="8:00" max="18:00">
                            <input type="time" id ="fr-h-fin" name="" min="8:00" max="18:00">
                            <button type="button" onclick="validarFormReserva()">Hacer Reserva</button>
                        </form>
                    </div>
                `
                modal.innerHTML = content;
            }
            
            //console.log(data)
        }
    }catch(e){
        console.error("error", e)
    }
    formReserva = document.getElementById("form-reserva");
}

function cerrarModal() {
    let modal = document.getElementById("modal-reserva");
    modal.style.visibility = "hidden";
}

function validarFormReserva(){
    let modelo = document.getElementById("fr-marca").value;
    let color = document.getElementById("fr-color").value;
    let hi = document.getElementById("fr-h-inicio").value;
    let hf = document.getElementById("fr-h-fin").value;

    let arrhi = hi.split(':');
    let arrhf = hf.split(':');

    let fechaInicio = new Date();
    let fechaFin = new Date();

    fechaInicio.setHours(arrhi[0],arrhi[1],0,0)
    fechaFin.setHours(arrhf[0],arrhf[1],0,0)

    if(fechaInicio >= fechaFin){
        alert("La hora de entrada no puede ser mayor a la hora de salida")
    }
    else {
        let enviar = true;
        //console.log(reservasCajonActivo)
        for(let i=0; i< reservasCajonActivo.length; i++){
            let fii = new Date(reservasCajonActivo[i].fechaIngreso)
            let fif = new Date(reservasCajonActivo[i].fechaSalida)

            if( fechaInicio > fii  && fechaInicio < fif){
                alert("Estas intentado reservar en un tiempo ya tomado");
                enviar = false;
            }
            if(fechaFin > fii && fechaFin < fif){
                alert("Estas intentado reservar en un tiempo ya tomado");
                enviar = false;
            }
            if(fechaInicio < fii &&  fechaFin > fif){
                alert("Estas intentado reservar en un tiempo ya tomado");
                enviar = false;
            }
        }
        if(enviar){
            let fi = ""
            fi = "" + fechaInicio.getFullYear() + "-" + (fechaInicio.getMonth()+1) + "-" + fechaInicio.getDate() + " " + fechaInicio.getHours() + ":" + fechaInicio.getMinutes() + ":" + fechaInicio.getSeconds();
        
            let ff = ""
            ff = "" + fechaFin.getFullYear() + "-" + (fechaFin.getMonth()+1) + "-" + fechaFin.getDate() + " " + fechaFin.getHours() + ":" + fechaFin.getMinutes() + ":" + fechaFin.getSeconds();
            
            let reserva = {
                idUser: JSON.parse(localStorage.getItem('user')).id,
                idCajon: estacionamientoActivo,
                modelo: modelo,
                color: color,
                fechaI: fi,
                fechaF: ff,
            }
            hacerReserva(reserva)
        }
    }
}

async function hacerReserva(reserva) {
    try{
        console.log(reserva)
        let response = await fetch('http://localhost:3000/reservarEstacionamiento',{
            method: "POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(reserva),
        });
        if(response.status==200){
            alert('Reserva realizada con exito');
            cerrarModal();
        }
        console.log(response);
    }catch(e){
        alert("error")
    }
}

function cerrarSesion(){
    storage.removeItem('user');
    location.href = "index.html"
}