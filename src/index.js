import "./styles.css";
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

const input = document.getElementById("input-area");
const form = document.getElementById("input-form");
let names;
let codes;

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const area = input.value.toLowerCase();
  console.log(area);
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
  console.log(data);
  console.log(data.value);
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

  const chart = new Chart("#chart", {
    title: "Population",
    data: data,
    height: 450,
    type: "line",
    colors: ["#eb5146"],
  });
};

buildChart();
getAreas();
