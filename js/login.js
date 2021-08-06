let login = "";
let password = "";
let loginObject = {
  login: login,
  pass: password,
};

let loginURL = "https://music-player-api1.herokuapp.com/login";
let refreshURL = "https://music-player-api1.herokuapp.com/refresh-token";

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
  let userRefresh = getCookie("refreshToken");
  if (user != "") {
    window.location.href = "home.html";
  } else if (userRefresh != "") {
    fetch(refreshURL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ refreshToken: userRefresh }),
    })
      .then((refreshResponse) => {
        return refreshResponse
          .json()
          .then((body) => ({ status: refreshResponse.status, ...body }));
      })
      .then((refreshResponse) => {
        if (refreshResponse.status === 200) {
          let { accessToken, refreshToken } = refreshResponse;
          setCookie("accessToken", accessToken, 5);
          setCookie("refreshToken", refreshToken, 10);
          window.location.href = "https://music-player-api1.herokuapp.com/home";
        }
      });
  }
};
checkCookie();

let inputLogin = document.getElementById("loginInput");
let inputPassword = document.getElementById("passwordInput");

const takeLogin = () => {
  if (inputLogin.value == "") {
    inputLogin.placeholder = "Campo obrigatório";
    inputLogin.classList.add("your-class");
    inputLogin.style.border = "2px solid red";
    inputLogin.style.color = "red";
  } else if (inputPassword.value == "") {
    inputPassword.type = "text";
    inputPassword.placeholder = "Campo obrigatório";
    inputPassword.classList.add("your-class");
    inputPassword.style.border = "2px solid red";
    inputPassword.style.color = "red";
  } else if (inputLogin.value == "" && inputPassword.value == "") {
    inputLogin.placeholder = "Campo obrigatório";
    inputLogin.classList.add("your-class");
    inputLogin.style.border = "2px solid red";
    inputLogin.style.color = "red";
    inputPassword.type = "text";
    inputPassword.placeholder = "Campo obrigatório";
    inputPassword.classList.add("your-class");
    inputPassword.style.border = "2px solid red";
    inputPassword.style.color = "red";
  } else {
    loginObject.login = inputLogin.value;
    loginObject.pass = inputPassword.value;
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
          inputLogin.placeholder = "Usuário inválido";
          inputLogin.classList.add("your-class");
          inputLogin.value = "";
          inputPassword.style.border = "2px solid red";
          inputPassword.type = "text";
          inputPassword.placeholder = "Senha inválida";
          inputPassword.classList.add("your-class");
          inputPassword.value = "";
        }
      });
  }
};

const redirect = () => {
  window.location.href = "register.html";
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
