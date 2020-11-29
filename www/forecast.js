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
      entry[1] + (entry[2] ? entry[2] : "") == entrySignature &&
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
    td.innerText = entry[1].toFixed(2);
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerText = entry[2] ? entry[2].toFixed(2) : "";
    tr.appendChild(td);

    // highlight current month
    let entryDate = new Date(entry[0]);
    if (
      entryDate.getMonth() == today.getMonth() &&
      entryDate.getFullYear() == today.getFullYear()
    ) {
      tr.classList.add("highlight");
    }

    // draw a seperator on january
    if(entryDate.getMonth() == 0){
      tr.classList.add("january");
    }

    forecastTableBody.appendChild(tr);
    entrySignature = entry[1] + (entry[2] ? entry[2] : "");
  });
};

function onEditButtonClicked() {
  location.href = "manage.html?itemID=" + itemID;
}
