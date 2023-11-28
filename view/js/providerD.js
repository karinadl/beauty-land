const id_prod = document.getElementById("productId");
const btn = document.getElementById("eliminar");

const sp = document.getElementById("provider");

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

proveedores();

//!Nos trae todos los productos
function proveedores() {
    fetch("http://localhost:3000/provider")
        .then((proveedores) => proveedores.json())
        .then((proveedores) => insertProveedores(proveedores));
}

//!Constante para ingresar los productos al select
const insertProveedores = (provider) => {
    a = provider;
    for (i = 0; i < provider.length; i++) {
        htmlSelect = "<option>" + provider[i].name + "</option>";
        sp.insertAdjacentHTML("beforeend", htmlSelect);
    }
};

//!Evento al darle click al button
btn.addEventListener("click", () => {
    id = 0;
    for (i = 0; i < a.length; i++) {
        if (a[i].name == sp.value) {
            id = a[i].id_provider;
        }
    }
    console.log(id);
    fetch("http://localhost:3000/provider/" + id, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.text())
        .then((res) => console.log(res));

    alert("Proveedor eliminado");
});
