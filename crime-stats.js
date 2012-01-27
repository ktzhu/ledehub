//Create a function that changes 3268 into 3,268, adding commas to numbers 1,000 or greater

function numberFormat(nStr){
     nStr += '';
     x = nStr.split('.');
     x1 = x[0];
     x2 = x.length > 1 ? '.' + x[1] : '';
     var rgx = /(\d+)(\d{3})/;
     while (rgx.test(x1))
       x1 = x1.replace(rgx, '$1' + ',' + '$2');
     return x1 + x2;
}

//draw the actual graph using data that's been specified for the specific state we're looking at

function drawVisualization(newData) {
	//layout the data
	
	//create a place for the data to go
	var data = new google.visualization.DataTable();
	//define the years we have data for
    var years = [2009, 2010];
	//add our columns
	//the first one is for the state, separate from our overall data set
	data.addColumn('string', 'State');
	//now add columns for each item in our piece of 'header' data
	for (var i = 0; i  <= headers.length-1; ++i) {
    	data.addColumn('number', headers[i]);
	}
    
	//add our rows
	
	//our total number of rows correspond to years we defined up top
	data.addRows(years.length);
	
	//now, let's fill those rows in
	
	//the first item in each of those rows gets filled with the actual year
	for (var i = 0; i < years.length; ++i) {    
		data.setValue(i, 0, years[i].toString());    
		}
	//the first half of our data is for 2009, so we fill the row in with appropriate numbers
	//we start at 1 to leave out the years, remember data structured this way starts at 0
	for (var i = 1; i  <=(newData.length-1)/2; ++i) {
			data.setValue(0, i, newData[i]);
			data.setFormattedValue(0,i, numberFormat(newData[i]));    
          
		}
	//now, the second half of the data is for 2010, so we'll fill that in
 	for (var i = 1; i<=(newData.length-1)/2; ++i) {
			data.setValue(1, i, newData[i]);
			data.setFormattedValue(1,i, numberFormat(newData[i+(newData.length-1)/2]));    
          
		}
	
	

   	//create the framework for the chart, tell the program it will be a bar, and what div to put it in
	var chart = new google.visualization.BarChart(document.getElementById('stacked_bar_chart'));
    
	//specify details about the chart
	chart.draw(data, {
		legend: 'right',
		isStacked: true,
		hAxis: {
			title: 'Number of Incidents'
			},
        vAxis: {
			title: 'Years'
			},
		colors:['#8DD3C7', '#FFFFB3', '#BEBADA', '#FB8072', '#80B1D3', '#FDB462', '#B3DE69', '#FCCDE5', '#D9D9D9'],
		backgroundColor: {
			fill: "#EBEBEB",
			strokeWidth: 1,
			stroke: '#000'
			}               
		});
}

//we want graph data to change when a different state is selected.  Also, some states should display disclaimers about the data
function changeGraph(stateText) {
	//first, only do this if the state has an actual value.  We don't want anything run if someone clicks on the --- in the dropdown.
	if ($("#states option:selected").val() != " "){
		//clear the disclaimer div
    	$('.disclaimer').html('');
		//adjust data according to the number assigned as value to selected state
		selectedData = allCrimeData[$("#states option:selected").val()]
	
		//set up disclaimers to display if the text of the state selected is a certain state
		if (stateText == "Illinois" || $("#states option:selected").text() == "United States" || $("#states option:selected").text() == "Oregon") {
			$('.disclaimer').append('&#8226; Because of changes in Illinois\' and Oregon\'s reporting practices, figures are not comparable to previous years\' data.<div class="pad5"></div>');
			}

		if (stateText == "Minnesota" || $("#states option:selected").text() == "United States") {
			$('.disclaimer').append('&#8226; The data collection methodology for the offense of forcible rape used by the Minnesota state Uniform \
			Crime Reporting (UCR) Program (with the exception of Minneapolis and St. Paul, Minnesota) does not comply with national UCR Program guidelines.\
			Consequently, its figures for forcible rape and violent crime (of which forcible rape is a part) are not published in this table.<div class="pad5"></div>');
			}

		if (stateText == "District of Columbia" || $("#states option:selected").text() == "United States") {
			$('.disclaimer').append('&#8226; Data for the District of Columbia includes offenses reported by the Zoological Police and the Metro Transit Police.');
			}
		//redraw the visualization, passing in this fresh data
		drawVisualization(selectedData);
		
		}
}

//When the basic page has loaded, let's put it all together
$(document).ready(function(){
	//fill out the dropdown with our various state options
	for (m=0; m< allCrimeData.length;m++){
		$('#states').append('<option value="' + m + '">' + allCrimeData[m][0] + '</option>')
		if (m==0){
			$('#states').append('<option value=" ">----------</option>')
			}
		}
	//attach our changeGraph function so it happens (is called) everytime someone selects a new state
	$('#states').change(function() {
 		changeGraph($("#states option:selected").text());
	});
	//run the change graph function for the US, to make sure appropriate disclaimers are displayed
	changeGraph('United States');

});