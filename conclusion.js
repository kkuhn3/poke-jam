moGuesses = {};

function parseHints(index) {
	moParsedHints = {};
	for(let r = 0; r < 5; r++) {
		const myAttributes = getRoundAttributes(r, index);
		moParsedHints[myAttributes.mine] = [];
		for(let u = 0; u < 5; u++) {
			if(u !== index) {
				const theirAttributes = getRoundAttributes(r, u);
				const hintMon = moPokemon[moHints[r][u]];
				if(isHintRelevant(hintMon, moPokes[index], myAttributes.mine)) {
					hintObj = {};
					hintObj["gen"] = "*";
					hintObj["type1"] = "*";
					hintObj["type2"] = "*";
					hintObj["stage"] = "*";
					hintObj["ability"] = "*";
					if(isHintRelevant(hintMon, theirAttributes, "gen")) {
						hintObj["gen"] = generation(hintMon);
					}
					if(isHintRelevant(hintMon, theirAttributes, "stage")) {
						hintObj["stage"] = hintMon.stage;
					}
					if(isHintRelevant(hintMon, theirAttributes, "type1")) {
						hintObj["type1"] = theirAttributes.type1;
						if(theirAttributes.type1 === "*") {
							hintObj["type1"] = hintMon.types[0]
							if(hintMon.types[0] === theirAttributes.type2) {
								hintObj["type1"] = "None";
								if(hintMon.types.length > 1) {
									hintObj["type1"] = hintMon.types[1];
								}
							}
						}
					}
					if(isHintRelevant(hintMon, theirAttributes, "type2")) {
						hintObj["type2"] = theirAttributes.type2;
						if(theirAttributes.type2 === "*") {
							hintObj["type2"] = "None";
							if(hintMon.types.length > 1) {
								hintObj["type2"] = hintMon.types[1];
								if(hintMon.types[1] === theirAttributes.type1) {
									hintObj["type2"] = hintMon.types[0];
								}
							}
						}
					}
					if(isHintRelevant(hintMon, theirAttributes, "ability")) {
						hintObj["ability"] = theirAttributes.ability;
						if(theirAttributes.ability === "*") {
							hintObj["ability"] = chooseAbility(hintMon);
						}
					}
					hintObj[myAttributes.mine] = "U";
					moParsedHints[myAttributes.mine].push(hintObj);
				}
			}
		}
	}
	return moParsedHints;
}

function isHintRelevant(hintMon, myMon, hintFor) {
	if(myMon[hintFor] === "*") {
		return true;
	}
	switch(hintFor) {
		case "gen":
			return generation(hintMon) === myMon.gen;
		case "stage":
			return hintMon.stage === myMon.stage;
		case "type1":
			return hintMon.types.includes(myMon.type1);
		case "type2":
			if(myMon.type2 === "None") {
				return hintMon.types.length < 2;
			}
			return hintMon.types.includes(myMon.type2);
		case "ability":
			return monHasAblity(hintMon, myMon.ability);
	}
	return false;
}

function showConclusionIfReady() {
	game.style.display = "none";
	waiting.style.display = "block";
	isWaiting = true;
	if(Object.keys(moHints[4]).length === 5) {
		showConclusion();
	}
}

