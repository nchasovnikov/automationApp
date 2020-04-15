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

function change_color() {
  var xhr = new XMLHttpRequest();

  xhr.open("POST", '/send-mqtt', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  if (hslValue) {
    let rgbw = hsi2rgbw(hslValue[0], hslValue[1], hslValue[2]);
    xhr.send(`message=${rgbw[0]}|${rgbw[1]}|${rgbw[2]}|${rgbw[3]}`);
  }
}

function hsi2rgbw(H, S, I) {
  let r, g, b, w;
  let cos_h, cos_1047_h;

  H = H % 360;
  H = Math.PI * H / 180.0;
  S = S > 0 ? S < 1 ? S : 1 : 0;
  I = I > 0 ? I < 1 ? I : 1 : 0;

  if ( H < 2.09439) {
    cos_h = Math.cos(H);
    cos_1047_h = Math.cos(1.047196667 - H);

    r = S * 255 * I / 3 * (1 + cos_h / cos_1047_h);

    g = S * 255 * I / 3 * (1 + (1 - cos_h / cos_1047_h));

    b = 0;

    w = 255 * (1 - S) * I;

  } else if (H < 4.188787) {
    H = H - 2.09439;

    cos_h = Math.cos(H);
    cos_1047_h = Math.cos(1.047196667 - H);

    g = S * 255 * I / 3 * (1 + cos_h / cos_1047_h);

    b = S * 255 * I / 3 * (1 + (1 - cos_h / cos_1047_h));

    r = 0;

    w = 255 * (1 - S) * I;

  } else {
    H = H - 4.188787;

    cos_h = Math.cos(H);
    cos_1047_h = Math.cos(1.047196667 - H);

    b = S * 255 * I / 3 * (1 + cos_h / cos_1047_h);

    r = S * 255 * I / 3 * (1 + (1 - cos_h / cos_1047_h));

    g = 0;

    w = 255 * (1 - S) * I;
  }

  return [r, g, b, w]
}

/*Grab Sliders, Demo area and HSL Text*/
let inputs = document.querySelectorAll(".control-area input");
let demo = document.querySelector(".demo-area");
let hslValueText = document.querySelector(".demo-area h2");
var hslValue;

/*Function that changes HSL value of background*/
function updateValue() {
  const suffix = this.dataset.unit || "";
  demo.style.setProperty(`--${this.name}`, this.value + suffix);
  hslValueText.innerHTML = `HSL (${hue.value}, ${sat.value}%, ${light.value}%)`;
  hslValue = [hue.value, sat.value, light.value];
  /*If Light is less than 50% make text light, if more than 50% make it dark*/
  if (light.value < 50) {
    hslValueText.classList.add("white-text");
    hslValueText.classList.remove("black-text");
  } else {
    hslValueText.classList.add("black-text");
    hslValueText.classList.remove("white-text");
  }
}

/*Event Listeners*/
inputs.forEach(input => {
  input.addEventListener("change", updateValue);
});

inputs.forEach(input => {
  input.addEventListener("mousemove", updateValue);
});
