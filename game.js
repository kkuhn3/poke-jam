let currentRound = 0;
let numHints = 0;

function updateRound(attributes) {
	gen.innerHTML = "<span>Generation:</span><br><br>";
	gen.innerHTML += attributes.gen;
	typeone.innerHTML = "<span>Type:</span><br><br>";
	typeone.innerHTML += attributes.type1;
	typetwo.innerHTML = "<span>Type:</span><br><br>";
	typetwo.innerHTML += attributes.type2;
	stage.innerHTML = "<span>Stage:</span><br><br>";
	stage.innerHTML += attributes.stage;
	ability.innerHTML = "<span>Ability:</span><br><br>";
	ability.innerHTML += attributes.ability;
}

function getRoundAttributes(round, index) {
	let attributes = {};
	attributes["gen"] = "Loading";
	attributes["type1"] = "Loading";
	attributes["type2"] = "Loading";
	attributes["stage"] = "Loading";
	attributes["ability"] = "Loading";
	if((round + index) % 5 == 0) {
		attributes["gen"] =  "*";
		attributes["mine"] = "gen";
	}
	else if(moPokes[(5 - round) % 5]) {
		attributes["gen"] = moPokes[(5 - round) % 5].gen;
	}
	if((round + index) % 5 == 1) {
		attributes["type1"] = "*";
		attributes["mine"] = "type1";
	}
	else if(moPokes[(6 - round) % 5]) {
		attributes["type1"] = moPokes[(6 - round) % 5].type1;
	}
	if((round + index) % 5 == 2) {
		attributes["type2"] = "*";
		attributes["mine"] = "type2";
	}
	else if(moPokes[(7 - round) % 5]) {
		attributes["type2"] = moPokes[(7 - round) % 5].type2;
	}
	if((round + index) % 5 == 3) {
		attributes["stage"] = "*";
		attributes["mine"] = "stage";
	}
	else if(moPokes[(8 - round) % 5]) {
		attributes["stage"] = moPokes[(8 - round) % 5].stage;
	}
	if((round + index) % 5 == 4) {
		attributes["ability"] = "*";
		attributes["mine"] = "ability";
	}
	else if(moPokes[(9 - round) % 5]) {
		attributes["ability"] = moPokes[(9 - round) % 5].ability;
	}
	return attributes;
}

function loadRound() {
	const attributes = getRoundAttributes(currentRound, myInd);
	hint.value = "";
	updateRound(attributes);
}

function loadNextRound() {
	if(currentRound === 4) {
		showConclusionIfReady();
	}
	else {
		currentRound = currentRound + 1;
		loadRound();
	}
}

function submitHint(pokemonName) {
	if(!moPokemon[pokemonName]) {
		return false;
	}
	sendHint(pokemonName, myInd, currentRound);
	if(!moHints[currentRound]) {
		moHints[currentRound] = {};
	}
	const attributes = getRoundAttributes(currentRound, myInd);
	numHints = numHints + hintsPerMon(moPokemon[pokemonName], attributes);
	moHints[currentRound][myInd] = pokemonName;
	if(isPlayerOne()) {
		for(index in moUsers) {
			if(isAI(moUsers[index])) {
				const aiHint = generateHint(index);
				sendHint(aiHint, index, currentRound);
				moHints[currentRound][index] = aiHint;
			}
		}
	}
	loadNextRound();
}

function generateHint(index) {
	const attributes = getRoundAttributes(currentRound, index);
	let bestGrade = -1;
	let bestHints = ["Charmeleon"];
	for(const [pokemonKey, pokemon] of Object.entries(moPokemon)) {
		const currentGrade = hintsPerMon(pokemon, attributes);
		if(currentGrade === bestGrade) {
			bestHints.push(pokemon.name);
		}
		if(currentGrade > bestGrade) {
			bestGrade = currentGrade;
			bestHints = [pokemon.name];
		}
	}
	return bestHints[Math.floor(Math.random() * bestHints.length)];
}

function hintsPerMon(pokemon, attributes) {
	let currentGrade = 0;
	if(generation(pokemon) == attributes.gen) {
		currentGrade = currentGrade + 1;
	}
	if(pokemon.stage == attributes.stage) {
		currentGrade = currentGrade + 1;
	}
	if(pokemon.types.includes(attributes.type1)) {
		currentGrade = currentGrade + 1;
	}
	if(pokemon.types.includes(attributes.type2)) {
		currentGrade = currentGrade + 1;
	}
	else if(attributes.type2 === "None" && pokemon.types.length === 1) {
		currentGrade = currentGrade + 1;
	}
	if(monHasAblity(pokemon, attributes.ability)) {
		currentGrade = currentGrade + 1;
	}
	return currentGrade;
}