//Constructor defining KeystrokeData object structure
function KeystrokeData () {
    this.text = ''; //the typed text
    //arrays holding timestamp
    this.monographTime = []; 
	this.digraphUUTime = [];
	this.digraphUDTime = [];
	this.digraphDUTime = [];
	this.digraphDDTime = [];
	this.trigraphUUTime = [];
	this.trigraphUDTime = [];
	this.trigraphDUTime = [];
	this.trigraphDDTime = [];
	//arrays holding list of mono,di and trigraphs
    this.monograph = [];//only 3 arrays should be here.
	this.digraphUU = [];
	this.digraphUD = [];
	this.digraphDU = [];
	this.digraphDD = [];
	this.trigraphUU = [];
	this.trigraphUD = [];
	this.trigraphDU = [];
	this.trigraphDD = [];
	//raw events and times
	this.raw=[];
}

//member functions of KeystrokeData
KeystrokeData.prototype = {
    constructor: KeystrokeData,
    //input functions
    listen:function(textFieldID){
    	//add keyup and keydown listeners here
    	$('#'+textFieldID).keyup(function(event){
    		this.monograph.push(event.which);
    		this.monographTime.push(event.timeStamp);
    	})
    	.keydown(function(event){
    		this.monographTime.push(event.timeStamp);
    	});
    },
    trainModelFromField:function(elementID,algorithm){},
    trainModelFromFile:function(datasetFilepath){},
    loadModelFromFile:function(filepath){},
    //output functions
    saveModelToFile:function(){},
    getDataToCSV:function(){},
    getJSON:function(){},
    printStats:function(){},
    //utility functions
    testModel:function(){},
    setSecurityToField:function(elementID){},
    //algorithmic functions
    arrayDisorder:function(){},
    neuralNetwork:function(){}
}

//sample usage
var myKeystrokeData = new KeystrokeData();
myKeystrokeData.trainModelFromField('textFieldID','arrayDisorder');
myKeystrokeData.testModel();
console.log(myKeystrokeData.text);
myKeystrokeData.printStats();