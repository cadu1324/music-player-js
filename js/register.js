let login = "";
let password = "";
let fullName = "";
let loginObject = {
  login: login,
  pass: password,
  name: fullName,
};

let loginURL = "https://music-player-api1.herokuapp.com/user";

const setCookie = (tokenName, accessToken, exhours) => {
  let d = new Date();
  d.setTime(d.getTime() + exhours * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = tokenName + "=" + accessToken + ";" + expires + ";path=/";
};

const getCookie = (tokenName) => {
  let name = tokenName + "=";
  let ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

const checkCookie = () => {
  let user = getCookie("accessToken");
  if (user != "") {
    window.location.href = "home.html";
  }
};
checkCookie();

let inputLogin = document.getElementById("loginInput");
let inputPassword = document.getElementById("passwordInput");
let inputPasswordConfirm = document.getElementById("passwordInputConfirm");
let inputName = document.getElementById("nameInput");

const takeLogin = function () {
  if (inputLogin.value == "") {
    inputLogin.style.border = "2px solid red";
    inputLogin.style.color = "red";
    inputLogin.placeholder = "Campo obrigatório";
    inputLogin.classList.add("your-class");
  } else if (inputPassword.value == "") {
    inputPassword.type = "text";
    inputPassword.placeholder = "Campo obrigatório";
    inputPassword.style.border = "2px solid red";
    inputPassword.style.color = "red";
    inputPassword.classList.add("your-class");
  } else if (inputPasswordConfirm.value == "") {
    inputPasswordConfirm.type = "text";
    inputPasswordConfirm.placeholder = "Campo obrigatório";
    inputPasswordConfirm.style.border = "2px solid red";
    inputPasswordConfirm.style.color = "red";
    inputPasswordConfirm.classList.add("your-class");
  } else if (inputName.value == "") {
    inputName.type = "text";
    inputName.placeholder = "Campo obrigatório";
    inputName.style.border = "2px solid red";
    inputName.style.color = "red";
    inputName.classList.add("your-class");
  } else if (inputPasswordConfirm.value != inputPassword.value) {
    inputPasswordConfirm.type = "text";
    inputPasswordConfirm.placeholder = "Senhas diferentes";
    inputPasswordConfirm.style.border = "2px solid red";
    inputPasswordConfirm.style.color = "red";
    inputPasswordConfirm.classList.add("your-class");
  } else {
    loginObject.login = inputLogin.value;
    loginObject.pass = inputPassword.value;
    loginObject.name = inputName.value;

    fetch(loginURL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(loginObject),
    })
      .then((response) => {
        return response
          .json()
          .then((body) => ({ status: response.status, ...body }));
      })
      .then((response) => {
        if (response.status === 200) {
          let { accessToken, refreshToken } = response;
          setCookie("accessToken", accessToken, 5);
          setCookie("refreshToken", refreshToken, 10);
          window.location.href = "home.html";
        } else {
          inputLogin.style.border = "2px solid red";
          inputLogin.style.color = "red";
          inputLogin.placeholder = "Usuário Existente";
          inputLogin.classList.add("your-class");
        }
      });
  }
};

const changeIcon = () => {
  const icon = inputPassword.type;

  if (icon == "password") {
    inputPassword.type = "text";
    document.getElementById("btnIcon").style.background =
      'url("../svg/visibility_black_24dp.svg")  center / contain no-repeat';
  } else {
    inputPassword.type = "password";
    document.getElementById("btnIcon").style.background =
      'url("../svg/visibility_off_black_24dp.svg")  center / contain no-repeat';
  }
};

const changeIconConfirm = () => {
  const icon2 = inputPasswordConfirm.type;

  if (icon2 == "password") {
    inputPasswordConfirm.type = "text";
    document.getElementById("btnIconConfirm").style.background =
      'url("../svg/visibility_black_24dp.svg")  center / contain no-repeat';
  } else {
    inputPasswordConfirm.type = "password";
    document.getElementById("btnIconConfirm").style.background =
      'url("../svg/visibility_off_black_24dp.svg")  center / contain no-repeat';
  }
};
