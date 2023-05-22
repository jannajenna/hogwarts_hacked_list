"use strict";

//URL
const studentsURL = `https://petlatkea.dk/2021/hogwarts/students.json`;
const blood = `https://petlatkea.dk/2021/hogwarts/families.json`

document.addEventListener("DOMContentLoaded", start);

//GLOBAL VARIABLES
let allStudents = [];
let pureStatus = [];
let halfStatus = [];

/* 
let expelled = [];
let prefects = [];
let inquisitors = [];
let filtered =[];
*/
//------OBJECT PROTOTYPE STUDENTS DATA------//
const Student = {
    firstName: "",
    middleName: "",
    lastName: "",
    nickName: "",
    house: "",
    gender: "",
    image: "",
    blood: "",
    /* 
    prefect: false, 
    isquad: false,
    expelled: false, 

    */
};

//------LOAD JSON ------//
async function start() {
    console.log("ready");
    await loadStudentJSON();
    await loadBloodJSON();

    // Add event-listeners to filter and sort buttons
    registerForm()
}

//------FETCH AND LOAD JSONDATA ------//
async function loadStudentJSON() {
    const resp = await fetch(studentsURL);
    const data = await resp.json();
    console.log("student data loaded");
    prepareStudents(data);
}

//Fetch blood data
async function loadBloodJSON() {
    const respblood = await fetch(blood);
    const bloodData = await respblood.json();
    console.log("blood data loaded");
    prepareStatus(bloodData);
    return bloodData;
}


//------PREPARE JSONDATA ------//
function prepareStudents(data) {
    allStudents = data.map(prepareStudent)

    //display list
    /* settings.currentStudents = allStudents;
    displayList(currentStudents); */
    buildList();

    //Display number of students
    document.querySelector("#numberofstudents").textContent = allStudents.length;
}

//------CLEAN DATA AND CREATE STUDENT OBJECT------//
function prepareStudent(jsonObject) {
    //create object
    const student = Object.create(Student)

    //Clean data
    //FIRST NAME
    const fullName = jsonObject.fullname.trim().split(" ");
    student.firstName = capitalize(fullName[0]);
    //LAST NAME - MIDDLE NAME - NICK NAME AND EXEPTIONS
    if (fullName.length === 3) {
        student.lastName = capitalize(fullName[2]);
        student.middleName = capitalize(fullName[1]);
        if (student.middleName.includes('"')) {
            student.nickName = '"' + capitalize(student.middleName.substring(1, student.middleName.length - 1));
            student.middleName = undefined;
        } else {
            student.nickName = undefined;
        }
    } else if (fullName.length === 2) {
        student.lastName = capitalize(fullName[1]);
        student.middleName = undefined;
        student.nickName = undefined;
    } else {
        student.lastName = "";
        student.middleName = undefined;
        student.nickName = undefined;
    }
    //HOUSE
    const house = jsonObject.house.trim();
    student.house = capitalize(house);
    //GENDER
    const gender = jsonObject.gender.trim()
    student.gender = capitalize(gender);
    //IMAGE
    //create if statements for: patil, leanne and fletchley. This code below should be for all the other cases
    student.image = student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase().substring(0, 1) + ".png";
    if (student.firstName === "Leanne") {
        student.image = `images/empty.png`
    } else if (student.lastName.includes("-")) {

    }
    /*     if (student.firstName === "Leanne") {
            photo.src = `images/empty.png`;
        } else if (student.lastName === "Patil") {
            photo.src = `images/${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
        } else if (student.lastName.includes("-")) {
            photo.src = `images/${student.lastName.split("-")[1].toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
        } else {
            photo.src = `images/${student.lastName.toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
        } */

    //Blood status
    bloodStatus(student);

    return student;
}


//
//------FUNCTIoNS THAT FIX THE DATA ------//
//Function capitalization
function capitalize(string) {
    const capi = string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
    return capi
}
//Fuction blood
function prepareStatus(bloodData) {
    pureStatus = bloodData.pure;
    halfStatus = bloodData.half;
    console.log("PURE:", pureStatus);
    console.log("HALF:", halfStatus);
}
function bloodStatus(student) {

    if (pureStatus.includes(student.lastName)) {
        student.blood = "Pure blood";
    } else if (halfStatus.includes(student.lastName)) {
        student.blood = "Half blood";
    } else {
        student.blood = "Muggle";
    }
}

//------FILTERING------//

const settings = {
    filterBy: "all",
    /* currentStudents: [allStudents], */
    /* sortBy: "" */
}

//Register Input fields
function registerForm() {
    document.querySelector("#filter").addEventListener("change", selectFilter);
}

function selectFilter(event) {
    //get the value of the selected option
    const filter = event.target.value;
    console.log(`User selected ${filter}`);
    //set the filter
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList()
}

