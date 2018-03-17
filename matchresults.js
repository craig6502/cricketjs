//modified version of playgame.js that just displays match results to browser
function Results() {
  //this parses the String, the '10' (option) indicates the numeral system to be used i.e. decimal
  var numballs = 0;
  var elem = document.getElementById("txt");
  //var value = parseInt(elem.innerHTML, 10);
  var value=0;
  var interval;
  //global array to hold our text to be output to screen
  var messages;
  var text ="starting value - file msg";
  var reset=false; //primitive boolean not wrapper
  var begincycle=false;
  var ids = ['test','these','words'];
  //match data
  var matchdate=" ";
  var Innings1 = new Innings();
  var Innings2 = new Innings();
  //var maxballs = 120;
  var ballcount=0;
  //on-screen display
  var commentarytext="default";
  //score objects
  var myScoresheet = new Livescore();
  var myScoresheet2 = new Livescore();
  //canvas variables
  var canvas, ctx, batter_sprite,
    canv_width = 600,
    canv_height = 150,
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,
    //base position srX was 10 but now 0
    sprite_x = (canv_width / 2) - 25, sprite_y = canv_height - 85, sprite_w = 65, sprite_h = 85,
     bwl_srcX=0,
     bwl_srcY=0,
     bwl_sprite_x=canv_width*0.9; //make this 90% of width
     bwl_sprite_y=sprite_y,
     ump_sprite_x=(canv_width / 2)+10,
     ump_sprite_y=sprite_y, //umpire starting xy position
     ump_srcX=0,
     ump_srcY=0,
     srcX=0,
     srcY=0; //batter frame starting position - NOT NEEDED?
    //----define individual variables from here
    var batter_framelist=[0,70,140,210,280,350,420,490,560,630,700,770,840,910,980,1050];
    var bowler_framelist=[560,630,700,770,840,910,980,1050];
    var umpire_framelist=[0,70,140,210]; //normal, wide
    var batter_frame=0;
    var bowler_frame=0;
    var umpire_frame=0;
    //set some default conditions
    var canv_ballcount=1;
    var canv_innings=1;
    var start=0;
    var bwl_start=0; //counter for sine function
    var mode=0;
    var bwl_mode=0;
    var lap=0; //lap counter;
    var inningscount=1;
    var currentruns=0;
    var umpirecode="default";
    var canv_out_text=" ";
    var battertext="default";
    var bowlertext="default";
    var bowlerfinished=0;//unused
    var bowlerball=0;
    var signalcode="default";
  
    

  
  function increment() {
      return value += 1;
  }

  function updateDisplay(value,text,innings) {
    elem.innerHTML = value;
    document.getElementById('msg').innerHTML = textoutput(value);
    //value of text changes because it is in an event handler
    if (text!="") {
      document.getElementById('ballbyball').innerHTML=text;
    }
    if (innings==1) {
      document.getElementById('ballbyball').innerHTML=text;
      var cty = document.getElementById('comments_inn1');
      cty.innerHTML=cty.innerHTML+text+"\n\r";
    }
    if (innings==2) {
      document.getElementById('ballbyball').innerHTML=text;
      var cty = document.getElementById('comments_inn2');
      cty.innerHTML=cty.innerHTML+text+"\n\r";
    }
    //match statistics
  }

  //Called by startcounter() after initial statistics processing
  //processes scores and stats then starts animation
  function run() {
    
    var matchball=0; 
    var innings=1
    var maxballs=Innings1.getMaxBalls();
    while (matchball<maxballs) {
      matchball++;
      //allow just text output for now
     commentarytext=Innings1.processOutcome(matchball, myScoresheet);
      //update display is for ball by ball commentary
      updateDisplay(matchball,commentarytext,innings);
    }
    //process outcome as per Java code in Cricket10.java in playgame method
    //while loop for innings 1
    if (matchball==maxballs) {
      //myScoresheet.printScores(Innings1);
      myScoresheet.tableScores(Innings1,innings);
      }
      //INNINGS2
      matchball=0;
      innings=2; 
      maxballs=Innings2.getMaxBalls();
      //while loop for innings 2
      while (matchball<maxballs) {
        matchball++;
        commentarytext=Innings2.processOutcome(matchball, myScoresheet2);
        //update display is for animation
        updateDisplay(matchball,commentarytext,innings);
      }
      if (matchball==maxballs) {
      myScoresheet2.tableScores(Innings2,innings);
      }
      //Do it again with animation and delays
      //set this to 1 to start animatin
      var animationFlag=1;
      if (animationFlag==1) {
      startcanvas();
      var matchball=0; 
      var maxballs=Innings1.getMaxBalls();
     
      //slower anonymous loop for ball increment
      setInterval(nextBall, 1000);

      //try to independently time the lap running
      //this may be better to run as a sub-loop of 'next', so that next ball doesn't occur until laps are finished
      
      setInterval(doLaps, 80);
      setInterval(doBowl, 80);
      

      //screen updates are still most frequent loop.  20 ms delay is 50 Hz
      //<3=both innings
      setInterval(function() {
      if(inningscount<3) {
        //doLaps();
        displayLoop();
        clearCanvas();
        drawSprite();
        }
        //animate3();
      }, 20)

      //TO DO: pause?  or will main  set interval loop continue indefinitely?
      document.getElementById('xpos').innerHTML = sprite_x;
    }
        //drawRunLeft(1);
      //
      return;
  }

  //the start timer is basically just calling the setInterval method.
  //run = the function to be executed. delay =  length of the time-interval between each execution.
  function startcounter() {
    //File I/O checks
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    } else {
    alert('The File APIs are not fully supported in this browser.');
    }
    // set the range of balls to run through the counter
    value=0;
    run();
    //Alternatively: var value = parseInt(elem.innerHTML, 10);
    //Just dispense with any delay for now! interval = window.setInterval(run, delay);
  }

  //javascript just accepts any number, type of argumentW!
  function textoutput(ballnum){
    //make ids global now
    //numballs = ids.length;  //this should equal array size
    var output = "default value";
    if (ballnum<numballs) {
      var output = ids[ballnum];
  }
    return output; // <-- to be printed to the div
}

