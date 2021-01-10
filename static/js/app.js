
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

//Build the data from Json. For every test subject extract
//metadata and update the information for the test subject
function buildMetadata(sampleId)
{

  d3.json("samples.json").then(function(data) {

    var metadata = data.metadata;
    var results = metadata.filter(metaobj=>metaobj.id == sampleId)
    //console.log(results);
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
      var sample = data.samples.filter(sampleobj=>sampleobj.id == sampleId);
      //console.log(sample);

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

//Cattch the event when the subject is changed and update the metadata and the graphs.
function optionChanged(value) {
  console.log(value);
  buildMetadata(value);
  buildChart(value);
}
//Initialize the dashboard
init();
