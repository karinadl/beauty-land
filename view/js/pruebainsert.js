const div = document.getElementById('insert');

i = 1;

colores = ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'];

for (i; i<11; i++){
    htmlInsert = '<div class="insertInto" id="insertInto' + i + '" onmouseenter="ingresarMouse(event, ' + i + ')" onmouseleave="salirMouse(event, ' + i + ')">Hola ' + i + '</div>';
    div.insertAdjacentHTML("beforeend", htmlInsert);
    htmlInsert = '';
}

function ingresarMouse(event, id){
    document.getElementById('insertInto'+id).style.backgroundColor = 'red';
}

function salirMouse(event, id){
    document.getElementById('insertInto'+id).style.backgroundColor = 'darkcyan';
}
