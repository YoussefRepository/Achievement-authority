/* || --- Declare All Constants */
// Loader
const LOADER = document.getElementById("loader");
// Project Containers [active container, archive container]
const ACTIVE_PROJJECT_CONTAINER = document.getElementById("active-project-container");
const ARCHIVE_PROJJECT_CONTAINER = document.getElementById("archive-project-container");
// Add Project Btn
const ADD_PROJECT_BTN = document.getElementById("add-new-project-btn");
// Forms [create, edit]
// --- create variables
const CREATE_PROJECT_FORM = document.getElementById("create-new-project-form");
const CREATE_PROJECT_INPUT = document.getElementById("new-project-name");
// --- edit variable
const EDIT_PROJECT_FORM = document.getElementById("edit-project-form");
const EDIT_PROJECT_INPUT = document.getElementById("eidt-project-input");
// Controls [edit, archive, delete]
const EDIT_BTN = document.getElementById("edit-btn");
const ARCHIVE_BTN = document.getElementById("archive-btn");
const DELETE_BTN = document.getElementById("delete-btn");
// Context Menu
const CONTEXT_MENU = document.getElementById("context-menu");
// Overlay
const OVERLAY = document.getElementById("overlay");
/*
  Project => [name, id, status, time], 
  -- privet proparty => [hour, munite]
*/
class Project {
  #time;
  #munite;
  #hour;

  constructor(name, id, status, time) {
    this.name = name;
    this.id = id;
    this.status = status;
    this.#time = time;
  }

  get getHour() {
    this.#hour = Math.floor(this.#time / 1000 / 60 / 60);
    return this.#hour;
  }
  get getMunite() {
    this.#munite = Math.floor(
      (this.#time / 1000 / 60 / 60 - this.getHour) * 60
    );
    return this.#munite;
  }

  set setHour(obj) {
    obj.innerText = this.getHour;
  }

  set setMunite(obj) {
    obj.innerText = this.getMunite;
  }
}


// Load Img Intel Page Reload
window.addEventListener("load", () => {
  LOADER.classList.add("hide-loader");
});

// Add New Project Button
ADD_PROJECT_BTN.addEventListener("click", () => {
  showAndHide(OVERLAY, "show-overlay", "show", "add");
  showAndHide(CREATE_PROJECT_FORM, "show-form", "show", "add");
  CREATE_PROJECT_INPUT.focus();
});

// Add New Project Form
CREATE_PROJECT_FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  let projectName = CREATE_PROJECT_INPUT.value.trim();
  if (projectName) {
    const PROJECT_STRUCTURE = createDomElement('div', ['project'], undefined, {"data-status": "active"}, [
      createDomElement('div', ["project__box project--name"], undefined, undefined, [
        createDomElement("ul", ["project__option"], undefined, undefined, [
          createDomElement("li"),
          createDomElement("li"),
          createDomElement("li"),
        ]),
        createDomElement("span", ["project__name"], undefined, undefined, [projectName])
      ]),
      createDomElement('div', ['project__box project--time'], undefined, undefined, [
        createDomElement('span', ["project__hour"], undefined, undefined, ['0h, ']),
        createDomElement('span', ["project__munite"], undefined, undefined, ['0m'])
      ])
    ]); // Project Structure
    ACTIVE_PROJJECT_CONTAINER.appendChild(PROJECT_STRUCTURE);
    handelInput(CREATE_PROJECT_INPUT);
    
    let projectOptions = document.querySelectorAll(".project__option");
    projectOptions.forEach(option => {
      option.addEventListener("click", editDomElement)

    })
  }
})

// Edit Project Name Btn
EDIT_BTN.addEventListener('click', _ => {
  showAndHide(OVERLAY, "show-overlay", "show", "add");
  showAndHide(EDIT_PROJECT_FORM, "show-form", "show", "add");
  let projectName = EDIT_BTN.closest(".project").firstElementChild.lastElementChild.innerText;
  EDIT_PROJECT_INPUT.value = projectName;
  EDIT_PROJECT_INPUT.focus();
  EDIT_PROJECT_INPUT.select();
})

