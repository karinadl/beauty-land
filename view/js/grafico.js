//Variables globales que representan un select del html
var c = document.getElementById('select');
var t = document.getElementById('tipo');
const list = document.getElementById('listProduct');
const nameAuthor = document.getElementById('nombreAuthor')


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

//Variables globales para dataset y grafico
dataset = [0];
var root;
gProduct = [0];

//Por default se van a cargar estos dos métodos
sendFetch(2);
createam5();

//Accion al hacer cambio en el combo c
c.addEventListener('change', () => {
  sendFetch(c.value);
  removeRoot();
  createam5();
});

//Accion al hacer cambio en el combo t
t.addEventListener('change', () => {
  sendFetch(c.value);
  removeRoot();
  createam5();
});

//Función para traer los datos en el dataset
function sendFetch(numC) {
  if (t.value == 'Compra') {
    fetch('http://localhost:3000/dataset/' + numC).then(x => x.json()).then(content => dataset = content);
  }
  else if (t.value == 'Precio') {
    fetch('http://localhost:3000/datasetp/' + numC).then(x => x.json()).then(content => dataset = content);
  }

}

//Borra el grafico en el dom "chartdiv"
function removeRoot() {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id == "chartdiv") {
      root.dispose();
    }
  });
}

//Creación del grafico
function createam5() {
  setTimeout(() => {

    am5.ready(function () {
      // Create root element
      // https://www.amcharts.com/docs/v5/getting-started/#Root_element
      root = am5.Root.new("chartdiv");

      // Set themes
      // https://www.amcharts.com/docs/v5/concepts/themes/
      root.setThemes([
        am5themes_Animated.new(root)
      ]);


      // Create chart
      // https://www.amcharts.com/docs/v5/charts/xy-chart/
      var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelY: "zoomXY",
        pinchZoomX: true,
        pinchZoomY: true
      }));


      // Create axes
      // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
      var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
      }));

      xAxis.children.moveValue(am5.Label.new(root, {
        text: t.value,
        x: am5.p50,
        centerX: am5.p50
      }), xAxis.children.length - 1);

      var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          inversed: false
        }),
        tooltip: am5.Tooltip.new(root, {})
      }));

      yAxis.children.moveValue(am5.Label.new(root, {
        rotation: -90,
        text: "Cantidad de producto vendido",
        y: am5.p50,
        centerX: am5.p50
      }), 0);


      // Create series
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
      var series = chart.series.push(am5xy.LineSeries.new(root, {
        calculateAggregates: true,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "y",
        valueXField: "x",
        valueField: "centroid",
        seriesTooltipTarget: "bullet",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "[bold]{title}[/]\nID: {id}\n" + t.value + ": {valueX.formatNumber('#.##')}\nCantidad de Producto: {valueY.formatNumber('#,###.')}\nGrupo: {value.formatNumber('#.')}"
        })
      }));
      series.strokes.template.set("visible", false);

      // Add bullet
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
      var circleTemplate = am5.Template.new({});
      circleTemplate.adapters.add("fill", function (fill, target) {
        var dataItem = target.dataItem;
        if (dataItem) {
          return am5.Color.fromString(dataItem.dataContext.color);
        }
        return fill
      });
      series.bullets.push(function () {
        var bulletCircle = am5.Circle.new(root, {
          radius: 5,
          fill: series.get("fill"),
          fillOpacity: 0.6
        }, circleTemplate);
        return am5.Bullet.new(root, {
          sprite: bulletCircle
        });
      });

      // Set data
      // https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Setting_data
      series.data.setAll(dataset);


      // Add cursor
      // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
      chart.set("cursor", am5xy.XYCursor.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        snapToSeries: [series]
      }));


      // Add scrollbars
      // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
      chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal"
      }));

      chart.set("scrollbarY", am5.Scrollbar.new(root, {
        orientation: "vertical"
      }));

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear(1000);
      chart.appear(1000, 100);

    }); // end am5.ready()
  }, 10000);
}

//Lista productos
//Trae la lista de productos con fetch
//Get //Delete
fetch('http://localhost:3000/product').then(x => x.json()).then(content => gProduct = content);

//Dura un tiempo de 5 seg para que haga la consulta fetch y va generando el listado en el div
setTimeout(() => {
  for (i = 0; i < gProduct.length; i++) {
    for (j = 0; j < dataset.length; j++) {
      if (gProduct[i].name == dataset[j].title) {
        htmlInsert = '<div class="insertInto" id="insertInto' + i + '" onmouseenter="ingresarMouse(event, ' + i + ', ' + j + ')" onmouseleave="salirMouse(event, ' + i + ', ' + j + ')"> '
          + '<strong>Nombre: </strong>' + gProduct[i].name + '<br>'
          + '<strong>Tipo: </strong>' + gProduct[i].types + '<br>'
          + '<strong>Precio: $ </strong>' + gProduct[i].price + '<br>'
          + '<strong>Existencia: </strong>' + gProduct[i].existence + '<br>'
        '</div>';
        list.insertAdjacentHTML("beforeend", htmlInsert);
        htmlInsert = '';
      }
    }
  }
}, 10000);

//Funciones para cambiar de color el contorno al estar seleccionandolo
function ingresarMouse(event, id, j) {
  document.getElementById('insertInto' + id).style.borderColor = dataset[j].color;
}

function salirMouse(event, id, j) {
  document.getElementById('insertInto' + id).style.borderColor = '#000';
}