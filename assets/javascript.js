
// code for loading Firebase
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

// code for grabbing information from button click
function submitBtn()
{
    $("#submit-btn").on("click", function (event)
    {   
        event.preventDefault();

        // resets border color in first train time field
        $("#firstTrainTime").addClass("border-blue-500");
        $("#firstTrainTime").addClass("bg-gray-200");

        // Grabs inputs from fields
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#firstTrainTime").val().trim();
        var frequency = $("#frequency").val().trim();

        // section to handles all error checking to make sure proper formatting is done in first train time field
        var timeArray = firstTrain.split(":"); 

        // makes sure that train time is proper length
        if (timeArray.length !== 2)
        {
            console.log("must have two #s in xx:xx format")
            $("#firstTrainTime").removeClass("border-blue-500");
            $("#firstTrainTime").removeClass("bg-gray-200");
            $("#firstTrainTime").addClass("border-red-500");
            $("#firstTrainTime").addClass("bg-red-100");
            return;
        }

        // variables with text information from field converted to integers
        var milHours = parseInt(timeArray[0]);
        var milMins = parseInt(timeArray[1]);

        // function to make sure that only integers are entered time fields
        if (isNaN(milHours) || isNaN(milMins))
        {
            console.log("Not a number");
            // changes border colors to let user know there is an error in the field
            $("#firstTrainTime").removeClass("border-blue-500");
            $("#firstTrainTime").removeClass("bg-gray-200");
            $("#firstTrainTime").addClass("border-red-500");
            $("#firstTrainTime").addClass("bg-red-100");
            return;
        }

        // error checking to make sure proper number formatting is done in both fields
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
        database.ref("trainAssignment").push(trainData);

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

database.ref("trainAssignment").on("child_added", function(childSnapshot)
{
    console.log(childSnapshot.val());

    var childKey = childSnapshot.key;

    //store snapshot information into a variable
    var trainName = childSnapshot.val().train;
    var destination = childSnapshot.val().dest;
    var firstTrain = childSnapshot.val().first;
    var frequency = childSnapshot.val().freq;

    //console log information to make sure it displays correctly
    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);

    var tableRow = $("<tr>").addClass("ml-4");

        // Assumptions
        //var tFrequency = 

        // Time is 3:30 AM
        //var firstTime = "03:30";

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    
    var tdTrainName = $("<td>").text(trainName);
    var tdDestination = $("<td>").text(destination);
    var tdFrequency = $("<td>").text(frequency);
    var tdNextArrival = $("<td>").text(moment(nextTrain).format("hh:mm A"));
    var tdMinsAway = $("<td>").text(tMinutesTillTrain);
    var removeButton = $("<button>");
    removeButton.text("Delete");
    removeButton.addClass("bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded");
    var tdRemove = $("<td>").append(removeButton);

    tableRow.append(tdTrainName);
    tableRow.append(tdDestination);
    tableRow.append(tdFrequency);
    tableRow.append(tdNextArrival);
    tableRow.append(tdMinsAway);
    tableRow.append(tdRemove);

    $("#tableBody").append(tableRow);

    setInterval(function()
    {
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;

        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        tdNextArrival.text(moment(nextTrain).format("hh:mm A"));
        console.log(moment(nextTrain).format("hh:mm A"));

        tdMinsAway.text(tMinutesTillTrain)  

        
    }, 1000);

    removeButton.on("click", function (event)
    {
        tableRow.remove();
        var ref = firebase.database().ref("trainAssignment/" + childKey);
        ref.remove();
    });

});
