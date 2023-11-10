let listOfChanges = [];
<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', function () {

	//LOAD TABLE
	const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
	let datatable;
=======
let datatable;
let year;
document.addEventListener('DOMContentLoaded', function () {
	//LOAD TABLE
	const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
	switch (isMobile) {
		case true:
			datatable = loadMobileTable();
			break;
		case false:
			datatable = loadDesktopTable();
			break;
	}
	const search = document.getElementById("searchBar");
	search.addEventListener('keyup', function () {
		datatable.search(search.value).draw();
	})
	//LOAD YEAR
	year = document.getElementById("yearInput");
	const yearButton = document.getElementById("yearButton");
	yearButton.addEventListener('click', function () {
		listOfChanges = [];
		reloadTable(year.value, datatable);
	})
	//SAVE BUTTON
	const saveButton = document.getElementById("save");
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

function reloadTable(value, table) {
	year=value;
	const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];
	table.clear().draw();
	fetch(`/membersTable/${value}`)
		.then((res) => res.json())
		.then((data) => {
<<<<<<< HEAD
=======
			let j=0, sum=0;
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
			data.memberList.forEach((member) => {
				let total = member.totalSavings + member.totalMatch;
				const rowData = [
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
					total,
				];
<<<<<<< HEAD
=======
				sum+=member.totalSavings;
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
				// Add a new row to the table
				const row = table.row.add(rowData).draw();
				// Make the cells of the newly added row editable and set attributes
				const cells = row.node().querySelectorAll('td');
<<<<<<< HEAD
				for (let i = 0; i < 2; i++) {
					let cell = cells[i];
					cell.setAttribute('class', 'memberPage');
=======
				let className;
				for (let i = 0; i < 2; i++) {
					let cell = cells[i];
					className="memberPage"+j;
					j++;
					cell.setAttribute('class', className);
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
				}

				for (let i = 2; i < cells.length - 3; i += 2) {
					let cell = cells[i];
					cell.setAttribute('contenteditable', 'true');
					cell.setAttribute('id', `${member.id}_${months[i / 2 - 1]}_${value}_savings`);
					cell = cells[i + 1];
					cell.setAttribute('contenteditable', 'true');
					cell.setAttribute('id', `${member.id}_${months[i / 2 - 1]}_${value}_match`);
				}
<<<<<<< HEAD
				linkMemberPage(`${member.id}`);
=======
				linkMemberPage(`${member.id}`,className);
				const yearDiv = document.getElementById("memberYear");
				yearDiv.textContent="Savings and Matching Grant for "+data.year;
				const totalDiv = document.getElementById("totalSavings");
				totalDiv.textContent=sum;
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
			});
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

function save() {
	const constructedChanges = [];
	for (const each of listOfChanges) {
		const split = each.id.split('_');
		const existingChange = constructedChanges.find(change => change.id === split[0] && change.year === split[2]);
		if (existingChange) {
			existingChange.content.push(new orderedContent(split[1], each.textContent, split[3]));
		} else {
<<<<<<< HEAD
			constructedChanges.push(new Change(split[0], split[2], [new orderedContent(split[1], each.textContent, split[3])]));
=======
			constructedChanges.push(new Change(split[0], split[2], [new orderedContent(split[1], each.textContent === '' ? "0" : each.textContent, split[3])]));
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
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
				if (response.ok) { // Handle success
					const toastLiveExample = document.getElementById('addSuccessToast')
					const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
					toastBootstrap.show();
<<<<<<< HEAD
=======
					console.log(year)
					reloadTable(year,datatable);
>>>>>>> 04f7f935db62c1cb100d6e36884b4eeda2819cd5
				} else {
					return response.json();
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}
}
