/***********************************************************
                       Keystroke.js
                        
        This is the pre-alpha v-0.0.1 of Keystroke.js
                            by 
    Event Horizon(bezoar17,fourEC,jayantabh,SatwikPrabhuK)
************************************************************/
// FUNCTIONS & VARIABLES TO BE USED AHEAD
var downstrokes=0,upstrokes=0;
//OBJECT CREATING FUNCTIONS
function strokes(code,type,time)
{
    this.code=code;
    this.type=type;
    this.time=time;
}
function n_graph (character,duration) 
{
    this.character=character;
    this.duration=duration;
}
//HELPER FUNCTIONS

//prev_down,prev_press,next_press,next_up  are four functions which each take 2 arguments [i,check] i: current index & check: true/false
//according to whether to find the key(down,press,up) of corresponding keycode(true) of irrespective of keycode(false)
function prev_down(i,check)
{
    for(var k=i-1;k>=0;k--)
    {
        if (this.raw[k].type=="keydown") 
        {   
            if (this.raw[i].code==this.raw[k].code && check==true) 
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
    for(var k=i+1;k<this.raw.length;k++)
    {
        if (this.raw[k].type=="keydown") 
        {
            if (this.raw[i].code==this.raw[k].code && check==true ) 
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
        if (this.raw[k].type=="keypress") 
        {
            if (this.raw[i].code==this.raw[k].code && check==true ) 
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
    for(var k=i+1;k<this.raw.length;k++)
    {
        if (this.raw[k].type=="keypress") 
        {
            if (this.raw[i].code==this.raw[k].code && check==true ) 
            {
                return k;
            }
            else if(check==false)
            return k;
        }
    }    
}
function prev_up (i,check)
{
    for(var k=i-1;k>=0;k--)
    {
        if (this.raw[k].type=="keyup") 
        {   
            if (this.raw[i].code==this.raw[k].code && check==true) 
            {
                return k;
            }
            else if(check==false)
            return k;
            
        }
    }
function next_up (i,check) 
{
    for(var k=i+1;k<this.raw.length;k++)
    {
        if (this.raw[k].type=="keyup") 
        {
            if (this.raw[i].code==this.raw[k].code && check==true ) 
            {
                return k;
            }
            else if(check==false) 
            return k;
        }
    }    
}
//checks is object exists already or not
function exists(arr, elem) 
{
    for (var x = 0; x < arr.length; x++) {
        if (arr[x].character == elem) {
            return x; //returning index if element found
        }
    }
    return -1;//returning -1 if element not found
}
//cleanup() is performed to cleanup the pure this.raw to form the raw this.raw by deleting the keypresses and Backspace keys.
function cleanup () 
  {
        //modifying the this.raw array to eliminate the keypress and have correct codes.
    for (var i = 0; i < this.raw.length; i++) 
    {   
        if(this.raw[i].type=="keypress")
        {
            if(this.raw[i].code!=this.raw[prev_down(i,true)].code)
            {
                //change both prevkeydown and nextkeyup.
                this.raw[prev_down(i,true)].code=this.raw[i].code;
                this.raw[next_up(i,true)].code=this.raw[i].code;
                this.raw.splice(i);

            }
            //else nothing happens
        }
    }
    //discard all those threshold values;

    //execute Backspace deletion.
    for (var i = 0; i < this.raw.length; i++) 
    {   
        if(this.raw[i].code==8 && this.raw[i].type=="keydown")
        {   
            this.raw.splice(prev_down(i,false));
            this.raw.splice(next_up(i,false));
            this.raw.splice(i);
            this.raw.splice(next_up(i,true));
        }
        
    }
    //delete all the BAD values
    for (var i = 0; i < this.raw.length; i++) 
    {   
        if (this.raw[i].code==9 || this.raw[i].code==13 || this.raw[i].code==17 || this.raw[i].code==18 || this.raw[i].code==19 || this.raw[i].code==27 || this.raw[i].code==33 
            || this.raw[i].code==34 || this.raw[i].code==35 || this.raw[i].code==36 || this.raw[i].code==37 || this.raw[i].code==38 || this.raw[i].code==39 || this.raw[i].code==40
            || this.raw[i].code==45 || this.raw[i].code==93 || this.raw[i].code==144 || this.raw[i].code==145 || this.raw[i].code==46 ) 
        {
            this.raw.splice(i);
            this.raw.splice(next_up(i,true));
        }
    }
  }
//populate() extracts n-graph timings from the raw timings
function populate () 
{
    //populating monographTimes
    for (var i = 0; i <= prev_down(this.raw.length,false); i++) 
    {
        if (this.raw[i].type=="keydown") 
        {
            var existence=exists(this.monographTimes,this.raw[i].code);
            if( existence != -1)
            {
                this.monographTimes[existence]=((this.monographTimes[existence]*this.monographTimes.length)+this.raw[next_up(i,true)].time-this.raw[i].time)/(this.monographTimes.length+1);
            }
            else
            this.monographTimes.push(new n_graph(this.raw[i].keycode,this.raw[next_up(i,true)].time-this.raw[i].time));
        }   
    }

    //populating digraphUUTimes
    for(var i=0;i <= prev_down(prev_down(this.raw.length,false),false);i++)
    {
        if(this.raw[i].type="keydown")
        {

            var character=String.fromCharCode(this.raw[i].code,this.raw[next_down(i,false)].code);
            var existence=exists(this.digraphUUTimes,character);
            var duration= this.raw[next_up(next_down(i,false),true)].time -this.raw[next_up(i,true)].time;
            if(existence!= -1)
            {
                this.digraphUUTimes[existence]=((this.digraphUUTimes[existence]*this.digraphUUTimes.length)+duration)/(this.digraphUUTimes.length+1);
            }
            else
            {
                this.digraphUUTimes.push(new n_graph(character,duration));
            }
        }
    }

    //populating digraphUDTimes
    for(var i=0;i <= prev_down(prev_down(this.raw.length,false),false);i++)
    {
        if(this.raw[i].type="keydown")
        {

            var character=String.fromCharCode(this.raw[i].code,this.raw[next_down(i,false)].code);
            var existence=exists(this.digraphUUTimes,character);
            var duration= this.raw[next_up(next_down(i,false),true)].time -this.raw[i].time;//2rp
            if(existence!= -1)
            {
                this.digraphUUTimes[existence]=((this.digraphUUTimes[existence]*this.digraphUUTimes.length)+duration)/(this.digraphUUTimes.length+1);
            }
            else
            {
                this.digraphUUTimes.push(new n_graph(character,duration));
            }
        }
    }

    //populating digraphDUTimes
    for(var i=0;i <= prev_down(prev_down(this.raw.length,false),false);i++)
    {
        if(this.raw[i].type="keydown")
        {

            var character=String.fromCharCode(this.raw[i].code,this.raw[next_down(i,false)].code);
            var existence=exists(this.digraphUUTimes,character);
            var duration= this.raw[next_down(i,false)].time - this.raw[next_up(i,true)].time;//2pr
            if(existence!= -1)
            {
                this.digraphUUTimes[existence]=((this.digraphUUTimes[existence]*this.digraphUUTimes.length)+duration)/(this.digraphUUTimes.length+1);
            }
            else
            {
                this.digraphUUTimes.push(new n_graph(character,duration));
            }
        }
    }

    //populating digraphDDTimes
    for(var i=0;i <= prev_down(prev_down(this.raw.length,false),false);i++)
    {
        if(this.raw[i].type="keydown")
        {

            var character=String.fromCharCode(this.raw[i].code,this.raw[next_down(i,false)].code);
            var existence=exists(this.digraphUUTimes,character);
            var duration= this.raw[next_down(i,false)].time - this.raw[i].time;//2pp
            if(existence!= -1)
            {
                this.digraphUUTimes[existence]=((this.digraphUUTimes[existence]*this.digraphUUTimes.length)+duration)/(this.digraphUUTimes.length+1);
            }
            else
            {
                this.digraphUUTimes.push(new n_graph(character,duration));
            }
        }
    }       
}
//Constructor defining Keystroke object structure
function Keystroke () 
{
    this.inputtext = ''; //the typed text
    //arrays holding timestamp
    this.monographTimes = []; 
    this.digraphUUTimes = [];
    this.digraphUDTimes = [];
    this.digraphDUTimes = [];
    this.digraphDDTimes = [];
    this.trigraphUUTimes = [];
    this.trigraphUDTimes = [];
    this.trigraphDUTimes = [];
    this.trigraphDDTimes = [];  
    //raw and pure events and times
    this.raw=[];
    this.pure=[];
}
//member functions of Keystroke
Keystroke.prototype = 
{
    constructor: Keystroke,
    //input functions
    listen:function (identity)                  
                    {   
                        $('#' + identity).keyup(function(event)
                                                          {
                                                            //Enter
                                                            if(event.which != 13)
                                                            {
                                                            upstrokes++;                                            
                                                            this.pure.push(new strokes(event.which,"keyup",event.timeStamp));
                                                            this.raw.push(new strokes(event.which,"keyup",event.timeStamp)); 
                                                            }  
                                                            else
                                                            {

                                                            }                                     
                                                          })
                                         .keydown(function(event)
                                                          {
                                                            //Enter
                                                            if ( event.which == 13 ) 
                                                            {
                                                              event.preventDefault();
                                                              this.inputtext=this.inputtext+"~~~~~"+$('#' + identity).val(); 
                                                                                                                           
                                                            }
                                                            //other than Enter
                                                            else
                                                            {
                                                              downstrokes++;                                               
                                                              this.pure.push(new strokes(event.which,"keydown",event.timeStamp));
                                                              this.raw.push(new strokes(event.which,"keydown",event.timeStamp));
                                                            }
                                                            
                                                          })
                                         .keypress(function( event)
                                                          {
                                                              this.pure.push(new strokes(event.which,"keypress",event.timeStamp));
                                                              this.raw.push(new strokes(event.which,"keypress",event.timeStamp));            
                                                            
                                                          }); 
                    },
    trainModelFromField:function(elementID,algorithm){},
    trainModelFromFile:function(datasetFilepath){},
    loadModelFromFile:function(filepath){},    
    //utility functions
    testModel:function(){},
    setSecurityToField:function(elementID){},
    //algorithmic functions
    arrayDisorder:function(trained,input){},
    neuralNetwork:function(trained,input){},
    
    //PROVIDER FUNCTIONS
    /*
        get_ngraph usage :
        var value;
        value=hello.get_ngraph();  
        value=hello.get_ngraph('monograph'); value.monograph is an array of objects where each is character,duration
        value=hello.get_ngraph('digraph'); value.digraph["UUT"] is an array of objects where each is character,duration
        value=hello.get_ngraph('trigraph'); 
    */
    get_ngraph:function()
    {
        populate();
        var result;
        if(arguments.length==0)
        {
            result.monograph=this.monographTimes;
            result.digraph=[];
            result.digraph.push({UUT:this.digraphUUTimes});
            result.digraph.push({UDT:this.digraphUDTimes});
            result.digraph.push({DUT:this.digraphDUTimes});
            result.digraph.push({DDT:this.digraphDDTimes});
            result.trigraph=[];
            result.trigraph.push({UUT:this.trigraphUUTimes});
            result.trigraph.push({UDT:this.trigraphUDTimes});
            result.trigraph.push({DUT:this.trigraphDUTimes});
            result.trigraph.push({DDT:this.trigraphDDTimes});
        }
        else
        {
            for (var i = 0; i < arguments.length; i++) 
                {
                 if(arguments[i]=="monograph")
                 {
                    result.monograph=this.monographTimes;
                 } 
                 else if(arguments[i]=="digraph")
                 {
                    result.digraph=[];
                    result.digraph.push({UUT:this.digraphUUTimes});
                    result.digraph.push({UDT:this.digraphUDTimes});
                    result.digraph.push({DUT:this.digraphDUTimes});
                    result.digraph.push({DDT:this.digraphDDTimes});
                 }
                 else if(arguments[i]=="trigraph")
                 {
                    result.trigraph=[];
                    result.trigraph.push({UUT:this.trigraphUUTimes});
                    result.trigraph.push({UDT:this.trigraphUDTimes});
                    result.trigraph.push({DUT:this.trigraphDUTimes});
                    result.trigraph.push({DDT:this.trigraphDDTimes});
                 }
                }
        }
        
        return result; 
    },
    get_raw_timings:function()
    {
        cleanup();
        return this.raw;
    },
    get_pure_timings:function()
    {
        return this.pure;
    },
    get_input_text:function()
    {
        return this.inputtext;
    },
    //output functions
    saveModelToFile:function()
    {
        //txt,csv
    },
    getJSON:function()
    {
        var result;        
        result=JSON.stringify(get_ngraph.apply(null,arguments));
        return result;
    }
}