//set up function called by event listener for file selection.
function readFile (evt) {
       var files = evt.target.files;
       var file = files[0];           
       var reader = new FileReader();
       reader.onload = function(event) {
        //this sends the event to the developer tools console
         console.log(event.target.result); 
         //simple case: just return all file by text=reader.result;
         var filetext = reader.result; //only update this once in the event handler
         begincycle=true;
         InningsData(filetext);
         //text="Team: "+bowlingteamname+", Last player: "+bowlernames[numbowlers]+" max balls:"+maxballs.toString();
         var bowlerdata = Innings1.getBowlersGame();
         var numbowlers = Innings1.getBowlerNum();
         ids=bowlerdata[numbowlers]; //unused
         reset = true; //for counter
         //check inputs at console
         Innings1.printBatInnings();
         Innings1.printBowlInnings();
         console.log("Now delivering Innings 2 data:");
         Innings2.printBatInnings(); 
         Innings2.printBowlInnings(); 
         if (begincycle==true) {
          startcounter();
         }
       }
       //this must be outside the 'onload' function
       reader.readAsText(file); // <---callback function
       //better start point?

    }

//currently not used but available as a private startup function
function wait() {
  
}

//TO DO: just store number of players and set points to read for each innings

function InningsData(firsttext) {
    //local variables - store relevant ones in Innings
    //batting data
      var batterdata = new Array(); //array declaration for batters (importBatterData)
      var numbatters=0;
      var battingteamname="batting team default";
      //bowling data
      var bowlerdata = new Array();
      var numbowlers=0;
      var bowlingteamname="bowling team default";
    //
    var lines = new Array();
    lines = firsttext.split('\r'); //my CSV has CR not LF 
    var rows = lines.length; //this is a count e.g. 7
    //
    matchdate = lines[0];
    // team 1 bat - details
    var line1 = lines[1];
    var meta1 = line1.split(',');
    battingteamname = meta1[0];
    numbatters = parseInt(meta1[3],10);
    console.log("numbatters:",numbatters);
    for (var x=1; x<numbatters+1; x++) {
      //to do - make sure rows aren't exceeded.
      batterdata[x] = lines[x+1].split(','); //comma delimiter
    }
    maxballs = batterdata[1].length-1;
    //
    var line2 = lines[numbatters+2];
    console.log ("line2:",line2);
    var meta2 = line2.split(',');
    console.log ("Meta2:",meta2)
    bowlingteamname = meta2[0];
    numbowlers = parseInt(meta2[3],10);
    var bowlingLineStart = numbatters+2;
    console.log("bowlinglineStart:",bowlingLineStart);
    for (x=1; x<numbowlers+1; x++) {
      //to do - make sure rows aren't exceeded.
      bowlerdata[x] = lines[x+bowlingLineStart].split(','); //comma delimiter
      console.log("bowler:",x,bowlerdata[x]);
    }
    
    //update the innings data
    Innings1.setMaxBalls(maxballs);
    Innings1.setBattingTeam(battingteamname);//<---use the prototype functions
    Innings1.setBatterNum(numbatters);
    Innings1.setBatsmenGame(batterdata);
    Innings1.setBowlingTeam(bowlingteamname);
    Innings1.setBowlerNum(numbowlers);
    Innings1.setBowlersGame(bowlerdata);
    Innings1.setInningsDate(matchdate);
    //INNINGS 2
    var battingLineStart=numbatters+numbowlers+3; //1st innings offset
    var line3 = lines[battingLineStart];
    console.log ("line3:",line3);
    console.log ("line3start:",battingLineStart);
    meta3 = line3.split(',');
    console.log ("meta3:",meta3);
    var battingteam2name = meta3[0];
    var batterdata2 = new Array();
    var numbatters2 = parseInt(meta3[3],10);
    for (x=1; x<numbatters2+1; x++) {
      //to do - make sure rows aren't exceeded.
      batterdata2[x] = lines[x+battingLineStart].split(','); //comma delimiter
      console.log ("batter:",x,batterdata2[x]);
    }
    maxballs2 = batterdata2[1].length-1;
    //
    line4 = lines[battingLineStart+numbatters2+1]; //change this to +1
    console.log ("line4start:",battingLineStart+numbatters2+1);
    console.log ("line4:",line4);
    meta4 = line4.split(',');
    console.log ("meta4:",meta4);
    var bowlingteam2name = meta4[0];
    var numbowlers2 = parseInt(meta4[3],10);
    var bowlingLineStart = battingLineStart+numbatters2+1;
    var bowlerdata2 = new Array();
    for (x=1; x<numbowlers2+1; x++) {
      //to do - make sure rows aren't exceeded.
      bowlerdata2[x] = lines[x+bowlingLineStart].split(','); //comma delimiter
      console.log ("bowler:",x,bowlerdata2[x]);
    }
    //update the second innings data
    Innings2.setMaxBalls(maxballs2);
    Innings2.setBattingTeam(battingteam2name);
    Innings2.setBatterNum(numbatters2);
    Innings2.setBatsmenGame(batterdata2);
    Innings2.setBowlingTeam(bowlingteam2name);
    Innings2.setBowlerNum(numbowlers2);
    Innings2.setBowlersGame(bowlerdata2);
    Innings2.setInningsDate(matchdate);
}

