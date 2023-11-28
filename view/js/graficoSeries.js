const div = document.getElementById('chartdiv');
var origin = [];
var predict = [];

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

//!fetch GET response
fetch('http://localhost:3000/serie')
        .then(response => response.json())
        .then(response => dataSets(response));


const dataSets = (response) => {
  for(i = 0; i<response.length; i++){
    if (response[i].table == "origin"){  origin.push(response[i]);  }
    else{  predict.push(response[i])  }
  }
  console.log(predict);
  data(origin, predict);
};

const data = (origin, predict) => {
    am5.ready(function() {
        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element 
        var root = am5.Root.new("chartdiv");
        
        
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
          wheelX: "panX",
          wheelY: "zoomX",
          maxTooltipDistance: 0,
          pinchZoomX:true
        }));
        
        
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        var value = 100;

        //Create series with datasets
        function generateData(dic) {
          //value = Math.round((Math.random() * 10 - 4.2) + value);
          value = parseInt(dic.total);
          console.log(dic);
          
          //am5.time.add(date, "month", 5,2010);
          date = new Date(parseInt(dic.year),parseInt(dic.month) - 1,parseInt(dic.day));
          //console.log(date.getTime());
          return {
            date: date.getTime(),
            value: value
          };
        }
        
        function generateDatas(array) {
          var generate = [];
          for (i = 0; i < array.length; ++i) {
            generate.push(generateData(array[i]));
          }
          return generate;
        }
        
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
          maxDeviation: 0.2,
          baseInterval: {
            timeUnit: "month",
            count: 1
          },
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {})
        }));
        
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        }));
        
        
        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        /*for (var i = 0; i < 2; ++i) {
          if(i == 0){  nameSerie = "Original"  }
          else{  nameSerie = "Predicción"  }
          */
        var data;
        var seriesOrigin = chart.series.push(am5xy.LineSeries.new(root, {
          name: "Original",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "date",
          legendValueText: "{valueY}",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}"
          }),
          fill: am5.color(0x227C9D),
          stroke: am5.color(0x227C9D)
        }));
        
        seriesOrigin.strokes.template.setAll({
          strokeWidth: 3
        });

        date = new Date();
        value = 0;
        
        data = generateDatas(origin);
        seriesOrigin.data.setAll(data);
        
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        seriesOrigin.appear();
        
        
        var seriesPredict = chart.series.push(am5xy.LineSeries.new(root, {
          name: "Prediccion",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          valueXField: "date",
          legendValueText: "{valueY}",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}"
          }),
          fill: am5.color(0xFE6D73),
          stroke: am5.color(0xFE6D73)
        }));
        
        seriesPredict.strokes.template.setAll({
          strokeWidth: 3
        });

        date = new Date();
        value = 0;
        
        data = generateDatas(predict);
        seriesPredict.data.setAll(data);
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        seriesPredict.appear();
        
        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
          behavior: "none"
        }));
        cursor.lineY.set("visible", false);
        
        
        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        chart.set("scrollbarX", am5.Scrollbar.new(root, {
          orientation: "horizontal"
        }));
        
        chart.set("scrollbarY", am5.Scrollbar.new(root, {
          orientation: "vertical"
        }));
        
        
        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        var legend = chart.rightAxesContainer.children.push(am5.Legend.new(root, {
          width: 200,
          paddingLeft: 15,
          height: am5.percent(100)
        }));
        
        // When legend item container is hovered, dim all the series except the hovered one
        legend.itemContainers.template.events.on("pointerover", function(e) {
          var itemContainer = e.target;
        
          // As series list is data of a legend, dataContext is series
          var series = itemContainer.dataItem.dataContext;
        
          chart.series.each(function(chartSeries) {
            if (chartSeries != series) {
              chartSeries.strokes.template.setAll({
                strokeOpacity: 0.15,
                stroke: am5.color(0x000000)
              });
            } else {
              chartSeries.strokes.template.setAll({
                strokeWidth: 3
              });
            }
          })
        })
        
        // When legend item container is unhovered, make all series as they are
        legend.itemContainers.template.events.on("pointerout", function(e) {
          var itemContainer = e.target;
          var series = itemContainer.dataItem.dataContext;
        
          chart.series.each(function(chartSeries) {
            chartSeries.strokes.template.setAll({
              strokeOpacity: 1,
              strokeWidth: 1,
              stroke: chartSeries.get("fill")
            });
          });
        })
        
        legend.itemContainers.template.set("width", am5.p100);
        legend.valueLabels.template.setAll({
          width: am5.p100,
          textAlign: "right"
        });
        
        // It's is important to set legend data after all the events are set on template, otherwise events won't be copied
        legend.data.setAll(chart.series.values);
        
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        chart.appear(1000, 100);
        
        }); // end am5.ready()

}



