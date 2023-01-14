const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

function convertKelvinToCelsius(degrees) {
  return Math.floor(degrees - 273.15);
}

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace(
    "{%tempval%}",
    convertKelvinToCelsius(orgVal.main.temp)
  );
  temperature = temperature.replace(
    "{%tempmin%}",
    convertKelvinToCelsius(orgVal.main.temp_min)
  );
  temperature = temperature.replace(
    "{%tempmax%}",
    convertKelvinToCelsius(orgVal.main.temp_max)
  );
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Chandigarh&appid=ca55c92d81f31ec0dfd49f685a997946"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(3000, "127.0.0.1");
