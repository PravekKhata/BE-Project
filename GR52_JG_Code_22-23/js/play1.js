/* some global values */
var pan = new Array(
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0]
	
	
);
var shadow = new Array(
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0]
);
var jie = new Array();
var move_record = new Array();
var passes = [];

function showPan() {
	var c = document.getElementById("weiqi");
	var cxt = c.getContext("2d");
	cxt.strokeStyle="black";
	
	
	cxt.clearRect(0,0,600,600);
	cxt.fillStyle = "#dcb35c";
	cxt.fillRect(0,0,600,600);
	grid(cxt);
	ninePoints(cxt);
	

	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (pan[i][j] === 1) { //black
				var rg = cxt.createRadialGradient((i+1)*30-3, (j+1)*30-3, 1, (i+1)*30-4, (j+1)*30-4, 11);
				rg.addColorStop(1, /*"black"*/"#202020");
				rg.addColorStop(0, "gray");
				cxt.beginPath();
				cxt.arc((i+1)*60, (j+1)*60,30,0,2*Math.PI,false);
				//cxt.fillStyle="black";
				cxt.fillStyle=rg;
				cxt.fill();
				
			}
			else if (pan[i][j] === 2) { //white
				var rg = cxt.createRadialGradient((i+1)*30-3, (j+1)*30-3, 1, (i+1)*30-4, (j+1)*30-4, 11);
				rg.addColorStop(1, /*"lightgray"*/"#e0e0e0");
				rg.addColorStop(0, "white");
				cxt.beginPath();
				cxt.arc((i+1)*60, (j+1)*60,30,0,2*Math.PI,false);
				//cxt.fillStyle="white";
				cxt.fillStyle=rg;
				cxt.fill();
			}
			else if (pan[i][j] === 7) { // fill color
				cxt.beginPath();
				cxt.arc((i+1)*30, (j+1)*30,15,0,2*Math.PI,false);
				cxt.fillStyle="red";
				cxt.fill();
			}
		}
	}
	
	if (move_show_flag) {
		for (var m = 0; m < move_record.length-1; m++) { 
			
			if (pan[move_record[m][0]][move_record[m][1]] === 0)
				continue;

			
			var repeat_move_flag = false;
			for (var j = m+1; j < move_record.length; j++) {
				if (move_record[m][0] === move_record[j][0] &&
						move_record[m][1] === move_record[j][1]) {
					repeat_move_flag = true;
					break;
				}
			}
			if (repeat_move_flag)
				continue;

			
			if (move_record[m][2] % 2 === 1) { //black
				cxt.fillStyle="white";
			} else {
				cxt.fillStyle="black";
			}
			cxt.font="bold 18px sans-serif";
			if (move_record[m][2] > 99) {
				cxt.font="bold 16px sans-serif";
			}
			cxt.font="bold 16px sans-serif";
			cxt.textAlign="center";
			var move_msg = move_record[m][2].toString();
			//cxt.fillText(move_msg, (i+1)*30, (j+1)*30+6);
			cxt.fillText(move_msg, (move_record[m][0]+1)*60, (move_record[m][1]+1)*60+6);

		}
	}
	
	if (move_record.length > 0) {
		cxt.fillStyle = "red";
		var newest_move = move_record.length-1;
		cxt.fillRect(
			(move_record[newest_move][0]+1)*60-5, 
			(move_record[newest_move][1]+1)*60-5, 
			10, 10
		);
	}
}

