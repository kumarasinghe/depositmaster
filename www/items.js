let itemMap = {};
const FORECAST_YEARS = 5;
const forecastEndDate = new Date();
forecastEndDate.setFullYear(forecastEndDate.getFullYear() + FORECAST_YEARS);

if (localStorage["itemMap"]) {
  itemMap = JSON.parse(localStorage["itemMap"]);
  for (let itemID in itemMap) {
    let item = itemMap[itemID];
    // parse date objetcs
    item.startDate = new Date(item.startDate);
    if (item.endDate) {
      item.endDate = new Date(item.endDate);
    }

    generateItemForecast(item);
  }
}

function upsertItem(item) {
  itemMap[item.id] = item;
  saveItemMap();
}

function removeItem(itemID) {
  delete itemMap[itemID];
  saveItemMap();
}

function saveItemMap() {
  // strip forecasts
  for (let itemID in itemMap) {
    let item = itemMap[itemID];
    item.forecast = [];
  }
  localStorage["itemMap"] = JSON.stringify(itemMap);
}

function generateItemForecast(item) {
  // generate empty term map
  let date = new Date(item.startDate);

  while (
    date <= forecastEndDate &&
    (item.endDate ? date <= item.endDate : true)
  ) {
    let term = date.toDateString();
    item.forecast.push([term, 0, undefined]); // [month, value, interest for value]
    date.setDate(date.getDate() + 1);
  }

  // fill value recurring points in term map
  if (item.recurring) {
    let date = new Date(item.startDate);
    while (
      date <= forecastEndDate &&
      (item.endDate ? date <= item.endDate : true)
    ) {
      let termMonth = date.toDateString();
      item.forecast.forEach((entry) => {
        if (entry[0] == termMonth) {
          entry[1] = item.value;
          return;
        }
      });
      // go to next recurring date
      date.setDate(date.getDate() + item.recurring);
    }
  } else {
    item.forecast[0][1] = item.value;
  }

  // fill interest recurring points in term map
  if (item.interest) {
    // jump to first interest occurance
    let date = new Date(item.startDate);
    date.setDate(date.getDate() + item.interest.frequency - 1);
    while (
      date <= forecastEndDate &&
      (item.endDate ? date <= item.endDate : true) // account end date
    ) {
      let termMonth = date.toDateString();
      item.forecast.forEach((entry) => {
        if (entry[0] == termMonth) {
          entry[2] = "*"; // mark interest occuring point
          return;
        }
      });
      // go to next interest occurance
      date.setDate(date.getDate() + item.interest.frequency);
    }
  }

  // accumulate asset values
  let accumulatingAssetValue = 0;
  item.forecast.forEach((entry) => {
    entry[1] += accumulatingAssetValue;

    if (item.interest) {
      // set interest
      let interest;
      // interest occuring point
      if (entry[2] != undefined) {
        interest = entry[2] = (entry[1] * (item.interest.rate / 100)) / 12;
      } else {
        interest = entry[2] = 0;
      }
      accumulatingAssetValue =
        entry[1] + (item.interest.compound ? interest : 0);
    } else {
      accumulatingAssetValue = entry[1];
    }

    // account item expiry
    if (item.endDate && entry[0] == item.endDate.toISOString().substr(0, 10)) {
      accumulatingAssetValue = 0;
    }
  });
}
