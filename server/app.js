
// SERVER SIDE //
const http = require("node:http");
const hostname = "127.0.0.1";
const port = 3000;
const serverUrl = "http://" + hostname + ":" + port + "";

// file path

const fs = require("fs");
const path = require("path");
const { create } = require("node:domain");

// MONGODB SIDE //
const MongoClient = require("mongodb").MongoClient;
const dbHostName = "127.0.0.1";
const dbPort = 27017;
const dbServerUrl = "mongodb://" + dbHostName + ":" + dbPort + "";
const dbClient = new MongoClient(dbServerUrl);
const dbName = "tnm115-lab";
const dbCollectionName = "artists";



const server = http.createServer((req, res) => {

    console.log("Someone has connected to the server");

    const requestUrl = new URL(serverUrl + req.url);
    const pathComponents = requestUrl.pathname.split("/");

    if (req.method == "GET") {
        switch (pathComponents[1]) {
            case "artist":
                console.log("artist");
                routing_results(res);
                break;
            case "singleartist":
                console.log("singleArtist");
                requestSingleArtist(res, pathComponents[2]);
                break;
            case "image":
                console.log("image");
                returnImageRequest(res, pathComponents[2]);
                break;
            case "search":
                console.log("searching");
                requestTextQuery(res, pathComponents[2]);
                break;
            default:
                sendResponse(res, 200, "text/plain", "Default msg");
                break;
        }
    }
    else if (req.method == "OPTIONS") {
        console.log("options");
        sendResponse(res, 204, null, null);
    }
    else if (req.method == "POST"){
        console.log("POST");
        console.log(pathComponents);
        if (pathComponents[1] == "postArtist"){
            createArtist(res, req);
        }
        //createArtist(res,pathComponents[1]);
        // createArtist(res, pathComponents[1]);
    }
    else {
        console.log("not work");
        sendResponse(res, 404, "text/plain", "Cannot send");
    }
});

server.listen(port, hostname, () => {
    console.log("Server running and listening at " + serverUrl);
});


// MONGODB CONNECTION //

async function routing_results(res) {

    // connect to MongoDB server
    await dbClient.connect();                                   // (1) establish an active connection to the specified MongoDB server
    const db = dbClient.db(dbName);                             // (2) select a specified database on the server
    const dbCollection = db.collection(dbCollectionName);       // (3) select a specified (document) collection in the database

    // query JSON documents
    const findQuery = {};
    const sortQuery = { name: 1 };
    const projectionQuery = {};
    const findAllResult = await dbCollection.find(findQuery).sort(sortQuery).project(projectionQuery).toArray();
    console.log("Found Documents Count:", findAllResult.length);


    // observe: the variable "findAllResult" contains an "array" with all the queried documents;
    //          in order to send these to the client, it makes sense to "wrap" the array into
    //          a new JSON object, serialize (stringify) it, and send the results to the client
    const jsonResult = { artistsDocuments: findAllResult };
    const jsonResultAsString = JSON.stringify(jsonResult);
    sendResponse(res, 200, "application/json", jsonResultAsString);
    console.log("sent response");
    await dbClient.close();
}

async function requestSingleArtist(res, id) {
    // connect to MongoDB server
    console.log(id);
    await dbClient.connect();                                   // (1) establish an active connection to the specified MongoDB server
    const db = dbClient.db(dbName);                             // (2) select a specified database on the server
    const dbCollection = db.collection(dbCollectionName);       // (3) select a specified (document) collection in the database
    id = parseInt(id);

    // query JSON documents
    const findQuery = { _id: id };
    const findAllResult = await dbCollection.find(findQuery).toArray();

    console.log("Found Documents Count:", findAllResult.length);
    console.log("sent response");
    // observe: the variable "findAllResult" contains an "array" with all the queried documents;
    //          in order to send these to the client, it makes sense to "wrap" the array into
    //          a new JSON object, serialize (stringify) it, and send the results to the client
    const jsonResult = { artistsDocuments: findAllResult };
    const jsonResultAsString = JSON.stringify(jsonResult);
    console.log(jsonResult);
    await dbClient.close();
    sendResponse(res, 200, "application/json", jsonResultAsString);
}

function returnImageRequest(res, id) {
    const filePath = "./media";
    const imageFilePath = path.join(filePath + "/" + id + ".png");
    console.log(imageFilePath);
    fs.readFile(imageFilePath, (err, data) => {
        // error handling
        if (err) {
            console.log(err);
            res.statusCode = 200;
            res.setHeader("Content-Type", "image/png");
            const imageFilePath = path.join(filePath + "/" + "PLACEHOLDER.png");
            fs.readFile(imageFilePath, (err, data) => {
                sendResponse(res, 200, "image/png", data);

            });
        }
        // success handling
        else {
            console.log("sent");
            sendResponse(res, 200, "image/png", data);
        }
    });
}

async function requestTextQuery(res, reqText) {
    // connect to MongoDB server
    await dbClient.connect();                                   // (1) establish an active connection to the specified MongoDB server
    const db = dbClient.db(dbName);                             // (2) select a specified database on the server
    const dbCollection = db.collection(dbCollectionName);       // (3) select a specified (document) collection in the database
    const textIndex = await dbCollection.createIndex({ name: "text", description: "text", realname: "text" });
    console.log("Index result:", textIndex);
    const textQuery = { $text : { $search: reqText}};
    const findResult = await dbCollection.find(textQuery).toArray();
    const jsonResult = { searchResults: findResult };
    const jsonResultAsString = JSON.stringify(jsonResult);
    if (findResult.length == 0){
        console.log("No documents found");
        sendResponse(res, 404, "text/plain", "Not found in database");
    }
    else{
        console.log("Found documents:", findResult);
        console.log("Found document count: ", findResult.length);
        sendResponse(res, 200, "application/json", jsonResultAsString);
    }
}
async function createArtist(res, req) {
    await dbClient.connect();                                   // (1) establish an active connection to the specified MongoDB server
    const db = dbClient.db(dbName);                             // (2) select a specified database on the server
    const dbCollection = db.collection(dbCollectionName);       // (3) select a specified (document) collection in the database
   const bodyChunks = [];
    req.on("error", (err) => {
        console.log("ERROR HERE AT line 180");
        sendResponse(res, 500, null, null);
    });

    req.on("data", (chunk) =>{
        bodyChunks.push(chunk)
    });

    req.on("end", async () => {
        const msgBody = Buffer.concat(bodyChunks).toString();
        try {
        await dbCollection.insertOne(JSON.parse(msgBody));
        sendResponse(res, 200, null, null);
        }
        catch (err){
            console.log("Already exists in DB");
            sendResponse(res, 500, "application/json", err);
        }
    });

}

// SENDING RESPONSE // 
function sendResponse(res, statusCode, contentType, data) {
    // configure HTTP response status code, and (if required) Content-Type header
    res.statusCode = statusCode;
    if (contentType != null) res.setHeader("Content-Type", contentType);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    // send (transmit) the HTTP response message
    if (data != null) res.end(data);     // data in HTTP message body
    else res.end();                      // empty HTTP message body
}