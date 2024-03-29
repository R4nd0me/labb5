
const serverUrl = "http://127.0.0.1:3000";
let jsonDataFile; // All artists
let swagFile; // Singular artist
document.addEventListener("DOMContentLoaded", function () {

    console.log("HTML DOM tree loaded, ready for manipulation");
    requestArtistData(); // auto load all artist data
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
            createButton(); // create button for each artist
            createSearch(); // create search button
            //submitArtist();
        })
    }
    else {
        console.log("Error");
    }
}

async function requestSingle(id) { // Request single artist
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
            requestImage(id);
            displayArtists(swagFile);
        })
    }
    else {
        console.log("Error");
    }
}

async function requestImage(id) { // Request image
    const response = await fetch(serverUrl + "/image/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "image/png",
        },
        body: null,

    });
    if (response.ok) {
        console.log("received image");
        response.blob().then((blobData) => { // Appendar till info_text
            const imgElement = document.createElement("img");
            const findElement = document.getElementById("info_text");
            imgElement.width = 200;
            imgElement.height = 200;
            imgElement.src = URL.createObjectURL(blobData);
            findElement.appendChild(imgElement);
        });
    }
}

async function searchArtist(artistInput) { // Searches artist
    const response = await fetch(serverUrl + "/search/" + artistInput, {
        method: "GET",
        headers: {
            "Content-Type": "text/plain",
        },
        body: null,

    });
    if (response.ok) {
        response.json().then((jsonBody) => {
            console.log(jsonBody);
            let foundFile;
            foundFile = jsonBody.searchResults[0];
            artistId = foundFile._id;
            const foundElement = document.getElementById(artistId);
            foundElement.click();
        })
    }
    else {
        // 
        errorMsg = document.createElement("header");
        errorMsg.innerHTML = "ERROR: Not found in database!";
        document.getElementById("info_text").innerHTML = "";
        document.getElementById("info_text").appendChild(errorMsg);
        console.log("Error: 404 Not found in Database");
    }

}


function createButton() { // Creates button
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
function displayArtists(data) { // displays Artist Data when clicked on
    console.log(data);
    const artistName = document.createElement("h1");
    const artistReal = document.createElement("p");
    const artistDescription = document.createElement("p");
    const artistAliases = document.createElement("p");
    const artistVariations = document.createElement("p");
    const groupMembers = document.createElement("p");
    const discog = document.createElement("p");
    const divContainer = document.getElementById("info_text");
    console.log(data);
    divContainer.innerHTML = "";
    artistName.innerHTML = "Name: " + data.name;
    artistAliases.innerHTML = "Aliases: ";
    artistVariations.innerHTML = "Artist Variations: ";
    discog.innerHTML = "Discog: " + data.discogsUrl;
    divContainer.appendChild(artistName);

    if (!(data.realname == null || data.realname == "")) {
        artistReal.innerHTML = "Real name: ";
        artistReal.innerHTML += data.realname;
        divContainer.appendChild(artistReal);
    }
    if (!(data.aliases == null || data.aliases == "")) {
        for (let i = 0; i < data.aliases.length; i++) {
            artistAliases.innerHTML += data.aliases[i].name + " ";
        }
        divContainer.appendChild(artistAliases);
    }
    if (!(data.nameVariations != null || data.nameVariations != "")) {
        for (let i = 0; i < data.nameVariations.length; i++) {
            artistVariations.innerHTML += data.nameVariations[i] + " ";
        }
        divContainer.appendChild(artistVariations);
        // if(data.membersInGroups != null)
        // const buttonElement = document.getElementById();
    }
    if (data.membersInGroup != null) {
        groupMembers.innerHTML = "Members: ";
        for (let i = 0; i < data.membersInGroup.length; i++) {
            groupMembers.innerHTML += data.membersInGroup[i] + ",";
        }
        divContainer.appendChild(groupMembers);
    }
    if (data.description != null || data.description != "") {
        artistDescription.innerHTML = "Description: " + data.description;
        divContainer.appendChild(artistDescription);
    }
    divContainer.appendChild(discog);
}

function createSearch() { // Creates Searchbar
    const searchBar = document.createElement("input");
    const divElement = document.getElementById("searchBar");
    searchBar.id = "barInput";
    searchBar.placeholder = "Search for artist...";
    searchBar.type = "text";
    searchBar.addEventListener("keypress", event => {
        if (event.key == "Enter") {
            event.preventDefault();
            const inputString = event.target.value;
            console.log(inputString);
            if (inputString.length != 0) {
                searchArtist(inputString);
            }
            else {
                errorMsg = document.createElement("header");
                errorMsg.innerHTML = "Please enter in searchbar";
                document.getElementById("info_text").innerHTML = "";
                document.getElementById("info_text").appendChild(errorMsg);
            }
        }
    });
    divElement.appendChild(searchBar);
}
/*
function submitArtist(){
    const submitArtist = document.createElement("input");
    submitArtist.id = "submitArtist";
    submitArtist.placeholder = "Submit to database...";
    submitArtist.type = "text";
    submitArtist.addEventListener("keypress", event =>{
        if (event.key == "Enter"){
            event.preventDefault();
            const inputString = event.target.value;
            artistArray = inputString.split(",");
            console.log(artistArray);
        }
    });
    const divElement = document.getElementById("submitBar");
    divElement.appendChild(submitArtist);
}
*/
async function submitToDB(data) {
    try {
        const response = await fetch(serverUrl + "/postArtist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            console.log("artist submitted");
        }
    }
    catch (e) {
        console.log(e);
    }

}
function submitArtist() {
    artistJson = {
        "_id": Number(document.getElementById("inputId").value),
        "discogsUrl" : document.getElementById("inputDiscog").value,
        "name":document.getElementById("inputName").value,
        "realname":document.getElementById("inputReal").value,
        "description":document.getElementById("inputDes").value,
        "nameVariations":document.getElementById("inputVariation").value,
        "aliases":document.getElementById("inputAlias").value,
        "membersInGroups":document.getElementById("inputMember").value,
        "referenceUrls":document.getElementById("inputRef").value,
    };

    console.log(artistJson);
    submitToDB(artistJson);
}



// 69420, President of US, https://www.discogs.com/artist/5027629-Joe-Biden, Joseph Robinette Biden Jr., https://en.wikipedia.org/wiki/Joe_Biden