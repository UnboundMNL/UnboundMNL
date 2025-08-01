let LISTOFCHANGES = [];
let DATATABLE;
let YEAR;
document.addEventListener('DOMContentLoaded', function () {
	//LOAD TABLE
	const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
	switch (isMobile) {
		case true:
			DATATABLE = loadMobileTable();
			break;
		case false:
			DATATABLE = loadDesktopTable();
			break;
	}
	const search = document.getElementById("searchBar");
	search.addEventListener('keyup', function () {
		DATATABLE.search(search.value).draw();
	})
	//LOAD YEAR
	YEAR = document.getElementById("yearInput");
	const yearButton = document.getElementById("yearButton");
	yearButton.addEventListener('click', function () {
		LISTOFCHANGES = [];
		reloadTable(YEAR.value, DATATABLE);
	})
	YEAR.addEventListener('keydown', function (event) {
		if (event.key === 'Enter') {
			LISTOFCHANGES = [];
			reloadTable(YEAR.value, DATATABLE);
		}
	});
	//SAVE BUTTON
	const saveButton = document.getElementById("save");
	//TABLE EDITING
	const table = document.querySelector("#membersTable");
	table.addEventListener("input", event => {
		const cell = event.target;
		if (cell.tagName === "TD") {
			if (!LISTOFCHANGES.includes(cell)) {
				LISTOFCHANGES.push(cell);
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

	//Unsaved changes warning
	window.addEventListener('beforeunload', function (e) {
		if (LISTOFCHANGES.length > 0) {
			e.preventDefault();
			e.returnValue = '';
		}
	});

});

function loadDesktopTable() {
	const table = new DataTable('#membersTable', {
		scrollX: true,
		scrollY: "50vh",
		scrollCollapse: true,
		fixedColumns: {
			left: 2,
			right: 0
		},
		columnDefs: [
			//stuff on top = more priority
			{
				targets: [0,1 ],
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
	});
	return table;
};

function loadMobileTable() {
	const table = new DataTable('#membersTable', {
		scrollX: true,
		scrollY: "50vh",
		scrollCollapse: true,
		columnDefs: [
			//stuff on top = more priority
			{
				targets: [0, 1],
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
	});
	return table;
};

// reloads the table with the specific year
function reloadTable(value, table) {
	showLoading();
	YEAR.value = value;
	const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
	table.clear().draw();
	fetch(`/membersTable/${value}`)
		.then((res) => res.json())
		.then((data) => {
			let j = 0;
			data.memberList.forEach((member) => {
				let grantTotal = parseFloat(member.totalSaving || 0) + parseFloat(member.totalMatch || 0);
				let balance = grantTotal - parseFloat(member.totalDeductions || 0);
				const rowData = [
					member.name,
					member.orgId,
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
					member.sep.savings,
					member.sep.match,
					member.oct.savings,
					member.oct.match,
					member.nov.savings,
					member.nov.match,
					member.dec.savings,
					member.dec.match,
					member.totalSaving,
					member.totalMatch,
					grantTotal,
					member.totalDeductions,
					balance,
				];
				// Add a new row to the table
				const row = table.row.add(rowData).draw();
				// Make the cells of the newly added row editable and set attributes
				const cells = row.node().querySelectorAll('td');
				let className;
				for (let i = 0; i < 2; i++) {
					let cell = cells[i];
					className = "memberPage" + j;
					cell.setAttribute('class', `memberPage ${className}`);
				}
				j++;

				for (let i = 2; i < cells.length - 5; i += 2) {
					let cell = cells[i];
					cell.setAttribute('contenteditable', 'true');
					cell.setAttribute('id', `${member.id}_${months[i / 2 - 1]}_${value}_savings`);
					cell = cells[i + 1];
					cell.setAttribute('contenteditable', 'true');
					cell.setAttribute('id', `${member.id}_${months[i / 2 - 1]}_${value}_match`);
				}
				
				// Make Total Deductions cell editable
				const totalDeductionsCell = cells[cells.length - 2]; // Second to last cell
				totalDeductionsCell.setAttribute('contenteditable', 'true');
				totalDeductionsCell.setAttribute('id', `${member.id}_${value}_totalDeductions`);
				linkMemberPage(`${member.id}`, className);
				
			});
			// Update total balance from backend data
			const yearDiv = document.getElementById("memberYear");
			const totalDiv = document.getElementById("totalBalance");
			totalDiv.textContent = data.totalBalance.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
			hideLoading();
		})
		.catch(error => {
			console.error('Error loading table data:', error);
			hideLoading();
		});
}

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
	const allCell = table.querySelectorAll('td');
	for (const cell of allCell) {
		if (cell.style.backgroundColor === 'pink') {
			return false;
		}
	}
	return true;
}

// on save create objects that saves the changes
async function save() {
	const constructedChanges = [];
	for (const each of LISTOFCHANGES) {
		const split = each.id.split('_');
		
		// Handle totalDeductions field (format: memberID_year_totalDeductions)
		if (split.length === 3 && split[2] === 'totalDeductions') {
			const value = each.textContent === '' ? "0.00" : parseFloat(each.textContent).toFixed(2);
			const existingChange = constructedChanges.find(change => change.id === split[0] && change.year === split[1]);
			if (existingChange) {
				existingChange.content.push(new orderedContent('totalDeductions', value, 'totalDeductions'));
			} else {
				constructedChanges.push(new Change(split[0], split[1], [new orderedContent('totalDeductions', value, 'totalDeductions')]));
			}
		} 
		// Handle monthly savings/match fields (format: memberID_month_year_type)
		else if (split.length === 4) {
			const value = each.textContent === '' ? "0.00" : parseFloat(each.textContent).toFixed(2);
			const existingChange = constructedChanges.find(change => change.id === split[0] && change.year === split[2]);
			if (existingChange) {
				existingChange.content.push(new orderedContent(split[1], value, split[3]));
			} else {
				constructedChanges.push(new Change(split[0], split[2], [new orderedContent(split[1], value, split[3])]));
			}
		}
	}
	for (const each of constructedChanges) {
		const data = {};
		const updateData = {};
		data["id"] = each.id;
		data["year"] = parseInt(each.year);
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
			if (orderedContent.type === "totalDeductions") {
				updateData.totalDeductions = orderedContent.content;
			}
		});
		data["updateData"] = updateData;
		await fetch('/newSaving', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(response => {
				if (response.ok) { // Handle success
					const toastLiveExample = document.getElementById('addSuccessToast')

					// Change toast background color
					toastLiveExample.classList.remove('bg-primary');
					toastLiveExample.classList.add('bg-success');

					setTimeout(function () {
						addSuccessToast.classList.remove('bg-success');
						addSuccessToast.classList.add('bg-primary');	
					}, 5500);

					// Add text
					const toastText = document.getElementsByClassName('toast-body')[0];
					toastText.innerHTML = "All changes have been saved!";

					const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
					toastBootstrap.show();
					if (each === [...constructedChanges].pop()) {
						reloadTable(YEAR.value, DATATABLE);
					}

					// Clear the list of changes
					LISTOFCHANGES = [];
				} else {
					return response.json();
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}
}

// Loading screen functions
function showLoading() {
	const loadingOverlay = document.getElementById('loadingOverlay');
	if (loadingOverlay) {
		loadingOverlay.classList.remove('d-none');
	}
}

function hideLoading() {
	const loadingOverlay = document.getElementById('loadingOverlay');
	if (loadingOverlay) {
		loadingOverlay.classList.add('d-none');
	}
}
