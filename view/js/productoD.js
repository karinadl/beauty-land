const id_prod = document.getElementById("productId");
const btn = document.getElementById("eliminar");

const sp = document.getElementById("producto");

// fetch('http://localhost:3000/getLogin')
//   .then(res => res.json())
//   .then(res => validar(res))

//   function validar (res){
//     console.log(res.name)
//     if(res.name == ""){
//         alert('Inicié sesión primero')
//         window.location.href = "./login.html";
//     }else if(res.rol == 'Empleado'){
//         alert('No tienes autorización para estar aquí')
//         window.location.href = "./index.html";
//     }
// }

productos();

//!Nos trae todos los productos
function productos() {
  fetch("http://localhost:3000/product")
    .then((producto) => producto.json())
    .then((producto) => insertProductos(producto));
}

//!Constante para ingresar los productos al select
const insertProductos = (producto) => {
  a = producto;
  for (i = 0; i < producto.length; i++) {
    htmlSelect = "<option>" + producto[i].name + "</option>";
    sp.insertAdjacentHTML("beforeend", htmlSelect);
  }
};

//!Evento al darle click al button
btn.addEventListener("click", () => {
  id = 0;
  for (i = 0; i < a.length; i++) {
    if (a[i].name == sp.value) {
      id = a[i].id_product;
    }
  }
  console.log(id);
  fetch("http://localhost:3000/product/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.text())
    .then((res) => console.log(res));

  alert("Producto eliminado");
});
