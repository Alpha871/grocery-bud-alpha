// ****** SELECT ITEMS **********
const form = document.querySelector(".grocery-form");
const clearBtn = document.querySelector(".clear-btn");
const input = document.getElementById("grocery");
const list = document.querySelector(".grocery-list");
const groceryContainer = document.querySelector(".grocery-container");
const submitBtn = document.querySelector(".submit-btn");

const alert = document.querySelector(".alert");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
//addItem
form.addEventListener("submit", addItem);
//clearItem
clearBtn.addEventListener("click", clearItems);
//Load Item
window.addEventListener("DOMContentLoaded", setupItem);

// ****** FUNCTIONS **********

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove alert
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

function addItem(e) {
  e.preventDefault();
  const value = input.value;
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createItem(id, value);
    //display
    displayAlert("item added to the list", "success");
    groceryContainer.classList.add("show-container");
    //Local storage
    addToLocalStorage(id, value);
    //set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    //Edit LocalStorage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Please Enter an item", "danger");
  }
}

function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  groceryContainer.classList.remove("show-container");
  displayAlert("Empty List", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// Delete function
function deleteFunc(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    groceryContainer.classList.remove("show-container");
  }
  setBackToDefault();
  //removeFromLocalStorage
  removeFromLocalStorage(id);
}
// edit function
function edit(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  input.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";
}
// set back to default funcion
function setBackToDefault() {
  input.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Submit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getItemFromLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
function removeFromLocalStorage(id) {
  let items = getItemFromLocalStorage();
  items = items.filter((item) => {
    return item.id !== id;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = getItemFromLocalStorage();
  items = items.map((item) => {
    if ((item.id = id)) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}
function getItemFromLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// ****** SETUP ITEMS **********

function setupItem() {
  let items = getItemFromLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createItem(item.id, item.value);
    });
    groceryContainer.classList.add("show-container");
  }
}

//Create Item
function createItem(id, value) {
  const element = document.createElement("article");
  //add class
  element.classList.add("grocery-item");
  //add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
            <p class="title">${value}</p>
            <div class="btn-container">
                <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
                <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
  const editBtn = element.querySelector(".edit-btn");
  const deleteBtn = element.querySelector(".delete-btn");
  editBtn.addEventListener("click", edit);
  deleteBtn.addEventListener("click", deleteFunc);

  //appendChild
  list.appendChild(element);
}
