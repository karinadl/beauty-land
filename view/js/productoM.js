const id_prod = document.getElementById('productId')
const nombreP = document.getElementById('productName');
const precio = document.getElementById('productPrice');
const des = document.getElementById('productDescription');
const uso = document.getElementById('productUse');
const tipo = document.getElementById('productType');
const exis = document.getElementById('existencia');
const btn = document.getElementById('modificar');

const sp = document.getElementById('provider');

fetch('http://localhost:3000/getLogin')
  .then(res => res.json())
  .then(res => validar(res))

function validar (res){
    console.log(res.name)
    if(res.name == ""){
        alert('Inicié sesión primero')
        window.location.href = "./login.html";
    }else if(res.rol == 'Empleado'){
        alert('No tienes autorización para estar aquí')
        window.location.href = "./index.html";
    }
}

proveedores();

if(res.name == ""){
    alert('Inicié sesión primero')
    window.location.href = "./login.html";
}else if(res.rol == 'Empleado'){
    alert('No tienes autorización para estar aquí')
    window.location.href = "./index.html";
}

function proveedores() {
    fetch('http://localhost:3000/provider')
        .then(providers => providers.json())
        .then(providers => insertProviders(providers));

};

//!Constante para ingresar los providers al select
const insertProviders = (providers) => {
    a = providers;
    for (i = 0; i < providers.length; i++) {
        htmlSelect = "<option>" + providers[i].enterprise + "</option>";
        sp.insertAdjacentHTML("beforeend", htmlSelect);
    }
}

btn.addEventListener('click', () => {
    if (id_prod.value == "" || id_prod.value == null || nombreP.value == null || nombreP.value == "" || precio.value == null || precio.value == ""
        || des.value == null || des.value == "" || uso.value == null || uso.value == ""
        || tipo.value == null || tipo.value == "" || exis.value == null || exis.value == "") {
        alert('Datos incompletos, intenta nuevamente');
    } else {
        id = 0;
        for (i = 0; i < a.length; i++) {
            if (a[i].enterprise == sp.value) {
                id = a[i].id_provider;
            }
        }
        const prod = {
            "id_provider": id,
            "name": nombreP.value,
            "price": precio.value,
            "description": des.value,
            "uses": uso.value,
            "types": tipo.value,
            "existence": exis.value
        }

        console.log(id_prod.value);
        fetch('http://localhost:3000/product/' + id_prod.value, {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prod)
        }).then(res => res.text()).then(res => console.log(res));
        alert('Producto modificado');

        nombreP.value = "";
        precio.value = "";
        des.value = "";
        uso.value = "";
        tipo.value = "";
        exis.value = "";
    }
});