function showConclusion() {
	waiting.style.display = "none";
	conclusion.style.display = "block";
	const moParsedHints = parseHints(myInd);
	const noteDropDown = `
	<div class="autocomplete">
		<input id=ECKS type="text" placeholder="Thoughts?">
	</div>`;
	let i = 0;
	hintTable.innerHTML = `
	<tr>
		<th></th>
		<th>Generation</th>
		<th>Type One</th>
		<th>Type Two</th>
		<th>Stage</th>
		<th>Ability</th>
	</tr>
	<tr>
		<th>Generation</th>
	</tr>`;
	moParsedHints["gen"].forEach(hint => {
		hintTable.innerHTML += "<tr id=\"hintrow" + i + "\"><td>" + noteDropDown.replace("ECKS", "ECKS" + i) + "</td><td>" + hint.gen + "</td><td>" + hint.type1 + "</td><td>" + hint.type2 + "</td><td>" + hint.stage + "</td><td>" + hint.ability + "</td></tr>";
		i++;
	});
	hintTable.innerHTML += `<tr>
		<th>Type One</th>
	</tr>`;
	moParsedHints["type1"].forEach(hint => {
		hintTable.innerHTML += "<tr id=\"hintrow" + i + "\"><td>" + noteDropDown.replace("ECKS", "ECKS" + i) + "</td><td>" + hint.gen + "</td><td>" + hint.type1 + "</td><td>" + hint.type2 + "</td><td>" + hint.stage + "</td><td>" + hint.ability + "</td></tr>";
		i++;
	});
	hintTable.innerHTML += `<tr>
		<th>Type Two</th>
	</tr>`;
	moParsedHints["type2"].forEach(hint => {
		hintTable.innerHTML += "<tr id=\"hintrow" + i + "\"><td>" + noteDropDown.replace("ECKS", "ECKS" + i) + "</td><td>" + hint.gen + "</td><td>" + hint.type1 + "</td><td>" + hint.type2 + "</td><td>" + hint.stage + "</td><td>" + hint.ability + "</td></tr>";
		i++;
	});
	hintTable.innerHTML += `<tr>
		<th>Stage</th>
	</tr>`;
	moParsedHints["stage"].forEach(hint => {
		hintTable.innerHTML += "<tr id=\"hintrow" + i + "\"><td>" + noteDropDown.replace("ECKS", "ECKS" + i) + "</td><td>" + hint.gen + "</td><td>" + hint.type1 + "</td><td>" + hint.type2 + "</td><td>" + hint.stage + "</td><td>" + hint.ability + "</td></tr>";
		i++;
	});
	hintTable.innerHTML += `<tr>
		<th>Ability</th>
	</tr>`;
	moParsedHints["ability"].forEach(hint => {
		hintTable.innerHTML += "<tr id=\"hintrow" + i + "\"><td>" + noteDropDown.replace("ECKS", "ECKS" + i) + "</td><td>" + hint.gen + "</td><td>" + hint.type1 + "</td><td>" + hint.type2 + "</td><td>" + hint.stage + "</td><td>" + hint.ability + "</td></tr>";
		i++;
	});

	for(let j = 0; j < i; j++) {
		autocomplete(document.getElementById("ECKS" + j));
	}

	moGuesses[myInd] = {
		grade: "?",
		givenHints: numHints,
		correctHints: "?",
		recievedHints: i,
		guess: "?????",
		answer: "?????"
	};
	sendMyGuess(moGuesses[myInd]);

	drawGuesses();
}

function drawGuesses() {
	for(let k = 0; k < 5; k++) {
		let thisGradeBox = document.getElementById("grade"+k);
		if(moUsers[k] === "AI"+k) {
			thisGradeBox.innerHTML = "AI Cheats";
			thisGradeBox.style.fontSize = "4vw";
		}
		else if(moGuesses[k]) {
			let leftSide = document.getElementById("grade"+k+"-left");
			let topSide = document.getElementById("grade"+k+"-top");
			let bottomSide = document.getElementById("grade"+k+"-bottom");
			if(k === myInd) {
				thisGradeBox.style.color = "8888ff";
			}

			leftSide.innerHTML = moGuesses[k].grade;
			if(moGuesses[k].grade === "S") {
				leftSide.style.color = "gold";
			}
			else if(moGuesses[k].grade === "A") {
				leftSide.style.color = "green";
			}
			else if(moGuesses[k].grade === "B" || moGuesses[k].grade === "C" || moGuesses[k].grade === "D") {
				leftSide.style.color = "yellow";
			}
			else if(moGuesses[k].grade === "F") {
				leftSide.style.color = "red";
			}
			topSide.innerHTML = "Gave " + moGuesses[k].givenHints + ". Got " + moGuesses[k].correctHints + "/" + moGuesses[k].recievedHints;
			bottomSide.innerHTML = moGuesses[k].guess + " / " + moGuesses[k].answer;
		}
	}
}

