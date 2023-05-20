"use strict";

//URL
const studentsURL = `https://petlatkea.dk/2021/hogwarts/students.json`;

document.addEventListener("DOMContentLoaded", start);

//GLOBAL VARIABLES
let allStudents = [];


//OBJECT PROTOTYPE STUDENTS DATA
const Student = {
    firstName: "",
    middleName: "",
    lastName: "",
    nickName: "",
    house: "",
    gender: "",
    image: "",
};

//LOAD JSON
async function start() {
    console.log("ready");
    await loadStudentJSON();
}

//FETCH AND LOAD JSONDATA
async function loadStudentJSON() {
    const resp = await fetch(studentsURL);
    if (!resp.ok) {
        const message = `An error has occurred ${resp.status}`;
        throw new Error(message);
    } else {
        console.log("data fetched");
    }
    const jsonData = await resp.json();
    console.log("student data loaded");
    /* console.table(jsonData); */

    prepareStudents(jsonData);
}


//PREPARE JSONDATA
function prepareStudents(jsonData) {
    allStudents = jsonData.map(prepareStudent)

    //display list
}

//CLEAN DATA AND CREATE STUDENT OBJECT
function prepareStudent(jsonObject) {
    //create object
    const student = Object.create(Student)

    //Clean data

    //FIRST NAME
    /* student.firstName = capitalize(fullname.substring(0, fullname.indexOf(" "))); */
    const fullName = jsonObject.fullname.trim().split(" ");
    student.firstName = capitalize(fullName[0]);
    /* console.log(`${fullName} and ${fullName.length}`) */

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
    /* student.house = house[0].toUpperCase() + house.slice(1).toLowerCase(); */
    student.house = capitalize(house);
    //GENDER
    const gender = jsonObject.gender.trim()
    student.gender = capitalize(gender);

    //IMAGE
    //create is statements for: patil, leanne and fletchley. This code below should be for all the other cases
    student.image = student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase().substring(0, 1) + ".png";
    if (student.firstName === "Leanne") {
        student.image = `images/empty.png`
    } else if (student.lastName.includes("-")) {

    }



    // Fixing images for Leanne, Patil, Finch-Fletchley

    /*     if (student.firstName === "Leanne") {
            photo.src = `images/empty.png`;
        } else if (student.lastName === "Patil") {
            photo.src = `images/${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
        } else if (student.lastName.includes("-")) {
            photo.src = `images/${student.lastName.split("-")[1].toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
        } else {
            photo.src = `images/${student.lastName.toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
        } */


    //Add the object to the global array
    /* return student */
    /* allStudents.push(student); */

    //console log to check


    /* console.log(`
    name:_${student.firstName}_
    middle name:_${student.middleName}_
    NICK NAME:_${student.nickName}_
    last name:_${student.lastName}_ 
    house:_${student.house}_
    gender:_${student.gender}_
 `) */

}



//Function capitalization
function capitalize(string) {
    const capi = string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
    return capi
}
