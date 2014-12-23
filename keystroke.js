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
function n_graph(character,duration) 
{
    this.character=character;
    this.duration=duration;
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

    //HELPER FUNCTIONS  
    //prev_down,prev_press,next_press,next_up  are four functions which each take 2 arguments [i,check] i: current index & check: true/false  
    //according to whether to find the key(down,press,up) of corresponding keycode(true) of irrespective of keycode(false)
    this.prev_down = function(i,check)
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
            return null;
        }
    this.next_down = function(i,check) 
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
            return null; 
        }
    this.prev_press = function(i,check) 
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
            return null;   
        }
    this.next_press = function(i,check)
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
            return null;  
        }
    this.prev_up = function (i,check)
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
            return null;
        }
    this.next_up = function(i,check) 
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
            return null;
        }

    //populate() extracts n-graph timings from the raw timings
    this.populate = function() 
        {
            //populating monographTimes
            for (var i = 0; i <= this.prev_down(this.raw.length,false); i++) 
            {
                if (this.raw[i].type=="keydown") 
                {
                    var existence=exists(this.monographTimes,this.raw[i].code);
                    if( existence != -1)
                    {
                        this.monographTimes[existence]=((this.monographTimes[existence]*this.monographTimes.length)+this.raw[this.next_up(i,true)].time-this.raw[i].time)/(this.monographTimes.length+1);
                    }
                    else
                    this.monographTimes.push(new n_graph(this.raw[i].keycode,this.raw[this.next_up(i,true)].time-this.raw[i].time));
                }   
            }

            //populating digraphUUTimes
            for(var i=0;i <= this.prev_down(this.prev_down(this.raw.length,false),false);i++)
            {
                if(this.raw[i].type="keydown")
                {

                    var character=String.fromCharCode(this.raw[i].code,this.raw[this.next_down(i,false)].code);
                    var existence=exists(this.digraphUUTimes,character);
                    var duration= this.raw[this.next_up(this.next_down(i,false),true)].time -this.raw[this.next_up(i,true)].time;
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
            for(var i=0;i <= this.prev_down(this.prev_down(this.raw.length,false),false);i++)
            {
                if(this.raw[i].type="keydown")
                {

                    var character=String.fromCharCode(this.raw[i].code,this.raw[this.next_down(i,false)].code);
                    var existence=exists(this.digraphUUTimes,character);
                    var duration= this.raw[this.next_up(this.next_down(i,false),true)].time -this.raw[i].time;//2rp
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
            for(var i=0;i <= this.prev_down(this.prev_down(this.raw.length,false),false);i++)
            {
                if(this.raw[i].type="keydown")
                {

                    var character=String.fromCharCode(this.raw[i].code,this.raw[this.next_down(i,false)].code);
                    var existence=exists(this.digraphUUTimes,character);
                    var duration= this.raw[this.next_down(i,false)].time - this.raw[this.next_up(i,true)].time;//2pr
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
            for(var i=0;i <= this.prev_down(this.prev_down(this.raw.length,false),false);i++)
            {
                if(this.raw[i].type="keydown")
                {

                    var character=String.fromCharCode(this.raw[i].code,this.raw[this.next_down(i,false)].code);
                    var existence=exists(this.digraphUUTimes,character);
                    var duration= this.raw[this.next_down(i,false)].time - this.raw[i].time;//2pp
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

    //cleanup() is performed to cleanup the pure this.raw to form the raw this.raw by deleting the keypresses and Backspace keys.
    this.cleanup = function () 
        {
            //modifying the this.raw array to eliminate the keypress and have correct codes.
            for (var i = 0; i < this.raw.length; i++) 
            {   
                if(this.raw[i].type == "keypress")
                {
                    
                    /* Taken this concept lite
                    if(this.prev_down(i,true) == null)
                    {
                        //change both prevkeydown and nextkeyup.
                        this.raw[this.prev_down(i,false)].code=this.raw[i].code;
                        //keyup is registered according to keypress
                    }*/
                    this.raw.splice(i,1); 
                    //else nothing happens
                }
            }
            //discard all those threshold values;
            
            //execute Backspace deletion.
            for (var i = 0; i < this.raw.length; i++) 
            {   
                if(this.raw[i].code==8 && this.raw[i].type=="keydown")
                {   
                    this.raw.splice(this.prev_down(i,false),1);
                    this.raw.splice(this.next_up(i,false),1);
                    this.raw.splice(i,1);
                    this.raw.splice(this.next_up(i,true),1);
                }
                
            }
            //delete all the BAD values
            for (var i = 0; i < this.raw.length; i++) 
            {   
                if (this.raw[i].code==9 || this.raw[i].code==13 || this.raw[i].code==17 || this.raw[i].code==18 || this.raw[i].code==19 || this.raw[i].code==27 || this.raw[i].code==33 
                    || this.raw[i].code==34 || this.raw[i].code==35 || this.raw[i].code==36 || this.raw[i].code==37 || this.raw[i].code==38 || this.raw[i].code==39 || this.raw[i].code==40
                    || this.raw[i].code==45 || this.raw[i].code==93 || this.raw[i].code==144 || this.raw[i].code==145 || this.raw[i].code==46 ) 
                {
                    this.raw.splice(i,1);
                    this.raw.splice(this.next_up(i,true),1);
                }
            }
            
        }
                   
}
//member functions of Keystroke
Keystroke.prototype = {
    constructor: Keystroke,
    //input functions
    listen:function (identity)                  
                    {   
                        var refer=this;
                        console.log(identity);
                        $('#' + identity).keyup(function(event)
                                                          {
                                                            //Enter
                                                            if(event.which != 13)
                                                            {
                                                            upstrokes++;                                            
                                                            refer.pure.push(new strokes(event.which,"keyup",event.timeStamp));
                                                            refer.raw.push(new strokes(event.which,"keyup",event.timeStamp));
                                                            } 
                                                            //change value of keyup acc to keypress for raw
                                                            /* Taken this concept lite 
                                                            if( refer.next_press(refer.prev_down(refer.raw.length-1,true),false)!= null)
                                                            {refer.raw[refer.raw.length-1].code=refer.raw[refer.next_press(refer.prev_down(refer.raw.length-1,true),false)].code;}
                                                            } */ 
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
                                                              refer.inputtext=refer.inputtext+"~~~~~"+$('#' + identity).val();                                                                                                                                                                                          
                                                              
                                                            }
                                                            //other than Enter
                                                            else
                                                            {
                                                              downstrokes++;                                               
                                                              refer.pure.push(new strokes(event.which,"keydown",event.timeStamp));
                                                              refer.raw.push(new strokes(event.which,"keydown",event.timeStamp));
                                                            }
                                                            
                                                          })
                                         .keypress(function( event)
                                                          {
                                                              refer.pure.push(new strokes(event.which,"keypress",event.timeStamp));
                                                              refer.raw.push(new strokes(event.which,"keypress",event.timeStamp));            
                                                            
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
        this.populate();
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
        this.cleanup();
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
};