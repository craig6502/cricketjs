//Inspiration:
//https://stackoverflow.com/questions/25805589/javascript-timer-to-change-content-of-a-text
//Started 27 Feb 2018 by Craig Duncan
//This doesn't use a canvas - it's just an HTML page updater
//It works by updating the html tag <label id="yourelementname">10</label>
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
  var ids = ['name','lname','email','password','cpassword','fff'];
  //batting data
  var numbatters=0;
  var batternames = new Array();
  var battingteamname="batting team default";
  var Innings1 = new Innings();

  function increment() {
  if (value<numballs) {
      return value += 1;
  } 
  else {
    //TO DO: finish
    return value;
   }
  }

  function updateDisplay(value) {
    elem.innerHTML = value;
    document.getElementById('msg').innerHTML = textoutput(value);
    //value of text changes because it is in an event handler
    if (text!="") {
      document.getElementById('filemsg').innerHTML=text;
    }
    //match statistics

  }

  //This is called after every time interval set by the start function.
  //to stop this just call clearInterval(run);
  function run() {
    updateDisplay(increment());
    Innings1.printBat();
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
    //update the innings data
    Innings1.setBatTeam(batternames);
    Innings1.setBowlTeam(battingteamname);
    Innings1.setBatNum(numbatters);
    // start the function that runs on intervals
    value=0;
    //Alternatively: var value = parseInt(elem.innerHTML, 10);
    interval = window.setInterval(run, delay);
  }

  //javascript just accepts any number, type of argumentW!
  function textoutput(ballnum){
    //make ids global now
    numballs = ids.length;  //this should equal array size
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
        //this sends the event to the std browser output (if you have developer tools)
         console.log(event.target.result); 
         //simple case: just return all file by text=reader.result;
         var filetext = reader.result; //only update this once in the event handler
         begincycle=true;
         importBatterData(filetext); //process and extract innings data
         if (begincycle=true) {
          startcounter();
         }
       }
       //this must be outside the 'onload' function
       reader.readAsText(file); //to run the method <---callback function
       
    }

//currently not used but available as a private startup function
function wait() {
  
}

function importBatterData (firsttext) {
    var lines = new Array();
    lines = firsttext.split('\r'); //my CSV has CR not LF 
    var rows = lines.length; //this is a count e.g. 7
    //split first line
    var matchdata = lines[0].split(',');
    //grab number of players from Innings data
    numbatters = parseInt(matchdata[0],10);
    var playerdata = new Array(); //array declaration
    for (var x=1; x<numbatters+1; x++) {
      //to do - make sure rows aren't exceeded.
      playerdata[x] = lines[x].split(','); //comma delimiter
    }
   //ids=['slippery','sauce','yellow'];
   var maxballs = playerdata[1].length-1;
   battingteamname = matchdata[1];
   var matchdate = matchdata[2];
   batternames[numbatters]=playerdata[numbatters][0];
   text="Team: "+battingteamname+", Last player: "+batternames[numbatters]+" max balls:"+maxballs.toString();
   ids=playerdata[numbatters]; //just cycle through one player array for now
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
var counter = new Counter(elem, 1000);

// only if you want to start the counter without the program controlling it.
//counter.start();