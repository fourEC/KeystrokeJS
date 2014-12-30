/***********************************************************
                       Keystroke.js
                        
        This is the pre-alpha v-0.0.1 of Keystroke.js
                            by 
    Event Horizon(bezoar17,fourEC,jayantabh,SatwikPrabhuK)
************************************************************/
// FUNCTIONS TO BE USED AHEAD
//OBJECT CREATING FUNCTIONS
function strokes(code,type,time)
{
    this.code=code;
    this.type=type;
    this.time=time;
}
function n_graph(character,duration,weight) 
{
    this.character=character;
    this.duration=duration;
    this.weight=weight;
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
//useful 
function letter(charac,downtime,uptime)
{
    this.charac=charac;
    this.downtime=downtime;
    this.uptime=uptime;
}
function convert () 
{
    var output="";
    for (var i = 0; i < arguments.length; i++) 
    {
        output=output+form(arguments[i]); 
        if(i!= arguments.length-1)output=output+",";
    };
    return output;
}
 function form(input)
 {
    var output = new String();
     var charCode = (input) ? input : event.keyCode
     output = String.fromCharCode(charCode);
     if (charCode == 8) output = "backspace"; //  backspace
     if (charCode == 9) output = "tab"; //  tab
     if (charCode == 13) output = "enter"; //  enter
     if (charCode == 16) output = "shift"; //  shift
     if (charCode == 17) output = "ctrl"; //  ctrl
     if (charCode == 18) output = "alt"; //  alt
     if (charCode == 19) output = "pause/break"; //  pause/break
     if (charCode == 20) output = "caps lock"; //  caps lock
     if (charCode == 27) output = "escape"; //  escape
     if (charCode == 33) output = "page up"; // page up, to avoid displaying alternate character and confusing people             
     if (charCode == 34) output = "page down"; // page down
     if (charCode == 35) output = "end"; // end
     if (charCode == 36) output = "home"; // home
     if (charCode == 37) output = "left arrow"; // left arrow
     if (charCode == 38) output = "up arrow"; // up arrow
     if (charCode == 39) output = "right arrow"; // right arrow
     if (charCode == 40) output = "down arrow"; // down arrow
     if (charCode == 45) output = "insert"; // insert
     if (charCode == 46) output = "delete"; // delete
     if (charCode == 91) output = "left window"; // left window
     if (charCode == 92) output = "right window"; // right window
     if (charCode == 93) output = "select key"; // select key
     if (charCode == 96) output = "numpad 0"; // numpad 0
     if (charCode == 97) output = "numpad 1"; // numpad 1
     if (charCode == 98) output = "numpad 2"; // numpad 2
     if (charCode == 99) output = "numpad 3"; // numpad 3
     if (charCode == 100) output = "numpad 4"; // numpad 4
     if (charCode == 101) output = "numpad 5"; // numpad 5
     if (charCode == 102) output = "numpad 6"; // numpad 6
     if (charCode == 103) output = "numpad 7"; // numpad 7
     if (charCode == 104) output = "numpad 8"; // numpad 8
     if (charCode == 105) output = "numpad 9"; // numpad 9
     if (charCode == 106) output = "multiply"; // multiply
     if (charCode == 107) output = "add"; // add
     if (charCode == 109) output = "subtract"; // subtract
     if (charCode == 110) output = "decimal point"; // decimal point
     if (charCode == 111) output = "divide"; // divide
     if (charCode == 112) output = "F1"; // F1
     if (charCode == 113) output = "F2"; // F2
     if (charCode == 114) output = "F3"; // F3
     if (charCode == 115) output = "F4"; // F4
     if (charCode == 116) output = "F5"; // F5
     if (charCode == 117) output = "F6"; // F6
     if (charCode == 118) output = "F7"; // F7
     if (charCode == 119) output = "F8"; // F8
     if (charCode == 120) output = "F9"; // F9
     if (charCode == 121) output = "F10"; // F10
     if (charCode == 122) output = "F11"; // F11
     if (charCode == 123) output = "F12"; // F12
     if (charCode == 144) output = "num lock"; // num lock
     if (charCode == 145) output = "scroll lock"; // scroll lock
     if (charCode == 186) output = ";"; // semi-colon
     if (charCode == 187) output = "="; // equal-sign
     if (charCode == 188) output = ","; // comma
     if (charCode == 189) output = "-"; // dash
     if (charCode == 190) output = "."; // period
     if (charCode == 191) output = "/"; // forward slash
     if (charCode == 192) output = "`"; // grave accent
     if (charCode == 219) output = "["; // open bracket
     if (charCode == 220) output = "\\"; // back slash
     if (charCode == 221) output = "]"; // close bracket
     if (charCode == 222) output = "'"; // single quote
     if (charCode == 32) output = "space"; // space

     return output;

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
    //stores all the letters typed
    this.all_letters=[];

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
    this.populate=function()
    {
        for(var i=0;i <= this.prev_down(this.raw.length-1,false);i++)
        {
            if(this.raw[i].type=="keydown")
            {
                this.all_letters.push(new letter(this.raw[i].code,this.raw[i].time,this.raw[this.next_up(i,true)].time));//populating this.all_letters
            }
        }
        
        for(var i=0;i<this.all_letters.length;i++)
        {
            var duration0=this.all_letters[i].uptime-this.all_letters[i].downtime;//mono
            var existence0=exists(this.monographTimes,convert(this.all_letters[i].charac));//mono

            if(existence0 == -1)this.monographTimes.push(new n_graph(convert(this.all_letters[i].charac),duration0,1));
                else{
                    this.monographTimes[existence0].duration=((this.monographTimes[existence0].duration)*(this.monographTimes[existence0].weight)+duration0)/(this.monographTimes[existence0].weight+1);
                    this.monographTimes[existence0].weight+=1;
                }
        }

        for (var i = 0; i < this.all_letters.length-1; i++) 
            {
                var character=convert(this.all_letters[i].charac,this.all_letters[i+1].charac);                
                var duration1=this.all_letters[i+1].uptime-this.all_letters[i].uptime;//uu
                var duration2=this.all_letters[i+1].uptime - this.all_letters[i].downtime;//ud
                var duration3=this.all_letters[i+1].downtime - this.all_letters[i].uptime;//du
                var duration4=this.all_letters[i+1].downtime- this.all_letters[i].downtime;//dd                
                var existence1=exists(this.digraphUUTimes,character);
                var existence2=exists(this.digraphUDTimes,character);
                var existence3=exists(this.digraphDUTimes,character);
                var existence4=exists(this.digraphDDTimes,character);                
                if(existence1 == -1)this.digraphUUTimes.push(new n_graph(character,duration1,1));
                else{
                    this.digraphUUTimes[existence1].duration=((this.digraphUUTimes[existence1].duration)*(this.digraphUUTimes[existence1].weight)+duration1)/(this.digraphUUTimes[existence1].weight+1);
                    this.digraphUUTimes[existence1].weight+=1;
                }
                if(existence2 == -1)this.digraphUDTimes.push(new n_graph(character,duration2,1));
                else{
                    this.digraphDUTimes[existence2].duration=((this.digraphUDTimes[existence2].duration)*(this.digraphUDTimes[existence2].weight)+duration2)/(this.digraphUDTimes[existence2].weight+1);;
                    this.digraphDUTimes[existence2].weight+=1;
                }
                if(existence3 == -1)this.digraphDUTimes.push(new n_graph(character,duration3,1));
                else{
                    this.digraphUDTimes[existence3].duration=((this.digraphDUTimes[existence3].duration)*(this.digraphDUTimes[existence3].weight)+duration3)/(this.digraphDUTimes[existence3].weight+1);;
                    this.digraphUDTimes[existence3].weight+=1;
                }
                if(existence4 == -1)this.digraphDDTimes.push(new n_graph(character,duration4,1));
                else{
                    this.digraphDDTimes[existence4].duration=((this.digraphDDTimes[existence4].duration)*(this.digraphDDTimes[existence4].weight)+duration4)/(this.digraphDDTimes[existence4].weight+1);;
                    this.digraphDDTimes[existence4].weight+=1;
                }
            };
    }
    
    //cleanup() is performed to cleanup the pure this.raw to form the raw this.raw by deleting the keypresses and Backspace keys.
    //Not in use currently
    this.cleanup = function () 
        {
         

            //discard all those threshold values;
            /*
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
            */
            
        }
                   
}
//member functions of Keystroke
Keystroke.prototype = {
    constructor: Keystroke,
    //input functions
    listen:function (identity)                  
                    {   
                        var refer=this;                        
                        $('#' + identity).keyup(function(event)
                                                          {
                                                            //Enter
                                                            if(event.which != 13)
                                                            {
                                                            upstrokes++;                                            
                                                            refer.pure.push(new strokes(event.which,"keyup",event.timeStamp));
                                                            refer.raw.push(new strokes(event.which,"keyup",event.timeStamp));
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
                                                              refer.inputtext=$('#' + identity).val();                                                                                                                                                                                          
                                                              
                                                            }
                                                            //other than Enter
                                                            else
                                                            {
                                                              downstrokes++;                                               
                                                              refer.pure.push(new strokes(event.which,"keydown",event.timeStamp));
                                                              refer.raw.push(new strokes(event.which,"keydown",event.timeStamp));
                                                            }
                                                            
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
        value=hello.get_ngraph('digraph'); value.digraph.UUT is an array of objects where each is character,duration
        value=hello.get_ngraph('trigraph'); 
    */
    get_ngraph:function()
    {
        this.cleanup();// not actually necessary but playing safe have to check this sometime
        this.populate();
        var result=new Object();//cannot add properties to undefined 
        if(arguments.length==0)
        {
            result.monograph=this.monographTimes;
            result.digraph={UUT:this.digraphUUTimes,UDT:this.digraphUDTimes,DUT:this.digraphDUTimes,DDT:this.digraphDDTimes};
            result.trigraph={UUT:this.trigraphUUTimes,UDT:this.trigraphUDTimes,DUT:this.trigraphDUTimes,DDT:this.trigraphDDTimes};
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
                    result.digraph={UUT:this.digraphUUTimes,UDT:this.digraphUDTimes,DUT:this.digraphDUTimes,DDT:this.digraphDDTimes};
                 }
                 else if(arguments[i]=="trigraph")
                 {
                    result.trigraph={UUT:this.trigraphUUTimes,UDT:this.trigraphUDTimes,DUT:this.trigraphDUTimes,DDT:this.trigraphDDTimes};
                 }
                }
        }
        
        return result; 
    },
    get_raw_timings:function()
    {
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
    get_letters:function()
    {
        return this.all_letters;
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