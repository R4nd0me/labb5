
// SERVER SIDE //
const http = require("node:http");
const hostname = "127.0.0.1";
const port = 3000;
const serverUrl = "http://" + hostname + ":" + port + "";

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

    if (req.method == "GET"){
        switch(pathComponents[1])
        {
            case "artist":
                console.log("artist");
                routing_results(res);
                break;
            case "singleartist":
                console.log("singleArtist");
                requestSingleArtist(res, pathComponents[2]);
                break;
            default:
                sendResponse(res, 200, "text/plain", "Default msg");
                break;
        }
    }
    else if(req.method == "OPTIONS"){
        console.log("options");
        sendResponse(res,204,null,null);
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

async function routing_results(res){

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

async function requestSingleArtist(res, id){
        // connect to MongoDB server
        console.log(id);
        await dbClient.connect();                                   // (1) establish an active connection to the specified MongoDB server
        const db = dbClient.db(dbName);                             // (2) select a specified database on the server
        const dbCollection = db.collection(dbCollectionName);       // (3) select a specified (document) collection in the database
        id = parseInt(id);
        // query JSON documents
        const findQuery = {_id:id};                               
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


// SENDING RESPONSE // 
function sendResponse(res, statusCode, contentType, data){
    // configure HTTP response status code, and (if required) Content-Type header
    res.statusCode = statusCode;
    if (contentType != null) res.setHeader("Content-Type", contentType);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    // send (transmit) the HTTP response message
    if (data != null) res.end(data);     // data in HTTP message body
    else res.end();                      // empty HTTP message body
}