function importBatterData (firsttext) {
    var lines = new Array();
    lines = firsttext.split('\r'); //my CSV has CR not LF 
    var rows = lines.length; //this is a count e.g. 7
    
    //split first line
    var matchdata = lines[0].split(',');
    //grab number of players from Innings data
    numbatters = parseInt(matchdata[0],10);
    for (var x=1; x<numbatters+1; x++) {
      //to do - make sure rows aren't exceeded.
      batterdata[x] = lines[x].split(','); //comma delimiter
      batternames[x]=batterdata[x][0]; //first entry is a name
    }
   var maxballs = batterdata[1].length-1;
   battingteamname = matchdata[1];
   text="Team: "+battingteamname+", Last player: "+batternames[numbatters]+" max balls:"+maxballs.toString();
   //ids=batterdata[numbatters]; //just cycle through one player array for now
   reset = true; //for counter
}

  document.getElementById('fileInput').addEventListener('change', readFile, false);
  // main external function for external call to this function
  this.start = wait;

function startcanvas() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  batter_sprite = new Image();
  umpire_sprite = new Image();
  bowler_sprite = new Image();
  ctx.font = "10px Arial";
  umpire_sprite.src = 'umpire.png';
  batter_sprite.src = 'batter.png';
  bowler_sprite.src = 'bowler.png';

  //setInterval(loop, 1000/2); //delay was 1000/30 so 33 ms = 30 Hz
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
}

