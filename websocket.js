let socket = null;
let myId = null;
let myPokemon = null;
let moPokes = {};
let moHints = {};
let loGens = [];
let isWaiting = false;

let loPings = [];
let startTime = null;
if(localStorage.getItem('kpow2Pings') != null){
	loPings = JSON.parse(localStorage.getItem('kpow2Pings'));
}

function socketStart() {
	socket = new WebSocket("ws://127.0.0.1:7979");
	
	socket.addEventListener('open', function (event) {
		socket.send('{"party":"pokejam"}');
	});

	socket.addEventListener('message', function (event) {
		console.log(event.data);
		if(event.data === "pong") {
			let endTime = Date.now();
			let delta = endTime - startTime;
			loPings.push(delta);
			localStorage.setItem("kpow2Pings", JSON.stringify(loPings));
		}
		else {
			const message = JSON.parse(event.data);
			if(message.party) {
				updateLobby(message.party);
			}
			if(message.pokeJam) {
				if(message.pokeJam === "startGame") {
					startGame(message.loGens);
				}
				if(message.pokeJam === "updatePokemon") {
					moPokes[message.from] = message.pokemon;
					loadRound();
				}
				if(message.pokeJam === "hint") {
					if(!moHints[message.round]) {
						moHints[message.round] = {};
					}
					moHints[message.round][message.from] = message.pokemon;
					if(isWaiting) {
						showConclusionIfReady();
					}
				}
				if(message.pokeJam === "guess") {
					moGuesses[message.from] = message.guess;
					drawGuesses();
				}
			}
			if(message.resourceId) {
				myId = message.resourceId;
			}
		}
	});
}

function isPlayerOne() {
	return myInd === 0;
}

function isAI(user) {
	return typeof user === 'string';
}

function startGame(inputGens) {
	game.style.display = "block";
	lobby.style.display = "none";
	loGens = inputGens;
	
	if(isPlayerOne()) {
		loGens = getGens();
		socket.send('{"party":"pokejam", "finalize":true}');
		socket.send('{"pokeJam":"startGame", "loGens":' + JSON.stringify(loGens) + '}');
	}
	
	generateMapOfPokemon();
	myPokemon = generatePokemon();
	socket.send('{"pokeJam":"updatePokemon","from":' + myInd + ',"pokemon":' + JSON.stringify(myPokemon) + '}');
	moPokes[myInd] = myPokemon;
	if(isPlayerOne()) {
		for(index in moUsers) {
			if(isAI(moUsers[index])) {
				const aiMon = generatePokemon();
				socket.send('{"pokeJam":"updatePokemon","from":' + index + ',"pokemon":' + JSON.stringify(aiMon) + '}');
				moPokes[index] = aiMon;
			}
		}
	}
	loadRound();
}

function sendHint(pokemonName, ind, round) {
	socket.send('{"pokeJam":"hint","from":' + ind + ',"round":' + round + ',"pokemon":"' + pokemonName + '"}');
	startTime = Date.now();
	socket.send("ping");
}

function sendMyGuess(myGuess) {
	socket.send('{"pokeJam":"guess","from":' + myInd + ',"guess":' + JSON.stringify(myGuess) + '}');
	startTime = Date.now();
	socket.send("ping");
}