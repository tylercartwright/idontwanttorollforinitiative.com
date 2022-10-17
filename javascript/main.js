const reroll = document.querySelector('#reroll');
const addUnit = document.querySelector('#add-unit');
const unitName = document.querySelector('#name-entry');
const unitInitBonus = document.querySelector('#init-entry');
const unitAtkBonus = document.querySelector('#atk-entry');
const entryError = document.querySelector('.entry-error');
// const initiativeList = document.querySelector('#initiatives');
const initiativeList = document.getElementById("initiatives");
let unitList = new Array ();
let unit = new Array ();
let unitID = 1;

reroll.addEventListener('click', rerollValues);
addUnit.addEventListener('submit', addUnitSubmit);

function rerollValues() {
    const crits = document.querySelectorAll('.crit');
    crits.forEach(crit => { crit.classList.remove("crit");});

    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("initiatives");
    /* Make a loop that will continue until
    no switching has been done: */
    rows = table.rows;
    for (i = 1; i < rows.length; i++) { 
        x = rows[i].getElementsByTagName("TD")[2].innerHTML;
        // console.log(rows[i].id);
        rowNo = rows[i].id.substring(3);
        for (x = 0; x < unitList.length; x++) {
            if (rowNo == unitList[x][3]){
                randomRoll = (Math.floor(Math.random() * 20) + 1);
                newValue = Number(unitList[x][2]) + randomRoll;
                console.log(Number(unitList[x][2]), randomRoll, newValue);
                console.log(unitList[x]);
                rows[i].cells[2].innerHTML = newValue;
                if (randomRoll === 20) {
                    rows[i].cells[2].classList.add("crit");
                }
            }
        }
    }
}

function editItem(unitID) {
    const el = document.getElementById(`editbutton${unitID}`);
    const currentRow = el.closest('tr');
    const unitTable = document.getElementById("initiatives");
    const name = unitTable.rows[currentRow.rowIndex].cells[0].innerHTML;
    const initBonus = unitTable.rows[currentRow.rowIndex].cells[1].innerHTML;
    const atkBonus = unitTable.rows[currentRow.rowIndex].cells[2].innerHTML;

    unitTable.rows[currentRow.rowIndex].cells[0].innerHTML = `<input type="text" id="name-edit${unitID}" name="name-edit" value="${name}">`;
    unitTable.rows[currentRow.rowIndex].cells[1].innerHTML = `<input type="text" id="init-edit${unitID}" name="init-edit" value=${initBonus}>`;
    unitTable.rows[currentRow.rowIndex].cells[2].innerHTML = `<input type="text" id="atk-edit${unitID}" name="atk-edit" value=${atkBonus}>`;
    unitTable.rows[currentRow.rowIndex].cells[3].innerHTML = `<button type="button" id="change-confirm${unitID}" onclick="submitChanges(${unitID})"><i class="fa fa-check"></i></button>`;
}

function submitChanges(unitID) {
    const unitTable = document.getElementById("initiatives");
    const changeRow = document.getElementById(`row${unitID}`);
    const name = document.getElementById(`name-edit${unitID}`);
    const init = document.getElementById(`init-edit${unitID}`);
    const atk = document.getElementById(`atk-edit${unitID}`);
    unitTable.rows[changeRow.rowIndex].cells[0].innerHTML = name.value;
    unitTable.rows[changeRow.rowIndex].cells[1].innerHTML = init.value;
    unitTable.rows[changeRow.rowIndex].cells[2].innerHTML = atk.value; 
    unitTable.rows[changeRow.rowIndex].cells[3].innerHTML = `<button id="editbutton${unitID}" class="edit" onclick="editItem(${unitID})"><i class="fa fa-pencil"></i></button>`;
    for ( let i = 0; i < unitList.length; i++){
        if (unitID === unitList[i][3]){
            const changeRowUnit = unitList.indexOf(unitList[i])
            unitList[changeRowUnit].splice(0,3,name.value,init.value,atk.value);
        }
    }
    sortTable();
}

