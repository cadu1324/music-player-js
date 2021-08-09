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
  let refreshURL = "https://music-player-api1.herokuapp.com/refresh-token";
  if (user != "") {
    // window.location.href = 'home.html'
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
        }
      });
  } else {
    window.location.href = "login.html";
  }
};
checkCookie();

const recommendedMusic = () => {
  let smallerName = [];
  let takeMusic = [];
  let takeImg = [];
  let takeName = [];
  let takeArtist = [];
  let user = getCookie("accessToken");
  let musicURL = "https://music-player-api1.herokuapp.com/music/recommended";
  fetch(musicURL, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      for (let index = 0; index < response.musics.length; index++) {
        let button = document.createElement("button");
        button.className = "btnSectionOne homeMainNone";
        button.setAttribute("id", `${index}`);

        let imgButton = document.createElement("img");
        imgButton.className = "imgRec homeMainNone";
        button.appendChild(imgButton);

        let spanButton = document.createElement("span");
        spanButton.className = "spanWords spanRec homeMainBlock";
        button.appendChild(spanButton);

        let spanButtonArtirst = document.createElement("span");
        spanButtonArtirst.className = "spanArtist homeMainBlock";
        button.appendChild(spanButtonArtirst);

        if (response.musics[index].name.length > 15) {
          smallerName[index] =
            response.musics[index].name.substring(0, 10) + "...";
        }

        imgButton.src = response.musics[index].imgUrl;
        spanButton.innerText = smallerName[index];
        spanButtonArtirst.innerText = response.musics[index].artist;
        takeMusic.push(response.musics[index].url);
        takeImg.push(response.musics[index].imgUrl);
        takeName.push(response.musics[index].name);
        takeArtist.push(response.musics[index].artist);
        document.getElementById("sectionOne").appendChild(button);
      }
      document.querySelectorAll(".btnSectionOne").forEach((a) => {
        a.addEventListener("click", () => {
          document.getElementById("audio").src = takeMusic[a.id];
          document.getElementById("imgBarMusic").src = takeImg[a.id];
          document.getElementById("imgMobileBar").src = takeImg[a.id];
          document.getElementById("imgPlayingNow").src = takeImg[a.id];
          document.getElementById("spanNameMusicBar").innerText =
            takeName[a.id];
          document.getElementById("spanMobileBarName").innerText =
            takeName[a.id];
          document.getElementById("nameMusicPlaying").innerText =
            takeName[a.id];
          document.getElementById("spanArtistMusicBar").innerText =
            takeArtist[a.id];
          document.getElementById("spanMobileBarArtist").innerText =
            takeArtist[a.id];
          document.getElementById("nameArtistPlaying").innerText =
            takeArtist[a.id];
        });
      });
      document.querySelectorAll("#svgContentOne").forEach((e) => {
        e.addEventListener("click", (event) => {
          if (event.screenX > 900 && event.screenX < 1200) {
            document.getElementById("sectionOne").scrollLeft += 100;
          }
          if (event.screenX < 400) {
            document.getElementById("sectionOne").scrollLeft += -100;
          }
        });
      });
    });
};
recommendedMusic();

const playlistMusic = () => {
  let user = getCookie("accessToken");
  let musicURL = "https://music-player-api1.herokuapp.com/playlist";
  fetch(musicURL, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      for (let index = 0; index < response.playlists.length; index++) {
        let button = document.createElement("button");
        button.className = "btnSectionTwo homeMain";

        let imgButton = document.createElement("img");
        imgButton.className = "imgPlay homeMain";
        button.appendChild(imgButton);

        let spanButton = document.createElement("span");
        spanButton.className = "spanPlayWords homeMain";
        button.appendChild(spanButton);

        if (response.playlists[index].name.length > 5) {
          response.playlists[index].name =
            response.playlists[index].name.substring(0, 5) + "...";
        }
        imgButton.src = response.playlists[index].imgUrl;
        spanButton.innerText = response.playlists[index].name;

        document.getElementById("sectionTwo").appendChild(button);
      }
      document.querySelectorAll("#svgContentTwo").forEach((e) => {
        e.addEventListener("click", (event) => {
          if (event.screenX > 900 && event.screenX < 1300) {
            document.getElementById("sectionTwo").scrollLeft += 250;
          }
          if (event.screenX < 400) {
            document.getElementById("sectionTwo").scrollLeft += -250;
          }
        });
      });
    });
};
playlistMusic();

