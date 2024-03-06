
const serverUrl = "http://127.0.0.1:3000";
let jsonDataFile;
let swagFile;
document.addEventListener("DOMContentLoaded", function () {

    console.log("HTML DOM tree loaded, ready for manipulation");
    requestArtistData();
});

async function requestArtistData() {
    const response = await fetch(serverUrl + "/artist", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: null,
    });
    if (response.ok) {
        response.json().then((jsonBody) => {
            jsonDataFile = jsonBody.artistsDocuments;
            console.log(jsonDataFile);
            createButton();
        })
    }
    else {
        console.log("Error");
    }
}
async function requestSingle(id) {
    const response = await fetch(serverUrl + "/singleartist/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: null,
    });
    if (response.ok) {
        response.json().then((jsonBody) => {
            console.log(jsonBody);
            swagFile = jsonBody.artistsDocuments[0];
            displayArtists(swagFile);
        })
    }
    else {
        console.log("Error");
    }
}
function createButton() {
    const bodyElement = document.getElementById("knappar");
    for (let i = 0; i < jsonDataFile.length; i++) {
        let button = document.createElement("button");
        button.textContent = jsonDataFile[i].name;
        button.id = jsonDataFile[i]._id;
        button.onclick = function () {
            console.log("click");
            requestSingle(button.id);
            console.log(swagFile);
        };
        bodyElement.appendChild(button);
    }
}

function displayArtists(data) {
    console.log(data);
    const artistName = document.createElement("h1");
    const artistReal = document.createElement("p");
    const artistDescription = document.createElement("p");
    const artistAliases = document.createElement("p");
    const artistVariations = document.createElement("p");
    const groupMembers = document.createElement("p");
    const discog = document.createElement("p");
    const divContainer = document.getElementById("info_text");
    divContainer.innerHTML = "";
    artistName.innerHTML = "Name: " + data.name;
    artistAliases.innerHTML = "Aliases: ";
    artistVariations.innerHTML = "Artist Variations: ";
    discog.innerHTML = "Discog: " + data.discogsUrl;
    divContainer.appendChild(artistName);

    if (data.realname != null) {
        artistReal.innerHTML = "Real name: ";
        artistReal.innerHTML += data.realname;
        divContainer.appendChild(artistReal);
    }
    if (data.aliases != null) {
        for (let i = 0; i < data.aliases.length; i++) {
            artistAliases.innerHTML += data.aliases[i].name + " ";
        }
        divContainer.appendChild(artistAliases);
    }
    if (data.nameVariations != null) {
        for (let i = 0; i < data.nameVariations.length; i++) {
            artistVariations.innerHTML += data.nameVariations[i] + " ";
        }
        divContainer.appendChild(artistVariations);
        // if(data.membersInGroups != null)
        // const buttonElement = document.getElementById();
    }
   if (data.membersInGroup != null){
        groupMembers.innerHTML = "Members: ";
        for (let i = 0; i < data.membersInGroup.length; i++) {
            groupMembers.innerHTML += data.membersInGroup[i] + ",";
        }
        divContainer.appendChild(groupMembers);
    }
    if (data.description != null || data.description != ""){
        artistDescription.innerHTML = "Description: " + data.description;
        divContainer.appendChild(artistDescription);
    }
    divContainer.appendChild(discog);
}