function play(row, col) {
	if (row < 0 || row > 9 || col < 0 || col > 9) {
		alert("index error....");
		return;
	}

	if (pan[row][col] != 0) {
		
		return;
	}

	var can_down = false; 
	
	var color = 2;
	if (move_count % 2 === 0) { 
		color = 1; 
	}

	if (!have_air(row, col)) {
		if (have_my_people(row, col)) {
			make_shadow();


			flood_fill(row, col, color);	
			if (fill_block_have_air(row, col, color)) {
				can_down = true;
				var dead_body = new Array();
				can_eat(row, col, color, dead_body);
				clean_dead_body(dead_body);
			} else {
				var dead_body = new Array();
				var cret = can_eat(row, col, color, dead_body);
				clean_dead_body(dead_body);

				if (cret) {
					can_down = true;
				} else {
					alert("No liberty. Cannot place the stone!");
				}
			}
		} else {
			var dead_body = new Array();
			var cret = can_eat(row, col, color, dead_body);

			if (cret) {
				if (!is_jie(row, col, dead_body)) {
					clean_dead_body(dead_body);
					can_down = true;
				} else {
					alert("KO,you cannot place the stone.Please play another move!");
				}	
			}
		}
	} else {
		can_down = true;
		var dead_body = new Array();
		can_eat(row, col, color, dead_body);
		clean_dead_body(dead_body);
	}
	if (can_down) {
		stone_down(row, col);
	}
	var blacks = 0, whites = 0;
	for(var sizex = 0; sizex < 9; sizex++)
	{
		for(var sizey = 0; sizey < 9; sizey++)
		{
			if(pan[sizex][sizey]==1)
			blacks++;
			else if(pan[sizex][sizey]==2)
			whites++;
		}
		sizey = 0;


	}
	
	console.log(blacks,whites);

	
	
	const colors = {
		WHITE: 2,
		BLACK: 1
	  }
	  
	const direction = {
		TOP: 1,
		RIGHT: 2,
		BOTTOM: 3,
		LEFT: 4
	  }
	
	  const checkCurrentPoints = (newValues, boardSize) => {
		let whitePoints = 0;
		let blackPoints = 0;
	  
		for (let y = 0; y < boardSize; y++) {
		  const row = newValues[y];
		  for (let x = 0; x < boardSize; x++) {
			const val = row[x];
			const currentColorVal = checkCurrentFieldPoint(newValues, val, y, x, boardSize)
			if (currentColorVal === 1) {
			  whitePoints++
			} else if (currentColorVal === 2) {
			  blackPoints++
			}
		  }
		}
	  
		return [whitePoints, blackPoints]
	  }
	  /**
	   * Determine for what color the point for this field should be assigned
	   */
	  const checkCurrentFieldPoint = (newValues, val, yVal, xVal, boardSize) => {
		if (val === 1) {
		  return 1;
		} else if (val === 2) {
		  return 2;
		} else if (val === 0) {
		  let surroundedColorCheck;
		  // Check top
		  if (yVal != 0) {
			if (newValues[yVal-1][xVal] === 0) {
			  return 0;
			}
			surroundedColorCheck = newValues[yVal-1][xVal]
		  }
		  // Check right
		  else if (xVal !== boardSize-1) {
			if (newValues[yVal][xVal+1] !== surroundedColorCheck) {
			  return 0;
			}
		  } 
		  // Check bottom
		  else if (yVal !== boardSize-1) {
			if (newValues[yVal+1][xVal] !== surroundedColorCheck) {
			  return 0;
			}
		  } 
		  // Check left
		  else if (xVal != 0) {
			if (newValues[yVal][xVal-1] !== surroundedColorCheck) {
			  return 0;
			}
		  }
	  
		  // Pass checking and return color by which is surrounded
		  return surroundedColorCheck;
		}
	  }
	  
	   const isFieldSurroundedByNothing = (newValues, yVal, xVal, boardSize) => {
		// Check top
		if (yVal != 0) {
		  if (newValues[yVal-1][xVal] !== 0) {
			return false;
		  }
		}
		// Check right
		if (xVal !== boardSize-1) {
		  if (newValues[yVal][xVal+1] !== 0) {
			return false;
		  }
		}
		// Check bottom
		if (yVal !== boardSize-1) {
		  if (newValues[yVal+1][xVal] !== 0) {
			return false;
		  }
		}
		// Check left
		if (xVal != 0) {
		  if (newValues[yVal][xVal-1] !== 0) {
			return false;
		  }
		}
	  
		return true;
	  }
	
	  const isGameFinished = (newValues, boardSize) => {
		for (let y = 0; y < boardSize; y++) {
		  const row = newValues[y];
		  for (let x = 0; x < boardSize; x++) {
			const val = row[x];
			if (!isFieldDetermined(newValues, val, y, x, boardSize)) {
			  return false;
			}
		  }
		}
		return true;
	  }
	  
	  /**
	   * Check if field has inserted stone or around are just one color stones
	   */
	   const isFieldDetermined = (newValues, val, yVal, xVal, boardSize) => {
		// Check if is filled with any stone
		if (val !== 0) {
		  return true;
		}
		return isFieldSurroundedByJustOneColor(newValues, yVal, xVal, boardSize)
	  }
	  
	   const isFieldSurroundedByJustOneColor = (newValues, yVal, xVal, boardSize) => {
		let isNeighborChecked = false;
		let isWhiteNeighbor = false;
		let isBlackNeighbor = false;
		// Check top
		if (yVal != 0) {
		  if (newValues[yVal-1][xVal] === 0) {
			return false;
		  } else if (newValues[yVal-1][xVal] === 1) {
			isWhiteNeighbor = true;
		  } else {
			isBlackNeighbor = true;
		  }
		  isNeighborChecked = true;
		}
		// Check right
		if (xVal !== boardSize-1) {
		  if (newValues[yVal][xVal+1] === 0) {
			return false;
		  } else if (newValues[yVal][xVal+1] === 1) {
			if (isNeighborChecked && isBlackNeighbor) {
			  return false;
			}
			isWhiteNeighbor = true;
		  } else {
			if (isNeighborChecked && isWhiteNeighbor) {
			  return false;
			}
			isBlackNeighbor = true;
		  }
		  isNeighborChecked = true;
		}
		// Check bottom
		if (yVal !== boardSize-1) {
		  if (newValues[yVal+1][xVal] === 0) {
			return false;
		  } else if (newValues[yVal+1][xVal] === 1) {
			if (isNeighborChecked && isBlackNeighbor) {
			  return false;
			}
			isWhiteNeighbor = true;
		  } else {
			if (isNeighborChecked && isWhiteNeighbor) {
			  return false;
			}
			isBlackNeighbor = true;
		  }
		  isNeighborChecked = true;
		}
		// Check left
		if (xVal != 0) {
		  if (newValues[yVal][xVal-1] === 0) {
			return false;
		  } else if (newValues[yVal][xVal-1] === 1) {
			if (isNeighborChecked && isBlackNeighbor) {
			  return false;
			}
			// isWhiteNeighbor = true; // ALGORITHM OPTIMIZATION - not used assignment
		  } else {
			if (isNeighborChecked && isWhiteNeighbor) {
			  return false;
			}
			// isBlackNeighbor = true; // ALGORITHM OPTIMIZATION - not used assignment
		  }
		  // isNeighborChecked = true; // ALGORITHM OPTIMIZATION - not used assignment
		}
		// If anywhere around there is no empty fields - say it is determined
		return true;
	  }
	  
	  /**
	   * Evaluate how many stones each user have, including surrounded empty fileds
	   * USE IT JUST WHEN GAME IS FINISHED - it is optimized for this case and otherwise it may return wrong results
	   */
	   const checkFinalPoints = (newValues, boardSize) => {
		let whitePoints = 0;
		let blackPoints = 0;
	  
		for (let y = 0; y < boardSize; y++) {
		  const row = newValues[y];
		  for (let x = 0; x < boardSize; x++) {
			const val = row[x];
			const finalColorVal = checkFinalFieldPoint(newValues, val, y, x, boardSize)
			if (finalColorVal === 1) {
			  whitePoints++
			} else {
			  blackPoints++
			}
		  }
		}
	  
		return [whitePoints, blackPoints]
	  }
	  /**
	   * Determine for what color the point for this field should be assigned
	   */
	  const checkFinalFieldPoint = (newValues, val, yVal, xVal, boardSize) => {
		if (val === 1) {
		  return 1;
		} else if (val === 2) {
		  return 2;
		} else if (val === 0) {
		  // Check top
		  if (yVal != 0) {
			return newValues[yVal-1][xVal] === 1 ? 1 : 2
		  }
		  // Check right
		  else if (xVal !== boardSize-1) {
			return newValues[yVal][xVal+1] === 1 ? 1 : 2
		  } 
		  // Check bottom
		  else if (yVal !== boardSize-1) {
			return newValues[yVal+1][xVal] === 1 ? 1 : 2
		  } 
		  // Check left
		  else if (xVal != 0) {
			return newValues[yVal][xVal-1] === 1 ? 1 : 2
		  }
		}
	  }
	  const evaluateBoard = (newValues, boardSize) => {
		let valuesWereChanged = false;
		let valuesAreChanged = false;
		// Opponent values might be surrounded in more then one place, thus need to be calculated as much time as possible
		do {
		  valuesAreChanged = false;
		  // Iterate over the whole board
		  for (let y = 0; y < boardSize; y++) {
			const row = newValues[y];
			let isChanged = false;
			for (let x = 0; x < boardSize; x++) {
			  const val = row[x];
			  if (val != 0) {
				let [currentValuesChanged, evaluatedValues] = evaluateCurrentValue(newValues, val, y, x, boardSize)
				isChanged = currentValuesChanged;
				// console.log(currentValuesChanged)
				if (currentValuesChanged) {
				  valuesWereChanged = true;
				  valuesAreChanged = true;
				  newValues = evaluatedValues;
				  // return [true, evaluatedValues] // temp....
				  break;
				}
			  }          
			}
			if (isChanged) {
			  break;
			}
		  }
		} while (valuesAreChanged)
		return [valuesWereChanged, newValues]
	  }
	  
	  /**
	   * Check if the current stone in given place is surrounded by opponent's stones
	   */
	  const evaluateCurrentValue = (newValues, val, yVal, xVal, boardSize) => {
		const opponentColor = val === 1 ? 2 : 1;
		let valuesAreChanged = false;
		// let checkedValues = [
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		// ]
		// Chack top
		if (yVal != 0) {
		  if (newValues[yVal-1][xVal] === opponentColor) {
			// console.log(`p 1 val:${val} yVal:${yVal} xVal:${xVal}`)
			let [isSorrounded, obtainedValues] = evaluateOpponentValue(newValues, val, yVal-1, xVal, direction.BOTTOM, boardSize)
			if (isSorrounded) {
			  valuesAreChanged = true;
			  // console.log('pass 1')
			  newValues = obtainedValues;
			}
		  }
		}
		// Check right
		if (xVal !== boardSize-1) {
		  if (newValues[yVal][xVal+1] === opponentColor) {
			// console.log(`p 2 val:${val} yVal:${yVal} xVal:${xVal}`)
			let [isSorrounded, obtainedValues] = evaluateOpponentValue(newValues, val, yVal, xVal+1, direction.LEFT, boardSize)
			if (isSorrounded) {
			  valuesAreChanged = true;
			  // console.log('pass 2')
			  newValues = obtainedValues;
			}
		  }
		}
		// Check bottom
		if (yVal !== boardSize-1) {
		  if (newValues[yVal+1][xVal] === opponentColor) {
			// console.log(`p 3 val:${val} yVal:${yVal} xVal:${xVal}`)
			let [isSorrounded, obtainedValues] = evaluateOpponentValue(newValues, val, yVal+1, xVal, direction.TOP, boardSize)
			if (isSorrounded) {
			  valuesAreChanged = true;
			  // console.log('pass 3')
			  newValues = obtainedValues;
			}
		  }
		}
		// Check left
		if (xVal != 0) {
		  if (newValues[yVal][xVal-1] === opponentColor) {
			// console.log(`p 4 val:${val} yVal:${yVal} xVal:${xVal}`)
			let [isSorrounded, obtainedValues] = evaluateOpponentValue(newValues, val, yVal, xVal-1, direction.RIGHT, boardSize)
			if (isSorrounded) {
			  valuesAreChanged = true;
			  // console.log('pass 4')
			  newValues = obtainedValues;
			}
		  }
		}
		// Resluting Values after current value is placed
		return [valuesAreChanged, newValues]; 
	  }
	  
	  // If it will be refactored, probably possible to remove prevDirection and use just checkedValues
	  const evaluateOpponentValue = (newValues, val, yVal, xVal, prevDirection, boardSize, checkedValuesMap) => {
		if (!checkedValuesMap)
		  checkedValuesMap = Array.from({length: boardSize}, () => Array(boardSize).fill(0));
		// let checkedValuesMap = [
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		//   [0,0,0,0,0,0,0,0,0],
		// ]//checkedValues.map(arr => arr.slice());
		checkedValuesMap[yVal][xVal] = 1;
	  
		const opponentColor = val === 1 ? 2 : 1;
		// console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection}`)
		let evaluatedValues = newValues.map(arr => arr.slice());
	  
		// Chack top
		if (yVal != 0 && prevDirection !== direction.TOP && checkedValuesMap[yVal-1][xVal] != 1) {
		  // console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 1`)
		  if (evaluatedValues[yVal-1][xVal] === opponentColor) {
			let [isSorrounded, obtainedValues, checkedValuesObtained] = evaluateOpponentValue(evaluatedValues, val, yVal-1, xVal, direction.BOTTOM, boardSize, checkedValuesMap.map(arr => arr.slice()))
			if (!isSorrounded) {
			  return [false, newValues];
			}
			evaluatedValues = obtainedValues;
			checkedValuesMap = checkedValuesObtained;
		  } else if (evaluatedValues[yVal-1][xVal] === 0) {
			return [false, newValues];
		  }
		}
		// Check right
		if (xVal !== boardSize-1 && prevDirection !== direction.RIGHT && checkedValuesMap[yVal][xVal+1] != 1) {
		  // console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 2`)
		  if (evaluatedValues[yVal][xVal+1] === opponentColor) {
			let [isSorrounded, obtainedValues, checkedValuesObtained] = evaluateOpponentValue(evaluatedValues, val, yVal, xVal+1, direction.LEFT, boardSize, checkedValuesMap.map(arr => arr.slice()))
			if (!isSorrounded) {
			  return [false, newValues];
			}
			evaluatedValues = obtainedValues;
			checkedValuesMap = checkedValuesObtained;
		  } else if (evaluatedValues[yVal][xVal+1] === 0) {
			return [false, newValues];
		  }
		}
		// Check bottom
		if (yVal !== boardSize-1 && prevDirection !== direction.BOTTOM && checkedValuesMap[yVal+1][xVal] != 1) {
		  // console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 3`)
		  if (evaluatedValues[yVal+1][xVal] === opponentColor) {
			let [isSorrounded, obtainedValues, checkedValuesObtained] = evaluateOpponentValue(evaluatedValues, val, yVal+1, xVal, direction.TOP, boardSize, checkedValuesMap.map(arr => arr.slice()))
			if (!isSorrounded) {
			  return [false, newValues];
			}
			evaluatedValues = obtainedValues;
			checkedValuesMap = checkedValuesObtained;
		  } else if (evaluatedValues[yVal+1][xVal] === 0) {
			return [false, newValues];
		  }
		}
		// Check left
		if (xVal != 0 && prevDirection !== direction.LEFT && checkedValuesMap[yVal][xVal-1] != 1) {
		  // console.log(`eov val:${val} yVal:${yVal} xVal:${xVal} prevDirect:${prevDirection} 4`)
		  if (evaluatedValues[yVal][xVal-1] === opponentColor) {
			let [isSorrounded, obtainedValues, checkedValuesObtained] = evaluateOpponentValue(evaluatedValues, val, yVal, xVal-1, direction.RIGHT, boardSize, checkedValuesMap.map(arr => arr.slice()))
			if (!isSorrounded) {
			  return [false, newValues];
			}
			evaluatedValues = obtainedValues;
			checkedValuesMap = checkedValuesObtained;
		  } else if (evaluatedValues[yVal][xVal-1] === 0) {
			return [false, newValues];
		  }
		}
		// If opponent is surrounded
		evaluatedValues[yVal][xVal] = 0;
		// console.log(evaluatedValues)
		return [true, evaluatedValues, checkedValuesMap];
	  }

	var pass_button = false;
	// var blackpass = false;
	// var whitepass = false;
	// const blackpasses = [];
	// const whitepasses = [];
	var pass = document.getElementById("pass");
	
		pass.onclick = function() {
			//alert(move_show_button);
			pass_button = true
			if (pass_button) {
				// pass.innerHTML="show no";
				console.log(whited);
				console.log(blacked);
				// blackpasses.push(move_count);
				if(move_count - passes[passes.length - 1] == 1){
					// alert("Two Consecutive Passes!!!!!!!!");
					if(blacked > whited){
						alert("Black has won the game");
						document.getElementById('path').style.pointerEvents = 'none';
					}
					else if(whited > blacked){
						alert("White has won the game");
						document.getElementById('path').style.pointerEvents = 'none';
					}
					else{
						alert("The game has ended in a tie as the scores are level");
					}
					
					// move_count++;
				}
					
				else{
				
					passes.push(move_count);
					move_count++;
					pass_button = false;
					console.log(passes);

				}
			}
		}
	      
	var resign = document.getElementById("resign");
		resign.onclick = function() {

			document.getElementById('path').style.pointerEvents = 'none';
			
			if(move_count%2==0){
				alert("Black has resigned, White has won the game");
			}
			else{
				alert("White has resigned, Black has won the game");
			}

		}
}


