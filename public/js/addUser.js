document.addEventListener('DOMContentLoaded', function () {
    // Call the functions to populate dropdowns or perform other actions
    accountTypeSelect();
    // Additional calls as needed
    getCluster();

    // Disable project and group dropdowns initially
    let projectDropdown = document.getElementById('projectSelect');
    let groupDropdown = document.getElementById('groupSelect');
    projectDropdown.disabled = true;
    groupDropdown.disabled = true;

    // Add event listener for the "Cluster" dropdown
    clusterDropdown.addEventListener('change', function () {
        const selectedCluster = clusterDropdown.value; // Get the selected value directly from clusterDropdown
    
        // Check if a cluster is selected
        if (selectedCluster !== "") {
            // Enable the project dropdown
            projectDropdown.disabled = false;
    
            // Call getProject function to retrieve projects for the selected cluster
            getProject();
    
            // Disable the group dropdown as no project is selected yet
            groupDropdown.disabled = true;
        } else {
            // If no cluster is selected, disable both project and group dropdowns
            projectDropdown.disabled = true;
            groupDropdown.disabled = true;
        }
    });

    // Add event listener for the "Project" dropdown
    projectDropdown.addEventListener('change', function () {
        // Check if a project is selected
        if (projectDropdown.value !== "") {
            // Enable the group dropdown
            groupDropdown.disabled = false;

            // Call getGroup function to retrieve groups for the selected project
            getGroup();
        } else {
            // If no project is selected, disable the group dropdown
            groupDropdown.disabled = true;
        }
    });
});


clusterDropdown.addEventListener('change', function () {
    const selectedCluster = clusterDropdown.value; // Get the selected value directly from clusterDropdown

    // Check if a cluster is selected
    if (selectedCluster !== "") {
        // Enable the project dropdown
        projectDropdown.disabled = false;

        // Call getProject function to retrieve projects for the selected cluster
        getProject();

        // Disable the group dropdown as no project is selected yet
        groupDropdown.disabled = true;
    } else {
        // If no cluster is selected, disable both project and group dropdowns
        projectDropdown.disabled = true;
        groupDropdown.disabled = true;
    }
});


// $(document).ready(function () {
//     const selectIDs = ["#clusterSelect", "#projectSelect", "#groupSelect"];
//     console.log("ddd");
//     // check #clusterSelect element type
//     for (let i = 0; i < selectIDs.length - 1; i++) {
//         if ($(selectIDs[i]).is('select')) {
//             // Changes the available options for the self help group select
//             $(selectIDs[i]).change(function () {
//                 // I do not know how slow this can be
//                 $(selectIDs[i + 1] + ' option:not(:first)').remove();
//                 if (selectIDs[i] === "#clusterSelect") {
//                     getProject();
//                 }
//                 else if (selectIDs[i] === "#projectSelect") {
//                     getSHG();
//                 }
//             });
//         }
//         else if ($(selectIDs[i]).is('input')) { // if the user is a SEDO
//             //append options to the select here OR do it in the ejs file
//             //for ejs file, make sure to put an if auth === SEDO before adding options
//         }
//     }
//     // Example starter JavaScript for disabling form submissions if there are invalid fields
//     (() => {
//         'use strict'
//         // Fetch all the forms we want to apply custom Bootstrap validation styles to
//         const forms = document.querySelectorAll('.needs-validation')
//         Array.from(forms).forEach(form => { // Loop over them and prevent submission
//             form.addEventListener('submit', event => {
//                 if (!form.checkValidity()) {
//                     event.preventDefault()
//                     event.stopPropagation()
//                 }
//                 form.classList.add('was-validated')
//             }, false)
//         })
//     })()
// });



function getSHG() {
    const project = $('#clusterSelect').find(":selected").text();
    const data = { project };
    fetch('/SHGchoices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch data');
            }
        })
        .then(data => {
            data.SHG.forEach(shg => {
                let newOption = `<option value="${shg.name}">${shg.name}</option>`;
                $("#groupSelect").append(newOption);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getProject() {
    const cluster = $('#projectSelect').find(":selected").text();
    const data = { cluster };
    console.log("hi", cluster);
    fetch('/projectChoices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch data');
            }
        })
        .then(data => {
            data.project.forEach(project => {
                let newOption = `<option value="${project.name}">${project.name}</option>`;
                $("#projectSelect").append(newOption);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getCluster() {
    const data = {};
    fetch('/clusterChoices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch data');
            }
        })
        .then(data => {
            data.cluster.forEach(cluster => {
                let newOption = `<option value="${cluster.id}">${cluster.name}</option>`;
                $("#clusterSelect").append(newOption);
                console.log("hi111", cluster._id);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



function ResetAll(authority) {
    let groupSelectDefault;
    if (authority != "Treasurer") {
        groupSelectDefault = `<option disabled value = "">
            No Project Selected
        </option>`
    }
    else {
        groupSelectDefault = `<option disabled value = "">
            Error
        </option>`
    }
    let projectSelectDefault;
    if (authority === "Admin") {
        projectSelectDefault = `<option disabled value = "">
            No Cluster Selected
        </option>`
    }
    else {
        projectSelectDefault = `<option disabled value = "">
            Error
        </option>`
    }
    $('#projectSelect option:not(:first)').remove();
    $('#groupSelect option:not(:first)').remove();
    $('#groupSelect').append(groupSelectDefault);
    $('#projectSelect').append(projectSelectDefault);
}