/** @format */

// DOM SELECTORS
let namesContainer = document.querySelector("#main-card");
const nameInput = document.querySelector("#lbl-input");
const mainBtn = document.querySelector("#main-button");
const cardContent = document.querySelector("#card-content");
const listBtn = document.querySelector("#list-btn");

const covid = new Covid();

// EVENT LISTENERS
mainBtn.addEventListener("click", updateOutputLabel);

// FUNCTIONS
// Validating the name input and outputting it in a card
function updateOutputLabel() {
  const inputText = nameInput.value;
  const newCard = document.createElement("ion-card-content");

  // Remove hidden card
  namesContainer.classList.remove("ion-hide");

  // If the user input is not empty
  if (inputText !== "") {
    // And there is already a card under the button
    if (namesContainer.innerText !== "") {
      // Remove the previous card
      namesContainer.innerText = "";
    }

    // API fetch data and append input if it exists in the database
    covid.getData(inputText, newCard, namesContainer);
  } else {
    // If the user input is empty
    // Remove the previous card
    namesContainer.innerText = "";

    // Remove output from selected country if it was already there
    if (namesContainer.parentNode.lastChild.id === "output") {
      namesContainer.parentNode.lastChild.remove();
    }

    // Create validation card
    newCard.innerHTML = "Please enter a country above";
    // Append validation card
    namesContainer.appendChild(newCard);
  }
}

// Show pop up at the bottom
async function presentToast() {
  const toast = document.createElement("ion-toast");
  toast.color = "dark";
  toast.message = "Your settings have been saved.";
  toast.duration = 2000;

  document.body.appendChild(toast);
  return toast.present();
}

// Capitalise city names
function titleCase(str) {
  str = str.split(" ");
  for (let i in str) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

// Count keys in an object
function countProperties(obj) {
  return Object.keys(obj).length;
}

// Format big numbers
abbrev = (num, fixed) => {
  if (num === undefined || num === null || num === 0 || num === "Unknown") {
    return ` - `;
  } // terminate early

  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  var b = num.toPrecision(2).split("e"), // get power
    k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    c =
      k < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, k * 3)).toFixed(1 + fixed), // divide by power
    d = c < 0 ? c : Math.abs(c), // enforce -0 is 0
    e = d + ["", "K", "M", "B", "T"][k]; // append power
  return e;
};

// Query for the toggle that is used to change between themes
const toggle = document.querySelector("#dark-toggle");
let moon = document.querySelector("#moon");

toggle.addEventListener("ionChange", ev => {
  document.body.classList.toggle("dark", ev.detail.checked);
  moon.classList.toggle("dark");
});
