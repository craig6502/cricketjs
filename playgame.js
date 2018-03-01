//Inspiration:
//https://stackoverflow.com/questions/25805589/javascript-timer-to-change-content-of-a-text
//Started 27 Feb 2018 by Craig Duncan
//The value in between the tags is the innerHTML that is being updated as if a value
function Counter(elem, delay) {
  //this parses the String, the '10' (option) indicates the numeral system to be used i.e. decimal
  var numballs = 0;
  var value = parseInt(elem.innerHTML, 10);
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
  var maxballs = 120;
  //score objects
  var myScoresheet = new Livescore();
  var myScoresheet2 = new Livescore();

  
  function increment() {
      return value += 1;
  }

  function updateDisplay(value) {
    elem.innerHTML = value;
    document.getElementById('msg').innerHTML = textoutput(value);
    //Innings1.processOutcome(ball, myScoresheet);
    text = Innings1.processOutcome(value,myScoresheet);
    //value of text changes because it is in an event handler
    if (text!="") {
      document.getElementById('ballbyball').innerHTML=text;
    }
    //match statistics
  }

  //This is called after every time interval set by the start function.
  //to stop this just call clearInterval(run);
  function run() {
    var ball=increment();
    //process outcome as per Java code in Cricket10.java in playgame method
    //catch increment before it goes over
    if (ball>120) {
      //clearInterval(run);
      //cleanup by removing event listener
      document.getElementById('fileInput').removeEventListener('change', readFile, false);
      if (ball==121) {
        myScoresheet.printScores(Innings1);
      }
      //Don't do this until 2nd run.  myScoresheet2.printScores(Innings2); //run from scoresheet 1?
      return;
    }
    else {
      updateDisplay(ball);
    }
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
    this.maxballs=Innings1.getMaxBalls();
    //Alternatively: var value = parseInt(elem.innerHTML, 10);
    interval = window.setInterval(run, delay);
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
         InningsData(filetext, Innings1);
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
    //maxballs = batterdata[1].length-1;
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

}



// get element
var elem = document.getElementById("txt");
//this reads the value of the ext from an event listener
//make sure the <input> is named id='file'
// <input id="fileInput" type="file">

   


// create counter with element and delay of 500ms
//var counter = new Counter(elem, 500);
//The constructor will create the event listener, so all is running...
var counter = new Counter(elem, 20);

// only if you want to start the counter without the program controlling it.
//counter.start();