function clearCanvas() {
  ctx.clearRect(0,0,canv_width,canv_height);
}

//ANIMATION LOOP FUNCTIONS

function displayLoop() {
  document.getElementById('run_count').innerHTML = lap;
  document.getElementById('runs_this_ball').innerHTML = currentruns;
  document.getElementById('anim_frame').innerHTML = batter_frame;
  document.getElementById('ball_in_frame').innerHTML = canv_ballcount;
  document.getElementById('outcome_in_frame').innerHTML = canv_out_text; 
  document.getElementById('xpos').innerHTML = sprite_x;
  //document.getElementsByTagName('matchcomments').style.overflow='auto';
     
}

function getUmpireFrame(signal){
  if (signal.includes("w")) {
      //umpirecode="wide";
      return umpire_framelist[1];
     }
     //out
     if (signal.includes("x")) {
      //umpirecode="noball";
      return umpire_framelist[2];
     }
     //nb
     if (signal.includes("n")) {
      //umpirecode="noball";
      return umpire_framelist[3];
     }
     return umpire_framelist[0];
}

function nextBall() {
  umpirecode="default"; //reset umpire
  ump_srcX=umpire_framelist[0]; //set umpire char frame
  //reset bowler start
  //reset laps to do for animation
  //if current laps are finished, and bowler finished advance the ball for animation.
  if (currentruns==0) {
      canv_ballcount++;
      bwl_sprite_x=550;
    }
  if (canv_ballcount>120) { //Innings1.getMaxBalls()
    canv_ballcount=0;
    inningscount++;
  }
  if (inningscount==1) {
     console.log(canv_out_text);
     canv_out_text=Innings1.getOutcomeText(canv_ballcount);
     currentruns=Innings1.getBallRuns(canv_ballcount);
     battertext=Innings1.getBatterLabel(canv_ballcount);
     bowlertext=Innings1.getBowlerLabel(canv_ballcount);
     signalcode=Innings1.getBallCode(canv_ballcount);
  }
  else {
     canv_out_text=Innings2.getOutcomeText(canv_ballcount);
     currentruns=Innings2.getBallRuns(canv_ballcount);
     battertext=Innings2.getBatterLabel(canv_ballcount);
     bowlertext=Innings2.getBowlerLabel(canv_ballcount);
     signalcode=Innings2.getBallCode(canv_ballcount);
     }
    }


//advance frameCount for Bowler Running
function advanceBowlerFrames() {
  if (bwl_sprite_x>300) {
      bowler_frame++;
  if (bowler_frame==8) {
      bowler_frame=0;
  } 
  bwl_srcX=bowler_framelist[bowler_frame];
  }
 }

//advance frameCount for Batsman Running
function advanceBatterFrames() {
  batter_frame++;
  if (batter_frame==8) {
         batter_frame=0;
  } 
  //moving right
  if (mode==1) {
      srcX=batter_framelist[batter_frame];
  }
   else {
        srcX=batter_framelist[batter_frame+8];
       }
  }

