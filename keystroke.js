//Constructor defining KeystrokeData object structure
function KeystrokeData () 
{
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
	//to access the monographs simply extend the . to monographTimes.list
    
	//raw and pure events and times
	this.raw=[];
    this.pure=[];
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
    arrayDisorder:function(trained,input){},
    neuralNetwork:function(trained,input){}
}

//sample usage
var myKeystrokeData = new KeystrokeData();
myKeystrokeData.trainModelFromField('textFieldID','arrayDisorder');
myKeystrokeData.testModel();
console.log(myKeystrokeData.text);
myKeystrokeData.printStats();

var hello= new KeystrokeData();
hello.listen('target');


/*
PART 1 JS
*/

/*
Keys on which keypress is not triggered but keydown and keyup are: Alt,RClick,Tab,Caps Lock,Ctrl,Shift,Backspace,Esc,Delete
fn and f1-12 : Only keydown event is trigerred.
Keydown is always succeeded by a keypress event other than those listed above. Or if keypress does not appear then those keys are 
not present in the text.
There is some lag in keypress and keydown so keydown will be registered. Keypress s used only for having then correct code.
For example look into keystroke.html in current folder
*/
var downstrokes=0,upstrokes=0,timings=[];
function strokes(code,type,time)
{
    this.code=code;
    this.type=type;
    this.time=time;
}
//prev_down,prev_press,next_press,next_up  are four functions which each take 2 arguments [i,check] i: current index & check: true/false
//according to whether to find the key(down,press,up) of corresponding keycode(true) of irrespective of keycode(false)
function prev_down(i,check)
{
    for(var k=i-1;k>=0;k--)
    {
        if (timings[k].type=="keydown") 
        {   
            if (timings[i].code==timings[k].code && check==true) 
            {
                return k;
            }
            else if(check==false)
            return k;
            
        }
    }
}
function next_down (i,check) 
{
    for(var k=i+1;k<timings.length;k++)
    {
        if (timings[k].type=="keydown") 
        {
            if (timings[i].code==timings[k].code && check==true ) 
            {
                return k;
            }
            else if(check==false) 
            return k;
        }
    }
    
}
function prev_press (i,check) 
{
    for(var k=i-1;k>=0;k--)
    {
        if (timings[k].type=="keypress") 
        {
            if (timings[i].code==timings[k].code && check==true ) 
            {
                return k;
            }
            else if(check==false) 
            return k;
        }
    }
    
}
function next_press (i,check)
{
    for(var k=i+1;k<timings.length;k++)
    {
        if (timings[k].type=="keypress") 
        {
            if (timings[i].code==timings[k].code && check==true ) 
            {
                return k;
            }
            else if(check==false)
            return k;
        }
    }
    
}
function prev_up(i,check)
{
    for(var k=i-1;k>=0;k--)
    {
        if (timings[k].type=="keyup") 
        {   
            if (timings[i].code==timings[k].code && check==true) 
            {
                return k;
            }
            else if(check==false)
            return k;
            
        }
    }

function next_up (i,check) 
{
    for(var k=i+1;k<timings.length;k++)
    {
        if (timings[k].type=="keyup") 
        {
            if (timings[i].code==timings[k].code && check==true ) 
            {
                return k;
            }
            else if(check==false) 
            return k;
        }
    }
    
}
//cleanup() is performed to cleanup the pure timings to form the raw timings by deleting the keypresses and Backspace keys.
function cleanup () 
{
        //modifying the timings array to eliminate the keypress and have correct codes.
    for (var i = 0; i < timings.length; i++) 
    {   
        if(timings[i].type=="keypress")
        {
            if(timings[i].code!=timings[prev_down(i,true)].code)
            {
                //change both prevkeydown and nextkeyup.
                timings[prev_down(i,true)].code=timings[i].code;
                timings[next_up(i,true)].code=timings[i].code;
                timings.splice(i);

            }
            //else nothing happens
        }
    }
    //discard all those threshold values;

    //execute Backspace and Delete events.
    for (var i = 0; i < timings.length; i++) 
    {   
        if(timings[i].code==8 && timings[i].type=="keydown")
        {   
            timings.splice(prev_down(i,false));
            timings.splice(next_up(i,false));
            timings.splice(i);
            timings.splice(next_up(i,true));
        }
        
    }
    //delete all the BAD values
    for (var i = 0; i < timings.length; i++) 
    {   
        if (timings[i].code==9 || timings[i].code==13 || timings[i].code==17 || timings[i].code==18 || timings[i].code==19 || timings[i].code==27 || timings[i].code==33 
            || timings[i].code==34 || timings[i].code==35 || timings[i].code==36 || timings[i].code==37 || timings[i].code==38 || timings[i].code==39 || timings[i].code==40
            || timings[i].code==45 || timings[i].code==93 || timings[i].code==144 || timings[i].code==145 || timings[i].code==46 ) 
        {
            timings.splice(i);
            timings.splice(next_up(i,true));
        }
    }
}
function listen (identity) 
{   
        $('#' + identity).keyup(function(event)
                                          {
                                            //Enter
                                            if(event.which != 13)
                                            {
                                            upstrokes++;                                            
                                            timings.push(new strokes(event.which,"keyup",event.timeStamp)); 
                                            }  
                                            else{}                                     
                                          })
                  .keydown(function( event){
                                            //Enter
                                            if ( event.which == 13 ) 
                                            {
                                              event.preventDefault();
                                              cleanup();
                                              
                                            }
                                            //other than Enter
                                            else
                                            {
                                              downstrokes++;                                               
                                              timings.push(new strokes(event.which,"keydown",event.timeStamp));
                                            }
                                            
                                          })
                    .keypress(function( event){
                                              timings.push(new strokes(event.which,"keypress",event.timeStamp));            
                                            
                                          }); 
}

/*
Part 2.js calculating all the monographs and diagraphs from the raw timinings.

*/
var monographTimes=[];
var digraphUUTimes = [];
var digraphUDTimes = [];
var digraphDUTimes = [];
var digraphDDTimes = [];
var trigraphUUTimes = [];
var trigraphUDTimes = [];
var trigraphDUTimes = [];
var trigraphDDTimes = [];

function exists(arr, elem) 
{
    for (var x = 0; x < arr.length; x++) {
        if (arr[x].character == elem) {
            return x; //returning index if element found
        }
    }
    return -1;//returning -1 if element not found
}

function n_graph (character,duration) 
{
    this.character=character;
    this.duration=duration;
}

//populating monographTimes
for (var i = 0; i <= prev_down(timings.length,false); i++) 
{
    if (timings[i].type=="keydown") 
    {
        var existence=exists(monographTimes,timings[i].code);
        if( existence != -1)
        {
            monographTimes[existence]=((monographTimes[existence]*monographTimes.length)+timings[next_up(i,true)].time-timings[i].time)/(monographTimes.length+1);
        }
        else
        monographTimes.push(new n_graph(timings[i].keycode,timings[next_up(i,true)].time-timings[i].time));
    }   
}

//populating diagraphUUTimes
for(var i=0;i <= prev_down(prev_down(timings.length,false),false);i++)
{
    if(timings[i].type="keydown")
    {

        var character=String.fromCharCode(timings[i].code,timings[next_down(i,false)].code);
        var existence=exists(diagraphUUTimes,character);
        var duration= timings[next_up(next_down(i,false),true)].time -timings[next_up(i,true)].time;
        if(existence!= -1)
        {
            diagraphUUTimes[existence]=((diagraphUUTimes[existence]*diagraphUUTimes.length)+duration)/(diagraphUUTimes.length+1);
        }
        else
        {
            diagraphUUTimes.push(new n_graph(character,duration);
        }
    }
}

//populating diagraphUDTimes
for(var i=0;i <= prev_down(prev_down(timings.length,false),false);i++)
{
    if(timings[i].type="keydown")
    {

        var character=String.fromCharCode(timings[i].code,timings[next_down(i,false)].code);
        var existence=exists(diagraphUUTimes,character);
        var duration= timings[next_up(next_down(i,false),true)].time -timings[i].time;//2rp
        if(existence!= -1)
        {
            diagraphUUTimes[existence]=((diagraphUUTimes[existence]*diagraphUUTimes.length)+duration)/(diagraphUUTimes.length+1);
        }
        else
        {
            diagraphUUTimes.push(new n_graph(character,duration);
        }
    }
}

//populating diagraphDUTimes
for(var i=0;i <= prev_down(prev_down(timings.length,false),false);i++)
{
    if(timings[i].type="keydown")
    {

        var character=String.fromCharCode(timings[i].code,timings[next_down(i,false)].code);
        var existence=exists(diagraphUUTimes,character);
        var duration= timings[next_down(i,false)].time - timings[next_up(i,true)].time;//2pr
        if(existence!= -1)
        {
            diagraphUUTimes[existence]=((diagraphUUTimes[existence]*diagraphUUTimes.length)+duration)/(diagraphUUTimes.length+1);
        }
        else
        {
            diagraphUUTimes.push(new n_graph(character,duration);
        }
    }
}

//populating diagraphDDTimes
for(var i=0;i <= prev_down(prev_down(timings.length,false),false);i++)
{
    if(timings[i].type="keydown")
    {

        var character=String.fromCharCode(timings[i].code,timings[next_down(i,false)].code);
        var existence=exists(diagraphUUTimes,character);
        var duration= timings[next_down(i,false)].time - timings[i].time;//2pp
        if(existence!= -1)
        {
            diagraphUUTimes[existence]=((diagraphUUTimes[existence]*diagraphUUTimes.length)+duration)/(diagraphUUTimes.length+1);
        }
        else
        {
            diagraphUUTimes.push(new n_graph(character,duration);
        }
    }
}
