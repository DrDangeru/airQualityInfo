import "./App.css";
import React, { useEffect, useState } from "react";
import CitySearch from "./citySearh";
import { sqlite3 } from "sqlite3";

function App() {
  const [error, setError] = useState("");
  const [airQualityData, setAirQualityData] = useState({});
  const [names, setNames] = useState([]);
  const [urls, setUrls] = useState([]);
  const [particulatesData, setParticulatesData] = useState([])
  const [domPol, setDomPol] = useState('')

  const sqlite = require(sqlite3).verbose();
  let sql;
  const db = new sqlite.Database('./aq.db', sqlite.OPEN_READWRITE,
    (err) => { if (err) console.error(error, 'sqlite Error!') })

  const GetAirQuality = async (city) => {

    //   useEffect(() => {
    //   // Assuming you want to fetch data when the component mounts
    //   GetAirQuality("Sofia");
    // }, []);
    try {
      const response = await fetch(
        `http://api.waqi.info/feed/${city}/?token=${process.env.REACT_APP_token}`
      );

      response.json()
        .then(data => {
          if (response.ok && data.status === "ok") {
            setAirQualityData(data.data);
            setError(null);

            const particulatesData = Object.keys(data.data.iaqi).map((key) =>
              ({
                name: key,
                value: data.data.iaqi[key].v
              }));
            setParticulatesData(particulatesData);
            const dompol = data.data.dominentpol;
            console.log(dompol, 'this is dompol')
            setDomPol(dompol);
            const mappedDataUrl = data.data.attributions.map((item) => ({
              name: item.name,
              url: item.url,
            }));
            console.log('part after set and map', particulatesData)
            setNames(mappedDataUrl.map((item) => item.name));
            setUrls(mappedDataUrl.map((item) => item.url));
          } else {
            setError("Please retry as an Error occurred");
            setAirQualityData({});
          }

        })
        .catch(error => {
          const msg = JSON.stringify.data;
          console.log("Error parsing JSON data", msg);
          setError("Sorry, but there was an error parsing the data. Try again!");
        });
    } catch (error) {
      console.log("network error", error);
      setError("Sorry, but there was a network error. Try again!");
    }
    console.log("Air Quality Data:", airQualityData);
  };



  function advisoryColor(aqi) {
    switch (true) {
      case aqi < 50:
        return "green";
      case aqi < 250:
        return "yellow";
      case aqi >= 250:
        return "red";
      default:
        return "grey";
    }
  }

  // CREATE Table if user 
  // sql = `CREATE TABLE users(ID INTEGER PRIMARY KEY, username, last_name,
  //   first_name, email, data_date, data)`
  // db.run(sql)

  const getBackgroundColorClass = () => {
    const color = advisoryColor(airQualityData.aqi);
    return `bg-${color}`;
  };

  return (

    <div className="leading-6 bg-[url('/public/gonzalo-facello-TLb0Sax_oZI-unsplash.jpg')]">
      <h1 className="text-blue-500 text-5xl font-italic p-8 pl-32 text-center align-items-center ">
        Air Quality Index Checker</h1>

      <CitySearch GetAirQuality={GetAirQuality} />
      <div
        direction="horizontal"
        className="max-w-90 rounded-lg border"
      >
        <div defaultSize={100} collapsible="false">
          <div className="flex flex-col items-end justify-center p-4 gap-7  ">
            <span className="text-4xl min-w-full font-semibold text-gray-700 pt-8 pl-6 bg-gradient-to-r from-blue-100 to-green-300 rounded-xl
            text-decoration-line : underline ">
              Rating for {airQualityData.city
                && airQualityData.city.name}

              <div className="text-end align-items-center font-semibold text-4xl pt-8 pl-6 text-decoration-line: underline">
                Pollution PPM  {airQualityData.aqi}
              </div>
            </span>
            <div className="text-center text-4xl content-center pt-8 pl-6 text-red-600 
            text-decoration-line: overline ">Particulates</div>
            <ul>
              {particulatesData.map(({ name, value }, index) => (
                <li key={index} className="text-orange-200/75
                text-decoration-line: underline">
                  {name}: {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div />
        <div defaultSize={25}>
          <div direction="vertical">
            <div defaultSize={25} className={getBackgroundColorClass()}>
              <div className="flex h-full items-center justify-center p-2 rounded-xl">
                <span className="text-center p-2  font-bold {getBackgroundColorClass()} text-decoration-line: underline " >    Advisory <br />
                  <span className="font-light animate-pulse"> GREEN
                    means Pollution is minimal </span><br />
                  <span className="font-light animate-pulse"> YELLOW
                    Pollution is moderately high </span><br />
                  <span className="font-light animate-pulse"> RED
                    Pollution is HIGH!!!  </span>
                </span>
              </div>
            </div>
            <div />
            <div defaultSize={25}>
              <div className=" text-center content-center font-semibold text-2xl pt-20 pl-6 text-blue-600 
            text-decoration-line: overline bg-gradient-to-r from-blue-100 to-green-300 rounded-xl ">Dominant Polutant {domPol}</div>

            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="">
          !!!  ERROR ERROR ERROR !!!{error}</div>
      )}
      {/* <footer>Data courtesy of {names.join(", ")}</footer> */}
      <footer className="text-xl">
        Data courtesy of {names.map((name, index) => (
        <span key={index}>
          <a href={urls[index]} target="_blank" rel="noopener noreferrer">
            {name}
          </a>
          {index < names.length - 1 && ", "}
        </span>
      ))}
      </footer>
      <footer className="text-xl">Photo by <a href="https://unsplash.com/@gonchifacello?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Gonzalo Facello</a> on <a href="https://unsplash.com/photos/a-building-with-a-green-door-and-window-TLb0Sax_oZI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      </footer>
    </div>
  );
}

export default App;
