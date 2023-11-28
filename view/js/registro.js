const nombre = document.getElementById('userName');
const ap = document.getElementById('middleName');
const am = document.getElementById('lastName');
const tel = document.getElementById('cell');
const contra = document.getElementById('pass');
const rol = document.getElementById('userRole');
const btn = document.getElementById('button');

btn.addEventListener('click', () => {
    if (nombre.value == null || nombre.value == "") {
        alert('Datos incompletos, intenta nuevamente');
    } else if (contra.value == null || contra.value == "") {
        alert('Datos incompletos');
    } else {
        const user = {
            "name": nombre.value,
            "middleName": ap.value,
            "lastName": am.value,
            "cell": tel.value,
            "pass": contra.value,
            "rol": rol.value
        }

        fetch('http://localhost:3000/employe', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        alert('Usuario registrado');
        window.location.href = "../html/login.html";
    }
});
