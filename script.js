const button = document.getElementById("generateUser");
const spinner = document.getElementById("spinner");
const userContainer = document.getElementById("userContainer");

const countries = ["USA", "India", "Canada", "Germany", "Australia", "UK"];

button.addEventListener("click", async () => {

  spinner.style.display = "block";

  try {

    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();

    const user = data[Math.floor(Math.random() * data.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];

    userContainer.innerHTML += `
      <div class="card">
        <img src="https://i.pravatar.cc/120?img=${user.id}" class="avatar">
        <h3>Name: ${user.name}</h3>
        <p>Email: ${user.email}</p>
        <p>Country: ${country}</p>
      </div>
    `;

  } catch (error) {

    userContainer.innerHTML = `<p style="color:red;">Failed to load user.</p>`;
    console.log(error);

  } finally {

    spinner.style.display = "none";

  }

});


document.getElementById("searchWeather").onclick = function () {

  let city = document.getElementById("cityInput").value.trim();

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
    .then(response => response.json())
    .then(data => {

      if (!data.results) {
        document.getElementById("weatherResult").innerHTML =
          "<span class='error'>City not found. Please type a valid city.</span>";
        return;
      }

      let place = data.results[0];

      if (place.feature_code === "PCLI") {
        document.getElementById("weatherResult").innerHTML =
          "<span class='error'>This is a country name. Please enter a city.</span>";
        return;
      }

      let lat = place.latitude;
      let lon = place.longitude;

      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(response => response.json())
        .then(weather => {

          let temp = weather.current_weather.temperature;
          let wind = weather.current_weather.windspeed;
          let code = weather.current_weather.weathercode;

          let condition = "";

          if (code == 0) condition = "Clear Sky";
          else if (code == 1) condition = "Mainly Clear";
          else if (code == 2) condition = "Partly Cloudy";
          else if (code == 3) condition = "Overcast";
          else condition = "Unknown";

          document.getElementById("weatherResult").innerHTML =
            `Temperature: ${temp}°C <br>
             Wind Speed: ${wind} km/h <br>
             Weather Condition: ${condition}`;

        });

    });

};




document.getElementById("addTask").onclick = function () {

  let taskText = document.getElementById("taskInput").value;

  if (taskText === "") return;

  let li = document.createElement("li");

  li.innerHTML = `
  <span>${taskText}</span>
  <div class="task-buttons">
  <button class="complete">✔</button>
  <button class="delete">❌</button>
  </div>
  `;

  document.getElementById("taskList").appendChild(li);

  document.getElementById("taskInput").value = "";

  li.querySelector(".complete").onclick = function () {
    li.classList.toggle("done");
    saveTasks();
  };

  li.querySelector(".delete").onclick = function () {
    li.remove();
    saveTasks();
  };

  saveTasks();
};




function saveTasks() {
  localStorage.setItem("tasks", document.getElementById("taskList").innerHTML);
}

function loadTasks() {
  let tasks = localStorage.getItem("tasks");

  if (tasks) {
    document.getElementById("taskList").innerHTML = tasks;
  }
}

window.onload = loadTasks;

function clearTasks() {
  localStorage.removeItem("tasks");
  document.getElementById("taskList").innerHTML = "";
}




const searchBox = document.getElementById("searchBox");
const products = document.querySelectorAll(".product");

searchBox.addEventListener("input", function () {

  let value = searchBox.value.toLowerCase();

  products.forEach(function (product) {

    let name = product.querySelector("p").textContent.toLowerCase();

    if (name === value) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }

  });

});




document.getElementById("themeToggle").onclick = function () {
  document.body.classList.toggle("dark");
};
