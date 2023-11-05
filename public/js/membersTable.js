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