async function cargarMisReservas(){
    try{
        let user = {
            idUser: JSON.parse(localStorage.getItem('user')).id
        }
        console.log(user);
        let response = await fetch('http://localhost:3000/getReservasUsuario',{
            method: "POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(user),
        });
        if(response.status == 200){
            let data = await response.json();
            let registrosViejos = [];
            let registroActivos = [];

            let hoy = new Date()

            for(let i=0; i<data.length; i++){
                let fechaFinalReserva = new Date(data[i].fechaSalida);
                if(fechaFinalReserva.getDate() == hoy.getDate()){
                    registroActivos.push(data[i]);
                }else{
                    registrosViejos.push(data[i]);
                }         
            }

            let rActivos = document.getElementById('rActivas');
            let rAntiguos = document.getElementById('rAntiguas');

            rActivos.innerHTML = "";
            rAntiguos.innerHTML = "";

            for(let i=0; i<registroActivos.length; i++){
                rActivos.innerHTML += `
                <div class="tarjetaReserva">
                    <h4>Reservado</h4>
                    <p><strong>Carro Marca:</strong> ${registroActivos[i].marcaCarro}</p>
                    <p><strong>Carro color:</strong> ${registroActivos[i].color}</p>
                    <p><strong>Hora entrada:</strong> ${registroActivos[i].fechaIngreso}</p>
                    <p><strong>Hora Salida:</strong> ${registroActivos[i].fechaSalida}</p>
                </div>
                `
            }

            for(let i=0; i<registrosViejos.length; i++){
                rAntiguos.innerHTML += `
                <div class="tarjetaReserva">
                    <h4>Reservado</h4>
                    <p><strong>Carro Marca:</strong> ${registrosViejos[i].marcaCarro}</p>
                    <p><strong>Carro color:</strong> ${registrosViejos[i].color}</p>
                    <p><strong>Hora entrada:</strong> ${registrosViejos[i].fechaIngreso}</p>
                    <p><strong>Hora Salida:</strong> ${registrosViejos[i].fechaSalida}</p>
                </div>
                `
            }
            console.log(data) 
        }
    }catch( err ){
        console.error("error",err)
    }
}
