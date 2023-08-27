import request from "./main.js";
import { LIMIT } from "./const.js";

const teacherRow = document.querySelector(".teachers-row");
const formcontrol = document.querySelector(".search__inp");
const teacherCount = document.querySelector(".teacher-count");
const pagination = document.querySelector(".pagination");
const modulForm = document.querySelector(".teacher-form");
const teacherModal = document.querySelector(".total_modal");
const addTeacherBtn = document.querySelector(".add-teacher-btn");
const addSaveTeacher = document.querySelector(".add-save-teacher");

// for search
let search = "";
// for pagination
let activePage = 1;
// add
let selected = null;
// chexbox
let Married;
// order
let lastName = "";

function getTeacherData({
  firstName,
  avatar,
  lastName,
  phoneNumber,
  email,
  id,
  isMarried,
}) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 mt-5 ">
        <div class="card">
            <img src="${avatar}" class="card-img-top" alt="..." />
            <div class="card-body">
            <h5 class="card-title">${firstName} ${lastName}</h5>
            <a class="email" href="${email}">${email}</a> <br>
            <a>isMarried: ${isMarried ? "Yes" : "No"}</a>
            <p>${phoneNumber}</p>
            
            <a href="students.html?students=${id}" class="btn btn-primary">Students</a>
            <button
              class="btn btn-success edit-btn"
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

async function getTeachers() {
  try {
    teacherRow.innerHTML = `
    <div class="loader"></div>
    `;
    let params = { firstName: search };
    let paramsWithPagination = {
      isMarried: Married,
      firstName: search,
      page: activePage,
      limit: LIMIT,
      sort: "lastName",
      order: lastName,
    };
    let { data } = await request.get("teacher", { params }); // teachers with search
    let { data: datawithPagination } = await request.get("teacher", {
      params: paramsWithPagination,
    }); // teachers with pagination

    let pages = Math.ceil(data.length / LIMIT); // pagination
    pagination.innerHTML = `
    <li class="page-item ${activePage === 1 ? "disabled" : ""}">
    <button page="-" onClick= "getPage('-')" class="page-link">Previous</button>
  </li>
   `;

    for (let i = 1; i <= pages; i++) {
      pagination.innerHTML += `<li class="page-item ${
        i === activePage ? "active" : ""
      }">
      <button page="${i}" onClick= "getPage(${i})" class="page-link" href="#">${i}</button>
    </li>`;
    }

    pagination.innerHTML += `
    <li class="page-item" ${activePage === pages ? "disabled" : ""}>
      <button page="-"  onClick= "getPage('+')" class="page-link" href="#">Next</button>
    </li>
   `;

    for (let i = 0; i < pagination.children.length; i++) {
      let pageItem = pagination.children[i];
      pageItem.addEventListener("click", () => {
        if (i === 0) {
          getPage("-");
        } else if (i === pages + 1) {
          getPage("+");
        } else {
          getPage(i);
        }
      });
    }
    function getPage(page) {
      if (page == "+") {
        activePage++;
      } else if (page == "-") {
        activePage--;
      } else {
        activePage = page;
      }
      getTeachers();
    }

    teacherCount.textContent = data.length; // count all teachers
    teacherRow.innerHTML = "";
    if (data.length !== 0) {
      datawithPagination.map((teacher) => {
        teacherRow.innerHTML += getTeacherData(teacher);
      });
    } else {
      teacherRow.innerHTML = `<div class="no-product">Don't found teacher!</div>`;
    }
  } catch (err) {
    console.log(err);
  }
}
getTeachers();

// search

formcontrol.addEventListener("keyup", function () {
  search = this.value.trim().toLowerCase();
  getTeachers();
});

// pagination

pagination.addEventListener("click", (e) => {
  let page = e.target.getAttribute("page");
  if (page !== null) {
    if (page === "+") {
      activePage++;
    } else if (page === "-") {
      activePage--;
    } else {
      activePage = +page;
    }
    getTeachers();
  }
});

// adding teachers

modulForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  let teacherData = {
    firstName: this.firstName.value,
    lastName: this.lastName.value,
    phoneNumber: this.phoneNumber.value,
    groups: this.groups.value,
    email: this.email.value,
    isMarried: Married.checked,
  };

  if (selected === null) {
    await request.post("teacher", teacherData);
  } else {
    await request.put(`teacher/${selected}`, teacherData);
  }
  getTeachers();
  bootstrap.Modal.getInstance(teacherModal).hide();
});

// adding button clean

addTeacherBtn.addEventListener("click", () => {
  selected = null;
  modulForm.firstName.value = "";
  modulForm.lastName.value = "";
  modulForm.phoneNumber.value = "";
  modulForm.email.value = "";
  modulForm.isMarried.checked = "";
  addSaveTeacher.textContent = "Add teacher";
});

// edit

window.addEventListener("click", async (e) => {
  let id = e.target.getAttribute("id");
  let checkEdit = e.target.classList.contains("edit-btn");
  if (checkEdit) {
    selected = id;
    let { data } = await request.get(`teacher/${id}`);
    modulForm.firstName.value = data.firstName;
    modulForm.lastName.value = data.lastName;
    modulForm.phoneNumber.value = data.phoneNumber;
    modulForm.email.value = data.email;
    modulForm.isMarried.checked = data.isMarried;

    addSaveTeacher.textContent = "Save teacher";
  }

  //delete

  let checkDelete = e.target.classList.contains("delete-btn");
  try {
    if (checkDelete) {
      let deleteConfirm = confirm("Do you want to delete this teacher data?");
      if (deleteConfirm) {
        let id = e.target.getAttribute("id");
        await request.delete(`teacher/${id}`);
        getTeachers();
      }
    }
  } catch (err) {
    console.log("error:", err);
  }
});

// // select all, married, single

seletTeacher.addEventListener("change", function () {
  Married = this.value;
  getTeachers();
});

// sort asc to desc

sortList.addEventListener("change", function () {
  let sort = this.value;
  lastName = sort === "asc" ? "asc" : sort === "desc" ? "desc" : "";
  getTeachers();
});
