const globalCases_url = "https://covid19.mathdro.id/api";

const fetchData = async () => {
  let response = await fetch(globalCases_url);
  if (response.ok) {
    const data = await response.json();
    // console.log(data)
    const globalData = {
      confirmed: data.confirmed.value / 1000000,
      recovered: data.recovered.value / 1000000,
      deaths: data.deaths.value / 1000000,
      lastUpdate: new Date(data.lastUpdate).toDateString(),
    };
    // console.log(globalData)

    document.getElementById(
      "confirmed"
    ).textContent = globalData.confirmed.toFixed(2);
    document.getElementById(
      "recovered"
    ).textContent = globalData.recovered.toFixed(2);
    document.getElementById("deaths").textContent = globalData.deaths.toFixed(
      2
    );
    document.getElementById("lastUpdate").textContent = globalData.lastUpdate;

    var ctx = document.getElementById("myGlobalPieChart").getContext("2d");
    var chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Confirmed", "Deaths"],
        datasets: [
          {
            backgroundColor: ["#3e95cdb0", "#8d5ea29e"],
            borderColor: ["#3e95cd", "#8e5ea2"],
            data: [globalData.confirmed, globalData.deaths],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "COVID-19 Global Cases",
        },
      },
    });
    return data;
  }
};

fetchData();

const fetchDailyGlobalData = async () => {
  let response = await fetch(`${globalCases_url}/daily`);
  if (response.ok) {
    const countryData = await response.json();

    const modifiedData = countryData.map((dailyData) => ({
      confirmed: dailyData.confirmed.total,
      deaths: dailyData.deaths.total,
      date: dailyData.reportDate,
    }));
    // console.log(modifiedData.map((data) => data.deaths));

    // Create Chart with cases by dates
    var ctx = document.getElementById("myChart").getContext("2d");
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "bar",

      // The data for our dataset
      data: {
        labels: modifiedData.map(({ date }) => date),
        datasets: [
          {
            label: "Global Confirmed Cases",
            backgroundColor: "#73bcf1",
            borderColor: "#2ca5fd",
            fill: false,
            data: modifiedData.map((data) => data.confirmed),
          },
          {
            label: "Global Death Cases",

            backgroundColor: "rgba(255, 0, 0, 0.5)",
            borderColor: "rgb(255, 99, 132)",
            data: modifiedData.map((data) => data.deaths),
          },
        ],
      },

      // Configuration options go here
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return value / 1000000 + " Million";
                },
              },
            },
          ],
        },
      },
    });
  }
};

fetchDailyGlobalData();

const fetchData_Country = async () => {
  var country = document.getElementById("inputCountry").value;
  let response = await fetch(`${globalCases_url}/countries/${country}`);
  const getFlag = await fetch(
    "https://restcountries.eu/rest/v2/name/" + country
  );
  // console.log(response);
  if (response.ok && getFlag.ok) {
    const countryData = await response.json();
    const flagObject = await getFlag.json();
    let flag_url = flagObject.map((item) => item.flag);
    flag_url = flag_url[0];
    // console.log(flag_url)

    var span = document.createElement("span");
    var img = document.createElement("img");
    img.className = "country-flag";

    img.setAttribute("src", flag_url);
    span.appendChild(img);

    document.getElementById("countryFlag").innerHTML = "";
    document.getElementById("countryFlag").appendChild(span);

    const countryData_Parsed = {
      confirmed: countryData.confirmed.value / 1000000,
      recovered: countryData.recovered.value / 1000000,
      deaths: countryData.deaths.value / 1000000,
      lastUpdate: new Date(countryData.lastUpdate).toDateString(),
    };
    // console.log(countryData_Parsed);
    document.getElementById(
      "country_confirmed"
    ).textContent = countryData_Parsed.confirmed.toFixed(2);
    document.getElementById(
      "country_recovered"
    ).textContent = countryData_Parsed.recovered.toFixed(2);
    document.getElementById(
      "country_deaths"
    ).textContent = countryData_Parsed.deaths.toFixed(2);
    document.getElementById("country_lastUpdate").textContent =
      countryData_Parsed.lastUpdate;

    var ctx = document.getElementById("myBarChart").getContext("2d");
    var chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["positive", "Recovered", "Deaths"],
        datasets: [
          {
            backgroundColor: ["#ffc16aad", "#26eb9c85", "#ff123582"],
            borderColor: ["#ffa412", "#26eb9c", "#ff1235"],
            borderWidth: 3,
            borderSkipped: "bottom",
            fill: false,
            data: [
              countryData_Parsed.confirmed,
              countryData_Parsed.recovered,
              countryData_Parsed.deaths,
            ],
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Total Cases in the U.S.",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return value + " M";
                },
              },
            },
          ],
        },
      },
    });

    return countryData_Parsed;
  } else {
    alert("Country not found!");
  }
};

