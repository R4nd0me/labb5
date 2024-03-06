/*
 *  Filename: lab-04-material/data-import/mongodb-import.js
 *  Description: This file accompanies is used to import the data within the
 *               artists.json file into the MongoDB database.
 *  Course Code: TNM115-2024VT
 *  Institution: Linköping University
 *
 *  Author: Nico Reski
 *  Version: 2024-02-07
 */

// === IMPORTANT: Database Setup =============================================================
// To run the script, use the CLI to navigate into the same directory as this file,
// and perform the following command: node mongodb-init.js
//
// Observe the console.log() output and ensure that there were no errors.
// Explore the inserted documents in the database/collection via
//  "MongoDB for VS Code" extension directly in Visual Studio Code.
// ===========================================================================================

// declaration of artist data for data import
const artistJsonData = require("./artists.json");       
console.log("Artist Data Loaded for DB Import (version): " + artistJsonData.version);

// MongoDB Driver Module loading, server configuration, and database client initialization
const MongoClient = require("mongodb").MongoClient;
const dbHostname = "127.0.0.1"; 
const dbPort = 27017;
const dbServerUrl = "mongodb://" + dbHostname + ":" + dbPort + "";
const dbClient = new MongoClient(dbServerUrl);

// names of the Database and Collection on the MongoDB Server, used for illustration in this example
const dbName = "tnm115-lab";
const dbCollectionName = "artists";

// helper function (for use use as callback), closing an established (active) connection to the MongoDB server
function closeDbConnection(){
    dbClient.close();
    console.log("=== FINISHED IMPORTING DATA ===");
}

// data insertion operation
async function performArtistsDataImport(){
    console.log("=== START IMPORTING DATA ===");
    
    // in order to make any operation in the database, 3 steps have to be performed:
    await dbClient.connect();                               // (1) establish an active connection to the specified MongoDB server
    const db = dbClient.db(dbName);                         // (2) select (create) a specified database on the server
    const dbCollection = db.collection(dbCollectionName);   // (3) select (create) a specified (document) collection in the database
    
    await dbCollection.insertMany(artistJsonData.artists);
    console.log("Document Count in " +  dbCollectionName + " Collection:", await dbCollection.countDocuments());
}

// run the actual data import
performArtistsDataImport()
    .catch(console.error) 
    .finally(closeDbConnection);