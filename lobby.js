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
					g1.disabled = false;
					g2.disabled = false;
					g3.disabled = false;
					g4.disabled = false;
					g5.disabled = false;
					g6.disabled = false;
					g7.disabled = false;
					g8.disabled = false;
					g9.disabled = false;
					start.disabled = false;
				}
				else {
					g1.disabled = "disabled";
					g2.disabled = "disabled";
					g3.disabled = "disabled";
					g4.disabled = "disabled";
					g5.disabled = "disabled";
					g6.disabled = "disabled";
					g7.disabled = "disabled";
					g8.disabled = "disabled";
					g9.disabled = "disabled";
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