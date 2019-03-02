  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then(function(response) {
    console.log(response);

    var sample_metadata = d3.select("#sample-metadata")

    sample_metadata.html("")

    Object.entries(response).forEach(function([key, value]){
      var list = sample_metadata.append("ul");
      //list
      var item = list.append("li")
      item.text(`${key}: ${value}`)
    })

  })
}




function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(response) {
    console.log(response)

    // @TODO: Build a Bubble Chart using the sample data
    var x = response.otu_ids;
    var y = response.sample_values;
    var msize = response.sample_values;
    var mcolors = response.otu_ids;
    var mtext = response.otu_labels;
    
    var trace1 = {
      x: x,
      y: y,
      mode: 'markers',
      marker: {
        size: msize,
        color: mcolors,
        //sizemode: 'area'
        sizeref: 1
      },
      text: mtext
    };

    var data = [trace1];

    var layout = {
      title: "BellyButton Bubbles",
      showlegend: false
    };
    Plotly.newPlot("bubble", data, layout)
  })

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  d3.json(`/samples/${sample}`).then(function(response) {
      console.log(response)
      var pievalues = response.sample_values.slice(0, 10);
      var pielabels = response.otu_ids;
      var pietext = response.otu_labels;

      trace = {
        values: pievalues,
        labels: pielabels,
        hovertext: pietext,
        type: "pie"
      }

      data = [trace];

      layout = {
        title: "Bellyful of Pie",
        showlegend: false
      };
      Plotly.newPlot("pie", data, layout);
      

    })


}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
