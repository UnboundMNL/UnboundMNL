document.addEventListener('DOMContentLoaded', function() {
    var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    let table
    switch(isMobile){
        case true:
            table = loadMobileTable();
            break;
        case false:
            table = loadDesktopTable();
            break;
    }
    const search = document.getElementById("searchBar");
    
    search.addEventListener('keyup', function() {
        table.search(search.value).draw();
    })
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

function reloadTable(value){
    // CHANGE THE URL TO THE APPROPRIATE ROUTE
    // Controller should get all data from the database for that year
    // and res.render components/orgPartViews/membersTable
    // this is a GET btw
    $('#membersTable').load(`/membersTable/${value}`)
};



var listOfChanges=[];
const table = document.querySelector("table");
let timeout;
const saveButton = document.getElementById("save");

function Change(id, year, content) {
    this.id = id;
    this.year = year;
    this.content = content;
  }

function orderedContent(month, content,type){
    this.month = month;
    this.content = content;
    this.type = type;
}

table.addEventListener("input", event => {
    const cell = event.target;
    if (cell.tagName === "TD") {
        if (!listOfChanges.includes(cell)) {
            listOfChanges.push(cell);
        }
        if (/^\d+(\.\d+)?$/.test(cell.textContent) || cell.textContent === '') {
            cell.style.backgroundColor = '';
            if (check()) {
                saveButton.disabled = false;
            }
        } else {
            cell.style.backgroundColor = 'pink';
            saveButton.disabled = true;
        }
    }
});

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

function check() {

    const alltd = table.querySelectorAll('td');

    for (const td of alltd) {
        if (td.style.backgroundColor === 'pink') {
            return false;
        }
    }
    return true;
  }