const topMusic = () => {
  let user = getCookie("accessToken");
  let musicURL = "https://music-player-api1.herokuapp.com/playlist/top";

  fetch(musicURL, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      document.getElementById("imgTopB").src = response.playlists[0].imgUrl;
      document.getElementById("spanTopB").innerText =
        response.playlists[0].name;

      document.getElementById("imgTopW").src = response.playlists[1].imgUrl;
      document.getElementById("spanTopW").innerText =
        response.playlists[1].name;
    });
};
topMusic();

const libraryMusic = () => {
  let user = getCookie("accessToken");
  let libraryMusics = "https://music-player-api1.herokuapp.com/playlist";
  fetch(libraryMusics, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      for (let i = 0; i < response.playlists.length; i++) {
        let button = document.createElement("button");
        button.className = "btnLibraryMain homeMain";

        let imgButton = document.createElement("img");
        imgButton.className = "imgLibraryMain homeMain";
        button.appendChild(imgButton);

        let spanButton = document.createElement("span");
        spanButton.className = "spanLibraryWords homeMain";
        button.appendChild(spanButton);

        if (response.playlists[i].name.length > 5) {
          response.playlists[i].name =
            response.playlists[i].name.substring(0, 5) + "...";
        }
        imgButton.src = response.playlists[i].imgUrl;
        spanButton.innerText = response.playlists[i].name;

        document.getElementById("libraryMain").appendChild(button);
      }
    });
};

libraryMusic();

const openOptions = () => {
  let menu = document.getElementById("optionsMobile");
  let open = menu.animate(
    [{ transform: "translate(0, 0)" }, { transform: "translate(300px, 0)" }],
    500
  );
  open.addEventListener("finish", () => {
    menu.style.transform = "translate(300px, 0)";
  });
};

const closeOptions = () => {
  let menu = document.getElementById("optionsMobile");
  let close = menu.animate(
    [{ transform: "translate(300px, 0)" }, { transform: "translate(0, 0)" }],
    500
  );
  close.addEventListener("finish", () => {
    menu.style.transform = "translate(0, 0)";
  });
};

const searchMenuMobile = () => {
  let btnMenu = document.getElementById("buttonSearchMenuMobile");
  if (btnMenu.innerHTML.length == 383) {
    document.getElementById("inputSearchMobile").style.display = "block";
    btnMenu.innerHTML =
      '<svg class="svgMenuMobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>';

    let classHome = document.querySelectorAll(".spanWords");
    for (let i = 0; i < classHome.length; i++) {
      classHome[i].style.display = "none";
    }
    let classHomeBlock = document.querySelectorAll(".homeMainBlock");
    for (let i = 0; i < classHomeBlock.length; i++) {
      classHomeBlock[i].style.display = "none";
    }
    let classHomeFlex = document.querySelectorAll(".homeMainFlex");
    for (let i = 0; i < classHomeFlex.length; i++) {
      classHomeFlex[i].style.display = "none";
    }
    let classHomeNone = document.querySelectorAll(".homeMainNone");
    for (let i = 0; i < classHomeNone.length; i++) {
      classHomeNone[i].style.flex = "none";
    }
    document.getElementById("searchMobile").style.display = "block";
  } else {
    document.getElementById("inputSearchMobile").style.display = "none";
    btnMenu.innerHTML =
      '<svg class="svgMenuMobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
    let classHomeBlock = document.querySelectorAll(".homeMainBlock");
    for (let i = 0; i < classHomeBlock.length; i++) {
      classHomeBlock[i].style.display = "block";
    }
    let classHomeFlex = document.querySelectorAll(".homeMainFlex");
    for (let i = 0; i < classHomeFlex.length; i++) {
      classHomeFlex[i].style.display = "flex";
    }
    document.getElementById("svgContentOne").style.display = "none";
    document.getElementById("svgContentTwo").style.display = "none";
    document.getElementById("searchMobile").style.display = "none";
  }
};

const showHome = () => {
  let classHomeBlock = document.querySelectorAll(".homeMainBlock");
  for (let i = 0; i < classHomeBlock.length; i++) {
    classHomeBlock[i].style.display = "block";
  }
  let classHomeFlex = document.querySelectorAll(".homeMainFlex");
  for (let i = 0; i < classHomeFlex.length; i++) {
    classHomeFlex[i].style.display = "flex";
  }
  let classHomeNone = document.querySelectorAll(".homeMainNone");
  for (let i = 0; i < classHomeNone.length; i++) {
    classHomeNone[i].style.flex = "none";
  }
  let classSearchFlex = document.querySelectorAll(".searchMainFlex");
  for (let a = 0; a < classSearchFlex.length; a++) {
    classSearchFlex[a].style.display = "none";
  }
  let classSearchBlock = document.querySelectorAll(".searchMainBlock");
  for (let a = 0; a < classSearchBlock.length; a++) {
    classSearchBlock[a].style.display = "none";
  }
  document.getElementById("libraryMain").style.display = "none";
};

