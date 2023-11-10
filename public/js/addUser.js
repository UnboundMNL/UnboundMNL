$(document).ready(function () {
    const selectIDs = ["#clusterSelect", "#projectSelect", "#groupSelect"];
    // check #clusterSelect element type
    for (let i = 0; i < selectIDs.length - 1; i++) {
        if ($(selectIDs[i]).is('select')) {
            // Changes the available options for the self help group select
            $(selectIDs[i]).change(function () {
                // I do not know how slow this can be
                $(selectIDs[i + 1] + ' option:not(:first)').remove();
                if (selectIDs[i] === "#clusterSelect") {
                    getProject();
                }
                else if (selectIDs[i] === "#projectSelect") {
                    getSHG();
                }
            });
        }
        else if ($(selectIDs[i]).is('input')) { // if the user is a SEDO
            //append options to the select here OR do it in the ejs file
            //for ejs file, make sure to put an if auth === SEDO before adding options
        }
    }
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (() => {
        'use strict'
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')
        Array.from(forms).forEach(form => { // Loop over them and prevent submission
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
    })()
});

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