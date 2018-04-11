$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB8mbzTVgN3sw9iR2hYJrxv7dHwcCQ38uQ",
        authDomain: "trainscheduletracker.firebaseapp.com",
        databaseURL: "https://trainscheduletracker.firebaseio.com",
        projectId: "trainscheduletracker",
        storageBucket: "",
        messagingSenderId: "58768418721"
    };
    firebase.initializeApp(config);


    var database = firebase.database();

    //globals
    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = "";


    $(document).on("click", "#submit", function (event) {

        event.preventDefault();


        //taking values form inputs
        trainName = $("#train-name-input").val().trim();
        destination = $("#destination-input").val().trim();
        trainTime = $("#time-input").val().trim();
        var startTime = trainTime;
        frequency = $("#frequency-input").val().trim();


        //time conversion
        var firstTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
        //getting current time
        var currentTime = moment();
        
        //differnce in current time and frequency
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        
        //getting remainder
        var tRemainder = diffTime % frequency;
        
        //minutes til next train
        var tMinutesTillTrain = frequency - tRemainder;
        
        //next arrival time
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");



        //push values to database
        database.ref().push({
            trainData: trainName,
            destinationData: destination,
            trainTimeData: trainTime,
            frequencyData: frequency,
            nextTrainData: moment(nextTrain).format("hh:mm"),
            minutesTrain: tMinutesTillTrain

        });

    });

    database.ref().on("child_added", function (snapshot) {

        //console logging
        console.log(snapshot.val().trainData);
        console.log(snapshot.val().destinationData);
        console.log(snapshot.val().frequencyData);
        console.log(snapshot.val().nextTrainData);
        console.log(snapshot.val().minutesTrain);
        

        //apending train information
        $("#name-display").append(snapshot.val().trainData + "<hr>");
        $("#destination-display").append(snapshot.val().destinationData + "<hr>");
        $("#frequency-display").append(snapshot.val().frequencyData + " minutes <hr>");
        $("#minute-display").append(snapshot.val().minutesTrain + " minutes <hr>");
        $("#arrival-display").append(snapshot.val().nextTrainData + "<hr>");





    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });




});