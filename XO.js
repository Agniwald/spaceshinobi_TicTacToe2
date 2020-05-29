var rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
var cells = document.getElementsByClassName("cell");
var moveCount = 1;
var gameOn = false;
var botFirst = false;

function checkDraw() {
	var count = 0;
	for (var i = 0; i < 9; i++){
		if (cells[i].innerHTML == "X" || cells[i].innerHTML == "O"){ count++; }
	}
	if (count == 9){ return true;}
	return false;
}

function checkWin(symb) {
	for (var r = 0; r < rows.length; r++) {
		var row = rows[r];
		var comparerow = [cells[row[0]].innerHTML, cells[row[1]].innerHTML, cells[row[2]].innerHTML];
		var counts = {};
		for (var i = 0; i < comparerow.length; i++) {
			var num = comparerow[i];
		 	counts[num] = counts[num] ? counts[num] + 1 : 1;
		}
		if (counts[symb] == 3){
			return true;		
		}
	}
	return false;
}

function check() {
	if (checkWin("X")) { alert("X won!"); gameOn = false; return true; }
	else if (checkWin("O")) { alert("O won!"); gameOn = false; return true; }
	else if (checkDraw()) { alert("DRAW!"); gameOn = false; return true; }
	return false;
}

class Connor {
	randomCorner() {
		var corners = [6, 2, 0, 8].sort(function() { return .5 - Math.random(); } );
		for (var c = 0; c < 4; c++) {
			var id = corners[c];
			if (cells[id].innerHTML == " ") {
				cells[id].innerHTML = "O";
				return true;
			}
		}
		return false;
	}

	opCorner() {
		for (var r = 0; r < rows.length-2; r++) {
			var row = rows[r];
			var comparerow = [cells[row[0]].innerHTML, cells[row[1]].innerHTML, cells[row[2]].innerHTML];
			if (JSON.stringify(comparerow)==JSON.stringify(["O", " ", " "])) {
				var finInd = rows[r][2];
				cells[finInd].innerHTML = "O";
				return true;
			} else if (JSON.stringify(comparerow)==JSON.stringify([" ", " ", "O"])){
				var finInd = rows[r][0];
				cells[finInd].innerHTML = "O";
				return true;
			}
		}
		return false;
	}

	checkConnorWin_or_Lose(symb) {
		for (var r = 0; r < rows.length; r++) {
			var row = rows[r];
			var comparerow = [cells[row[0]].innerHTML, cells[row[1]].innerHTML, cells[row[2]].innerHTML];
			var counts = {};
			for (var i = 0; i < comparerow.length; i++) {
				var num = comparerow[i];
			 	counts[num] = counts[num] ? counts[num] + 1 : 1;
			}
			if (counts[symb] == 2 && counts[" "] == 1){
				for (var i = 0; i < 3; i++){
					var g = row[i];
					if (cells[g].innerHTML == " ") {
						cells[g].innerHTML = "O";
						return true;
					}
				}
			}
		}
		return false;
	}

	ConnorMove() {
		if(!check()){
			// First move
			if (moveCount == 1) {

				// If Connor is first => take random corner
				if (botFirst == true) {
					this.randomCorner();
				}
				// If Connor is second => check if center is free and take it
				else {
					if (cells[4].innerHTML == " ") { cells[4].innerHTML = "O";}
					// Otherwise => take random corner
					else { this.randomCorner(); }
				}
			}

			// Second move
			else if (moveCount == 2) {

				// If Connor is first => check if center isn't free and take oposite corner
				if (botFirst == true) {
					if (cells[4].innerHTML == "X") {
						for (var r = 6; r < rows.length; r++) {
							var row = rows[r];
							var comparerow = [cells[row[0]].innerHTML, cells[row[1]].innerHTML, cells[row[2]].innerHTML];
							if (JSON.stringify(comparerow)==JSON.stringify(["O", "X", " "])) {
								var finInd = rows[r][2];
								cells[finInd].innerHTML = "O";
								break;
							} else if (JSON.stringify(comparerow)==JSON.stringify([" ", "X", "O"])){
								var finInd = rows[r][0];
								cells[finInd].innerHTML = "O";
								break;
							}
						}
					} 
					// If center is free => take row-oposite corner
					else { this.opCorner(); }
				}
				// If Connor is second => check for lose and trap
				else {
					// Check lose
					if (!this.checkConnorWin_or_Lose("X")) {
						// Check trap
						var trap = false;
						var sides = [1, 3, 5, 7];
						for (var r = 6; r < rows.length; r++) {
							var row = rows[r];
							var comparerow = [cells[row[0]].innerHTML, cells[row[1]].innerHTML, cells[row[2]].innerHTML];
							if (JSON.stringify(comparerow)==JSON.stringify(["X", "O", "X"])) {
								trap = true;
								for (var i = 0; i < 4; i++) {
									var finInd = sides[i];
									if (cells[finInd].innerHTML == " ") {
										cells[finInd].innerHTML = "O";
										break;
									}
								}
							}
						}
						if (!trap) {this.randomCorner();}
					}
				}
			}

			// Other moves => check for win, lose, row-oposite corner, random corner and any free corner
			else {
				if (!this.checkConnorWin_or_Lose("O")){
					if (!this.checkConnorWin_or_Lose("X")) {
						if(!this.opCorner()) {
							if (!this.randomCorner()) {
								for (var i = 0; i < cells.length; i++) {
									if (cells[i].innerHTML == " ") {cells[i].innerHTML == "O"; }
								}
							}
						}
					}
				}
			}

			// Change move count and check for game status
			moveCount++;
			check();
		}
	}
}

let connor = new Connor();

// Choose who first
document.getElementById("bot").addEventListener("click", function(){
	document.getElementById("hoverboard").remove();
	gameOn = true;
	botFirst = true;
	connor.ConnorMove();
});
document.getElementById("human").addEventListener("click", function(){
	document.getElementById("hoverboard").remove();
	gameOn = true;
});

// Listener for player moves
for(let i = 0; i < cells.length; i++) {
	cells[i].addEventListener("click", function () {
		if (cells[i].innerHTML == " " && gameOn) {
			cells[i].innerHTML = "X";
			connor.ConnorMove();
		}
  	});
}