const showSearch = () => {
  let classHome = document.querySelectorAll(".spanWords");
  for (let i = 0; i < classHome.length; i++) {
    classHome[i].style.display = "none";
  }
  let classHomeBlock = document.querySelectorAll(".homeMainBlock");
  for (let i = 0; i < classHomeBlock.length; i++) {
    classHomeBlock[i].style.display = "none";
  }
  let classHomeFlex = document.querySelectorAll(".homeMainFlex");
  for (let i = 0; i < classHomeFlex.length; i++) {
    classHomeFlex[i].style.display = "none";
  }
  let classHomeNone = document.querySelectorAll(".homeMainNone");
  for (let i = 0; i < classHomeNone.length; i++) {
    classHomeNone[i].style.flex = "none";
  }
  let classSearchFlex = document.querySelectorAll(".searchMainFlex");
  for (let a = 0; a < classSearchFlex.length; a++) {
    classSearchFlex[a].style.display = "flex";
  }
  let classSearchBlock = document.querySelectorAll(".searchMainBlock");
  for (let a = 0; a < classSearchBlock.length; a++) {
    classSearchBlock[a].style.display = "block";
  }
  document.getElementById("libraryMain").style.display = "none";
};

const showLibrary = () => {
  let classHome = document.querySelectorAll(".spanWords");
  for (let i = 0; i < classHome.length; i++) {
    classHome[i].style.display = "none";
  }
  let classHomeBlock = document.querySelectorAll(".homeMainBlock");
  for (let i = 0; i < classHomeBlock.length; i++) {
    classHomeBlock[i].style.display = "none";
  }
  let classHomeFlex = document.querySelectorAll(".homeMainFlex");
  for (let i = 0; i < classHomeFlex.length; i++) {
    classHomeFlex[i].style.display = "none";
  }
  let classHomeNone = document.querySelectorAll(".homeMainNone");
  for (let i = 0; i < classHomeNone.length; i++) {
    classHomeNone[i].style.flex = "none";
  }
  let classSearchFlex = document.querySelectorAll(".searchMainFlex");
  for (let a = 0; a < classSearchFlex.length; a++) {
    classSearchFlex[a].style.display = "none";
  }
  let classSearchBlock = document.querySelectorAll(".searchMainBlock");
  for (let a = 0; a < classSearchBlock.length; a++) {
    classSearchBlock[a].style.display = "none";
  }
  document.getElementById("libraryMain").style.display = "flex";
};

const searchMusic = () => {
  let user = getCookie("accessToken");
  console.log("alo");
  let music = document.getElementById("inputSearch").value;
  let urlSearch = `https://music-player-api1.herokuapp.com/music?search=${music}`;
  fetch(urlSearch, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      for (let i = 0; i < response.musics.length; i++) {
        let button = document.createElement("button");
        button.className = "btnSearchMain searchMain";

        let imgButton = document.createElement("img");
        imgButton.className = "imgSearch searchMain";
        button.appendChild(imgButton);

        let spanButton = document.createElement("span");
        spanButton.className = "spanSearch searchMain";
        button.appendChild(spanButton);

        let spanButtonArtist = document.createElement("span");
        spanButtonArtist.className = "spanSearchArtist searchMain";
        button.appendChild(spanButtonArtist);

        imgButton.src = response.musics[i].imgUrl;
        spanButton.innerText = response.musics[i].name;
        spanButtonArtist.innerText = response.musics[i].artist;

        document.getElementById("sectionTwoSearch").appendChild(button);
      }
    });
};

let playOrPause = false;
let startInput;

