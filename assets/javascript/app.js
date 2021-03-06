$(document).ready(function(){
   // Initialize Firebase
   var config = {
    apiKey: "AIzaSyB7_65uEuBnFYqare81GslDlf0Y4PUC2mA",
    authDomain: "train-scheduler-9316d.firebaseapp.com",
    databaseURL: "https://train-scheduler-9316d.firebaseio.com",
    projectId: "train-scheduler-9316d",
    storageBucket: "train-scheduler-9316d.appspot.com",
    messagingSenderId: "816486291564"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();

  //on button click, store data

  $(".sumbit-btn").on("click", function(event){
    //to prevent page from refreshing
    event.preventDefault();

    // store and retrieve user input 
    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#frequency").val().trim();

    //clear input feilds after user sumbits info 
    $("#name").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

    //push data to add to previous data 
    database.ref().push({
      name: name,
      destination: destination,
      time: firstTrain,
      frequency: frequency
  });
    })

//create firebase "watcher"

database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());


  //create new variables for clean build from childSnapshot of data from firebase

  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var frequency = childSnapshot.val().frequency;
  var time = childSnapshot.val().time;
  var key = childSnapshot.key;
  var remove = "<button class='glyphicon glyphicon-trash' id=" + key + "></button>"


  //code in math to find the next train time and minutes 

  //convert first train time back a year to make sure it is set before current time before pushing to firebase.

  var firstTrainConverted = moment(time, "hh:mm").subtract(1, "years");
  console.log(firstTrainConverted);

  //set a variable equal to the current time from moment.js

  var currentTime = moment();
  console.log("Current Time: " + moment(currentTime).format("hh:mm"));

  //post current time to jumbotron for reference

  $("#currentTime").html("Current Time: " + moment(currentTime).format("hh:mm"));

  //find the difference between the first train time and the current time

  var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("Difference In Time: " + timeDiff);

  //find the time apart by finding the remainder of the time difference and the frequency 
  var timeRemainder = timeDiff % frequency;
  console.log(timeRemainder);

  //find the minutes until the next train

  var nextTrainMin = frequency - timeRemainder;
  console.log("Minutes Till Train: " + nextTrainMin);

  //find the time of the next train arrival

  var nextTrainAdd = moment().add(nextTrainMin, "minutes");
  var nextTrainArr = moment(nextTrainAdd).format("hh:mm");
  console.log("Arrival Time: " + nextTrainArr);

  //prepend all information for train data submitted by user

  $("#schedule").prepend("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrainArr + "</td><td>" + nextTrainMin + "</td><td>" + remove + "</td></tr>");


});

  


}) 