"use strict";

//URL
const studentsURL = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodURL = "https://petlatkea.dk/2021/hogwarts/families.json";

document.addEventListener("DOMContentLoaded", start);

//GLOBAL VARIABLES
let allStudents = [];
let pureStatus = [];
let halfStatus = [];
let expelled = [];
let prefects = [];
let inquisitors = [];

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
    expelled: false,
    prefect: false,
    isquad: false,
};

const settings = {
    filterBy: "all",
    sortBy: "none",
    /* searchBy: "", */
    currentList: allStudents,

};

//------LOAD JSON ------//
async function start() {
    console.log("ready");
    const data = await loadStudentJSON();
    const bloodData = await loadBloodJSON();

    console.log(data)
    console.log(bloodData)

    prepareStudents(data);
    prepareStatus(bloodData);

    // Add event-listeners to filter and sort buttons
    registerInputFields();
}

// ---------- LOAD STUDENT JSON DATA & ADD TO ARRAY AS OBJECTS ----------

//------FETCH AND LOAD JSONDATA ------//
async function loadStudentJSON() {
    const response = await fetch(studentsURL);
    const data = await response.json();

    console.log("student data loaded");

    return data;
}

//Fetch blood data
async function loadBloodJSON() {
    const response = await fetch(bloodURL);
    const bloodData = await response.json();
    console.log("blood data loaded");
    /* prepareStatus(bloodData); */
    return bloodData;
}


//------PREPARE JSONDATA ------//
function prepareStudents(data) {
    // add data into array containing all students
    allStudents = data.map(prepareStudent)
    settings.currentList = allStudents;
    console.log("Preparing the data")

    displayList(settings.currentList);
}

//------CLEAN DATA AND CREATE STUDENT OBJECT------//
function prepareStudent(jsonObject) {
    // create a student object with the json data
    const student = Object.create(Student);

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
    //Blood status
    bloodStatus(student);

    return student;
}

//------FUNCTIONS THAT FIX THE DATA ------//
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

    // Update blood status for each student
    allStudents.forEach(bloodStatus);
}
//Determine status
function bloodStatus(student) {
    if (pureStatus.includes(student.lastName)) {
        student.blood = "Pure blood";
    } else if (halfStatus.includes(student.lastName)) {
        student.blood = "Half blood";
    } else {
        student.blood = "Muggle";
    }
}

//------THE LIST------//
//Display list 
function displayList(students) {
    console.log("display list");
    //clear the list
    document.querySelector(".list").innerHTML = "";

    //build a new list
    students.forEach(displayStudent);
    numberStudents();
}

//Display student -- populate template
function displayStudent(student) {
    //create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    //set clone data
    //name
    clone.querySelector("[data-field=firstname]").textContent = student.firstName;
    /*  clone.querySelector("[data-field=middle]").textContent = student.middleName;
     clone.querySelector("[data-field=nickname]").textContent = student.nickName; */
    clone.querySelector("[data-field=lastname]").textContent = student.lastName;

    //house
    clone.querySelector("[data-field=house]").textContent = student.house;
    /* clone.querySelector(".house-img").src = `assets/${student.house.toLowerCase()}-crest.jpg`;
    clone.querySelector(".house-img").alt = student.house; */

    //blood status
    clone.querySelector("[data-field=blood]").textContent = student.blood;

    //Visual feedback for prefects and inquisitors onthe list
    if (student.prefect === true) {
        clone.querySelector(".prefect").classList.remove("hidden");
    } else {
        clone.querySelector(".prefect").classList.add("hidden");
    }

    if (student.isquad === true) {
        clone.querySelector(".inquisitor").classList.remove("hidden");
    } else {
        clone.querySelector(".inquisitor").classList.add("hidden");
    }


    //------------MODAL
    clone.querySelector(".jopen").addEventListener("click", () => {
        showModal(student);
    });
    //console.log(student);
    //append clone to list
    document.querySelector("#list tbody").appendChild(clone);

}

//Students on display
function numberStudents() {

    // show total students
    document.querySelector("#numberofstudents").textContent = allStudents.length;

    // show total students each house
    document.querySelector("#numbersG").textContent = allStudents.filter(isG).length;
    document.querySelector("#numbersH").textContent = allStudents.filter(isS).length;
    document.querySelector("#numbersR").textContent = allStudents.filter(isH).length;
    document.querySelector("#numbersS").textContent = allStudents.filter(isR).length;
}

//Modal
function showModal(student) {
    //console.log("opened");
    document.querySelector(".modal").classList.remove("hidden");
    document.querySelector(".modal").classList.add("active");
    document.querySelector(".overlay").classList.add("acctive-overlay");
    document.querySelector(".modal-header").classList.add("close");

    document.querySelector(".firstName").textContent = student.firstName;
    document.querySelector(".middleName").textContent = student.middleName;
    document.querySelector(".lastName").textContent = student.lastName;
    document.querySelector(".nickName").textContent = student.nickName;

    document.querySelector(".house").textContent = student.house;
    document.querySelector(".blood").textContent = student.blood;

    //changing color crests
    if (student.house === "Gryffindor") {
        document.querySelector(".house-crest").src = "assets/icons/gry.svg"
    }
    if (student.house === "Hufflepuff") {
        document.querySelector(".house-crest").src = "assets/icons/huf.svg"
    }
    if (student.house === "Ravenclaw") {
        document.querySelector(".house-crest").src = "assets/icons/rav.svg"
    }
    if (student.house === "Slytherin") {
        document.querySelector(".house-crest").src = "assets/icons/sly.svg"
    }

    // add button event listeners
    document.querySelector(".btnexpel").addEventListener("click", () => {
        expelStudent(student);
    });

    document.querySelector(".btprefect").addEventListener("click", () => {
        prefectStudent(student);
    });

    document.querySelector(".btninquisitor").addEventListener("click", () => {
        inquisitorStudent(student);
    });

    document.querySelector(".mclose").addEventListener("click", hideModal);
}

