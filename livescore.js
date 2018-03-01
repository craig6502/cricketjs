/* Javascript prototype object (class) to update cricket score for each time step
by Craig Duncan
Java version created 25-6 February 2018
This javascript version 28 February 2018
*/

/*
constructor with team numbers
public Livescore(int team1, int team2) {
	this.numbatters=team1;
	this.numbowlers=team2;
	
}
*/

var Livescore =function() {
	this.numbatters=0;
	//try this with 'this' to see if it can be picked up by other methods
	this.batterBF  = [0,0,0,0,0,0,0,0,0,0,0];
	this.batternames  = ["default","default","default","default","default","default","default","default","default","default","default"];
	this.batterscores = [0,0,0,0,0,0,0,0,0,0,0];
	this.batterwickets = [0,0,0,0,0,0,0,0,0,0,0];
	this.batterrunshots = [0,0,0,0,0,0,0,0,0,0,0];
	this.batterwides  = [0,0,0,0,0,0,0,0,0,0,0];
	this.batterdots  = [0,0,0,0,0,0,0,0,0,0,0];
	this.batternoballs = [0,0,0,0,0,0,0,0,0,0,0];
	this.batterbyes  = [0,0,0,0,0,0,0,0,0,0,0];
	this.batterlegbyes  = [0,0,0,0,0,0,0,0,0,0,0];
	
	//
	this.numbowlers=0;
	this.bowlernames  = ["default","default","default","default","default","default","default","default","default","default","default"];
	this.bowlerscores  = [0,0,0,0,0,0,0,0,0,0,0];
	this.bowlerwickets  = [0,0,0,0,0,0,0,0,0,0,0];
	this.bowlerwides  = [0,0,0,0,0,0,0,0,0,0,0];
	this.bowlerdots  = [0,0,0,0,0,0,0,0,0,0,0];
	this.bowlernoballs  = [0,0,0,0,0,0,0,0,0,0,0];
	this.bowlerbyes  = [0,0,0,0,0,0,0,0,0,0,0];
	this.bowlerlegbyes  = [0,0,0,0,0,0,0,0,0,0,0];
	this.bowlerovers  = [0,0,0,0,0,0,0,0,0,0,0];
	this.bowlermaidens  = [0,0,0,0,0,0,0,0,0,0,0];
	//
	this.maiden = true;
	//
	this.totalruns=0;;
	this.totalsundries=0;
	this.totalscore=0;
	this.totalwickets=0;
	this.totalbyes=0;
	this.totallegbyes=0;
	this.totalnb=0;
	this.totalwides=0;
	this.totalovers=0;
	//display
	this.matchtext="default match score";

	this.getBF = function() {
		return this.batterBF;
	}

	this.setBF = function(batter,value) {
		this.batterBF[batter]=value+this.batterBF[batter];
	}

}

//setup strings with spaces for column widths
//TO DO: use equi-width font for screen if spacing cols by characters

Livescore.prototype.columnWidth=function(myString,maxWidth) {
	//var spacer = "                                    ";
	var spacer="";
	var nbrk="_";
	for (var f=0;f<20;f++) {
		spacer=spacer+nbrk;
	}
	while (myString.length<5) {
		myString=myString+"_";
	}
	var mod = myString+spacer.substr(0,maxWidth-myString.length);
	return mod;
}

Livescore.prototype.displayline=function(myLine) {
	//for screen print
	//for console
	console.log(myLine);
}

