let form = document.querySelector(".form");
let input = document.querySelector(".input");
let containerList = document.querySelector(".containerList");
let btnDelAll = document.querySelector(".btn_red");
let btnDelFinished = document.querySelector(".btn_grey");
let recycle = document.querySelector(".recycle");
let btns = document.querySelector(".btns");

let LS = window.localStorage;
let arr = [];
btns.classList.add("d-none");


form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (input.value) {
    createContent(input.value);
  }
  setIntoLS(input.value);
  input.value = "";
});

function createContent(text, check) {
  let content = document.createElement("div");
  content.classList.add("content");
  // let firstLetter = (str) => str.split("")[0].toUppercase() + str.slice(1);
  content.innerHTML = `<div class="left">
                <label class="check option">
                  <input type="checkbox" class="checkbox" ${
                    check === "text_checked" ? "checked" : ""
                  }/>
                  <span class="check__box"></span>
                  <p class="text ${check}">${text}</p>
                </label>
              </div>
              <div class="right">
                <button class="apply">
                  <img class="pensil" src="./style/pensil.webp" alt="check"/>
                </button>
                <button class="delete">
                  <img class="recycle" src="./style/recycle.webp" alt="recycle"/>
                </button>
              </div>`;
  containerList.append(content);
  btns.classList.remove("d-none");
}

function getFromLS() {
  arr = JSON.parse(LS.getItem("toBye"));
  for (el of arr) {
    createContent(el.item, el.done);
  }
}

if (LS.toBye) {
  getFromLS();
}

function setIntoLS(text) {
  let obj = {
    item: text,
    done: false,
  };
  arr.push(obj);
  LS.setItem("toBye", JSON.stringify(arr));
}

btnDelAll.addEventListener("click", function () {
  containerList.innerHTML = '';
  btns.classList.add("d-none");
  arr = [];
  LS.setItem("toBye", JSON.stringify(arr));
});

function deleteItem(str) {
  let textItem = str.closest(".content").querySelector(".text").innerText;
  arr.splice(
    arr.findIndex((el) => el.item == textItem),
    1
  );
  LS.setItem("toBye", JSON.stringify(arr));
  str.closest(".content").remove();
}

containerList.addEventListener("click", function (event) {
  if (event.target.classList == "recycle") {
    deleteItem(event.target);
  }
});

containerList.addEventListener("click", function (event) {
  if (event.target.classList == "checkbox") {
    let textItem = event.target.closest(".content").querySelector(".text");
    textItem.classList.toggle("text_checked");
    let checkbox = document.querySelector(".checkbox");
    checkbox.toggleAttribute("checked"); // если отключить это, то чекбоксы перестают по два включаться
    let x = arr.findIndex((el) => el.item === textItem.innerText);
    arr[x].done = arr[x].done ? false : "text_checked";
    LS.setItem("toBye", JSON.stringify(arr));
  } else if (event.target.classList.contains("pensil")) {
    editText(event);
  }
});

btnDelFinished.addEventListener("click", function () {
  let AlltextCheckeds = document.querySelectorAll(".text_checked");
  for (let el of AlltextCheckeds) {
    deleteItem(el);
  }
});

function editText(event) {
  let icon = event.target.closest(".content").querySelector(".pensil");
  let textItem = event.target.closest(".content").querySelector(".text");
  let x = textItem.innerText;
  if (icon.classList.contains("green")) {
    icon.setAttribute("src", "./style/pensil.webp");
    x = textItem.querySelector('input').value;
    textItem.innerHTML = `${x}`;
  } else {
    icon.setAttribute("src", "./style/check_green.webp");
    textItem.textContent = "";
    textItem.innerHTML = `<input class="edit__text" type="text" value='${x}'>`;
  }
  icon.classList.toggle("green");

  textItem.onkeypress = function (event) {
    let button = event.which || event.keyCode;
    if (button == 13) {
      saveChange(textItem, icon, x);
    }
  };
  
  icon.addEventListener("click", function () {
    let inputValue = textItem.querySelector(".edit__text").value;
    arr[arr.findIndex((el) => el.item == x)].item = inputValue;
    LS.setItem("toBye", JSON.stringify(arr));
  });
}

function saveChange(textItem, icon, x) {
  let inputValue = textItem.querySelector(".edit__text").value;
  arr[arr.findIndex((el) => el.item == x)].item = inputValue;
  LS.setItem("toBye", JSON.stringify(arr));
  textItem.innerHTML = `<p class="new__text">${inputValue}</P>`;
  icon.setAttribute("src", "./style/pensil.webp");
  icon.classList.toggle("green");
}