moPokemon = {};

function generatePokemon() {
	const pokemon = randomPokemon(loGens);
	return {
		"name": pokemon.name,
		"gen": generation(pokemon),
		"stage": pokemon.stage,
		"type1": type1(pokemon),
		"type2": type2(pokemon),
		"ability": chooseAbility(pokemon)
	};
}

function randomPokemon() {
	const pokemonKeys = Object.keys(moPokemon);
	const pokemon = moPokemon[pokemonKeys[ pokemonKeys.length * Math.random() << 0]];
	if(isPokemonValid(pokemon, loGens)) {
		return pokemon
	}
	return randomPokemon(loGens);
}

function isPokemonValid(pokemon, loGens) {
	if(pokemon.num < 1) {
		return false;
	}
	if(pokemon.forme) {
		return false;
	}
	if(!loGens.includes(generation(pokemon))) {
		return false;
	}
	return true;
}

function monHasAblity(pokemon, abilityName) {
	for(const [abilityKey, ability] of Object.entries(pokemon.abilities)) {
		if(ability === abilityName) {
			return true;
		}
	}
	return false;
}

function monHastype(pokemon, typeName) {
	if(pokemon.types.includes(typeName)) {
		return true;
	}
	if(pokemon.types.length < 2 && typeName === "None") {
		return true;
	}
	return false;
}

function reqStage(pokemon) {
	if(pokemon.prevo) {
		return 1 + reqStage(getMonFromName(pokemon.prevo));
	}
	return 0;
}

function genstage(pokemon) {
	let intStage = reqStage(pokemon);
	if(intStage) {
		return "Stage " + intStage;
	}
	return "Basic";
}

function type1(pokemon) {
	return pokemon.types[0];
}

function type2(pokemon) {
	if(pokemon.types.length > 1) {
		return pokemon.types[1];
	}
	else {
		return "None";
	}
}

function generation(pokemon) {
	if(pokemon.num < 152) {
		return 1;
	}
	if(pokemon.num < 252) {
		return 2;
	}
	if(pokemon.num < 387) {
		return 3;
	}
	if(pokemon.num < 495) {
		return 4;
	}
	if(pokemon.num < 650) {
		return 5;
	}
	if(pokemon.num < 722) {
		return 6;
	}
	if(pokemon.num < 810) {
		return 7;
	}
	if(pokemon.num < 906) {
		return 8;
	}
	return 9;
}

function chooseAbility(pokemon) {
	const abilityKeys = Object.keys(pokemon.abilities);
	return pokemon.abilities [abilityKeys[ abilityKeys.length * Math.random() << 0]];
}

function generateMapOfPokemon() {
	for(const [pokemonKey, pokemon] of Object.entries(pokedex)) {
		if(isPokemonValid(pokemon, loGens)) {
			moPokemon[pokemon.name] = pokemon;
			moPokemon[pokemon.name]["key"] = pokemonKey;
			moPokemon[pokemon.name]["stage"] = genstage(pokemon);
		}
	}
}

function getGens() {
	return [1, 2, 3, 4, 5, 6, 7, 8, 9];
}

function getMonFromName(pokemonName) {
	for(const [pokemonKey, pokemon] of Object.entries(pokedex)) {
		if(pokemonName === pokemon.name) {
			return pokemon;
		}
	}
}