/* Javascript prototype object (class) to update cricket score for each time step
by Craig Duncan
Java version created 25-6 February 2018
This javascript version 28 February 2018
*/

public class LiveScore {
	int numbatters;
	String batternames[] = new String[11];
	int batterscores[] = new int[11];
	int batterwickets[] = new int[20];
	int batterrunshots[] = new int[11];
	int batterwides[] = new int[11];
	int batterdots[] = new int[11];
	int batternoballs[] = new int[11];
	int batterbyes[] = new int[11];
	int batterlegbyes[] = new int[11];
	int batterBF[] = new int[11];
	//
	int numbowlers;
	String bowlernames[] = new String[11];
	int bowlerscores[] = new int[11];
	int bowlerwickets[] = new int[11];
	int bowlerwides[] = new int[11];
	int bowlerdots[] = new int[11];
	int bowlernoballs[] = new int[11];
	int bowlerbyes[] = new int[11];
	int bowlerlegbyes[] = new int[11];
	int bowlerovers[] = new int[11];
	int bowlermaidens[] = new int[11];
	//
	Boolean maiden = true;
	//
	int totalruns;
	int totalsundries;
	int totalscore;
	int totalwickets;
	int totalbyes;
	int totallegbyes;
	int totalnb;
	int totalwides;
	int totalovers;

public LiveScore() {

}

//constructor with team numbers
public LiveScore(int team1, int team2) {
	this.numbatters=team1;
	this.numbowlers=team2;
	
}

//setup strings with spaces for column widths

public String columnWidth(String myString, int maxWidth) {
	String spacer = "                                    ";
	while (myString.length()<5) {
		myString=myString+" ";
	}
	String mod = myString+spacer.substring(0,maxWidth-myString.length());
	return mod;
}

public void printScores(Innings myInnings) {
	int numbatters = myInnings.getBatterNum();
	int numbowlers = myInnings.getBowlerNum();
	String teamname = myInnings.getBattingTeamName();
	String date = myInnings.getInningsDate();
	String spacer = "                                    ";
	String linedash="-----------------\n";
	System.out.println(linedash+"Innings of "+teamname+" on "+date+"\n"+linedash);
	System.out.println(columnWidth("Batter",20)+columnWidth("---Ball Analysis---",25));
	System.out.println(columnWidth("   ",15)+columnWidth("runs",5)+columnWidth("BF",5)+columnWidth("BR",5)+columnWidth("x",5)+columnWidth(".",5)+columnWidth("w",5)+columnWidth("nb",5)+columnWidth("b",5)+columnWidth("lb",5));
	for (int batters=1;batters<numbatters+1;batters++) {
		String name = myInnings.getBatterName(batters);
		String BF = Integer.toString(this.batterBF[batters]);
		String scoreshots = Integer.toString(this.batterrunshots[batters]);
		String runs = Integer.toString(this.batterscores[batters]);
		String outs = Integer.toString(this.batterwickets[batters]);
		String wideys=Integer.toString(this.batterwides[batters]);
		String dots = Integer.toString(this.batterdots[batters]);
		String nbs = Integer.toString(this.batternoballs[batters]);
		String bbyes = Integer.toString(this.batterbyes[batters]);
		String lbyes = Integer.toString(this.batterlegbyes[batters]);
		System.out.println(columnWidth(name,15)+columnWidth(runs,5)+columnWidth(BF,5)+columnWidth(scoreshots,5)+columnWidth(outs,5)+columnWidth(dots,5)+columnWidth(wideys,5)+columnWidth(nbs,5)+columnWidth(bbyes,5)+columnWidth(lbyes,5));
		}
		System.out.println(columnWidth("Bowler",20)+columnWidth("---Bowler Stats---",25));
		System.out.println(columnWidth("   ",15)+columnWidth("O",6)+columnWidth("M",5)+columnWidth("X",5)+columnWidth("R",5)+columnWidth("wd",5)+columnWidth("nb",5)+columnWidth("Total",7)+columnWidth("Econ(R/O)",10));
	for (int bowlers=1;bowlers<numbowlers+1;bowlers++) {
		String name = myInnings.getBowlerName(bowlers);
		String bwlruns = Integer.toString(this.bowlerscores[bowlers]);
		String bwlwicks = Integer.toString(this.bowlerwickets[bowlers]);
		String bnb = Integer.toString(this.bowlernoballs[bowlers]);
		String widebowl = Integer.toString(this.bowlerwides[bowlers]);
		String bovers = Integer.toString(this.bowlerovers[bowlers]);
		float a = (float)this.bowlerscores[bowlers]; //Float is an object, float is primitive
		float b = (float)this.bowlerovers[bowlers];
		float econ = a/b;
		String bwlecon = Float.toString(econ);
		String becon=bwlecon.substring(0,3);
		String bwlmaidens=Integer.toString(this.bowlermaidens[bowlers]);
		int bowlertotal = this.bowlerscores[bowlers]+this.bowlernoballs[bowlers]+this.bowlerwides[bowlers];
		String bwltotal = Integer.toString(bowlertotal);
		System.out.println(columnWidth(name,15)+columnWidth(bovers,6)+columnWidth(bwlmaidens,5)+columnWidth(bwlwicks,5)+columnWidth(bwlruns,5)+columnWidth(widebowl,5)+columnWidth(bnb,5)+columnWidth(bwltotal,7)+columnWidth(becon,10));
		}
		updateTotals();
		System.out.println(linedash);
		System.out.println(columnWidth("Totals:",15));
		System.out.println(columnWidth("Overs",15)+this.totalovers);
		System.out.println(columnWidth("Wickets :",15)+this.totalwickets);
		System.out.println(columnWidth("Runs",15)+this.totalruns);
		String sundry= Integer.toString(this.totalsundries);
		String totalscoreStr = Integer.toString(this.totalscore);
		System.out.println(columnWidth("All Sundries :",15)+columnWidth(sundry,5));
		System.out.println(columnWidth("--Wides :",20)+this.totalwides);
		System.out.println(columnWidth("--No balls :",20)+this.totalnb);
		System.out.println(columnWidth("--Byes :",20)+this.totalbyes);
		System.out.println(columnWidth("--Leg Byes :",20)+this.totallegbyes);
		System.out.println(columnWidth("Total Score :",15)+columnWidth(totalscoreStr,5));
}

public void addbatterNames(String[] myNames) {
	this.batternames = myNames;
}

/* This 'adds' integer values.  nb if you want to see a trace of runs then add a String variable and 'add' the String for each run
*/

public void addBF (int batter, int value) {
	this.batterBF[batter]=this.batterBF[batter]+value;
}

public void addRuns(int batter, int bowler, int runs) {
	this.batterscores[batter]=this.batterscores[batter]+runs;
	if (runs>0) {
		this.batterrunshots[batter]++;
		this.maiden=false;
	}
	this.bowlerscores[bowler]=this.bowlerscores[bowler]+runs;
	this.totalruns=this.totalruns+runs;
}

public void addWicket(int batter, int bowler) {
	this.batterwickets[batter]++;
	this.bowlerwickets[bowler]++;
	this.totalwickets++;
}

public void addWide(int batter, int bowler, int value) {
	//add just a 'count' to batter wides (dot ball analysis)
	this.batterwides[batter]=this.batterwides[batter]+1;
	//add vaue of wide to bowler/total
	this.bowlerwides[bowler]=this.bowlerwides[bowler]+value;
	this.totalwides=this.totalwides+value;
	this.maiden=false;
}

public void addDot(int batter) {
	this.batterdots[batter]++;
}

public void addNoBall(int batter, int bowler) {
	this.batternoballs[batter]++;
	this.bowlernoballs[bowler]++;
	this.maiden=false;
	this.totalnb++;
}

public void addBye(int batter, int value) {
	this.batterbyes[batter]=this.batterbyes[batter]+value;
	this.totalbyes=this.totalbyes+value;
}

public void addLegBye(int batter,int value) {
	this.batterlegbyes[batter]=this.batterlegbyes[batter]+value;
	this.totallegbyes=this.totallegbyes+value;
}

public void updateTotals() {
	this.totalsundries = this.totalwides+this.totalnb+this.totalbyes+this.totallegbyes;
	this.totalscore = this.totalruns+this.totalsundries;
}

public void updateOvers(int bowler) {
	this.bowlerovers[bowler]++;
	this.totalovers++;
	if (this.maiden==true) {
		this.bowlermaidens[bowler]++;
	}
	this.maiden=true;
}
	
}
