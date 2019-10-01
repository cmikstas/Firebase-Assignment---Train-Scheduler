
//code for loading Firebase
var firebaseConfig =
{
  apiKey: "AIzaSyCZmpMUDLA55Li2JKm8K42Jv_gCAG_v5Lg",
  authDomain: "bootcamp-project-09242019.firebaseapp.com",
  databaseURL: "https://bootcamp-project-09242019.firebaseio.com",
  projectId: "bootcamp-project-09242019",
  storageBucket: "bootcamp-project-09242019.appspot.com",
  messagingSenderId: "344953998725",
  appId: "1:344953998725:web:119bcabddb32ce5dbd48ec"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$( document ).ready(function()
{
    submitBtn();
});

//code to store train info into firebase and add to train schedule div
//database.ref().on("child_added", function(childSnapshot) {
    //console.log(childSnapshot.val());
  
    // Store everything into a variable.
    //var trainName = childSnapshot.val().train;
    //var destination = childSnapshot.val().dest;
    //var firstTrain = childSnapshot.val().first;
    //var frequency = childSnapshot.val().freq;

    // Employee Info
    //console.log(trainName);
    //console.log(destination);
    //console.log(firstTrain);
    //console.log(frequency);


    //new row information
    //var trainRow = $("<tr>").append(
        //$("<td>").text(trainName),
        //$("<td>").text(destination),
        //$("<td>").text(empStartPretty),
        //$("<td>").text(empMonths),
        //$("<td>").text(frequency),
        //$("<td>").text(empBilled)
      //);
//});

//code for grabbing information from button click
function submitBtn()
{
    $("#submit-btn").on("click", function (event)
    {   
        event.preventDefault();
        $("#firstTrainTime").addClass("border-blue-500");
        $("#firstTrainTime").addClass("bg-gray-200");

        // Grabs inputs from fields
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#firstTrainTime").val().trim();
        var frequency = $("#frequency").val().trim();

        var timeArray = firstTrain.split(":"); 

        if (timeArray.length !== 2)
        {
            console.log("must have two #s in xx:xx format")
            $("#firstTrainTime").removeClass("border-blue-500");
            $("#firstTrainTime").removeClass("bg-gray-200");
            $("#firstTrainTime").addClass("border-red-500");
            $("#firstTrainTime").addClass("bg-red-100");
            return;
        }

        var milHours = parseInt(timeArray[0]);
        var milMins = parseInt(timeArray[1]);

        if (isNaN(milHours) || isNaN(milMins))
        {
            console.log("Not a number");
            $("#firstTrainTime").removeClass("border-blue-500");
            $("#firstTrainTime").removeClass("bg-gray-200");
            $("#firstTrainTime").addClass("border-red-500");
            $("#firstTrainTime").addClass("bg-red-100");
            return;
        }

        if (milHours > 23 || milHours < 0 || milMins > 59 || milMins < 0)
        {
            console.log("Number format incorrect");
            $("#firstTrainTime").removeClass("border-blue-500");
            $("#firstTrainTime").removeClass("bg-gray-200");
            $("#firstTrainTime").addClass("border-red-500");
            $("#firstTrainTime").addClass("bg-red-100");
            return;
        }

        // Creates local "temporary" object for holding train data
        var trainData =
        {
        train: trainName,
        dest: destination,
        first: firstTrain,
        freq: frequency,
        };

        // Uploads employee data to the database
        database.ref().push(trainData);

        // Logs everything to console
        console.log(trainData.train);
        console.log(trainData.dest);
        console.log(trainData.first);
        console.log(trainData.freq);

        // Clears all of the text-boxes
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrainTime").val("");
        $("#frequency").val("");
    });
}