Livescore.prototype.printScores=function(myInnings) {
	var numbatters = myInnings.getBatterNum();
	var numbowlers = myInnings.getBowlerNum();
	var teamname = myInnings.getBattingTeamName();
	var date = myInnings.getInningsDate();
	var spacer = "                                    ";
	var linedash="-----------------\n";
	this.displayline(linedash+"Innings of "+teamname+" on "+date+"\n"+linedash);
	this.displayline(this.columnWidth("Batter",20)+this.columnWidth("---Ball Analysis---",25));
	this.displayline(this.columnWidth("   ",15)+this.columnWidth("runs",5)+this.columnWidth("BF",5)+this.columnWidth("BR",5)+this.columnWidth("x",5)+this.columnWidth(".",5)+this.columnWidth("w",5)+this.columnWidth("nb",5)+this.columnWidth("b",5)+this.columnWidth("lb",5));
	for (var batters=1;batters<numbatters+1;batters++) {
		var name = myInnings.getBatterName(batters);
		var BF = this.batterBF[batters].toString();
		var scoreshots = this.batterrunshots[batters].toString();
		var runs = this.batterscores[batters].toString();
		var outs = this.batterwickets[batters].toString();
		var wideys=this.batterwides[batters].toString();
		var dots = this.batterdots[batters].toString();
		var nbs = this.batternoballs[batters].toString();
		var bbyes = this.batterbyes[batters].toString();
		var lbyes = this.batterlegbyes[batters].toString();
		this.displayline(this.columnWidth(name,15)+this.columnWidth(runs,5)+this.columnWidth(BF,5)+this.columnWidth(scoreshots,5)+this.columnWidth(outs,5)+this.columnWidth(dots,5)+this.columnWidth(wideys,5)+this.columnWidth(nbs,5)+this.columnWidth(bbyes,5)+this.columnWidth(lbyes,5));
		}
		this.displayline(this.columnWidth("Bowler",20)+this.columnWidth("---Bowler Stats---",25));
		this.displayline(this.columnWidth("   ",15)+this.columnWidth("O",6)+this.columnWidth("M",5)+this.columnWidth("X",5)+this.columnWidth("R",5)+this.columnWidth("wd",5)+this.columnWidth("nb",5)+this.columnWidth("Total",7)+this.columnWidth("Econ(R/O)",10));
		for (var bowlers=1;bowlers<numbowlers+1;bowlers++) {
		var name = myInnings.getBowlerName(bowlers);
		var bwlruns = this.bowlerscores[bowlers].toString();
		var bwlwicks = this.bowlerwickets[bowlers].toString();
		var bnb = this.bowlernoballs[bowlers].toString();
		var widebowl = this.bowlerwides[bowlers].toString();
		var bovers = this.bowlerovers[bowlers].toString();
		var a = this.bowlerscores[bowlers]; //Float is an object, float is primitive
		var b = this.bowlerovers[bowlers];
		var econ = a/b;
		//var bwlecon = Float.toString(econ);
		//var becon=bwlecon.substring(0,3);
		var becon = econ.toFixed(2);
		var bwlmaidens=this.bowlermaidens[bowlers].toString();
		var bowlertotal = this.bowlerscores[bowlers]+this.bowlernoballs[bowlers]+this.bowlerwides[bowlers];
		var bwltotal = bowlertotal.toString();
		this.displayline(this.columnWidth(name,15)+this.columnWidth(bovers,6)+this.columnWidth(bwlmaidens,5)+this.columnWidth(bwlwicks,5)+this.columnWidth(bwlruns,5)+this.columnWidth(widebowl,5)+this.columnWidth(bnb,5)+this.columnWidth(bwltotal,7)+this.columnWidth(becon,10));
		}
		this.updateTotals();
		this.displayline(linedash);
		this.displayline(this.columnWidth("Totals:",15));
		this.displayline(this.columnWidth("Overs",15)+this.totalovers.toString());
		this.displayline(this.columnWidth("Wickets :",15)+this.totalwickets.toString());
		this.displayline(this.columnWidth("Runs",15)+this.totalruns);
		var sundry= this.totalsundries.toString();
		var totalscoreStr = this.totalscore.toString();
		this.displayline(this.columnWidth("All Sundries :",15)+this.columnWidth(sundry,5));
		this.displayline(this.columnWidth("--Wides :",20)+this.totalwides.toString());
		this.displayline(this.columnWidth("--No balls :",20)+this.totalnb.toString());
		this.displayline(this.columnWidth("--Byes :",20)+this.totalbyes.toString());
		this.displayline(this.columnWidth("--Leg Byes :",20)+this.totallegbyes.toString());
		this.displayline(this.columnWidth("Total Score :",15)+this.columnWidth(totalscoreStr,5));
}

