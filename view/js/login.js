//Luz Elizabeth Velázquez Tovar
//19 de octubre de 2023
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if(username != null || username != ""){
        fetch('http://localhost:3000/employeNombre/' + username)
            .then(res => res.json())
            .then(res => validar(res, username, password));
    }
    
});

function validar(res, username, password) {
    if(res.length > 0){
        if (res[0].name.toLowerCase() == username.toLowerCase() && res[0].pass == password) {
            var user = {
                "nom": res[0].name, 
                "rol": res[0].rol
            };
            fetch('http://localhost:3000/setLogin', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            }).then(res => res.json()).then(res => console.log(res));

            window.location.href = "./index.html"; // Redirige a la página de dashboard si las credenciales son correctas
        } else {
            showAlert();
        }
    }else{
        showAlert()
    }
}

document.getElementById("registro").addEventListener("click", function() {
    // Redirigir a la página de registro
    window.location.href = "../html/registro.html";
  });
  

function showAlert() {
    alert("Comunicate con el administrador.");
}