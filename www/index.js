const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

(function main() {
  // generate forecasts and cards for each item
  for (let itemID in itemMap) {
    let item = itemMap[itemID];
    // generate card
    let newCard = getNewCard(item.id, item.title, item.value);
    cardContainer.appendChild(newCard);
  }

  generateForecastTable();

  // show monthly Interest from forecast table
  monthlyInterest.innerText = parseFloat(forecastTableBody.querySelector(
    "tr:first-child>td:last-child"
  ).innerText).toLocaleString('en');

  if (monthlyInterest.innerText == "") {
    monthlyInterest.innerText = "0.00";
  }

  // show total assets from forecast table
  totalAssets.innerText = parseFloat(forecastTableBody.querySelector(
    "tr:first-child>td:nth-child(2)"
  ).innerText).toLocaleString('en');
})();

function getNewCard(id, title, value) {
  let card = document.createElement("div");
  card.className = "card clickable";

  let cardTitle = document.createElement("div");
  cardTitle.className = "card-title";
  cardTitle.innerText = title;
  card.appendChild(cardTitle);

  let cardValue = document.createElement("div");
  cardValue.className = "card-asset-value";
  cardValue.innerText = value;
  card.appendChild(cardValue);

  card.onclick = function () {
    window.location.href = "forecast.html?itemID=" + id;
  };
  return card;
}

function generateForecastTable() {
  let date = new Date();
  // iterate through months
  while (date <= forecastEndDate) {
    let monthlyAllItemAssetTotal = 0;
    let monthlyAllItemInterestTotal = 0;
    let lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // iterate each item
    for (let itemID in itemMap) {
      // iterate each day entry of item
      itemMap[itemID].forecast.forEach((entry) => {
        // accumulate interest for current month entries
        let entryDate = new Date(entry[0]);
        if (
          entryDate.getFullYear() == date.getFullYear() &&
          entryDate.getMonth() == date.getMonth()
        ) {
          monthlyAllItemInterestTotal += entry[2];

          // get balance on the month's last day
          if (entryDate.toDateString() == lastDate.toDateString()) {
            monthlyAllItemAssetTotal += entry[1];
            return;
          }
        }
      });
    }

    // add table entry
    let tr = document.createElement("tr");

    let td = document.createElement("td");
    td.innerText = `${date.getFullYear()} ${monthNames[date.getMonth()]}`;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerText = formatValue(monthlyAllItemAssetTotal)
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerText = monthlyAllItemInterestTotal
      ? formatValue(monthlyAllItemInterestTotal)
      : "";
    tr.appendChild(td);

    // draw a seperator on january
    if (date.getMonth() == 0) {
      tr.classList.add("january");
    }

    forecastTableBody.appendChild(tr);
    // increment term
    date.setDate(lastDate.getDate() + 1);
  }

  function formatValue(value){
    
    // has two decimal points
    let match = `${value}`.match(/[0-9]+\.[0-9]{2}/)
    if(match){
      return match[0].toLocaleString('en')
    }
    // has one decimal points
    else if(`${value}`.match(/[0-9]+\.[0-9]{1}/)){
      return `${match[0]}0`
    }
    // has no decimal point
    else{
      return `${value}.00`
    }
  }

}
