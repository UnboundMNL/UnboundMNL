document.addEventListener('DOMContentLoaded', function() {
    loadDataTable();
});

function loadDataTable(){
    const table = new DataTable('#membersTable', {
       
        scrollX:true,
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

    const search = document.getElementById("searchBar");
    
    search.addEventListener('keyup', function() {
        table.search(search.value).draw();
    })
};

function reloadTable(value){
    // CHANGE THE URL TO THE APPROPRIATE ROUTE
    // Controller should get all data from the database for that year
    // and res.render components/orgPartViews/membersTable
    // this is a GET btw
    $('#membersTable').load(`/membersTable/${value}`)
};