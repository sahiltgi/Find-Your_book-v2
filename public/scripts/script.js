const hostUrl = "http://localhost:8080/";
const Limit = 1000;
const PageNumber = 1;

// function validateEmail(emailField) {
//   var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

//   if (reg.test(emailField.value) == false) {
//     alert("Invalid Email Address");
//     return false;
//   }

//   return true;
// }

async function registration() {
  event.preventDefault();
  let signUpEle = document.forms.signUpForm.elements;
  let userName = signUpEle.username.value;
  let userEmail = signUpEle.email.value;
  let userPass = signUpEle.password.value;
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (userName == "" && userEmail == "" && userPass == "") {
    document.getElementById("signUpFormMessage").innerText =
      "username, email and password field cannot be empty";
  } else if (userName == "" && userEmail == "") {
    document.getElementById("signUpFormMessage").innerText =
      "username and email field cannot be empty";
  } else if (userName == "" && userPass == "") {
    document.getElementById("signUpFormMessage").innerText =
      "username and password field cannot be empty";
  } else if (userEmail == "" && userPass == "") {
    document.getElementById("signUpFormMessage").innerText =
      "email and password field cannot be empty";
  } else if (userName == "") {
    document.getElementById("signUpFormMessage").innerText =
      "username field cannot be empty";
  } else if (userEmail == "") {
    document.getElementById("signUpFormMessage").innerText =
      "email field cannot be empty";
  } else if (userPass == "") {
    document.getElementById("signUpFormMessage").innerText =
      "password field cannot be empty";
  } else if (userPass.length < 8) {
    document.getElementById("signUpFormMessage").innerText =
      "Length of password should be greater than 8";
  } else if (regex.test(userEmail) == false) {
    document.getElementById("signUpFormMessage").innerText =
      "Write email in abc@xyz.com format";
  } else {
    let data = JSON.stringify({
      username: userName,
      email: userEmail,
      password: userPass
    });

    let res = await fetch(hostUrl + "api/signup", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json"
      }
    });
    let dataJson = await res.json();
    console.log("Success:", JSON.stringify(dataJson));
    console.log("Successful Signup");
    document.forms.signUpForm.reset();
    alert("Sign up with your newely created credentials");
    document.getElementById("login_redirect").click();
  }
}

async function login() {
  event.preventDefault();
  let loginEle = document.forms.signInForm.elements;
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let userEmail = loginEle.email.value;
  let userPass = loginEle.password.value;
  console.log(userEmail);
  if (userEmail == "" && userPass == "") {
    document.getElementById("signInFormMsg").innerText =
      "email and password field cannot be empty";
  } else if (userEmail == "") {
    document.getElementById("signInFormMsg").innerText =
      "email field cannot be empty";
  } else if (userPass == "") {
    document.getElementById("signInFormMsg").innerText =
      "password field cannot be empty";
  } else if (userPass.length < 8) {
    document.getElementById("signInFormMsg").innerText =
      "Check for the Password";
  } else if (regex.test(userEmail) == false) {
    document.getElementById("signInFormMsg").innerText = "Check for the Email";
  } else {
    let data = JSON.stringify({
      email: userEmail,
      password: userPass
    });

    let res = await fetch(hostUrl + "api/login", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow"
    });
    if (res.status == "404") {
      alert("no user exist with this name , please register first");
      document.getElementById("signup_redirect").click();
    } else if (res.status == "200") {
      window.location.assign("http://localhost:8080/views/bookfind.html");
    } else {
      alert(res.text());
    }
    document.forms.signInForm.reset();
  }
}

async function logout() {
  fetch(hostUrl + "/api/user/logout", {
    method: "GET",
    redirect: "follow"
  })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log("error", error));

  window.location.assign(
    "https://findyourbook-2020.herokuapp.com/views/login.html"
  );
}

let bookContainer = document.getElementById("bookInfo");

// const bookDataDisplay = data => {
//   //asuming data is an array of books
//   const bookElements = data.reduce((str, book) => {
//     str += `
//       <div class="card">
//         <div class="card-header">${book.title}</div>
//       </div>
//     `;
//   }, "");

//   document.getElementById("bookInfo").innerHTML = bookElements;
// };

// fetchBooks().then(data => bookDataDisplay(data));

// function bookDataDisplay() {
//   let card = document.createElement("div");
//   card.className = "card-header";
//   let footerData = document.createTextNode("Footer");
//   card.appendChild(footerData);
//   let cardBody = document.createElement("div");
//   cardBody.className = "card-body";
//   let heading = document.createElement("h5");
//   heading.className = "card-title";
//   let titleData = document.createTextNode("Special Title Treatement");
//   heading.appendChild(titleData);
//   let para = document.createElement("p");
//   para.className = "card-text";
//   let paraData = document.createTextNode(
//     "With supporting text below as a natural lead-in to additional content."
//   );
//   para.appendChild(paraData);
//   cardBody.appendChild(heading);
//   cardBody.appendChild(para);
//   bookContainer.appendChild(card);
//   bookContainer.appendChild(cardBody);
// }

// bookDataDisplay();

async function fetchBooks() {
  try {
    let response = await fetch(
      hostUrl + `api/bookdata?page=${PageNumber}&limit=${Limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response);
    response.json().then(matter => {
      console.log(matter);
    });
    if (response.status == 200) {
      console.log("the status is " + response.status);
    } else {
      console.log("the status is " + response.status);
    }
  } catch (error) {
    console.log("Error:" + error);
  }
}
// fetchBooks();

$(document).ready(function() {
  $.ajax({
    url: "/api/v1/bookdata?page=1&limit=10000",
    dataType: "json",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    success: function(data) {
      let tr;
      const books = data.results;
      for (let i = 0; i < books.length; i++) {
        tr += "<tr>";
        tr += "<td>" + books[i].authors + "</td>";
        tr += "<td>" + books[i].title + "</td>";
        tr += "<td><img src='" + books[i].image_url + "' /></td>";
        tr += "</tr>";
      }
      $("#table_id").append(tr);
      tblFormation();
    },
    error: function(xhr) {}
  });
  function tblFormation() {
    $("#table_id").DataTable({
      searching: true,
      processing: true,
      scrollY: 700,
      deferRender: true,
      scroller: true
    });
  }
});
