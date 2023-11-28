
const tbody = document.querySelector('tbody');

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
//Llamada a los metodos
productos();

//Fetch para traer todos los productos
function productos() {
    fetch('http://localhost:3000/product')
        .then(productos => productos.json())
        .then(productos => insertTable(productos));
};


//for para ingresar los datos
const insertTable = (productos) => {
    console.log(productos);
    for (i = 0; i < productos.length; i++) {
        htmlCode = '<tr>' +
            '<td>' + productos[i].id_product + '</td>' +
            '<td>' + productos[i].id_provider + '</td>' +
            '<td>' + productos[i].name + '</td>' +
            '<td> $ ' + productos[i].price + '</td>' +
            '<td>' + productos[i].existence + '</td>' +
            '<td>' + productos[i].uses + '</td>' +
            '</tr>';
        tbody.insertAdjacentHTML("beforeend", htmlCode);
        htmlConde = '';
    }
};