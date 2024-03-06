/*
 *  Filename: scripts.js
 *  Description: This file illustrates how to dynamically handle a submission from an HTML input element node of type text.
 *  Course Code: TNM115-2024VT
 *  Institution: Linköping University
 *
 *  Author: Nico Reski
 *  Version: 2024-02-11
 */

// a simple function for processing the current state (values) of various input HTML element nodes of type text
function submitText(){

    // overall workflow for retrieving the "value" of an input HTML element node of type text:
    // 1. get a reference to the respective input HTML element node; the easist: utilize the getElementById() function (see HTML DOM Manipulation)
    // 2. access the .value property of the referred input HTML element node

    const gameNameTextValue = document.getElementById("game_name").value;
    console.log("Game Name:");
    console.log(gameNameTextValue);
    console.log(typeof(gameNameTextValue));
    console.log("==========");

    const gameYearTextValue = document.getElementById("game_year").value;
    console.log("Release Year:");
    console.log(gameYearTextValue);
    console.log(typeof(gameYearTextValue));
    console.log("==========");

    const gameDeveloperTextValue = document.getElementById("game_developer").value;
    console.log("Developer:");
    console.log(gameDeveloperTextValue);
    console.log(typeof(gameDeveloperTextValue));
    console.log("==========");

    const gameCommentTextValue = document.getElementById("game_comment").value;
    console.log("Comment:");
    console.log(gameCommentTextValue);
    console.log(typeof(gameCommentTextValue));
    console.log("==========");
}