const inputBehavior = () => {
  inputMusic.value++;
  inputPlayingNow.value++;
  //volume
  audio.volume = document.getElementById("inputVolume").value;

  if (Math.floor(document.getElementById("audio").currentTime % 60) < 10) {
    document.getElementById("currentDuration").innerText =
      Math.floor(parseInt(document.getElementById("audio").currentTime) / 60) +
      " : 0" +
      Math.floor(document.getElementById("audio").currentTime % 60);
    document.getElementById("currentTimePlaying").innerText =
      Math.floor(parseInt(document.getElementById("audio").currentTime) / 60) +
      " : 0" +
      Math.floor(document.getElementById("audio").currentTime % 60);
  } else {
    document.getElementById("currentDuration").innerText =
      Math.floor(parseInt(document.getElementById("audio").currentTime) / 60) +
      " : " +
      Math.floor(document.getElementById("audio").currentTime % 60);
    document.getElementById("currentTimePlaying").innerText =
      Math.floor(parseInt(document.getElementById("audio").currentTime) / 60) +
      " : " +
      Math.floor(document.getElementById("audio").currentTime % 60);
  }
  inputMusic.addEventListener("click", () => {
    audio.currentTime = inputMusic.value;
  });
  inputMusic.addEventListener("touchend", () => {
    audio.currentTime = inputMusic.value;
  });
  inputPlayingNow.addEventListener("touchend", () => {
    audio.currentTime = inputPlayingNow.value;
  });
  if (
    document.getElementById("inputMusic").value ==
    Math.floor(document.getElementById("inputMusic").max)
  ) {
    document.getElementById("inputMusic").value = 0;
    document.getElementById("inputPlayingNow").value = 0;
    nextMusic();
  }
  if (Math.floor(document.getElementById("audio").duration) % 60 < 10) {
    document.getElementById("durationPlaying").innerText =
      Math.floor(parseInt(document.getElementById("audio").duration) / 60) +
      " : 0" +
      Math.floor(document.getElementById("audio").duration % 60);
    document.getElementById("totalDuration").innerText =
      Math.floor(parseInt(document.getElementById("audio").duration) / 60) +
      " : 0" +
      Math.floor(document.getElementById("audio").duration % 60);
  } else {
    document.getElementById("durationPlaying").innerText =
      Math.floor(parseInt(document.getElementById("audio").duration) / 60) +
      " : " +
      Math.floor(document.getElementById("audio").duration % 60);
    document.getElementById("totalDuration").innerText =
      Math.floor(parseInt(document.getElementById("audio").duration) / 60) +
      " : " +
      Math.floor(document.getElementById("audio").duration % 60);
  }
};

const playAndPause = () => {
  let audio = document.getElementById("audio");
  //play/pause
  document.getElementById("inputMusic").max = audio.duration;
  if (playOrPause == false) {
    audio.play();
    document.getElementById("pauseButton").innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    document.getElementById("pausePlaying").innerHTML =
      '<svg class="svgPlayingNowControls" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"  fill="#EAF0FF"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    startInput = setInterval(inputBehavior, 1000);
    playOrPause = true;
  } else {
    audio.pause();
    document.getElementById("pauseButton").innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M0 0h24v24H0z" fill="none"/><path d="M8 5v14l11-7z"/></svg>';
    document.getElementById("pausePlaying").innerHTML =
      '<svg class="svgPlayingNowControls" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="#EAF0FF"><path d="M0 0h24v24H0z" fill="none"/><path d="M8 5v14l11-7z"/></svg>';
    clearInterval(startInput);
    playOrPause = false;
  }
};

let muteOrUnmute = false;
const changeVolumeIcon = () => {
  if (muteOrUnmute == false) {
    document.getElementById("btnVolume").innerHTML =
      '<svg class="svgVolume" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
    document.getElementById("inputVolume").value = 0;
    muteOrUnmute = true;
  } else {
    document.getElementById("btnVolume").innerHTML =
      '<svg class="svgVolume" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  ><path d="M0 0h24v24H0z" fill="none"/><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    document.getElementById("inputVolume").value = 0.5;
    muteOrUnmute = false;
  }
};

let musicStorage = [];
const previousMusic = () => {
  musicStorage.reverse();
  let user = getCookie("accessToken");
  let music = musicStorage[0];
  let urlSearch = `https://music-player-api1.herokuapp.com/music?search=${music}`;
  fetch(urlSearch, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      document.getElementById("inputMusic").value = 0;
      document.getElementById("inputPlayingNow").value = 0;
      document.getElementById("spanNameMusicBar").innerText =
        response.musics[0].name;
      document.getElementById("imgBarMusic").src = response.musics[0].imgUrl;
      document.getElementById("spanArtistMusicBar").innerText =
        response.musics[0].artist;
      document.getElementById("audio").src = response.musics[0].url;
      document.getElementById("imgMobileBar").src = response.musics[0].imgUrl;
      document.getElementById("spanMobileBarName").innerText =
        response.musics[0].name;
      document.getElementById("spanMobileBarArtist").innerText =
        response.musics[0].artist;
      document.getElementById("imgPlayingNow").src = response.musics[0].imgUrl;
      document.getElementById("nameMusicPlaying").innerText =
        response.musics[0].name;
      document.getElementById("nameArtistPlaying").innerText =
        response.musics[0].artist;
      document.getElementById("audio").play();
    });
};

