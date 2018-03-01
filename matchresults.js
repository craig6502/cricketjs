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
  var canvas, ctx, sprites,
    canv_width = 600,
    canv_height = 150,
    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,
    sprite_x = (canv_width / 2) - 25, sprite_y = canv_height - 85, sprite_w = 65, sprite_h = 85,
    srcX = 10, srcY = 0;
    //set some default conditions
    var canv_ballcount=1;
    var canv_innings=1;

  
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

  //This is called after every time interval set by the start function.
  //to stop this just call clearInterval(run);
  function run() {
    startcanvas();
    var matchball=0; 
    var innings=1
    var maxballs=Innings1.getMaxBalls();
    //document.getElementsByTagName('matchcomments').style.overflow='auto';
    while (matchball<maxballs) {
    matchball++;
    commentarytext=Innings1.processOutcome(matchball, myScoresheet);
    updateDisplay(matchball,commentarytext,innings);
   }
    //process outcome as per Java code in Cricket10.java in playgame method
    //while loop for innings 1
    if (matchball==maxballs) {
      //clearInterval(run);
      //cleanup by removing event listener
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
        updateDisplay(matchball,commentarytext,innings);
      }
      if (matchball==maxballs) {
      //clearInterval(run);
      //cleanup by removing event listener
      //document.getElementById('fileInput').removeEventListener('change', readFile, false);
      //myScoresheet2.printScores(Innings2);
      myScoresheet2.tableScores(Innings2,innings);
      }
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
    for (var x=1; x<numbatters+1; x++) {
      //to do - make sure rows aren't exceeded.
      batterdata[x] = lines[x+1].split(','); //comma delimiter
    }
    maxballs = batterdata[1].length-1;
    //
    var line2 = lines[numbatters+2];
    var meta2 = line2.split(',');
    bowlingteamname = meta2[0];
    numbowlers = parseInt(meta2[3],10);
    var bowlingLineStart = numbatters+2;
    for (x=1; x<numbowlers+1; x++) {
      //to do - make sure rows aren't exceeded.
      bowlerdata[x] = lines[x+bowlingLineStart].split(','); //comma delimiter
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
    meta3 = line3.split(',');
    var battingteam2name = meta3[0];
    var batterdata2 = new Array();
    var numbatters2 = parseInt(meta3[3],10);
    for (x=1; x<numbatters2+1; x++) {
      //to do - make sure rows aren't exceeded.
      batterdata2[x] = lines[x+battingLineStart].split(','); //comma delimiter
    }
    maxballs2 = batterdata2[1].length-1;
    //
    line4 = lines[battingLineStart+numbatters+2];
    meta4 = line4.split(',');
    var bowlingteam2name = meta4[0];
    var numbowlers2 = parseInt(meta4[3],10);
    var bowlingLineStart = battingLineStart+numbatters+2;
    var bowlerdata2 = new Array();
    for (x=1; x<numbowlers+1; x++) {
      //to do - make sure rows aren't exceeded.
      bowlerdata2[x] = lines[x+bowlingLineStart].split(','); //comma delimiter
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

  // exports
  // This actually creates a function that our counter can call
  // you'll see it used below.
  //
  // The other functions above cannot be accessed from outside
  // this function.
  document.getElementById('fileInput').addEventListener('change', readFile, false);
  //This is to create a function that can be called publically, to start other private function if needed
  this.start = wait;

function startcanvas() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  sprites = new Image();
  //sprites.src = 'sprites2.png';
  sprites.src = 'cricketer.png';
  setInterval(loop, 1000/30);
  document.addEventListener('keydown', keyDown, false);
  document.addEventListener('keyup', keyUp, false);
}

function clearCanvas() {
  ctx.clearRect(0,0,canv_width,canv_height);
}
//if the right key is pressed it changes the sprite image by 83 pixels
function drawSprite() {
  if (rightKey) {
    canv_ballcount++;
    if (canv_ballcount>Innings1.getMaxBalls()) {
      canv_ballcount=Innings1.getMaxBalls();
    }
    sprite_x += 5;
    if (sprite_x>canv_width-50) {
      sprite_x=canv_width-50;
    }
    /*move sprite
    sprite_x += 5;
    srcX = 83;
    */
  } else if (leftKey) {
    canv_ballcount--;
    if (canv_ballcount<1) {
      canv_ballcount=1;
    }
      sprite_x -= 5;
      if (sprite_x<0) {
        sprite_x=0;
      }
      srcX = 156; 
    }
    document.getElementById('ball_in_frame').innerHTML = canv_ballcount;
    var canv_out_text=Innings1.getOutcomeText(canv_ballcount);
    document.getElementById('outcome_in_frame').innerHTML = canv_out_text; 
    //changes sprite image by 156 pixels
  ctx.drawImage(sprites,srcX,srcY,sprite_w,sprite_h,sprite_x,sprite_y,sprite_w,sprite_h);
  //change the conditions for animation from key press to ballcount.
  if (rightKey == false || leftKey == false) {
    srcX = 10;
  }
}

//write comments based on ballcount for canvas

function writeComments() {
    document.getElementById('ball_in_frame').innerHTML = canv_ballcount;
    var canv_out_text=Innings1.getOutcomeText(canv_ballcount);
    document.getElementById('outcome_in_frame').innerHTML = canv_out_text;
    document.getElementById('xpos').innerHTML = sprite_x;
}

//main animation loop

function loop() {
  clearCanvas();
  writeComments();
  drawSprite();
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