//
function advanceUmpireFrames() {

   ump_srcX=getUmpireFrame(signalcode);
   setTimeout(function() {
      ump_srcX=umpire_framelist[0];
      }, 200)
}
 

//bowler run up for every ball
function doBowl() {
  if (bwl_sprite_x>300) {
    moveBowler_xpos();
    advanceBowlerFrames();
  }
  else {
     advanceUmpireFrames();
  }
}

//make position update and character frame conditional on still running laps
//to make continuous, call position X directly
//this will loop for as many runs as needed, then reset lap counter
//TO DO: change appearance of batsmen if no runs etc
function doLaps() { 

    if (bwl_sprite_x<=300) {
      moveBatter_xpos();
      advanceBatterFrames();
    }
    else {
      
      }
  }

//setup a cycling run for the bowler
//better: setup acceleration and deceleration phases
function moveBowler_xpos() {

    //DO: reset strike batsman
    start=0;
    sprite_x=0;
    srcX=batter_framelist[0];
    //
    var bwltemp = bwl_sprite_x;
    var bwlamplitude=(canv_width/2)-50;
    var bwlcentre = 550; //canv_width/2;
    var bwl_end=300;
    var bwlstep=8;
    //bwl_sprite_x = bwlamplitude * Math.sin( bwl_start ) + bwlcentre;
    bwl_sprite_x -= bwlstep; 
    //bwl_sprite_x -= bwlstep; //basic stride of 0.05 is ok but make it bigger
    console.log("bowler x pos:",bwl_sprite_x,"finished?",bowlerball,"end test:",bwl_end);
    //return 1 if at end of run i.e. mode of direction changes
  }

//setup a cycling run for the batter
//Takes radians.  If you want the batter to run up and back in a second that's PI degrees so 3.14 radians per second.
//If the interval timer is set to 40 Hz (25ms repeat)

function moveBatter_xpos() {
    var temp = sprite_x;
    var amplitude=(canv_width/4)-50;
    var centre = 150; //canv_width/2;
    var step=0.30;
    sprite_x = amplitude * Math.sin( start ) + centre; //radians; Math.PI / 2
    var storemode=mode;
    if (Math.sin(start)<0 || start>(Math.PI/2)) {
      mode=0;
    }
    else {mode=1;}
    start += step; //basic stride of 0.05 is ok but make it bigger
    //return 1 if at end of lap i.e. mode of direction changes
    if (storemode!=mode && start>2*step) {
      lap++;
    }
  }

function drawSprite() {
  ctx.drawImage(batter_sprite,srcX,srcY,sprite_w,sprite_h,sprite_x,sprite_y,sprite_w,sprite_h);
  ctx.drawImage(umpire_sprite,ump_srcX,ump_srcY,sprite_w,sprite_h,ump_sprite_x,ump_sprite_y,sprite_w,sprite_h);
  //bwl_sprite_x
  ctx.drawImage(bowler_sprite,bwl_srcX,bwl_srcY,sprite_w,sprite_h,bwl_sprite_x,bwl_sprite_y,sprite_w,sprite_h);
  //ctx.drawImage(bowler_sprite,bwl_srcX,bwl_srcY,sprite_w,sprite_h,550,bwl_sprite_y,sprite_w,sprite_h);
  ctx.fillText(battertext,sprite_x+10,sprite_y-10);
  ctx.fillText(bowlertext,bwl_sprite_x+10,bwl_sprite_y-10);
}

//keycheck loop
function loop() {
 //no functions for now
}

function keyDown(e) {
  if (e.keyCode == 39) rightKey = true;
  else if (e.keyCode == 37) leftKey = true;
}
function keyUp(e) {
  if (e.keyCode == 39) rightKey = false;
  else if (e.keyCode == 37) leftKey = false;
}

}

//produce results.  Canvas functions inside.
var match = new Results();