const fetchUSData = async () => {
  let response = await fetch("https://covidtracking.com/api/us");
  if (response.ok) {
    const USData = await response.json();

    const modifiedData = USData.map((dailyData) => ({
      positive: dailyData.positive / 1000000,
      recovered: dailyData.recovered / 1000000,
      death: dailyData.death / 1000000,
      lastUpdate: new Date(dailyData.dateChecked).toDateString(),
    }));

    document.getElementById(
      "USconfirmed"
    ).textContent = modifiedData[0].positive.toFixed(2);
    document.getElementById(
      "USrecovered"
    ).textContent = modifiedData[0].recovered.toFixed(2);
    document.getElementById(
      "USdeaths"
    ).textContent = modifiedData[0].death.toFixed(2);
    document.getElementById("USlastUpdate").textContent =
      modifiedData[0].lastUpdate;

    var ctx = document.getElementById("myBarChart").getContext("2d");
    var chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["positive", "Recovered", "Deaths"],
        datasets: [
          {
            backgroundColor: ["#ffc16aad", "#26eb9c85", "#ff123582"],
            borderColor: ["#ffa412", "#26eb9c", "#ff1235"],
            borderWidth: 3,
            borderSkipped: "bottom",
            fill: false,
            data: [
              modifiedData[0].positive,
              modifiedData[0].recovered,
              modifiedData[0].death,
            ],
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Total Cases in the U.S.",
        },
        scales: {
          yAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return value + " M";
                },
              },
            },
          ],
        },
      },
    });

    return modifiedData;
  }
};

fetchUSData();

const fetchUSStates = async () => {
  let response = await fetch(
    "https://corona.lmao.ninja/v2/states?sort&yesterday"
  );
  if (response.ok) {
    const USData = await response.json();

    var $table = $("#table");

    $(function () {
      $("#table").bootstrapTable({
        data: USData,
      });
    });
  }
};

fetchUSStates();

require(["esri/Map", "esri/views/MapView", "esri/Graphic"], function (
  Map,
  MapView,
  Graphic
) {
  var map = new Map({
    basemap: "gray-vector",
  });

  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-6.463774, 30.415958],
    zoom: 1,
  });

  const mapCountry = async () => {
    let response = await fetch(
      "https://corona.lmao.ninja/v2/countries?yesterday&sort"
    );
    if (response.ok) {
      const countriesData = await response.json();

      const coutriesInfo = {
        recovered: countriesData.map((item) => item.recovered),
        confirmed: countriesData.map((item) => item.active),
        deaths: countriesData.map((item) => item.deaths),
        countryRegion: countriesData.map((item) => item.country),
        coords: countriesData.map((item) => item.countryInfo),
      };

      const coordinates = {
        long: coutriesInfo.coords.map((coord) => coord.lat),
        lat: coutriesInfo.coords.map((coord) => coord.long),
      };

      for (var i = 0; i < coordinates.lat.length; i++) {
        var point = {
          type: "point", // autocasts as new Point()
          longitude: coordinates.lat[i],
          latitude: coordinates.long[i],
        };

        var markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: "#ff9799",
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: "#ff1235",
            width: 2,
          },
        };
        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
          popupTemplate: {
            title: "COVID-19 Map View",
            content: [
              {
                type: "text",
                text: `There are ${coutriesInfo.confirmed[i]} cases in ${coutriesInfo.countryRegion[i]} with 
                       ${coutriesInfo.recovered[i]} recovered cases and ${coutriesInfo.deaths[i]} cases.`,
              },
            ],
          },
        });
        view.graphics.addMany([pointGraphic]);
      }
    }
  };

  mapCountry();
});
