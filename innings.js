/* javascript version of innings.java 
This uses prototyping so that the instance variables and methods can be treated similar to classes in java 
If prototyping is not used, then creating a new Innings() will simply clone the function object and values

*/

 var Innings = function() {
	
	//setup gamestates variables for 120 ball U10 game
	  var numballs = 120; //need to be varied once over lengths can vary
    var numbatters=0;
    var numbowlers=0;
    var battingteamname="default";
    var bowlingteamname="default";
    var inningsdate="";
    var batsmen = new Array();
    var bowlers = new Array();
    //for current ball state
	   var bowlername="";
	   var battername="";
	   var outcome="";
	   var runscored=0;
	   var batternum=0;
	   var bowlernum=0;
     var wicket=0;
     var wide=0;
     var dot=0;
     var bye=0;
     var legbye=0;
     var noball=0;
}
//=======SETUP========

Innings.prototype.setBowlingTeam = function(myTeam)
{
	this.bowlingteamname = myTeam;
}

Innings.prototype.setBattingTeam = function(myTeam) {
	this.battingteamname = myTeam;
}

Innings.prototype.setBatterNum = function(numBat) {
	this.numbatters = numBat;
}

Innings.prototype.setBowlerNum = function(numBowl) {
	this.numbowlers = numBowl;
}

//myArray is 2D array
Innings.prototype.setBatsmenGame = function(myArray) {
	this.batsmen = myArray;
}

//myArray is 2D array
Innings.prototype.setBowlersGame = function(myArray) {
	this.bowlers = myArray;
}

Innings.prototype.printBatInnings=function() {
	   //"Team name: "+
     console.log("Batting team name: ",this.getBattingTeamName());
       //"Team size:"+
     console.log("Number of batters: ",this.getBatterNum());
     var batterlist = this.getBatsmenGame();
       for (var x=1;x<this.getBatterNum()+1;x++) {
        //var bname = batterlist[1][0].toString();
        console.log(batterlist[x]);
    	}
	}

//see https://developer.mozilla.org/en-US/docs/Web/API/Console/log

Innings.prototype.printBowlInnings=function() {
  //"Team name: ",
	   console.log("Bowling team name: ",this.getBowlingTeamName());
     //"Team size:",
     console.log("Number of bowlers: ",this.getBowlerNum());
     var bowlerlist = this.getBowlersGame();
       for (var x=1;x<this.getBowlerNum()+1;x++) {
        console.log(bowlerlist[x]);
    	}
	}

// GETTERS

Innings.prototype.getBatterNum=function() {
	return this.numbatters;
}

Innings.prototype.getBowlerNum=function() {
	return this.numbowlers;
}

Innings.prototype.getBattingTeamName=function() {
  return this.battingteamname;
}

Innings.prototype.getBowlingTeamName=function() {
  return this.bowlingteamname;
}

Innings.prototype.getInningsDate=function() {
  return this.inningsdate;
}

Innings.prototype.getBatsmenGame=function() {
  return this.batsmen;
}

Innings.prototype.getBowlersGame=function() {
  return this.bowlers;
}

//====LOADING======
	
//1) batsmen
//2) bowlers

