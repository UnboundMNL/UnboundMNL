var listOfChanges=[];
document.addEventListener('DOMContentLoaded', function() {

    //LOAD TABLE
    var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    let datatable
    switch(isMobile){
        case true:
            datatable = loadMobileTable();
            break;
        case false:
            datatable = loadDesktopTable();
            break;
    }
    const search = document.getElementById("searchBar");
    
    search.addEventListener('keyup', function() {
        table.search(search.value).draw();
    })

	//LOAD YEAR
	const year = document.getElementById("yearInput");
	const yearButton = document.getElementById("yearButton");
	yearButton.addEventListener('click', function() {
		listOfChanges = [];
		reloadTable(year.value, datatable);
	})

	//SAVE BUTTON
	const saveButton = document.getElementById("save");
	saveButton.addEventListener('click', function() {
		save();
		window.location.reload();
	})

	//TABLE EDITING
	const table = document.querySelector("#membersTable");
	table.addEventListener("input", event => {
		const cell = event.target;
		if (cell.tagName === "TD") {
			if (!listOfChanges.includes(cell)) {
				listOfChanges.push(cell);
			}
			if (/^\d+(\.\d+)?$/.test(cell.textContent) || cell.textContent === '') {
				cell.style.backgroundColor = '';
				if (check(table)) {
					saveButton.disabled = false;
				}
			} else {
				cell.style.backgroundColor = 'pink';
				saveButton.disabled = true;
			}
		}
	});

});

function loadDesktopTable(){

    const table = new DataTable('#membersTable', {
       
        scrollX:true,
        scrollY:"50vh",
        scrollCollapse:true,
        fixedColumns: {
            left:3,
            right:0
        },
        columnDefs:[
        //stuff on top = more priority
        {
            target: 0,
            searchable: true
        },
        //place the supposed to be visible columns here
        {
            targets: '_all',
            visible: true,
            searchable: false
        },
        //hide everything else
        ],
        paging: false,
        dom: 'lrtip',
    })

    return table;
};

function loadMobileTable(){

    const table = new DataTable('#membersTable', {
       
        scrollX:true,
        scrollY:"50vh",
        scrollCollapse:true,
        columnDefs:[
        //stuff on top = more priority
        {
            target: 0,
            searchable: true
        },
        //place the supposed to be visible columns here
        {
            targets: '_all',
            visible: true,
            searchable: false
        },
        //hide everything else
        ],
        paging: false,
        dom: 'lrtip',
    })

    return table;
};

function reloadTable(value, table){
	const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept','oct','nov','dec']
	table.clear().draw();
  
	fetch(`/membersTable/${value}`).then(res => res.json()).then(data => {
	  data.memberList.forEach(member => {
		table.row.add([
		  member.name,
		  member.id,
		  member.jan.savings,
		  member.jan.match,
		  member.feb.savings,
		  member.feb.match,
		  member.mar.savings,
		  member.mar.match,
		  member.apr.savings,
		  member.apr.match,
		  member.may.savings,
		  member.may.match,
		  member.jun.savings,
		  member.jun.match,
		  member.jul.savings,
		  member.jul.match,
		  member.aug.savings,
		  member.aug.match,
		  member.sept.savings,
		  member.sept.match,
		  member.oct.savings,
		  member.oct.match,
		  member.nov.savings,
		  member.nov.match,
		  member.dec.savings,
		  member.dec.match,
		  member.totalSavings,
		  member.totalMatch,
		]).draw();
  
		//set the just added cells to be editable
		const rows = table.rows().nodes();
		const row = rows[rows.length - 1];
		const cells = row.querySelectorAll('td');
		for (let i = 2; i < cells.length; i++) {
		  const cell = cells[i];
		  cell.setAttribute('contenteditable', 'true');
		  cell.setAttribute('id', `${member.id}_${months[i-2]}_${value}_savings`);
		}
	  })
	})
};

class Change {
	constructor(id, year, content) {
		this.id = id;
		this.year = year;
		this.content = content;
	}
}

class orderedContent {
	constructor(month, content, type) {
		this.month = month;
		this.content = content;
		this.type = type;
	}
}

function check(table) {

	const alltd = table.querySelectorAll('td');

	for (const td of alltd) {
		if (td.style.backgroundColor === 'pink') {
			return false;
		}
	}
	return true;
}

function save() {
	const constructedChanges = [];
	
	for (const each of listOfChanges) {
		const split = each.id.split('_');
		const existingChange = constructedChanges.find(change => change.id === split[0] && change.year === split[2]);
		if (existingChange) {
		existingChange.content.push(new orderedContent(split[1], each.textContent, split[3]));
		} else {
		constructedChanges.push(new Change(split[0], split[2], [new orderedContent(split[1], each.textContent, split[3])]));
		}
	}
	
	for (const each of constructedChanges) {
		const data = {};
		const updateData = {};
  
		data["id"] = each.id;
		data["year"] = each.year;

		each.content.forEach(orderedContent => {
		if (orderedContent.type === "match") {
			if (!updateData[orderedContent.month]) {
			updateData[orderedContent.month] = {};
			}
			updateData[orderedContent.month].match = orderedContent.content;
		}
		if (orderedContent.type === "savings") {
			if (!updateData[orderedContent.month]) {
			updateData[orderedContent.month] = {};
			}
			updateData[orderedContent.month].savings = orderedContent.content;
		}
		});

		data["updateData"] = updateData;
  
		fetch('/newSaving', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		.then(response => {
			if (response.ok) {
				// Handle success
			} else {
				return response.json().then(data => {
				// Handle error response
				});
			}
		})
		.catch(error => {
			console.error('Error:', error);
		});
	}
}
