// check for edit mode with id URL parameter
let itemID = window.location.href.match(/itemID=[0-9]+/);
if (itemID) {
  itemID = itemID[0].split("=").pop();
  headerTitle.innerText = "Edit";
  removeButton.style.display = "block";
}

// if we are on edit mode => find and load item
if (itemID) {
  let item = itemMap[itemID];

  inputTitle.value = item.title;
  inputValue.value = item.value;
  startDate.valueAsDate = new Date(item.startDate);

  if (item.endDate) {
    endDate.valueAsDate = new Date(item.endDate);
  }

  if (item.recurring) {
    recurringCheckbox.checked = true;
    recurringFrequencySelect.value = item.recurring;
  }

  if (item.interest) {
    interestCheckbox.checked = true;
    inputRate.value = item.interest.rate;
    interestFrequency.value = item.interest.frequency;
    compundInterestCheckbox.checked = item.interest.compound;
  }
}

function onSaveClicked() {
  let item = {};
  item.id = itemID || Date.now();
  item.title = inputTitle.value ? inputTitle.value : "Unnamed Asset";
  item.value = inputValue.value ? parseFloat(inputValue.value) : 0;
  item.startDate = startDate.value ? new Date(startDate.value) : new Date();
  item.endDate = endDate.value ? new Date(endDate.value) : undefined;
  item.forecast = [];

  if(item.endDate && item.endDate < item.startDate){
    alert('Please correct ending date!')
    return
  }

  if (recurringCheckbox.checked) {
    item.recurring = parseInt(
      recurringFrequencySelect.options[
        parseInt(recurringFrequencySelect.selectedIndex)
      ].value
    );
  }

  if (interestCheckbox.checked && inputRate.value != "") {
    item.interest = {
      frequency: parseInt(interestFrequency.value),
      rate: parseFloat(inputRate.value),
      compound: compundInterestCheckbox.checked,
    };
  }

  upsertItem(item);

  window.history.back();
}

function onRemoveClicked() {
  if (confirm("Do you want to remove this item?")) {
    removeItem(itemID);
    window.location.href = "index.html";
  }
}

function onCancelButtonClicked() {
  if (confirm("Do you want to cancel editing?")) {
    window.history.back();
  }
}
