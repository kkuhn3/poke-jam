let myInd = null;
let moUsers = {};

function updateLobby(loUsers) {
	for(let i = 0; i < players.children.length; i++) {
		if(loUsers.length > i) {
			moUsers[i] = loUsers[i];
			players.children[i].innerHTML = loUsers[i];
			if(myId == loUsers[i]) {
				players.children[i].style.color = "8888ff";
				myInd = i;
				if(i === 0) {
					start.disabled = false;
				}
				else {
					start.disabled = true;
				}
			}
			else {
				players.children[i].style.color = "dddddd";
			}
		}
		else {
			moUsers[i] = "AI"+i;
			players.children[i].innerHTML = "AI";
			players.children[i].style.color = "dddddd";
		}
	}
}