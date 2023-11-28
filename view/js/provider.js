const nombreP = document.getElementById('providerName');
const empresa = document.getElementById('enterprise');
const tel = document.getElementById('contact');
const btn = document.getElementById('registrar');


fetch('http://localhost:3000/getLogin')
    .then(res => res.json())
    .then(res => validar(res))


function validar(res) {
    console.log(res.name)
    if (res.name == "") {
        alert('Inicié sesión primero')
        window.location.href = "./login.html";
    } else if (res.rol == 'Empleado') {
        alert('No tienes autorización para estar aquí')
        window.location.href = "./index.html";
    }
}


btn.addEventListener('click', () => {
    if (nombreP.value == null || nombreP.value == "" || empresa.value == null || empresa.value == ""
        || contact.value == null || contact.value == "") {
        alert('Datos incompletos, intenta nuevamente');
    } else {
        const prov = {
            "name": nombreP.value,
            "enterprise": enterprise.value,
            "contact": contact.value
        }

        console.log(prov);
        fetch('http://localhost:3000/provider', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prov)
        }).then(res => res.text()).then(res => console.log(res));
        alert('Proveedor registrado');

        nombreP.value = "";
        enterprise.value = "";
        contact.value = "";
    }
});