// Implementing KO rule
function is_jie(row, col, dead_body) { 
	if (dead_body.length === 1) {
		for (var i = 0; i < jie.length; i++) {
			//If it meets (there is coordinates, and move_count is the first hand)
			
			if (	jie[i][0] === dead_body[0][0] && 
					jie[i][1] === dead_body[0][1] && 
					jie[i][2] === move_count) {
				return true;
			}
		}
		//Add the record table
		jie.push([row, col, move_count+1]);
		return false;
	}
	return false;
}


function can_eat(row, col, color, dead_body) {
	var ret = false;
	var anti_color = 2;
	if (color === 2)
		anti_color = 1;

	if (row+1 <= 9-1 && pan[row+1][col] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		flood_fill(row+1, col, anti_color);
		if (!anti_fill_block_have_air(anti_color)) {
			

			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	if (row-1 >= 0 && pan[row-1][col] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		flood_fill(row-1, col, anti_color);
		if (!anti_fill_block_have_air(anti_color)) {
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	if (col+1 <= 9-1 && pan[row][col+1] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		flood_fill(row, col+1, anti_color);
		if (!anti_fill_block_have_air(anti_color)) {
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	if (col-1 >= 0 && pan[row][col-1] === anti_color) {
		make_shadow();
		shadow[row][col] = color;
		flood_fill(row, col-1, anti_color);
		if (!anti_fill_block_have_air(anti_color)) {
			var rret = record_dead_body(dead_body);
			ret = ret || rret;
		}

	}
	return ret;
}

function record_dead_body(db) {
	var ret = false;
	for (var row = 0; row < shadow.length; row++) {
		for (var col = 0; col < shadow[row].length; col++) {
			if (shadow[row][col] === 7) {
				db.push([row, col]);
				ret = true; // it's true have dead body
				//alert("DEAD: "+(row).toString()+","+col.toString());
			}
		}
	}
	return ret;
}
var whited = 0, blacked = 0;
function clean_dead_body(db) {
	
	for (var i = 0; i < db.length; i++) {
		if(pan[db[i][0]][db[i][1]] == 2)
		{
			pan[db[i][0]][db[i][1]] = 0;
		    blacked = blacked + 1;
		}
		if(pan[db[i][0]][db[i][1]] == 1)
		{
			pan[db[i][0]][db[i][1]] = 0;
		    whited = whited + 1;
		}
		//alert("OUT: "+(db[i][0]).toString()+","+(db[i][1]).toString());
	}	

	document.getElementById("white-score").innerHTML = whited;
	document.getElementById("black-score").innerHTML = blacked;
	console.log(whited);
	console.log(blacked);
}

/* Is it free around the filling area? */
function fill_block_have_air(row, col, color) {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			if (i !== row || j !== col) {
				if (shadow[i][j] === 7 && pan[i][j] !== color) {
					return true; // This block is free, but it can be downloaded
				}
			}
		}
	}
	
	return false;
}

function anti_fill_block_have_air(color) {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			if (shadow[i][j] === 7 && pan[i][j] !== color) {
				return true; // live
			}
		}
	}
	
	return false; //die
}

/*Creating a copy of the current state of the game board*/
function make_shadow() {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			shadow[i][j] = pan[i][j];
		}
	}
}

