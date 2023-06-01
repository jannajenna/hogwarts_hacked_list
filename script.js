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
let hack = false;
let modalOpen = 0;

let currentStudents = []

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
    sortBy: "",
};

//------LOAD JSON ------//
async function start() {
    console.log("ready");
    const data = await loadStudentJSON();
    const bloodData = await loadBloodJSON();

    //console.log(data)
    //console.log(bloodData)

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
    console.log("blood data loaded", bloodData);
    /* prepareStatus(bloodData); */
    return bloodData;
}


//------PREPARE JSONDATA ------//
function prepareStudents(data) {
    // add data into array containing all students
    allStudents = data.map(prepareStudent);
    currentStudents = allStudents;
    //console.log("Preparing the data", currentStudents)
    displayList(allStudents);
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
    if (student.lastName === "Finch-fletchley") {
        const finch = student.lastName.split("-");
        student.image = `assets/images/${finch[1].toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
    } else if (student.lastName === "Patil") {
        student.image = `assets/images/${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
    } else {
        student.image = `assets/images/${student.lastName.toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
    }



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
    //console.log("PURE:", pureStatus);
    //console.log("HALF:", halfStatus);

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


//------FILTERING------//
function filterList(filteredList) {
    // console.log("filterList");
    currentStudents = filteredList;

    //all
    if (settings.filterBy === "all") {
        currentStudents = allStudents;
    }
    //house
    if (settings.filterBy === "gryffindor") {
        currentStudents = allStudents.filter(isG);
    }
    if (settings.filterBy === "hufflepuff") {
        currentStudents = allStudents.filter(isH);
    }
    if (settings.filterBy === "ravenclaw") {
        currentStudents = allStudents.filter(isR);
    }
    if (settings.filterBy === "slytherin") {
        currentStudents = allStudents.filter(isS);
    }

    //prefects
    if (settings.filterBy === "prefects") {
        currentStudents = allStudents.filter(isP);
    }
    //inquisitors
    if (settings.filterBy === "inquisitors") {
        currentStudents = allStudents.filter(isI);
    }
    //expelled false
    if (settings.filterBy === "noexpelled") {
        currentStudents = allStudents.filter(isNe);
    }
    //expelled true
    if (settings.filterBy === "expelled") {
        currentStudents = allStudents.filter(isE);
    }
    displayList(currentStudents);
    return currentStudents;
}

//filter Gryffindor
function isG(student) {
    return student.house === "Gryffindor"
}
//filter Hufflepuff
function isH(student) {
    return student.house === "Hufflepuff"
}
//filter Ravenclaw
function isR(student) {
    return student.house === "Ravenclaw"
}
//filter Slytherin
function isS(student) {
    return student.house === "Slytherin"
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
    return student.expelled === false
}
function isE(student) {
    return student.expelled === true
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


//------SEARCH------//
function search() {
    const searchInput = document.getElementById("search").value.toLowerCase();

    // Filter the list of students based on the search query
    const filteredList = allStudents.filter((student) => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        return fullName.includes(searchInput);
    });

    // Update the displayed list
    displayList(filteredList);
}

//------HACKING THE LIST ------//

function hackTheSystem() {
    //adds me into th list
    addFakeStudent()
    //Mess with student blood
    allStudents.forEach(messBlood);
    //Remove Inquisitors
    allStudents.forEach(removeInquisitors)

    alert("The system has been hacked with dark macig!")

}

function addFakeStudent() {
    console.log("Student added")
    const anna = Object.create(Student);
    anna.firstName = "Anna";
    anna.middleName = "Barella"
    anna.lastName = "Alonso";
    anna.gender = "girl";
    anna.house = "Ravenclaw";
    anna.image = "assets/images/alonso_a.png";
    anna.blood = "Half blood";
    anna.expelled = false;
    anna.prefect = false;
    anna.isquad = false;
    allStudents.push(anna);
    displayList(currentStudents);
    alert("The system has been hacked with dark magic!")
}

function messBlood(student) {
    if (student.blood === "Half blood" || student.blood === "Muggle") {
        student.blood = "Pure blood";
    } else if (student.blood === "Pure blood") {
        let randomStatus = ["Pure blood", "Half blood", "Muggle"];
        let index = Math.floor(Math.random() * 3);
        student.blood = randomStatus[index];
    } else {
        student.blood = "Pure blood";
    }
}


function removeInquisitors(student) {
    if (student.isquad === true) {
        setTimeout(() => {
            student.isquad = false;
            alert("Inquisitor removed from list!")
            buildList();
        }, 1000);
    }
}

//------THE LIST------//
//Students on display
function numberStudents() {

    // show total students
    document.querySelector("#numberofstudents").textContent = allStudents.length;

    //show number of current students displayed
    document.querySelector("#numberstudentsdisplayed").textContent = currentStudents.length

    //show number of students expelled
    document.querySelector("#numberstudentsexpelled").textContent = expelled.length

    // show total students each house
    document.querySelector("#numbersG").textContent = currentStudents.filter(isG).length;
    document.querySelector("#numbersH").textContent = currentStudents.filter(isH).length;
    document.querySelector("#numbersR").textContent = currentStudents.filter(isR).length;
    document.querySelector("#numbersS").textContent = currentStudents.filter(isS).length;
}

//Display list 
function displayList(newList) {
    console.log("display newList", newList);
    //clear the list
    document.querySelector(".list").innerHTML = "";

    //build a new list
    newList.forEach(displayStudent);
    numberStudents();
}

//Display student -- populate template
function displayStudent(student) {
    //create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    //set clone data
    //name
    clone.querySelector("[data-field=firstname]").textContent = student.firstName;
    clone.querySelector("[data-field=lastname]").textContent = student.lastName;

    //house
    clone.querySelector("[data-field=house]").textContent = student.house;

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

//Modal
function showModal(student) {
    //console.log("opened");
    modalOpen++; // Increment the count of opened modals

    if (modalOpen === 5) {
        hackTheSystem(); // Call the hackTheSystem function
    }
    document.querySelector(".modal").classList.remove("hidden");
    document.querySelector(".modal").classList.add("active");
    document.querySelector(".overlay").classList.add("active-overlay")
    document.querySelector(".modal-header").classList.add("close");

    document.querySelector(".firstName").textContent = student.firstName;
    document.querySelector(".middleName").textContent = student.middleName;
    document.querySelector(".lastName").textContent = student.lastName;
    document.querySelector(".nickName").textContent = student.nickName;

    document.querySelector(".student-photo").src = student.image;

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
        document.querySelector(".house-crest").src = "assets/icons/sly.svg";
    }

    //adding icons if student is prefect, inquisitor or expelled
    if (student.prefect === true) {
        document.querySelector(".modal_prefect").classList.remove("hidden");
        //document.querySelector(".btprefect").classList.add("disabled");
    } else {
        document.querySelector(".modal_prefect").classList.add("hidden");
    }

    if (student.isquad === true) {
        document.querySelector(".modal_inquisitor").classList.remove("hidden");
        //document.querySelector(".btninquisitor").classList.add("disabled");
    } else {
        document.querySelector(".modal_inquisitor").classList.add("hidden");
    }

    if (student.expelled === true) {
        document.querySelector(".text_expelled").classList.remove("hidden");
        document.querySelector(".btprefect").classList.add("disabled");
        document.querySelector(".btninquisitor").classList.add("disabled");

        document.querySelector(".modal_inquisitor").classList.add("hidden");
        document.querySelector(".modal_prefect").classList.add("hidden");
    } else {
        document.querySelector(".text_expelled").classList.add("hidden");
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
    document.querySelector(".btnexpel").removeEventListener("click", () => {
        expelStudent();
    });

    document.querySelector(".btprefect").removeEventListener("click", () => {
        prefectStudent();
    });

    document.querySelector(".btninquisitor").removeEventListener("click", () => {
        inquisitorStudent();
    });

}

//Expel students
function expelStudent(student) {

    if (student.firstName === "Anna") {
        alert("Student can not be expelled!")
    } else if (student.expelled === false) {
        student.expelled = true;
        let index = currentStudents.indexOf(student);
        expelled.push(student);
        currentStudents.splice(index, 1);

        hideModal();
        buildList(currentStudents);
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
            // Remove the previously selected student from prefects list
            prefects = prefects.filter((prefect) => prefect.house !== student.house);
            student.prefect = true;
            prefects.push(student);
            console.log("PREFECTS", prefects);
            hideModal();
            buildList(currentStudents);
        } else {
            alert("There can be only 2 prefects within one house.");
        }
    }
}

//Inquisitor students
function inquisitorStudent(student) {
    if (!student.expelled && !student.isquad) {
        if ((student.blood === "Pure blood" || student.house === "Slytherin") || (student.blood !== "Pure blood" && student.house === "Slytherin")) {
            // Remove the previously selected student from inquisitors list
            inquisitors = inquisitors.filter((inquisitor) => inquisitor.blood !== student.blood);
            student.isquad = true;
            inquisitors.push(student);
            console.log("INQUISITORS", inquisitors);
            hideModal();
            buildList(currentStudents);
        }

        if (student.blood !== "Pure blood" && student.house !== "Slytherin") {
            alert("Can't be inquisitor")
        }
    }
}

//Register form fields
function registerInputFields() {
    document.querySelector("#filter").addEventListener("change", selectFilter);
    document.querySelector("#sort").addEventListener("change", setSort);
    document.querySelector("#search").addEventListener("input", search);
}

function selectFilter(event) {
    //get the value of the selected option
    const filter = event.target.value;
    console.log(`User selected ${filter}`);

    settings.filterBy = filter;
    buildList(currentStudents);
}

function setSort(event) {
    // select sort option with input value & update in settings
    const sort = event.target.value;
    settings.sortBy = sort;

    console.log(`User is sorting by ${sort}`);
    buildList(currentStudents);
}

function buildList(list) {
    // console.log("buildList");
    // create filtered array
    const currentList = filterList(list);
    const sortedList = sortList(currentList);

    // displayList(sortedList);
    displayList(sortedList);
}

