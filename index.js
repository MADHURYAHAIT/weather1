const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("main.html", "utf-8");
//var place = 'majitar';

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%pressure%}", orgVal.main.pressure);
    temperature = temperature.replace("{%humidity%}", orgVal.main.humidity);
    temperature = temperature.replace("{%windspeed%}", orgVal.wind.speed);
    temperature = temperature.replace("{%tempfeelslike%}", orgVal.main.feels_like);


    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    return temperature;

}

const server = http.createServer((req, res) => {
    if (req.url = "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=majitar&units=metric&appid=5ff68fcc483ffa960d4ee98fb6f375a5")
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData
                    .map((val) => replaceVal(homeFile, val))
                    .join("");
                res.write(realTimeData);
                //console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });

    }
});
server.listen(8000, "127.0.0.1");