Livescore.prototype.displayScore=function(myLine) {
	//for screen print
	this.matchtext=this.matchtext+myLine+"<br>";
	document.getElementById('matchscore').innerHTML=this.matchtext;
}

Livescore.prototype.makeRows=function(table,contents) {
		// Create an empty <tr> element and add it to the 1st position of the table:
		var numrows = contents.length;
		// Insert new cells (<td> elements) at the f position of the "new" <tr> element:
		for (x=0;x<numrows;x++) {
		var entries = contents[x].length;
		row = table.insertRow(x);
			for (var f=0;f<entries;f++) {
				var a = row.insertCell(f);
				a.innerHTML=contents[x][f];
			}
		}
	}


Livescore.prototype.tableScores=function(myInnings, innings) {
	var numbatters = myInnings.getBatterNum();
	var numbowlers = myInnings.getBowlerNum();
	var teamname = myInnings.getBattingTeamName();
	var date = myInnings.getInningsDate();
	var spacer = "                                    ";
	var linedash="-----------------\n";
	//set header above table
	var hdr = "<b>Innings of "+teamname+" on "+date+"</b>";
	if (innings==1)
	{
		document.getElementById('hdr_inn1').innerHTML=hdr;
	}
	else
	{
		document.getElementById('hdr_inn2').innerHTML=hdr;
	}
	//set table
	var tablerows=new Array();
	tablerows[0]=["<b>Batters</b>"];//,"---Ball Analysis---"
	tablerows[1]=["   ","runs","BF","BR","x",".","w","nb","b","lb"];
	for (var batters=1;batters<numbatters+1;batters++) {
		var name = myInnings.getBatterName(batters);
		var BF = this.batterBF[batters].toString();
		var scoreshots = this.batterrunshots[batters].toString();
		var runs = this.batterscores[batters].toString();
		var outs = this.batterwickets[batters].toString();
		var wideys=this.batterwides[batters].toString();
		var dots = this.batterdots[batters].toString();
		var nbs = this.batternoballs[batters].toString();
		var bbyes = this.batterbyes[batters].toString();
		var lbyes = this.batterlegbyes[batters].toString();
	tablerows[1+batters]=[name,runs,BF,scoreshots,outs,dots,wideys,nbs,bbyes,lbyes];
	}
	//make table output
	var tablebat;
	if (innings==1) {
			tablebat = document.getElementById("batters_inn1");
		}
		else {
			tablebat = document.getElementById("batters_inn2");
		}
	tablebat.style.minWidth = "400px";
	this.makeRows(tablebat,tablerows)
		//new table
	var t2rows=new Array();
		t2rows[0]=["<b>Bowlers</b>"]; // ," ","---Bowler Stats---"
		t2rows[1]=["   ","O","M","X","R","wd","nb","Total","Econ(R/O)"];
		for (var bowlers=1;bowlers<numbowlers+1;bowlers++) {
			var name = myInnings.getBowlerName(bowlers);
			var bwlruns = this.bowlerscores[bowlers].toString();
			var bwlwicks = this.bowlerwickets[bowlers].toString();
			var bnb = this.bowlernoballs[bowlers].toString();
			var widebowl = this.bowlerwides[bowlers].toString();
			var bovers = this.bowlerovers[bowlers].toString();
			var a = this.bowlerscores[bowlers]; //Float is an object, float is primitive
			var b = this.bowlerovers[bowlers];
			var econ = a/b;
			//var bwlecon = Float.toString(econ);
			//var becon=bwlecon.substring(0,3);
			var becon = econ.toFixed(2);
			var bwlmaidens=this.bowlermaidens[bowlers].toString();
			var bowlertotal = this.bowlerscores[bowlers]+this.bowlernoballs[bowlers]+this.bowlerwides[bowlers];
			var bwltotal = bowlertotal.toString();
			t2rows[1+bowlers]=[name,bovers,bwlmaidens,bwlwicks,bwlruns,widebowl,bnb,bwltotal,becon];
		}	
	var tablebowl;
		if (innings==1) {
			tablebowl = document.getElementById("bowlers_inn1");
		}
		else {
			tablebowl = document.getElementById("bowlers_inn2");
		}
	tablebowl.style.minWidth = "400px";
	this.makeRows(tablebowl,t2rows);
	//new total scores
		this.updateTotals();
		//contents
		t3rows=new Array();
		t3rows[0]=["<b>Totals:</b>"];
		t3rows[1]=["Overs",this.totalovers.toString()];
		t3rows[2]=["Wickets :",this.totalwickets.toString()];
		t3rows[3]=["Runs",this.totalruns.toString()];
		var sundry= this.totalsundries.toString();
		var totalscoreStr = this.totalscore.toString();
		t3rows[4]=["All Sundries :",sundry];
		t3rows[5]=["--Wides :",this.totalwides.toString()];
		t3rows[6]=["--No balls :",this.totalnb.toString()];
		t3rows[7]=["--Byes :",this.totalbyes.toString()];
		t3rows[8]=["--Leg Byes :",this.totallegbyes.toString()];
		t3rows[9]=["Total Score :",totalscoreStr];
	//choose table to update
		var tablesc;
		if (innings==1) {
			tablesc = document.getElementById("totals_inn1");
		}
		else {
			tablesc = document.getElementById("totals_inn2");
		}
		this.makeRows(tablesc,t3rows);
}


