/*
Keys on which keypress is not triggered but keydown and keyup are: Alt,RClick,Tab,Caps Lock,Ctrl,Shift,Backspace,Esc,Delete
fn and f1-12 : Only keydown event is trigerred.
Keydown is always succeeded by a keypress event other than those listed above. Or if keypress does not appear then those keys are 
not present in the text.
There is some lag in keypress and keydown so keydown will be registered. Keypress s used only for having then correct code.
For example look into keystroke.html in current folder
*/

var downstrokes=0,upstrokes=0,timings=[],monographs=[],diagraphs=[],trigraphs=[];
function strokes(code,type,time)
{
this.code=code;
this.type=type;
this.time=time;
}
function listen (identity) 
{
	$('#' + identity).keyup(function(event)
									  {
                                        //Enter
                                        if(event.which != 13)
                                        {
                                        upstrokes++;
                                        var msg = "Handler for .keyup() called " + upstrokes + " time(s).";
                                        $.print( msg, "html" );
                                        timings.push(new strokes(event.which,"keyup",event.timeStamp)); 
                                        }  
                                        else{}                                     
                                      })
              .keydown(function( event){
              							//Enter
                                        if ( event.which == 13 ) 
                                        {
                                          event.preventDefault();
                                          
                                        }
                                        //other than Enter
                                        else
                                        {
                                          downstrokes++;
                                          var msg1 = " \t \t \t \t \t \t Handler for .keydown() called " + downstrokes + " time(s).";
                                          $.print( msg1, "html"); 
                                          timings.push(new strokes(event.which,"keydown",event.timeStamp));
                                        }
                                        
                                      })
				.keypress(function( event){
              							
                                       
                                          downstrokes++;
                                          var msg1 = " \t \t \t \t \t \t Handler for .keydown() called " + downstrokes + " time(s).";
                                          $.print( msg1, "html"); 
                                          timings.push(new strokes(event.which,"keypress",event.timeStamp));
                                        
                                        
                                      }); 
}

function prev_down(i,check)
{
	for(var k=i;k>=0;k--)
	{
		if (timings[k].type=="keydown") 
		{	
			if (timings[i].code==timings[k].code && check==true ) 
			{
				return k;
			}
			else 
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
			else 
			return k;
		}
	}
	
}
function next_press (i,check)
{
	for(var k=i-1;k<timings.length;k++)
	{
		if (timings[k].type=="keypress") 
		{
			if (timings[i].code==timings[k].code && check==true ) 
			{
				return k;
			}
			else 
			return k;
		}
	}
	
}
function next_up (i,check) 
{
	for(var k=i;k<timings.length;k++)
	{
		if (timings[k].type=="keyup") 
		{
			if (timings[i].code==timings[k].code && check==true ) 
			{
				return k;
			}
			else 
			return k;
		}
	}
	
}

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
	if(timings[i].code==8 && timings[i].type=="keydown")
	{	
		timings.splice(prev_down(i,false));
		timings.splice(next_up(i,false));
		timings.splice(i);
		timings.splice(next_up(i,true));
	}
}
//delete all the BAD values (alt right click just precautiion values )
for (var i = 0; i < timings.length; i++) 
{
	if (timings[i].code==) 
	{
		timings.splice(i);
		timings.splice(next_up(i,true));
	}
}