const nextMusic = () => {
  let user = getCookie("accessToken");
  let musicURL = "https://music-player-api1.herokuapp.com/music/recommended";
  fetch(musicURL, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      let spanNameMusicBar = document.getElementById("spanNameMusicBar");
      let randomMusic = [];
      let check = false;
      musicStorage.push(spanNameMusicBar.innerText);
      function randomMusicGenerator() {
        randomMusic.push(Math.floor(Math.random() * response.musics.length));
        randomMusic.reverse();
      }

      do {
        randomMusicGenerator();
        if (
          spanNameMusicBar.innerText != response.musics[randomMusic[0]].name
        ) {
          document.getElementById("inputMusic").value = 0;
          document.getElementById("inputPlayingNow").value = 0;
          spanNameMusicBar.innerText = response.musics[randomMusic[0]].name;
          document.getElementById("imgBarMusic").src =
            response.musics[randomMusic[0]].imgUrl;
          document.getElementById("spanArtistMusicBar").innerText =
            response.musics[randomMusic[0]].artist;
          document.getElementById("audio").src =
            response.musics[randomMusic[0]].url;
          document.getElementById("imgMobileBar").src =
            response.musics[randomMusic[0]].imgUrl;
          document.getElementById("spanMobileBarName").innerText =
            response.musics[randomMusic[0]].name;
          document.getElementById("spanMobileBarArtist").innerText =
            response.musics[randomMusic[0]].artist;
          document.getElementById("imgPlayingNow").src =
            response.musics[randomMusic[0]].imgUrl;
          document.getElementById("nameMusicPlaying").innerText =
            response.musics[randomMusic[0]].name;
          document.getElementById("nameArtistPlaying").innerText =
            response.musics[randomMusic[0]].artist;
          document.getElementById("audio").play();
          check = true;
        }
      } while (check != true);
    });
};

const openPlayerMobile = () => {
  document.getElementById("playingNow").style.visibility = "visible";
};

const closePlayerMobile = () => {
  document.getElementById("playingNow").style.visibility = "hidden";
};

const searchMusicMobile = () => {
  let takeMusic = [];
  let takeImg = [];
  let takeName = [];
  let takeArtist = [];
  let user = getCookie("accessToken");
  let music = document.getElementById("inputSearchMobile").value;
  let urlSearch = `https://music-player-api1.herokuapp.com/music?search=${music}`;
  fetch(urlSearch, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      for (let i = 0; i < response.musics.length; i++) {
        let button = document.createElement("button");
        button.className = "btnSearchMobile searchMobile";
        button.setAttribute("id", `${i}`);

        let imgButton = document.createElement("img");
        imgButton.className = "imgSearchMobile searchMobile";
        button.appendChild(imgButton);

        let spanButton = document.createElement("span");
        spanButton.className = "spanSearchMobile searchMobile";
        button.appendChild(spanButton);

        let spanButtonArtist = document.createElement("span");
        spanButtonArtist.className = "spanSearchArtistMobile searchMobile";
        button.appendChild(spanButtonArtist);

        imgButton.src = response.musics[i].imgUrl;
        spanButton.innerText = response.musics[i].name;
        spanButtonArtist.innerText = response.musics[i].artist;
        takeMusic.push(response.musics[i].url);
        takeImg.push(response.musics[i].imgUrl);
        takeName.push(response.musics[i].name);
        takeArtist.push(response.musics[i].artist);
        document.getElementById("searchMobile").appendChild(button);
      }
      document.querySelectorAll(".btnSearchMobile").forEach((a) => {
        a.addEventListener("click", () => {
          document.getElementById("audio").src = takeMusic[a.id];
          document.getElementById("imgBarMusic").src = takeImg[a.id];
          document.getElementById("imgMobileBar").src = takeImg[a.id];
          document.getElementById("spanNameMusicBar").innerText =
            takeName[a.id];
          document.getElementById("spanMobileBarName").innerText =
            takeName[a.id];
          document.getElementById("spanArtistMusicBar").innerText =
            takeArtist[a.id];
          document.getElementById("spanMobileBarArtist").innerText =
            takeArtist[a.id];
        });
      });
    });
};