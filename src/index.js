import "./styles.css";
import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";

const input = document.getElementById("input-area");
const form = document.getElementById("submit-data");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const area = input.value;
  console.log(area);
});

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
    data: data,
    height: 450,
    type: "line",
    colors: ["#eb5146"],
  });
};

buildChart();
