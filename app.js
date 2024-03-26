const express = require("express");
const https = require("https");
const app = express();

app.use(express.static("public"));
// app.get("/", function (req, res) {
//   https.get(
//     "https://api.openweathermap.org/data/2.5/weather?q=Lahore$appid=e72ca729af228beabd5d20e3b7749713$units=metric",
//     function (response) {
//       console.log(response);
//       response.on("data", () => {
//         const weatherData = JSON.parse(data);
//         let temp = weatherData.main.temp;
//         res.send(`Temperature in Lahore is: ${temp} degrees celcuis`);
//       });
//     }
//   );
//   res.send("Server is up and running");
// });
app.use(express.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.post("/", function (req, res) {
  // myID: 14d08b36da0aa3614e7a2be0b34c9c94
  const appid = req.body.ID;
  const city = req.body.city;
  const unit = req.body.unit;
  https.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appid}&units=${unit}`,
    (response) => {
      response.on("data", async (data) => {
        const weatherData = await JSON.parse(data);
        const weatherDescription = weatherData.weather[0].description;
        const weatherTemp = weatherData.main.temp;
        const weatherIcon = weatherData.weather[0].icon;
        const weatherImg =
          `https://openweathermap.org/img/wn/` + weatherIcon + `@2x.png`;
        res.write(
          `<h1>Temperature in ${city} is ${weatherTemp} and weather is ${weatherDescription}.</h1>`
        );
        res.write(`<img src='${weatherImg}'/>`);
        res.send();
      });
    }
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