function deleteItem(unitID) {
    const el = document.getElementById(`delbutton${unitID}`);
    let currentRow = el.closest('tr');
    document.getElementById("initiatives").deleteRow(currentRow.rowIndex);
    unitList.splice(currentRow.rowIndex);
}

function addUnitSubmit(e) {
    e.preventDefault();
    // If bonuses are not entered, default to 0.
    if(unitInitBonus.value === ''){
        unitInitBonus.value = 0;
    }
    if(unitAtkBonus.value === ''){
        unitAtkBonus.value = 0;
    }
    // If +s are used in the first slot, just remove them.
    if(unitInitBonus.value.indexOf("+") === 0 && unitInitBonus.value.indexOf("+",1) === -1) {
        unitInitBonus.value = unitInitBonus.value.substring(1);
    }
    if(unitAtkBonus.value.indexOf("+") === 0 && unitAtkBonus.value.indexOf("+",1) === -1) {
        unitAtkBonus.value = unitAtkBonus.value.substring(1);
    }

    // Error handling
    if(unitName.value === '') // If no name is entered for the unit
    { entryError.innerHTML = 'Please enter a name for the unit.';
    setTimeout(() => entryError.innerHTML = '', 3000);}
    else if(isNaN(unitInitBonus.value)) // If the user enters something in the bonus field and it isn't a number
    { entryError.innerHTML = 'Please enter a number for the initiative bonus.';
    setTimeout(() => entryError.innerHTML = '', 3000); }
    else if(isNaN(unitAtkBonus.value)) // If the user enters something in the bonus field and it isn't a number
    { entryError.innerHTML = 'Please enter a number for the attack bonus.';
    setTimeout(() => entryError.innerHTML = '', 3000);}
    // If no errors are found . . .
    else {
        let editButtonID = `editbutton${unitID}`;
        let delButtonID = `delbutton${unitID}`;
        let listID = `list${unitID}`;
        let editButton = document.createElement("button");
        let deleteButton = document.createElement("button");
        editButton.setAttribute("class", "edit");
        editButton.setAttribute("id", editButtonID);
        editButton.setAttribute("onClick", `editItem(${unitID})`);
        var pencil = editButton.appendChild(document.createElement('i'));
        pencil.className = "fa fa-pencil";
        deleteButton.setAttribute("class", "delete");
        deleteButton.setAttribute("id", delButtonID);
        deleteButton.setAttribute("onClick", `deleteItem(${unitID})`);
        var delB = deleteButton.appendChild(document.createElement('i'));
        delB.className = "fa fa-remove";
        const atkRoll = Math.floor(Math.random() * 20) + 1;
        // console.log(atkRoll);
        unit = [unitName.value, Number(unitInitBonus.value), Number(unitAtkBonus.value), unitID];
        init = [unitName.value, Math.floor(Math.random() * 20) + 1 + unit[1], atkRoll + unit[2]];
        unitList.push(unit);
        const initiative = document.createElement('li');
        initiative.setAttribute("id", listID);
        initiative.appendChild(document.createTextNode(`${unitName.value} : ${init[1]} : ${init[2]}`));
        let row = initiativeList.insertRow(-1);
        row.id = `row${unitID}`;
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        cell1.innerHTML = init[0];
        cell2.innerHTML = init[1];
        cell2.className = 'init-roll';
        cell3.innerHTML = init[2];
        if (atkRoll === 20){
            cell3.classList.add("crit"); // Rolling a 20 is always a critical hit. The bonus is irrelevant, so these should be flagged with unique styling.
        }
        cell4.appendChild(editButton);
        cell5.appendChild(deleteButton);
        unitID++;
        unitName.value = '';
        unitInitBonus.value = '';
        unitAtkBonus.value = '';
        sortTable();
    }
}

function sortTable(colnum = 1) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("initiatives");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[1].innerHTML;
        y = rows[i + 1].getElementsByTagName("TD")[1].innerHTML;
        // Check if the two rows should switch place:
        //if (x.toLowerCase() > y.toLowerCase()) {
        if (Number(x) < Number(y)) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
}