//=== PROCESS AND/OR PRINT BALL RESULT

     //function processOutcome(myBall, myScores) {
     	//setBallState(myBall, myScores);
      function processOutcome(myBall) {
        setBallState(myBall);
      
      /* TO DO:
      myScores.addBF(this.batternum,1);
     	myScores.addRuns(this.batternum, this.bowlernum, this.runscored);
      if (this.wicket==1) {
        myScores.addWicket(this.batternum, this.bowlernum);
      }
      //this is count of wide balls
      if (this.wide!=0) {
        myScores.addWide(this.batternum, this.bowlernum, this.wide);
      }
      if (this.dot==1) {
        myScores.addDot(this.batternum);
      }
      if (this.noball==1) {
        myScores.addNoBall(this.batternum, this.bowlernum);
      }
      //this is a count of number of bye balls
      if (this.bye!=0) {
        //myScores.addBye(this.batternum, this.bye);
        myScores.addBye(this.batternum, 1);
      }
      //this is count of leg bye balls
      if (this.legbye!=0) {
        //myScores.addLegBye(this.batternum, this.legbye);
        myScores.addLegBye(this.batternum, 1);
      }
     	printBallState();
       */
     }
    

    //when accepting myScores as well:
    //function setBallState(myBall, myScores) {

     function setBallState(myBall) {
	     this.batternum = getstrikeBatsman(myBall);
	     if (this.batternum==0) {
	     	return;
	     }
       var currentbowler = this.bowlernum;
	     this.bowlernum = getBowler(myBall);
       //when bowler changes, regardless of balls bowled

       /*TO DO:

       if (myBall>1 && this.bowlernum!=currentbowler) {
        myScores.updateOvers(currentbowler);
       }
       if (myBall==this.numballs) { //end of innings
        myScores.updateOvers(currentbowler);
       }
       */
	     //To do: error checking
	     //BallState myState = new BallState();
	     //unpack ball state from current outcome code
	     this.outcome = batsmen[this.batternum][myBall];
	     this.runscored = getRuns(outcome); 
       this.wicket = getWicket(outcome);
       this.wide = getWide(outcome);
       this.dot = getDot(outcome);
       this.bye = getByes(outcome);
       this.legbye = getLegByes(outcome);
       this.noball = getNoBall(outcome);
	     this.battername = batsmen[this.batternum][0];
	     this.bowlername = bowlers[this.bowlernum][0];
	 }

	 /* return batter name for given batsman */
	 Innings.prototype.getBatterName =function(batterreq) {
	 	return batsmen[batterreq][0];

	 }

   /* return batter name for given batsman */
 Innings.prototype.getBowlerName =function(bowlerreq) {
    return bowlers[bowlerreq][0];

   }
	 /* get runs (if any) as part of outcome 
	 for now, just process integers not multiple events 
   Runs scored off no balls in regular cricet go on batsman's score
   Runs scored off a 'wicket' e.g. run out in junior cricket are added in same way
	 */

	Innings.prototype.getRuns=function(myOutcome) {
	 	switch (myOutcome) {
	 		case "0": return 0;
	 		//break;
	 		case "1": return 1;
	 		case "1x": return 1;
      case "1n": return 1;
      case "1nb": return 1;
	 		case "2": return 2;
	 		case "2x": return 2;
      case "2n": return 2;
      case "2nb": return 2;
	 		case "3": return 3;
	 		case "3x": return 3;
      case "3n": return 3;
      case "3nb": return 3;
	 		case "4": return 4;
	 		case "4x": return 4;
      case "4n": return 4;
      case "4nb": return 4;
	 		case "5": return 5;
	 		case "5x": return 5;
	 		default: return 0;
	 	}
	 }

   /* get wicket (if any) as part of outcome 
   @return 1 if wicket
   @return 0 if no wicket
   */

   Innings.prototype.getWicket=function(myOutcome) {
    switch (myOutcome) {
      case "x": return 1;
      case "1x": return 1;
      case "2x": return 1;
      case "3x": return 1;
      case "4x": return 1;
      case "5x": return 1;
      default: return 0;
    }
   }

   /* get no ball (if any) as part of outcome 
   @return 1 if no ball
   @return 0 if not
   */

   Innings.prototype.getNoBall=function(myOutcome) {
    switch (myOutcome) {
      case "n": return 1;
      case "nb": return 1;
      case "1n": return 1;
      case "2n": return 1;
      case "3n": return 1;
      case "4n": return 1;
      case "5n": return 1;
      case "1nb": return 1;
      case "2nb": return 1;
      case "3nb": return 1;
      case "4nb": return 1;
      case "5nb": return 1;
      default: return 0;
    }
   }

   /* get wide (if any) as part of outcome 
   @return 1 if wide
   @return 0 if no wide
   */

   Innings.prototype.getWide=function(myOutcome) {
    switch (myOutcome) {
      case "w": return 1;
      case "1w": return 1;
      case "2w": return 1;
      case "3w": return 1;
      case "4w": return 1;
      case "5w": return 1;
      default: return 0;
    }
   }

   /* get byes (if any) as part of outcome 
   @return 1 if bye
   @return 0 if no bye
   */

   Innings.prototype.getByes=function(myOutcome) {
    switch (myOutcome) {
      case "b": return 1;
      case "1b": return 1;
      case "2b": return 2;
      case "3b": return 3;
      case "4b": return 4;
      case "5b": return 5;
      default: return 0;
    }
   }

   /* get leg byes (if any) as part of outcome 
   @return 1 if leg bye(s)
   @return 0 if no leg byes
   */

   Innings.prototype.getLegByes=function(myOutcome) {
    switch (myOutcome) {
      case "lb": return 1;
      case "1lb": return 1;
      case "2lb": return 2;
      case "3lb": return 3;
      case "4lb": return 4;
      case "5lb": return 5;
      default: return 0;
    }
   }

   /* get wide (if any) as part of outcome 
   @return 1 if wide
   @return 0 if no wide
   */

   Innings.prototype.getDot=function(myOutcome) {
    switch (myOutcome) {
      case "0": return 1;
      default: return 0;
    }
   }

     /* print ball result 
     //TO DO: link to process outcome
     */

     Innings.prototype.printBallState=function() {
	     //To do: switch statement
	     if (this.outcome.includes( "0")!=-1) {
	     	console.log(this.bowlername+ " to "+this.battername+"  - dot ball : "+this.outcome);
	     	return;
	     }
	     if (this.outcome.includes( "w")!=-1) {
	     	console.log(this.bowlername+ " to "+this.battername+"  - wide(s) : "+this.outcome);
	     	return;
	     }
       /*
       if (this.wide==1) {
        console.log(this.bowlername+ " to "+this.battername+"  - wide(s) : "+this.outcome);
        return;
       }
       */
	     if (this.outcome.includes("b")==true) {
	     	console.log(this.bowlername+ " to "+this.battername+"  - sundries : "+this.outcome);
	     	return;
	     }

	     if (this.outcome.includes("x")==false) {
	     	console.log(this.bowlername+ " to "+this.battername+" hit "+this.outcome);
	     }
	     else {
	     	console.log(this.bowlername+ " to "+this.battername+" Out: "+this.outcome);
	     }
 	 }

     Innings.prototype.getstrikeBatsman=function(myBall) {
     	for (var testplyr=1;testplyr<numbatters+1;testplyr++) {
     		if (batsmen[testplyr][myBall]!=="Z") {
     			return testplyr;
     		}
     	}
     	return 0;
     }

     Innings.prototype.getBowler=function(myBall) {
     	for (var testplyr=1;testplyr<numbowlers+1;testplyr++) {
     		if (bowlers[testplyr][myBall]!=="Z") {
     			return testplyr;
     		}
     	}
     	return 0;
     }
     //no 'privileged' functions needed when writing a prototype
