
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
      console.log(firstId);
      buildMetadata(firstId);
      buildChart(firstId)
  });
}

function buildMetadata(sampleId)
{

  d3.json("samples.json").then(function(data) {

    var metadata = data.metadata;
    var results = metadata.filter(metaobj=>metaobj.id == sampleId)
    console.log(results);
    panel = d3.selectAll('.panel').select('.panel-body');
    panel.html("");
    Object.entries(results[0]).forEach(([key, value]) => {
      console.log(key,value);
     
      panel.append('div')
            .html(function(d) {
              return `<strong>${key}:${value}</strong>`;
          });
    
    });
  });

}

function buildChart(sampleId){

    d3.json("samples.json").then(function(data) {
      var sample = data.samples.filter(sampleobj=>sampleobj.id == sampleId);
      console.log(sample);

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
      
      console.log(toptenOtuIds,totenSampleValues,toptenOtus,toptenOtuLabels);

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
      var bubbleTrace = [
        {
        x: toptenOtuIds,
        y: totenSampleValues,
        text: toptenOtuLabels,
        mode: 'markers',
        marker: {
          color: toptenOtuIds,
          size: totenSampleValues
        }
      }];

      var bubbleLayout = {
        showlegend: false,
        height: 600,
        width: 1000
      };

      Plotly.newPlot('bubble', bubbleTrace, bubbleLayout);

  });
}

function optionChanged(value) {
  console.log(value);
  buildMetadata(value);
  buildChart(value);
}

init();
