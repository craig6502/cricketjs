/* Javascript prototype object (class) to update cricket score for each time step
by Craig Duncan
Java version created 25-6 February 2018
This javascript version 28 February 2018
*/

/*
constructor with team numbers
public LiveScore(int team1, int team2) {
	this.numbatters=team1;
	this.numbowlers=team2;
	
}
*/

var LiveScore =function() {
	var numbatters=0;
	var batternames = new Array();
	var batterscores = new Array();
	var batterwickets = new Array();
	var batterrunshots = new Array();
	var batterwides = new Array();
	var batterdots = new Array();
	var batternoballs = new Array();
	var batterbyes = new Array();
	var batterlegbyes = new Array();
	var batterBF = new Array();
	//
	var numbowlers=0;
	var bowlernames = new Array();
	var bowlerscores = new Array();
	var bowlerwickets = new Array();
	var bowlerwides = new Array();
	var bowlerdots = new Array();
	var bowlernoballs = new Array();
	var bowlerbyes = new Array();
	var bowlerlegbyes = new Array();
	var bowlerovers = new Array();
	var bowlermaidens = new Array();
	//
	var maiden = true;
	//
	var totalruns;
	var totalsundries;
	var totalscore;
	var totalwickets;
	var totalbyes;
	var totallegbyes;
	var totalnb;
	var totalwides;
	var totalovers;

}

//setup strings with spaces for column widths

LiveScore.prototype.columnWidth=function(myString,maxWidth) {
	var spacer = "                                    ";
	while (myString.length()<5) {
		myString=myString+" ";
	}
	var mod = myString+spacer.substring(0,maxWidth-myString.length());
	return mod;
}

LiveScore.prototype.printScores=function(myInnings) {
	var numbatters = myInnings.getBatterNum();
	var numbowlers = myInnings.getBowlerNum();
	var teamname = myInnings.getBattingTeamName();
	var date = myInnings.getInningsDate();
	var spacer = "                                    ";
	var linedash="-----------------\n";
	console.log(linedash+"Innings of ",teamname+" on ",date,"\n"+linedash);
	console.log(this.columnWidth("Batter",20),this.columnWidth("---Ball Analysis---",25));
	console.log(this.columnWidth("   ",15),this.columnWidth("runs",5),this.columnWidth("BF",5),this.columnWidth("BR",5),this.columnWidth("x",5),this.columnWidth(".",5),this.columnWidth("w",5),this.columnWidth("nb",5),this.columnWidth("b",5),this.columnWidth("lb",5));
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
		console.log(this.columnWidth(name,15),this.columnWidth(runs,5),this.columnWidth(BF,5),this.columnWidth(scoreshots,5),this.columnWidth(outs,5),this.columnWidth(dots,5),this.columnWidth(wideys,5),this.columnWidth(nbs,5),this.columnWidth(bbyes,5),this.columnWidth(lbyes,5));
		}
		console.log(this.columnWidth("Bowler",20),this.columnWidth("---Bowler Stats---",25));
		console.log(this.columnWidth("   ",15),this.columnWidth("O",6),this.columnWidth("M",5),this.columnWidth("X",5),this.columnWidth("R",5),this.columnWidth("wd",5),this.columnWidth("nb",5),this.columnWidth("Total",7),this.columnWidth("Econ(R/O)",10));
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
		console.log(this.columnWidth(name,15),this.columnWidth(bovers,6),this.columnWidth(bwlmaidens,5),this.columnWidth(bwlwicks,5),this.columnWidth(bwlruns,5),this.columnWidth(widebowl,5),this.columnWidth(bnb,5),this.columnWidth(bwltotal,7),this.columnWidth(becon,10));
		}
		updateTotals();
		console.log(linedash);
		console.log(this.columnWidth("Totals:",15));
		console.log(this.columnWidth("Overs",15)+this.totalovers);
		console.log(this.columnWidth("Wickets :",15)+this.totalwickets);
		console.log(this.columnWidth("Runs",15)+this.totalruns);
		var sundry= this.totalsundries.toString();
		var totalscoreStr = this.totalscore.toString();
		console.log(this.columnWidth("All Sundries :",15),this.columnWidth(sundry,5));
		console.log(this.columnWidth("--Wides :",20)+this.totalwides);
		console.log(this.columnWidth("--No balls :",20)+this.totalnb);
		console.log(this.columnWidth("--Byes :",20)+this.totalbyes);
		console.log(this.columnWidth("--Leg Byes :",20)+this.totallegbyes);
		console.log(this.columnWidth("Total Score :",15),this.columnWidth(totalscoreStr,5));
}

LiveScore.prototype.addbatterNames = function(myNames) {
	this.batternames = myNames;
}

/* This 'adds' integer values.  nb if you want to see a trace of runs then add a String variable and 'add' the String for each run
*/

LiveScore.prototype.addBF = function(batter,value) {
	this.batterBF[batter]=this.batterBF[batter]+value;
}

LiveScore.prototype.addRuns = function(batter,bowler,runs) {
	this.batterscores[batter]=this.batterscores[batter]+runs;
	if (runs>0) {
		this.batterrunshots[batter]++;
		this.maiden=false;
	}
	this.bowlerscores[bowler]=this.bowlerscores[bowler]+runs;
	this.totalruns=this.totalruns+runs;
}

LiveScore.prototype.addWicket = function(batter,bowler) {
	this.batterwickets[batter]++;
	this.bowlerwickets[bowler]++;
	this.totalwickets++;
}

LiveScore.prototype.addWide = function(batter,bowler,value) {
	//add just a 'count' to batter wides (dot ball analysis)
	this.batterwides[batter]=this.batterwides[batter]+1;
	//add vaue of wide to bowler/total
	this.bowlerwides[bowler]=this.bowlerwides[bowler]+value;
	this.totalwides=this.totalwides+value;
	this.maiden=false;
}

LiveScore.prototype.addDot = function(batter) {
	this.batterdots[batter]++;
}

LiveScore.prototype.addNoBall = function(batter,bowler) {
	this.batternoballs[batter]++;
	this.bowlernoballs[bowler]++;
	this.maiden=false;
	this.totalnb++;
}

LiveScore.prototype.addBye = function(batter,value) {
	this.batterbyes[batter]=this.batterbyes[batter]+value;
	this.totalbyes=this.totalbyes+value;
}

LiveScore.prototype.addLegBye = function(batter,value) {
	this.batterlegbyes[batter]=this.batterlegbyes[batter]+value;
	this.totallegbyes=this.totallegbyes+value;
}

LiveScore.prototype.updateTotals = function() {
	this.totalsundries = this.totalwides+this.totalnb+this.totalbyes+this.totallegbyes;
	this.totalscore = this.totalruns+this.totalsundries;
}

LiveScore.prototype.updateOvers = function(bowler) {
	this.bowlerovers[bowler]++;
	this.totalovers++;
	if (this.maiden==true) {
		this.bowlermaidens[bowler]++;
	}
	this.maiden=true;
}
