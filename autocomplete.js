function autocomplete(inputText) {
	let currentFocus = -1;

	inputText.addEventListener("input", function(e) {
		closeAllLists();
		if (!this.value) { 
			return false;
		}

		let dropDiv = document.createElement("DIV");
		dropDiv.setAttribute("id", this.id + "autocomplete-list");
		dropDiv.setAttribute("class", "autocomplete-items");
		this.parentNode.appendChild(dropDiv);

		const hasWords = hasKeyWords(this.value.toLowerCase());
		for(const [pokemonName, pokemon] of Object.entries(moPokemon)) {
			const index = pokemonName.toLowerCase().indexOf(this.value.toLowerCase());
			if (index != -1) {
				let lineDiv = document.createElement("DIV");
				lineDiv.innerHTML = pokemonName.substr(0, index);
				lineDiv.innerHTML += "<strong>" + pokemonName.substr(index, this.value.length) + "</strong>";
				lineDiv.innerHTML += pokemonName.substr(index + this.value.length);
				lineDiv.innerHTML += "<input type='hidden' value='" + pokemonName + "'>";
				lineDiv.innerHTML += "<br>";
				lineDiv.innerHTML += "<span>" + generation(pokemon) + ", " + type1(pokemon) + "/" + type2(pokemon) + ", " + pokemon.stage + ", " + Object.values(pokemon.abilities).join("/") + "</span>";
				lineDiv.addEventListener("click", function(e) {
					inputText.value = this.getElementsByTagName("input")[0].value;
					closeAllLists();
				});
				dropDiv.appendChild(lineDiv);
			}
			else if (monMatchesFilters(this.value.toLowerCase(), hasWords, pokemon)) {
				let lineDiv = document.createElement("DIV");
				lineDiv.innerHTML = pokemonName;
				lineDiv.innerHTML += "<input type='hidden' value='" + pokemonName + "'>";
				lineDiv.innerHTML += "<br>";
				
				let innerString = "";
				const hasWordsCopy = [...hasWords];
				if (hasWordsCopy.includes("gen:")) {
					innerString += "<strong>" + generation(pokemon) + "</strong>, ";
				}
				else {
					innerString += generation(pokemon) + ", ";
				}
				let matchtype1 = false;
				let matchtype2 = false;
				let valueCopy = this.value.toLowerCase();
				while (hasWordsCopy.includes("type:")) {
					const index = hasWordsCopy.indexOf("type:");
					if (index > -1) { // only splice array when item is found
						hasWordsCopy.splice(index, 1); // 2nd parameter means remove one item only
					}
					const searchWord = getSearchWord(valueCopy, "type:");
					if (type1(pokemon).toLowerCase() === searchWord) {
						matchtype1 = true;
					}
					else if(type2(pokemon).toLowerCase() === searchWord) {
						matchtype2 = true;
					}
					valueCopy = valueCopy.replace("type:", "");
				}
				if (matchtype1) {
					innerString += "<strong>" + type1(pokemon) + "</strong>/";
				}
				else {
					innerString += type1(pokemon) + "/";
				}
				if (matchtype2) {
					innerString += "<strong>" + type2(pokemon) + "</strong>, ";
				}
				else {
					innerString += type2(pokemon) + ", ";
				}
				if (hasWordsCopy.includes("stage:")) {
					innerString += "<strong>" + pokemon.stage + "</strong>, ";
				}
				else {
					innerString += pokemon.stage + ", ";
				}
				let matchAbility1 = false;
				let matchAbility2 = false;
				let matchAbility3 = false;
				while (hasWordsCopy.includes("ability:")) {
					const index = hasWordsCopy.indexOf("ability:");
					if (index > -1) { // only splice array when item is found
						hasWordsCopy.splice(index, 1); // 2nd parameter means remove one item only
					}
					const searchWord = getSearchWord(valueCopy, "ability:");
					for(const [abilityKey, ability] of Object.entries(pokemon.abilities)) {
						if(ability.toLowerCase().replace(" ", "_") === searchWord) {
							if(abilityKey === "0") {
								matchAbility1 = true;
							}
							if(abilityKey === "1") {
								matchAbility2 = true;
							}
							if(abilityKey === "H") {
								matchAbility3 = true;
							}
						}
					}
					valueCopy = valueCopy.replace("ability:", "");
				}
				if (matchAbility1) {
					innerString += "<strong>" + pokemon.abilities["0"] + "</strong>";
				}
				else {
					innerString += pokemon.abilities["0"];
				}
				if (matchAbility2 && pokemon.abilities["1"]) {
					innerString += "/<strong>" + pokemon.abilities["1"] + "</strong>";
				}
				else if (pokemon.abilities["1"]) {
					innerString += "/" + pokemon.abilities["1"];
				}
				if (matchAbility3 && pokemon.abilities["H"]) {
					innerString += "/<strong>" + pokemon.abilities["H"] + "</strong>";
				}
				else if (pokemon.abilities["H"]){
					innerString += "/" + pokemon.abilities["H"];
				}

				lineDiv.innerHTML += "<span>" + innerString + "</span>";
				lineDiv.addEventListener("click", function(e) {
					inputText.value = this.getElementsByTagName("input")[0].value;
					closeAllLists();
				});
				dropDiv.appendChild(lineDiv);
			}
		}
	});

	function monMatchesFilters(valueString, hasWords, pokemon) {
		let stringCopy = valueString;
		for (let i = 0; i < hasWords.length; i++) {
			const searchWord = getSearchWord(stringCopy, hasWords[i]);
			if (hasWords[i] === "gen:" && generation(pokemon) != searchWord) {
				return false;
			}
			if (hasWords[i] === "type:") {
				let containsType = false;
				if (searchWord === "none" && pokemon.types.length > 1) {
					return false;
				}
				if (searchWord === "none") {
					containsType = true;
				}
				else {
					for (let j = 0; j < pokemon.types.length; j++) {
						if (pokemon.types[j].toLowerCase() === searchWord) {
							containsType = true;
							break;
						}
					}
				}
				if (!containsType) {
					return false;
				}
			}
			if (hasWords[i] === "stage:" && ""+stageNumFromString(pokemon.stage) !== searchWord) {
				return false;
			}
			if (hasWords[i] === "ability:") {
				let containsAbility = false;
				for(const [abilityKey, ability] of Object.entries(pokemon.abilities)) {
					if (ability.toLowerCase().replace(" ", "_") === searchWord) {
						containsAbility = true;
						break;
					}
				}
				if (!containsAbility) {
					return false;
				}
			}
			stringCopy = stringCopy.replace(hasWords[i], "");
		}
		return hasWords.length > 0;
	}

	inputText.addEventListener("keydown", function(e) {
		let dropDiv = document.getElementById(this.id + "autocomplete-list");
		let dropLines = null;
		if (dropDiv) {
			dropLines = dropDiv.getElementsByTagName("div");
		}
		if (e.keyCode == 40) {
			currentFocus++;
			addActive(dropLines);
		} 
		else if (e.keyCode == 38) { 
			currentFocus--;
			addActive(dropLines);
		} 
		else if (e.keyCode == 13) {
			e.preventDefault();
			if (currentFocus > -1 && dropLines) {
				dropLines[currentFocus].click();
			}
		}
	});

	function getSearchWord(wholeString, searchTerm) {
		const startIndex = wholeString.indexOf(searchTerm) + searchTerm.length;
		const spaceIndex = wholeString.indexOf(" ", startIndex);
		if (spaceIndex === -1) {
			return wholeString.substring(startIndex);
		}
		return wholeString.substring(startIndex, spaceIndex);
	}

	function addActive(dropLines) {
		if (!dropLines) {
			return false;
		}
		removeActive(dropLines);
		if (currentFocus >= dropLines.length) {
			currentFocus = 0;
		}
		if (currentFocus < 0)  {
			currentFocus = (dropLines.length - 1);
		}
		dropLines[currentFocus].classList.add("autocomplete-active");
	}

	function removeActive(dropLines) {
		for (let i = 0; i < dropLines.length; i++) {
			dropLines[i].classList.remove("autocomplete-active");
		}
	}

	function closeAllLists(elmnt) {
		let allAutoItems = document.getElementsByClassName("autocomplete-items");
		for (let i = 0; i < allAutoItems.length; i++) {
			if (elmnt != allAutoItems[i] && elmnt != inputText) {
				allAutoItems[i].parentNode.removeChild(allAutoItems[i]);
			}
		}
	}

	function hasKeyWords(stringValue) {
		const keyWords = ["gen:", "type:", "stage:", "ability:"];
		let hasWords = [];
		for (let i = 0; i < stringValue.length; i++) {
			for (let j = 0; j < keyWords.length; j++) {
				if (stringValue.substr(i, keyWords[j].length) === keyWords[j]) {
					hasWords.push(keyWords[j]);
				}
			}
			
		}
		return hasWords;
	}

	function stageNumFromString(stageString) {
		if(stageString === "Basic") {
			return 0;
		}
		if(stageString === "Stage 1") {
			return 1;
		}
		return 2;
	}

	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}