function shadow_to_pan() {
	for (var i = 0; i < pan.length; i++) {
		for (var j = 0; j < pan[i].length; j++) {
			pan[i][j] = shadow[i][j];
		}
	}
}

/* Flood filling, only the shadow board */
function flood_fill(row, col, color) {
	if (row < 0 || row > 9-1 || col < 0 || col > 9-1)
		return;

	var anti_color = 2;
	if (color === 2)
		anti_color = 1;

	if (shadow[row][col] !== anti_color && shadow[row][col] !== 7) { 
		shadow[row][col] = 7; // Indicates that it has been filled
		flood_fill(row+1, col, color);
		flood_fill(row-1, col, color);
		flood_fill(row, col+1, color);
		flood_fill(row, col-1, color);
	}
}

/* Checking if there are any liberties around the stone for different scenarios*/
function have_air(row, col) {
	if (row > 0 && row < 9-1 && col > 0 && row < 9-1) { 
		if (	pan[row+1][col] !== 0 &&
				pan[row-1][col] !== 0 &&
				pan[row][col+1] !== 0 &&
				pan[row][col-1] !== 0 ) {
			//alert("have no air");
			return false;
		} else {
			//alert("have air");
			return true;
		}
	} else if (row === 0 && col > 0 && col < 9-1) { // side
		if (	pan[row+1][col] !== 0 &&
				pan[row][col+1] !== 0 &&
				pan[row][col-1] !== 0 ) {
			//alert("have no air");
			return false;
		} else {
			//alert("have air");
			return true;
		}
	} else if (row === 9-1 && col > 0 && col < 9-1) {
		if (	pan[row-1][col] !== 0 &&
				pan[row][col+1] !== 0 &&
				pan[row][col-1] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (col === 0 && row > 0 && row < 9-1) {
		if (	pan[row][col+1] !== 0 &&
				pan[row+1][col] !== 0 &&
				pan[row-1][col] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (col === 9-1 && row > 0 && row < 9-1) {
		if (	pan[row][col-1] !== 0 &&
				pan[row+1][col] !== 0 &&
				pan[row-1][col] !== 0 ) {
			return false;
		} else {
			return true;
		}
	} else if (row === 0 && col === 0) { 
		if (	pan[row][col+1] !== 0 &&
				pan[row+1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 0 && col === 9-1) {
		if (	pan[row][col-1] !== 0 &&
				pan[row+1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 9-1 && col === 0) {
		if (	pan[row][col+1] !== 0 &&
				pan[row-1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	} else if (row === 9-1 && col === 9-1) {
		if (	pan[row][col-1] !== 0 &&
				pan[row-1][col] !== 0) {
			return false;
		} else {
			return true;
		}
	}		
}

/* Checking if stones near the current stone are the same color or not */
function have_my_people(row, col) { 
	if (row > 0 && row < 9
		-1 && col > 0 && row < 9-1) { 
		if (move_count % 2 === 0) { //Before placing a stone,it is white
			if (	pan[row+1][col] === 1 ||
					pan[row-1][col] === 1 ||
					pan[row][col+1] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row-1][col] === 2 ||
					pan[row][col+1] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 0 && col > 0 && col < 9-1) { // side
		if (move_count % 2 === 0) {
			if (	pan[row+1][col] === 1 ||
					pan[row][col+1] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row][col+1] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 9-1 && col > 0 && col < 9-1) { //side
		if (move_count % 2 === 0) { 
			if (	pan[row-1][col] === 1 ||
					pan[row][col+1] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row-1][col] === 2 ||
					pan[row][col+1] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (col === 9-1 && row > 0 && row < 9-1) {
		if (move_count % 2 === 0) { 
			if (	pan[row+1][col] === 1 ||
					pan[row-1][col] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row-1][col] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (col === 0 && row > 0 && row < 9-1) {
		if (move_count % 2 === 0) { 
			if (	pan[row+1][col] === 1 ||
					pan[row-1][col] === 1 ||
					pan[row][col+1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row-1][col] === 2 ||
					pan[row][col+1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 0 && col === 0) { // Corner
		if (move_count % 2 === 0) { 
			if (	pan[row+1][col] === 1 ||
					pan[row][col+1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row][col+1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 0 && col === 9-1) { 
		if (move_count % 2 === 0) { 
			if (	pan[row+1][col] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row+1][col] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 9-1 && col === 0) { 
		if (move_count % 2 === 0) { 
			if (	pan[row-1][col] === 1 ||
					pan[row][col+1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row-1][col] === 2 ||
					pan[row][col+1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	} else if (row === 9-1 && col === 9-1) {
		if (move_count % 2 === 0) { 
			if (	pan[row-1][col] === 1 ||
					pan[row][col-1] === 1 ) {
				//alert("have my people");
				return true;
			}
		} else {
			if (	pan[row-1][col] === 2 ||
					pan[row][col-1] === 2 ) {
				//alert("have my people");
				return true;
			}
		}
	}

	return false;
}


function stone_down(row, col) {
	if (move_count % 2 === 0) { 
		pan[row][col] = 1;
	} else {
		pan[row][col] = 2;
	}
	move_count ++;
	move_record.push([row, col, move_count]);
}