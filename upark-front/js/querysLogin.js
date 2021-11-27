let formLogin = document.getElementById("form-login-id");

formLogin.addEventListener('submit', function(event){
    event.preventDefault();
    let email = document.getElementById("l-email");
    let contra = document.getElementById("l-pass");
    let usuario = {
        email : email.value,
        pass : contra.value,
    }
    login(usuario)
});

async function login(user){
    try{
        console.log(user)
        let response = await fetch('http://localhost:3000/loginUser',{
            method: "POST",
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(user),
        });
        if(response.status==401){
            alert('usuario o contraseña incorrecto')
        }
        if(response.status==200){
            alert('Ingreso con exito');
            let data = await response.json();
            localStorage.setItem('user',JSON.stringify(data.user[0]));
            location.href="dashboard.html";
        }
        console.log(response);
    }catch(e){
        alert("error")
    }

}