function finalGuess(pokemonName) {
	const myMon = moPokemon[pokemonName];
	let i = 0;
	let correctCount = 0;
	let correctMap = {
		gen: true,
		type1: true,
		type2: true,
		stage: true,
		ability: true
	};
	moParsedHints["gen"].forEach(hint => {
		let thisRow = document.getElementById("hintrow"+i);
		thisRow.style.color = "red";
		if(pokemonExists(generation(myMon), hint.type1, hint.type2, hint.stage, {"0" : hint.ability})) {
			thisRow.style.color = "green";
			correctCount++;
		}
		else {
			correctMap.gen = false;
		}
		i++;
	});
	moParsedHints["type1"].forEach(hint => {
		let thisRow = document.getElementById("hintrow"+i);
		thisRow.style.color = "red";
		if(pokemonExists(hint.gen, type1(myMon), hint.type2, hint.stage, {"0" : hint.ability})) {
			thisRow.style.color = "green";
			correctCount++;
		}
		else {
			correctMap.type1 = false;
		}
		i++;
	});
	moParsedHints["type2"].forEach(hint => {
		let thisRow = document.getElementById("hintrow"+i);
		thisRow.style.color = "red";
		if(pokemonExists(hint.gen, hint.type1, type2(myMon), hint.stage, {"0" : hint.ability})) {
			thisRow.style.color = "green";
			correctCount++;
		}
		else {
			correctMap.type2 = false;
		}
		i++;
	});
	moParsedHints["stage"].forEach(hint => {
		let thisRow = document.getElementById("hintrow"+i);
		thisRow.style.color = "red";
		if(pokemonExists(hint.gen, hint.type1, hint.type2, myMon.stage, {"0" : hint.ability})) {
			thisRow.style.color = "green";
			correctCount++;
		}
		else {
			correctMap.stage = false;
		}
		i++;
	});
	moParsedHints["ability"].forEach(hint => {
		let thisRow = document.getElementById("hintrow"+i);
		thisRow.style.color = "red";
		if(pokemonExists(hint.gen, hint.type1, hint.type2, hint.stage, myMon.abilities)) {
			thisRow.style.color = "green";
			correctCount++;
		}
		else {
			correctMap.ability = false;
		}
		i++;
	});

	const myGrade = generateGrade(numHints, correctMap, pokemonName);
	moGuesses[myInd] = {
		grade: myGrade,
		givenHints: numHints,
		correctHints: correctCount,
		recievedHints: i,
		guess: pokemonName,
		answer: moPokes[myInd].name
	};
	sendMyGuess(moGuesses[myInd]);
	drawGuesses();
}

function pokemonExists(sgen, stype1, stype2, sstage, sability) {
	for(const [pokemonKey, pokemon] of Object.entries(moPokemon)) {
		if(sgen === "*" || sgen === generation(pokemon)) {
			if(stype1 === "*" || monHastype(pokemon, stype1)) {
				if(stype2 === "*" || monHastype(pokemon, stype2)) {
					if(sstage === "*" || sstage === pokemon.stage) {
						if(sability["0"] === "*" || monHasOneAbility(pokemon, sability)) {
							return true;
						}
					}
				}
			}
		}
		else if(sgen < generation(pokemon)) {
			return false;
		}
	}
	return false;
}

function monHasOneAbility(pokemon, moAbilities) {
	for(const [abilityKey, ability] of Object.entries(moAbilities)) {
		if(monHasAblity(pokemon, ability)) {
			return true;
		}
	}
	return false;
}

function generateGrade(givenHints, correctMap, pokemonName) {
	if(pokemonName === moPokes[myInd].name) {
		return "S";
	}
	let falseCount = 0;
	for(const [key, bool] of Object.entries(correctMap)) {
		if(!bool) {
			falseCount++;
		}
	}
	let givenHintsOrTen = 10;
	if(givenHints < 10) {
		givenHintsOrTen = givenHints;
	}
	const score = givenHintsOrTen / 2 - falseCount;
	if(score === 5) {
		return "A"
	}
	if(score === 4) {
		return "B"
	}
	if(score === 3) {
		return "C"
	}
	if(score === 2) {
		return "D"
	}
	if(score === 1) {
		return "E"
	}
	if(score < 1) {
		return "F"
	}
}
