"use strict";

function light_on() {
  var xhr = new XMLHttpRequest();

  xhr.open("POST", '/send-mqtt', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("message=255|0|0|0");
};

function light_off() {
  var xhr = new XMLHttpRequest();

  xhr.open("POST", '/send-mqtt', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send("message=0|0|0|0");
};