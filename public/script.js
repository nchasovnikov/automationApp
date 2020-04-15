"use strict";

var hslValue= [100, 50, 10];

function rgb2hsi(rgb) {
  console.log(`rgb is ${rgb}`);
  let R, G, B, H, S, I;
  let r, g, b, w, i, min;
  min = 1.e-6;

  R = rgb[0] / 255;
  G = rgb[1] / 255;
  B = rgb[2] / 255;

  i = R + G + B;
  I = i / 3.0;

  r = R / i;
  g = G / i;
  b = B / i;

  if (R == G && G == B) {
    S = 0;
    H = 0;
  } else {

    w = 0.5 * (R - G + R - B)/ Math.sqrt((R - G) * (R - G) + (R - B) * (R - B));
    w = w > 1 ? 1 : w < -1 ? -1: w;
    console.log(`w is ${w}`);

    H = Math.acos(w);
    if (H < 0) { console.log(H)};

    if (B > G) { H = 2 * Math.PI - H};
    if (r <= g && r <= b) { S = 1 - 3 * r};
    if (g <= r && g <= b) { S = 1 - 3 * g};
    if (b <= r && b <= g) { S = 1 - 3 * b};
  };
  H = (H * 180 / Math.PI).toFixed(0);

  return [H, S, I]
}

function hsl2rgb(hsl) {
  let H, S, L, R, G, B;
  H = hsl[0];
  S = hsl[1] / 100;
  L = hsl[2] / 100;
  let C = (1 - Math.abs(2 * L - 1)) * S;

  let X = C * (1 - Math.abs((H / 60) % 2 - 1));

  let m = L - C / 2;

  if (H < 60) {
    R = 255 * (m + C);
    G = 255 * (m + X);
    B = 255 * (m + 0);
  } else if (H < 120) {
    R = 255 * (m + X);
    G = 255 * (m + C);
    B = 255 * (m + 0);
  } else if (H < 180) {
    R = 255 * (m + 0);
    G = 255 * (m + C);
    B = 255 * (m + X);
  } else if (H < 240) {
    R = 255 * (m + 0);
    G = 255 * (m + X);
    B = 255 * (m + C);
  } else if (H < 300) {
    R = 255 * (m + X);
    G = 255 * (m + 0);
    B = 255 * (m + C);
  } else {
    R = 255 * (m + C);
    G = 255 * (m + 0);
    B = 255 * (m + X);
  };

  return [R, G, B];
}

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
   // console.log(hslValue);

    //hslValue[1] = hslValue[1] / 100;
    //hslValue[2] = hslValue[2] / 100;
    console.log(`HSL value ${hslValue}`);
    let rgb = hsl2rgb(hslValue);
    let hsi = rgb2hsi(rgb);

    let rgbw = hsi2rgbw(hsi[0], hsi[1], hsi[2]);
    xhr.send(`message=${rgbw[3].toFixed(0)}|${rgbw[0].toFixed(0)}|${rgbw[1].toFixed(0)}|${rgbw[2].toFixed(0)}`);
  }
}

function hsi2rgbw(H, S, I) {
  let r, g, b, w;
  let cos_h, cos_1047_h;
console.log(S);
  H = H % 360;
  H = Math.PI * H / 180.0;
  S = S ;
  I = I ;
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
document.addEventListener("DOMContentLoaded", function(event) { 
/*Grab Sliders, Demo area and HSL Text*/
let inputs = document.querySelectorAll(".control-area input");
let demo = document.querySelector(".demo-area");
let hslValueText = document.querySelector(".demo-area h2");


console.log(inputs);
console.log(demo);
console.log(hslValueText);
/*Function that changes HSL value of background*/
function updateValue() {
  const suffix = this.dataset.unit || "";
  demo.style.setProperty(`--${this.name}`, this.value + suffix);
  hslValueText.innerHTML = `HSL (${hue.value}, ${sat.value}%, ${light.value}%)`;
  hslValue = [hue.value, sat.value, light.value];
  //console.log(hslValue);
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
});
