// Initialize the dashboard
function init() 
{

  d3.json("samples.json").then(function(data) {

      var names = data.names;

      d3.select('#selDataset')
      .selectAll('options')
      .data(names)
      .enter()
      .append('option')
      .text(function(d) {
        return d;
      });

      var firstId = names[0];
      
      buildMetadata(firstId);
      buildChart(firstId)
      buildguage(firstId)
  });
}

//Build the data from Json. For every test subject extract
//metadata and update the information for the test subject
function buildMetadata(sampleId)
{
  d3.json("samples.json").then(function(data) {

    var metadata = data.metadata;

    var results = metadata.filter(metaobj=>metaobj.id == sampleId)
    console.log('freq')
   
    washFreq =  (results[0])['wfreq'];

    panel = d3.selectAll('.panel').select('.panel-body');
    panel.html("");
    Object.entries(results[0]).forEach(([key, value]) => {
      // console.log(key,value);
      
      panel.append('div')
            .html(function(d) {
              return `<strong>${key}:${value}</strong>`;
          });
    
    });
  });
}

//Build a bar chart and bubble chart for that subject id
//Here jut take the topten values for bar chart, but all the values for bubble chart
function buildChart(sampleId){

    d3.json("samples.json").then(function(data) {
      var metadata = data.metadata;
      var sample = data.samples.filter(sampleobj=>sampleobj.id == sampleId);

      const otuIds = sample[0].otu_ids;
      const sampleValues = sample[0].sample_values;
      const otuLables = sample[0].otu_labels;

      var toptenOtuIds = otuIds.slice(0,10);
      toptenOtuIds = toptenOtuIds.reverse();

      var totenSampleValues = sampleValues.slice(0,10);
      totenSampleValues = totenSampleValues.reverse();
      
      var toptenOtuLabels = otuLables.slice(0,10);
      toptenOtuLabels = toptenOtuLabels.reverse();

       toptenOtus = toptenOtuIds.map(function(otu) {
        return 'otu ' + otu;
      });
      
      //console.log(toptenOtuIds,totenSampleValues,toptenOtus,toptenOtuLabels);

      var trace = {
        type: "bar",
        y: toptenOtus,
        x: totenSampleValues,
        text: toptenOtuLabels,
        orientation: "h"
      };
      var data = [trace];

      var layout = {
        xaxis: {
          range: totenSampleValues
        },
        yaxis: {
          range: toptenOtus
        }
      };
  
      Plotly.newPlot("bar", data, layout);

      //Bubble Chart
      var bubbleData = [
        {
        x: otuIds,
        y: sampleValues,
        text: otuLables,
        mode: 'markers',
        marker: {
          color: otuIds,
          size: sampleValues
        },
        sizeref: 0.2,
        sizemode: 'area'
      }];

      var bubbleLayout = {
        showlegend: false,
        height: 600,
        width: 1000
      };

      Plotly.newPlot('bubble', bubbleData, bubbleLayout);
  });
}

function buildguage(sampleId)
{
  d3.json("samples.json").then(function(data) {
      var metadata = data.metadata;
      var results = metadata.filter(metaobj=>metaobj.id == sampleId) 
      console.log('freq {')
    
      washFreq =  (results[0])['wfreq'];
      console.log(washFreq,sampleId)
      var traceA = {
        type: "pie",
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
        text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        direction: "clockwise",
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: ['','','','','','','','','','white'],
          labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
          hoverinfo: "label"
        }
      };

      var degrees = washFreq *20, radius = .25;
      var radians = degrees * Math.PI / 180;
      var x = 1 * radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
      
      pointx = 0.5-x;
      pointy = 0.5+y;
      console.log(pointx,pointy);
      var layout = {
        shapes:[{
            type: 'line',
            x0: 0.5,
            y0: 0.5,
            x1: pointx,
            y1: pointy,
            line: {
              color: 'black',
              width: 3
            }
          }],
        title: 'Washing frequency',
        xaxis: {visible: false, range: [-1, 1]},
        yaxis: {visible: false, range: [-1, 1]}
      };
  
    var data = [traceA];
  
    Plotly.newPlot('gauge', data, layout);
});
}

//Cattch the event when the subject is changed and update the metadata and the graphs.
function optionChanged(value) {
  //console.log(value);
  buildMetadata(value);
  buildChart(value);
  buildguage(value);
}
//Initialize the dashboard
init();