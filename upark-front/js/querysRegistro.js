let formRegister = document.getElementById("form-register-id");

formRegister.addEventListener('submit', function(event){
    event.preventDefault();
    let nombre = document.getElementById("r-user");
    let email = document.getElementById("r-email");
    
    let pass1 = document.getElementById("r-pass1");
    let pass2 = document.getElementById("r-pass2");

    if(pass1.value === pass2.value){
        let usuario = {
            nombre : nombre.value,
            email : email.value,
            pass : pass1.value,
        }
        registro(usuario);
    }else{
        alert('las contraseñas no coinciden')
    }
});

async function registro(user){
    try{
        console.log(user)
        let response = await fetch('http://localhost:3000/registerUser',{
            method: "POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(user),
        });
        if(response.status==401){
            alert('Este correo ya esta registrado')
        }
        if(response.status==200){
            alert('Ingreso con exito');
            location.href="login.html";
        }
        console.log(response);
    }catch(e){
        alert("error")
    }

}