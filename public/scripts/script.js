const hostUrl = "http://localhost:8080/";
const Limit = 10;
const PageNumber = 1;
let user_id;
let bookDetailsCheck;

async function registration() {
  event.preventDefault();
  let signUpEle = document.forms.signUpForm.elements;
  let userName = signUpEle.username.value;
  let userEmail = signUpEle.email.value;
  let userPass = signUpEle.password.value;
  let userConPass = signUpEle.confirmpass.value;
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
  } else if (userConPass != userPass) {
    document.getElementById("signUpFormMessage").innerText =
      "Password and Confirm Password doesn't match";
  } else if (regex.test(userEmail) == false) {
    document.getElementById("signUpFormMessage").innerText =
      "Write email in abc@xyz.com format";
  } else {
    let data = JSON.stringify({
      username: userName,
      email: userEmail,
      password: userPass,
      confirmpass: userConPass,
    });

    let res = await fetch(hostUrl + "api/signup", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    let dataJson = await res.json();
    // console.log("Success:", JSON.stringify(dataJson));
    // console.log("Successful Signup");
    document.forms.signUpForm.reset();
    document.getElementById("login-signup").innerText =
      "User Signed Up Successfully!";
    document.getElementById("login_redirect").click();
  }
}

async function login() {
  event.preventDefault();
  let loginEle = document.forms.signInForm.elements;
  let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let userEmail = loginEle.email.value;
  let userPass = loginEle.password.value;
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
      password: userPass,
    });
    let res = await fetch(hostUrl + "api/login", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    });
    if (res.status == "404") {
      document.getElementById("signInFormMsg").innerText = "No user Exist!";
      // alert("no user exist with this name , please register first");
      document.getElementById("signup_redirect").click();
    } else if (res.status == "200") {
      document.getElementById("login-signup").innerText = "Logged in!";
      // toastr.success("Logged in!");
      window.location.assign("http://localhost:8080/views/bookfind.html");
    } else {
      alert(res.text());
    }
  }
  document.forms.signInForm.reset();
}

async function showUserInfo() {
  let user = await fetchUserDetails();
  // console.log(user);
  document.getElementById("user").innerText = user.username;
}
showUserInfo();

async function fetchUserDetails() {
  let cookie = document.cookie;
  let res = await fetch(hostUrl + "api/user/dashboard", {
    redirect: "follow",
    headers: {
      Cookie: cookie,
    },
  });
  let userJson = await res.json();
  return userJson;
}

async function logout() {
  fetch(hostUrl + "api/user/logout", {
    method: "GET",
    redirect: "follow",
  })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  window.location.assign(
    "https://findyourbook-2020.herokuapp.com/views/login.html"
  );
}

let bookContainer = document.getElementById("bookWishlist");

function bookDataDisplay(book) {
  let card = document.createElement("div");
  card.className = "card col-md-2 fixSize mb-4 mr-2 p-2";
  let image = document.createElement("img");
  image.className = "card-img-top img-fluid fizSize";
  image.src = book.bookImg;
  let cardBody = document.createElement("div");
  cardBody.className = "card-block";
  let title = document.createElement("h5");
  title.className = "card-title fizSiz";
  let titleData = document.createTextNode(book.bookName);
  title.appendChild(titleData);
  cardBody.appendChild(title);
  let para = document.createElement("h6");
  para.className = "card-text fizSiz";
  let paraData = document.createTextNode(book.bookAuthor);
  cardBody.appendChild(paraData);
  card.appendChild(image);
  card.appendChild(cardBody);
  bookContainer.appendChild(card);
}

async function fetchWishlist() {
  let userDetails = await fetchUserDetails();
  user_id = userDetails._id;
  try {
    let response = await fetch(
      hostUrl + "api/wishlist/display?userId=" + user_id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(response.json());
    response.json().then((matter) => {
      // console.log(matter[0].bagpack);
      matter[0].bagpack.forEach(bookDataDisplay);
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
fetchWishlist();

$(document).ready(function () {
  $.ajax({
    url: "/api/v1/bookdata?page=1&limit=10000",
    dataType: "json",
    type: "GET",
    contentType: "application/json; charset=utf-8",
    beforeSend: function () {
      // Show image container
      $("#loader").show();
    },
    success: function (data) {
      let tr;
      const books = data.results;
      for (let i = 0; i < books.length; i++) {
        let book_id = books[i]._id;
        let authorsdetail = books[i].authors;
        let titledetail = books[i].title;
        let imagedetail = books[i].small_image_url;
        tr += "<tr style='color:#723dbe'>";
        tr +=
          "<td style='vertical-align: middle;width: 40vw !important'>" +
          authorsdetail +
          "</td>";
        tr +=
          "<td style='vertical-align: middle;width: 40vw !important'>" +
          titledetail +
          "</td>";
        tr +=
          "<td class='pt-1 pl-1 pr-1' style='vertical-align: middle;width: 40vw !important'><img src='" +
          imagedetail +
          "' /></td>";
        tr +=
          "<td style='vertical-align: middle;width:40vw !important'><input type='button' class='btn btn-active-primary btn-sm m-0 waves-effect wish-button' value='WISHLIST' data-book_id='" +
          book_id +
          "' data-titledetail='" +
          titledetail +
          "' data-authorsdetail='" +
          authorsdetail +
          "' data-imagedetail='" +
          imagedetail +
          "' onClick='userWishlist(this)' />";
        tr += "</tr>";
      }
      $("#table_id").append(tr);
      tblFormation();
    },
    complete: function (data) {
      // Hide image container
      $("#loader").hide();
    },
    // error: function(xhr) {}
  });

  function tblFormation() {
    $("#table_id").DataTable({
      searching: true,
      //processing: true,
      deferRender: true,
      // scroller: true,
      pagingType: "numbers",
      columnDefs: [
        {
          orderable: false,
          targets: 3,
        },
      ],
    });
  }
});

async function userWishlist(el) {
  let userDetails = await fetchUserDetails();
  user_id = userDetails._id;

  try {
    const userId = user_id;
    const bookId = el.dataset.book_id;
    const bookname = el.dataset.titledetail;
    const authorname = el.dataset.authorsdetail;
    const bookimg = el.dataset.imagedetail;
    let body = {
      user_id: userId,
      book: {
        id: bookId,
        name: bookname,
        author: authorname,
        img: bookimg,
      },
    };

    let response = await fetch(hostUrl + "api/wishlist", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),

      redirect: "follow",
    });
    // console.log(body);

    if (response.status == 400) {
      toastr.error("Already Exist!");
    } else if (response.status == 200) {
      toastr.success("Added to the Wishlist");
    } else {
      alert(response.text());
    }
  } catch (error) {
    console.log("Error");
  }
}

$("#navbar_feature_btn").on("click", function (e) {
  e.preventDefault();
  $("#exampleModalLong").modal("show");
});