function filterList(filteredList) {
    //console.log("filterList");
    /* settings.currentStudents = filteredList; */

    settings.filterBy = filteredList;
    if (settings.filterBy === "gryffindor") {
        settings.filterBy = allStudents.filter(isG);
    }
    if (settings.filterBy === "ravenclaw") {
        settings.filterBy = allStudents.filter(isR);
    }
    if (settings.filterBy === "hufflepuff") {
        settings.filterBy = allStudents.filter(isH);
    }
    if (settings.filterBy === "slytherin") {
        settings.filterBy = allStudents.filter(isS);
    }

    return filteredList
}

//filter Gryffindor
function isG(student) {
    return student.house === "Gryffindor"
    /* if (student.house === "Gryffindor") {
      return true;
    }
    return false; */
}
//filter Ravenclaw
function isR(student) {
    return student.house === "Ravenclaw"
    /*  if (student.house === "Ravenclaw") {
       return true;
     }
     return false; */
}
//filter Hufflepuff
function isH(student) {
    return student.house === "Hufflepuff"
    /* if (student.house === "Hufflepuff") {
      return true;
    }
    return false; */
}
//filter Slytherin
function isS(student) {
    return student.house === "Slytherin"
    /*  if (student.house === "Slytherin") {
       return true;
     }
     return false; */
}

























//------THE LIST------//

//function build list
function buildList() {
    const currentList = filterList(allStudents);
    /* const sortedList = sortList(currentList); */

    displayList(currentList);
}

//function display list 
function displayList(students) {
    console.log("display list");
    //clear the list
    document.querySelector("#list tbody").innerHTML = "";

    //build a new list
    students.forEach(displayStudent);
}
//Display list
function displayStudent(student) {
    //create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=firstname]").textContent = student.firstName;
    /* clone.querySelector("[data-field=middle]").textContent = student.middleName;
    clone.querySelector("[data-field=nickname]").textContent = student.nickName; */
    clone.querySelector("[data-field=lastname]").textContent = student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;
    clone.querySelector("[data-field=blood]").textContent = student.blood;
    /*  clone.querySelector("[data-field=blood]").textContent = student.blood;
     clone.querySelector("[data-field=prefect]").textContent = student.prefect;
     clone.querySelector("[data-field=inquisitor]").textContent = student.inquisitor;
     clone.querySelector("[data-field=expelled]").textContent = student.expelled; */

    //number of students total

    /*    document.querySelector("#numberstudentsdisplayed").textContent = allStudents.length;
   
       function updateStudentAmount() {
           document.querySelector("#nonexpelled").textContent = fineStudents.length;
           document.querySelector("#expelled").textContent = expelledStudents.length;
         } */
    //MODAL 

    /*  clone.querySelector(".open").addEventListener("click", () => {
         openModal();
         //Modal Student
         document.querySelector(".photo-container img").src = student.image;
         document.querySelector(".fullname .firstname").textContent = student.firstName;
         document.querySelector(".fullname .middlename").textContent = student.middleName;
         document.querySelector(".fullname .lastname").textContent = student.lastName;
         document.querySelector(".fullname .nickname").textContent = student.nickName;
         document.querySelector(".gender-container .gender-status").textContent = student.gender;
         document.querySelector(".house-container .house-name").textContent = student.house;
         document.querySelector(".house-container .house-color").style.backgroundColor = student.colorHouse;
     
         //Blood Status
         document.querySelector(".blood-status").textContent = student.bloodStatus;
     
         //Prefect Modal
         if (student.prefect === false) {
           //Add Prefect Modal
           document.querySelector(".responsibility-container .add").classList.remove("hiden");
           document.querySelector(".responsibility-container .add").addEventListener("click", clickPrefect);
           document.querySelector(".responsibility-container .remove").classList.add("hiden");
           document.querySelector(".responsibility-container .prefect").textContent = "None";
           document.querySelector(".responsibility-container .shield img").src = "";
         } else {
           //Remove Prefect Modal
           document.querySelector(".responsibility-container .add").classList.add("hiden");
           document.querySelector(".responsibility-container .remove").classList.remove("hiden");
           document.querySelector(".responsibility-container .remove").addEventListener("click", clickPrefect);
           document.querySelector(".responsibility-container .prefect").textContent = "Prefect";
           document.querySelector(".responsibility-container .shield img").src = iconShield;
         }
     
         //Squad Modal
         if (student.squad === false) {
           //Add Squad Modal
           document.querySelector(".squad-container .add-squad").classList.remove("hiden");
           document.querySelector(".squad-container .add-squad").addEventListener("click", clickSquad);
           document.querySelector(".squad-container .remove-squad").classList.add("hiden");
           document.querySelector(".squad-container .yes").textContent = "None";
           document.querySelector(".squad-container .i img").src = "";
         } else {
           //Remove Squad Modal
           document.querySelector(".squad-container .add-squad").classList.add("hiden");
           document.querySelector(".squad-container .remove-squad").classList.remove("hiden");
           document.querySelector(".squad-container .remove-squad").addEventListener("click", clickSquad);
           document.querySelector(".squad-container .yes").textContent = "Member";
           document.querySelector(".squad-container .i img").src = iconSquad;
         }
     
         //Close Student Modal
         document.querySelector(".modal-student .close").addEventListener("click", closeModal);
       });
  */
    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}