// Edit Project Name Form
EDIT_PROJECT_FORM.addEventListener("submit", e => {
  e.preventDefault();
  let newName = EDIT_PROJECT_INPUT.value.trim();
  let projectName = EDIT_BTN.closest(".project").firstElementChild.lastElementChild;
  if (newName) {
    projectName.innerText = newName;
    handelInput(EDIT_PROJECT_INPUT);
    showAndHide(OVERLAY, "show-overlay", "hide", "remove");
    showAndHide(EDIT_PROJECT_FORM, "show-form", "hide", "remove");
    showAndHide(CONTEXT_MENU, "show-context-menu", "hide", "remove");
  }
})

// Archive Project Btn
ARCHIVE_BTN.addEventListener("click", archiveProject);

// Delete Project Btn
DELETE_BTN.addEventListener("click", deleteDomElement)

// Overlay Setting
OVERLAY.addEventListener("click", () => {
  showAndHide(OVERLAY, "show-overlay", "hide", "remove");
  showAndHide(CREATE_PROJECT_FORM, "show-form", "hide", "remove");
  showAndHide(EDIT_PROJECT_FORM, "show-form", "hide", "remove");
  showAndHide(CONTEXT_MENU, "show-context-menu", "hide", "remove");
  // Handel Inupts
  handelInput(CREATE_PROJECT_INPUT);
  handelInput(EDIT_PROJECT_INPUT);
});



/* || --- App Functions */
// Function To Show And Hide HTML Element Depending On His Status
function showAndHide(element, cls, status, type) {
  if (status === "show") {
    type === "add" ? element.classList.add(cls) : element.classList.toggle(cls);
  } else if (status === "hide") {
    type === "remove"
      ? element.classList.remove(cls)
      : element.classList.toggle(cls);
  } else {
    console.log(Error("You Shoul But The Element Status 'Open' Or 'Close'"));
  }
}

// Function To Create HTML DOM Element Dynamically 
function createDomElement(tagName, classNames, id, attr, children) {
  const element = document.createElement(tagName);

  // Add Classes To The Element
  classNames ?  element.className = [...classNames] : false;
  // Add Id To The Element
  id ?  element.id  = id : false;
  // Add Attrebiuts To The Element
  attr ? setAttr(element, attr) : false;

  if (children && children.length > 0) {
    children.forEach(child => {
      if (child instanceof HTMLElement) { // Check If (child) Is HTML Element To Append Into (element)
        element.appendChild(child);
      } else if (typeof child === 'string') { // Check If (child) Is Text To Added To (element)
        element.appendChild(document.createTextNode(child));
      } else if (typeof child === 'object' && child !== null) { // Check If (child) Is A Nested Element To Append It Into (element)
        const { container, tagName, classNames, ids, attr, children } = child;
        const nestedElement = createDomElement(container, tagName, classNames, ids, attr, children);
        element.appendChild(nestedElement);
      }
    });
  }

  return element;
}

// Function To Edit On Element
function editDomElement() {
  showAndHide(CONTEXT_MENU, "show-context-menu", "hide", "remove");
  this.closest(".project").appendChild(CONTEXT_MENU);
  setTimeout(_ => {showAndHide(CONTEXT_MENU, "show-context-menu", "show", "add")});  
}

// Function To Archive Project
function archiveProject() {
  if (this.closest(".project").getAttribute("data-status") === "active") {
    ARCHIVE_PROJJECT_CONTAINER.appendChild(this.closest(".project"));
    this.closest(".project").setAttribute("data-status", "archive")
  } 
  else if (this.closest(".project").getAttribute("data-status") === "archive") {
    ACTIVE_PROJJECT_CONTAINER.appendChild(this.closest(".project"));
    this.closest(".project").setAttribute("data-status", "active")
  }
  else {
    return Error(`there is no status like this ${this.closest(".project").getAttribute("data-status")}`);
  }
  showAndHide(CONTEXT_MENU, "show-context-menu", "hide", "remove");
}

// Function To Delete DOM Element
function deleteDomElement() {
  showAndHide(CONTEXT_MENU, "show-context-menu", "hide", "remove");
  this.closest(".project").remove();
}

// Function To Put Attribute In HTML Element 
function setAttr(ele, attrObj) {
  for (let attr in attrObj) ele.setAttribute(attr, attrObj[attr]);
}

// Function To Handel Inputs
function handelInput(input) {
  input.value = "";
  input.blur();
}