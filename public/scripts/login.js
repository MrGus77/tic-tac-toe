const form = document.getElementById("form");
const username = document.getElementById("username");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  login({ username: username.value });
});

function storeUsername(username) {
  localStorage.setItem("username", username);
}

function logError(error) {
  console.error(error);
  alert("Failed to join the game.");
}

function redirectToGame(res) {
  console.log(res.json());
  window.location.href = "/game";
}

async function login({ username }) {
  await fetch("/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
  })
    .then((res) => {
      if (res.status === 200) {
        storeUsername(username);
        return redirectToGame(res);
      }

      return logError(res.json());
    })
    .catch((err) => logError(err));
}
