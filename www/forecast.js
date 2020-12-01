// check for edit mode with id URL parameter
let itemID = window.location.href.match(/itemID=[0-9]+/);
itemID = itemID[0].split("=").pop();
let entrySignature; // asset value + interst

window.onload = () => {
  headerTitle.innerText = itemMap[itemID].title;
  let today = new Date();

  // iterate each day entry of item
  itemMap[itemID].forecast.forEach((entry, index) => {
    // hide similar entries with the same signatures execpt the last entry
    if (
      entrySignature == `${entry[1]}${entry[2] ? entry[2] : ""}` &&
      index != itemMap[itemID].forecast.length - 1
    ) {
      return;
    }

    // add table entry
    let tr = document.createElement("tr");

    let td = document.createElement("td");
    td.innerText = entry[0].substr(3);
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerText = formatValue(entry[1]);
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerText = entry[2] ? formatValue(entry[2]) : "";
    tr.appendChild(td);

    // highlight current month
    let entryDate = new Date(entry[0]);
    if (
      entryDate.getMonth() == today.getMonth() &&
      entryDate.getFullYear() == today.getFullYear()
    ) {
      tr.classList.add("highlight");
    }

    forecastTableBody.appendChild(tr);
    entrySignature = `${entry[1]}${entry[2] ? entry[2] : ""}`;
  });
};

function formatValue(value) {
  // has two decimal points
  let match = `${value}`.match(/[0-9]+\.[0-9]{2}/);
  if (match) {
    return match[0].toLocaleString("en");
  }
  // has one decimal points
  else if (`${value}`.match(/[0-9]+\.[0-9]{1}/)) {
    return `${match[0]}0`;
  }
  // has no decimal point
  else {
    return `${value}.00`;
  }
}

function onEditButtonClicked() {
  location.href = "manage.html?itemID=" + itemID;
}
