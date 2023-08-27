// request
import { ENDPOINT } from "./const.js";

const request = axios.create({
  baseURL: ENDPOINT,
  timeout: 10000,
});

export default request;

//navbar-shrink

const header = document.querySelector("header");

window.addEventListener("scroll", function () {
  shrink();
});

function shrink() {
  if (scrollY > 100) {
    header.classList.add("navbar-shrink");
    searchNav.classList.add("view");
    bodySeach.classList.add("closed");
  } else {
    header.classList.remove("navbar-shrink");
    searchNav.classList.remove("view");
    bodySeach.classList.remove("closed");
  }
}

// light- dark-mode

const darkBtn = document.querySelector(".switch-icon");
const bodyDark = document.querySelector("body");
const darkImg = document.querySelector("#dark-img");

darkBtn.addEventListener("click", function () {
  bodyDark.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    darkImg.src = "./images/light-mode.svg";
  } else {
    darkImg.src = "./images/dark-mode.svg";
  }
});
