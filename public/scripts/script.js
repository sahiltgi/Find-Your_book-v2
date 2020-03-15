const hostUrl = "http://localhost:8080/";
const Limit = 20;
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
  let data = JSON.stringify({
    username: signUpEle.username.value,
    email: signUpEle.email.value,
    password: signUpEle.password.value
  });
  try {
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
    alert("login with your newely created credentials");
    // document.getElementById("signIn").click();
  } catch (error) {
    console.log("error", error);
  }
}

async function login() {
  event.preventDefault();
  let loginEle = document.forms.signInForm.elements;
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
      document.getElementById("signUp").click();
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

function bookDataDisplay() {
  let card = document.createElement("div");
  card.className = "card-header";
  let footerData = document.createTextNode("Footer");
  card.appendChild(footerData);
  let cardBody = document.createElement("div");
  cardBody.className = "card-body";
  let heading = document.createElement("h5");
  heading.className = "card-title";
  let titleData = document.createTextNode("Special Title Treatement");
  heading.appendChild(titleData);
  let para = document.createElement("p");
  para.className = "card-text";
  let paraData = document.createTextNode(
    "With supporting text below as a natural lead-in to additional content."
  );
  para.appendChild(paraData);
  cardBody.appendChild(heading);
  cardBody.appendChild(para);
  bookContainer.appendChild(card);
  bookContainer.appendChild(cardBody);
}

bookDataDisplay();

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
fetchBooks();