Livescore.prototype.addbatterNames=function(myNames) {
	this.batternames = myNames;
}

/* This 'adds' integer values.  
nb if you want to see a trace of runs then add a String variable and 'add' the String for each run
*/

Livescore.prototype.addBF = function(batter,value) {
	//this.batterBF[batter]=value+this.batterBF[batter];
	//works-->this.setBF(batter,value);
	this.batterBF[batter]=value+this.batterBF[batter];
}

Livescore.prototype.addRuns = function(batter,bowler,runs) {
	this.batterscores[batter]=this.batterscores[batter]+runs;
	if (runs>0) {
		this.batterrunshots[batter]++;
		this.maiden=false;
	}
	this.bowlerscores[bowler]=this.bowlerscores[bowler]+runs;
	this.totalruns=this.totalruns+runs;
}

Livescore.prototype.addWicket = function(batter,bowler) {
	this.batterwickets[batter]++;
	this.bowlerwickets[bowler]++;
	this.totalwickets++;
}

Livescore.prototype.addWide = function(batter,bowler,value) {
	//add just a 'count' to batter wides (dot ball analysis)
	this.batterwides[batter]=this.batterwides[batter]+1;
	//add vaue of wide to bowler/total
	this.bowlerwides[bowler]=this.bowlerwides[bowler]+value;
	this.totalwides=this.totalwides+value;
	this.maiden=false;
}

Livescore.prototype.addDot = function(batter) {
	this.batterdots[batter]++;
}

Livescore.prototype.addNoBall = function(batter,bowler) {
	this.batternoballs[batter]++;
	this.bowlernoballs[bowler]++;
	this.maiden=false;
	this.totalnb++;
}

Livescore.prototype.addBye = function(batter,value) {
	this.batterbyes[batter]=this.batterbyes[batter]+value;
	this.totalbyes=this.totalbyes+value;
}

Livescore.prototype.addLegBye = function(batter,value) {
	this.batterlegbyes[batter]=this.batterlegbyes[batter]+value;
	this.totallegbyes=this.totallegbyes+value;
}

Livescore.prototype.updateTotals = function() {
	this.totalsundries = this.totalwides+this.totalnb+this.totalbyes+this.totallegbyes;
	this.totalscore = this.totalruns+this.totalsundries;
}

Livescore.prototype.updateOvers = function(bowler) {
	this.bowlerovers[bowler]++;
	this.totalovers++;
	if (this.maiden==true) {
		this.bowlermaidens[bowler]++;
	}
	this.maiden=true;
}
