import request from "./main.js";

const queryString = new URLSearchParams(location.search);
const teacherID = queryString.get("students");
const studentsRow = document.querySelector(".students-row");
const searchInput = document.querySelector(".search__inp");
const studentsCount = document.querySelector(".students-count");
const modulForm = document.querySelector(".teacher-form");
const studentsModal = document.querySelector(".total_modal");
const addStudentBtn = document.querySelector(".add-students-btn");
const addSaveStudent = document.querySelector(".add-save-student");

// for search
let search = "";
// add
let selected = null;
// chexbox
let Married;

function getStudents({
  avatar,
  firstName,
  lastName,
  id,
  age,
  isWork,
  phoneNumber,
  field,
  email,
  isMarried,
}) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 mt-5">
    <div class="card">
        <img src="${avatar}" class="card-img-top" alt="..." />
        <div class="card-body">
        <h5 class="card-title">${firstName} ${lastName}</h5>
        <div class="info-box">Age :<span>${age}</span></div>
        <p>${phoneNumber}</p>
        
        <a href="${email}">${email}</a> <br>
        <p class="my-3">isMarried: ${isMarried ? "Yes" : "No"}</p>
        <div class="info-box mb-3">Is Work: <span>${
          isWork ? "Yes" : "No"
        }</span></div>
        <button
        class="btn btn-success edit-btn m-3"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        id = "${id}"
        >Edit</
        >
        <button id="${id}" class="btn btn-danger delete-btn">Delete</button>
        </div>
        </div>
    </div>
    `;
}

async function getStudentsData() {
  try {
    studentsRow.innerHTML = `
    <div class="loader"></div>
    `;
    let params = { firstName: search }; //search
    let { data } = await request.get(`teacher/${teacherID}/students`, {
      params,
    });
    studentsCount.textContent = data.length; // count all students
    studentsRow.innerHTML = "";
    if (data.length !== 0) {
      data.map((students) => {
        studentsRow.innerHTML += getStudents(students);
      });
    } else {
      studentsRow.innerHTML += `<div class="no-product">Don't found students!</div>`;
    }
  } catch (err) {
    console.log("Error", err);
  }
}
getStudentsData();

// search

searchInput.addEventListener("keyup", function () {
  search = this.value.trim().toLowerCase();
  getStudentsData();
});

// adding students

modulForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let studentsData = {
    firstName: this.firstName.value,
    lastName: this.lastName.value,
    phoneNumber: this.phoneNumber.value,
    groups: this.groups.value,
    email: this.email.value,
  };

  if (selected === null) {
    await request.post(`teacher/${teacherID}/students`, studentsData);
  } else {
    await request.put(
      `teacher/${teacherID}/students/${selected}`,
      studentsData
    );
  }
  getStudentsData();
  bootstrap.Modal.getInstance(studentsModal).hide();
});

// adding button clean

addStudentBtn.addEventListener("click", () => {
  selected = null;
  modulForm.firstName.value = "";
  modulForm.lastName.value = "";
  modulForm.phoneNumber.value = "";
  modulForm.email.value = "";
  modulForm.isMarried.checked = "";
  addSaveStudent.textContent = "Add student";
});

// edit

window.addEventListener("click", async (e) => {
  let id = e.target.getAttribute("id");
  let checkEdit = e.target.classList.contains("edit-btn");
  if (checkEdit) {
    selected = id;
    let { data } = await request.get(`teacher/${teacherID}/students/${id}`);
    modulForm.firstName.value = data.firstName;
    modulForm.lastName.value = data.lastName;
    modulForm.phoneNumber.value = data.phoneNumber;
    modulForm.email.value = data.email;
    modulForm.isMarried.checked = data.isMarried;

    addSaveStudent.textContent = "Save student";
  }

  //delete

  let checkDelete = e.target.classList.contains("delete-btn");
  try {
    if (checkDelete) {
      let deleteConfirm = confirm("Do you want to delete this student data?");
      if (deleteConfirm) {
        let id = e.target.getAttribute("id");
        await request.delete(`teacher/${teacherID}/students/${id}`);
        getStudentsData();
      }
    }
  } catch (err) {
    console.log("error:", err);
  }
});

// sort asc to desc

sortList.addEventListener("change", function () {
  let sort = this.value;
  lastName = sort === "asc" ? "asc" : sort === "desc" ? "desc" : "";
  getTeachers();
});
