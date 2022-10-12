import "./styles.css";
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

const input = document.getElementById("input-area");
const form = document.getElementById("input-form");
const add = document.getElementById("add-data");
let names;
let codes;
let chart;
let chart2;

const jsonQuery = {
  query: [
    {
      code: "Vuosi",
      selection: {
        filter: "item",
        values: [
          "2000",
          "2001",
          "2002",
          "2003",
          "2004",
          "2005",
          "2006",
          "2007",
          "2008",
          "2009",
          "2010",
          "2011",
          "2012",
          "2013",
          "2014",
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2020",
          "2021",
        ],
      },
    },
    {
      code: "Alue",
      selection: {
        filter: "item",
        values: ["SSS"],
      },
    },
    {
      code: "Tiedot",
      selection: {
        filter: "item",
        values: ["vaesto"],
      },
    },
  ],
  response: {
    format: "json-stat2",
  },
};

const getAreas = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url);
  const data = await res.json();
  //console.log(data);
  names = data.variables[1].valueTexts;
  codes = data.variables[1].values;
};

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const area = input.value.toLowerCase();
    //console.log(area);
    let areaIndex;
    names.forEach((value, index) => {
      if (value.toLowerCase() == area) {
        areaIndex = index;
      }
    });
    const code = codes[areaIndex];
    if (code) {
      jsonQuery.query[1].selection.values[0] = code;
      buildChart();
    }
  });
}

if (add) {
  add.addEventListener("click", async () => {
    const fetchedData = await getData();
    const data = fetchedData.value;
    const length = data.length - 1;
    let deltas = [];
    data.forEach((value, index) => {
      if (index < length) {
        deltas.push(data[index + 1] - data[index]);
        //console.log(value, index);
      }
    });
    let sum = 0;
    deltas.forEach((item) => {
      sum += item;
    });
    const mean = sum / length;
    //console.log(deltas);
    //console.log(sum, length, mean);
    const newPoint = mean + data[length];
    let newData = [];
    newData.push(newPoint);
    data.push(newPoint);
    //console.log(data);
    chart.addDataPoint("2022", newData);
  });
}

const getData = async () => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(jsonQuery),
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();
  //console.log(data);
  //console.log(data.value);
  return data;
};

const buildChart = async () => {
  const fetchedData = await getData();

  const data = {
    labels: jsonQuery.query[0].selection.values,
    datasets: [
      {
        name: "Population",
        values: fetchedData.value,
      },
    ],
  };

  chart = new Chart("#chart", {
    title: "Population",
    data: data,
    height: 450,
    type: "line",
    colors: ["#eb5146"],
  });
};

const buildChart2 = async () => {
  jsonQuery.query[2].selection.values = ["vm01", "vm11"];
  const fetchedData = await getData();
  const values = fetchedData.value;
  const length = values.length / 2;
  let births = [];
  let deaths = [];
  for (let i = 0; i < length; i++) {
    births.push(values[i * 2]);
    deaths.push(values[i * 2 + 1]);
  }
  console.log(births, deaths);
  const data = {
    labels: jsonQuery.query[0].selection.values,
    datasets: [
      {
        name: "Births",
        values: births,
      },
      {
        name: "Deaths",
        values: deaths,
      },
    ],
  };

  chart2 = new Chart("#chart2", {
    title: "Population",
    data: data,
    height: 450,
    type: "bar",
    colors: ["#63d0ff", "#363636"],
  });
};

if (document.getElementById("chart")) {
  buildChart();
}
if (document.getElementById("chart2")) {
  buildChart2();
}
getAreas();