function hideModal() {
    //console.log("closed");
    document.querySelector(".overlay").classList.remove("active-overlay");
    document.querySelector(".modal").classList.remove("active");
    document.querySelector(".modal").classList.add("hidden");

    // remove button event listeners
}

//Expel students
function expelStudent(student) {
    if (student.expelled === false) {
        student.expelled = true;
        const index = settings.currentList.indexOf(student);
        expelled.push(student);
        settings.currentList.splice(index, 1);

        hideModal();
        buildList();
        console.log("EXPELLED", expelled);
    } else {
        console.log("Already expelled");
        hideModal();
    }
}

//Prefect students
function prefectStudent(student) {
    if (!student.expelled && !student.prefect) {
        let prefectHouses = prefects.filter((newPrefect) => newPrefect.house === student.house);
        if (prefectHouses.length < 2) {
            student.prefect = true;
            prefects.push(student);
            console.log("PREFECTS", prefects);
            hideModal();
            buildList(settings.currentList);
        }/* else {
            alert("There can be only 2 prefects within one house.");
        } */
    }
}

//Inquisitor students
function inquisitorStudent(student) {
    if (!student.expelled && !student.isquad) {
        if (student.blood === "Pure blood" || student.house === "Slytherin") {
            student.isquad = true;
            inquisitors.push(student);
            console.log("INQUISITORS", inquisitors);
            hideModal();
            buildList();
        }
    }
}

//Register form fields
function registerInputFields() {
    document.querySelector("#filter").addEventListener("change", selectFilter);
    document.querySelector("#sort").addEventListener("change", setSort);
    /*document.querySelector("#searchInput").addEventListener("input", search); */
}

function selectFilter(event) {
    //get the value of the selected option
    const filter = event.target.value;
    console.log(`User selected ${filter}`);

    settings.filterBy = filter;
    buildList();
}

function setSort(event) {
    // select sort option with input value & update in settings
    const sort = event.target.value;
    settings.sortBy = sort;

    console.log(`User is sorting by ${sort}`);
    buildList();
}

function buildList() {
    // console.log("buildList");
    // create filtered array
    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);

    // displayList(sortedList);
    displayList(sortedList);
}

//------FILTERING------//
function filterList(filteredList) {
    // console.log("filterList");
    settings.currentList = filteredList;
    //house
    if (settings.filterBy === "gryffindor") {
        settings.currentList = allStudents.filter(isG);
    }
    if (settings.filterBy === "hufflepuff") {
        settings.currentList = allStudents.filter(isH);
    }
    if (settings.filterBy === "ravenclaw") {
        settings.currentList = allStudents.filter(isR);
    }
    if (settings.filterBy === "slytherin") {
        settings.currentList = allStudents.filter(isS);
    }

    //prefects
    if (settings.filterBy === "prefects") {
        settings.currentList = allStudents.filter(isP);
    }
    //inquisitors
    if (settings.filterBy === "inquisitors") {
        settings.currentList = allStudents.filter(isI);
    }
    //expelled false
    if (settings.filterBy === "noexpelled") {
        settings.currentList = allStudents.filter(isNe);
    }
    //expelled true
    if (settings.filterBy === "expelled") {
        settings.currentList = allStudents.filter(isE);
    }

    return settings.currentList;
}

//filter Gryffindor
function isG(student) {
    return student.house === "Gryffindor"
    /* if (student.house === "Gryffindor") {
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
//filter Ravenclaw
function isR(student) {
    return student.house === "Ravenclaw"
    /*  if (student.house === "Ravenclaw") {
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
//filter Prefect
function isP(student) {
    return student.prefect === true
}
//filter Inquisitors
function isI(student) {
    return student.isquad === true
}
//filter Expelled
function isNe(student) {
    return student.isquad === false
}
function isE(student) {
    return student.isquad === true
}


//------SORTING------//
function sortList(currentList) {
    //first name
    if (settings.sortBy === "first_name_az") {
        currentList = currentList.sort(firstNameAz);
    }
    if (settings.sortBy === "first_name_za") {
        currentList = currentList.sort(firstNameZa);
    }
    //last name
    if (settings.sortBy === "last_name_az") {
        currentList = currentList.sort(lastNameAz);
    }
    if (settings.sortBy === "last_name_za") {
        currentList = currentList.sort(lastNameZa);
    }
    //house
    if (settings.sortBy === "house_az") {
        currentList = currentList.sort(houseAz);
    }
    if (settings.sortBy === "house_za") {
        currentList = currentList.sort(houseZa);
    }




    return currentList;
}
//sort first name
function firstNameAz(elementA, elementB) {
    if (elementA.firstName > elementB.firstName) {
        return 1;
    } else {
        return -1
    }

}
function firstNameZa(elementA, elementB) {
    if (elementA.firstName < elementB.firstName) {
        return 1;
    } else {
        return -1
    }

}

//sort last name
function lastNameAz(elementA, elementB) {
    if (elementA.lastName > elementB.lastName) {
        return 1;
    } else {
        return -1
    }

}
function lastNameZa(elementA, elementB) {
    if (elementA.lastName < elementB.lastName) {
        return 1;
    } else {
        return -1
    }

}
// sort by house
function houseAz(elementA, elementB) {
    if (elementA.house > elementB.house) {
        return 1;
    } else {
        return -1
    }

}
function houseZa(elementA, elementB) {
    if (elementA.house < elementB.house) {
        return 1;
    } else {
        return -1
    }

}

