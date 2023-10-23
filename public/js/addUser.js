$(document).ready(function() {

    // check #clusterSelect element type
    if($("#clusterSelect").is('select')){
    
        // Changes the available options for the self help group select
        $("#clusterSelect").change(function() {
            // I do not know how slow this can be
            $('#groupSelect option:not(:first)').remove();
            getProject();   
            getSHG();
        });
    }
    // if the user is a SEDO
    else if ($("#clusterSelect").is('input')){
        //append options to the select here OR do it in the ejs file
        //for ejs file, make sure to put an if auth === SEDO before adding options
    }

    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (() => {
        'use strict'
    
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')
    
        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
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
    var project = $('#clusterSelect').find(":selected").text();
    var data = { project };
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
            var newOption = `<option value="${shg.name}">${shg.name}</option>`;
            $("#groupSelect").append(newOption);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getProject() {
    var cluster = $('#projectSelect').find(":selected").text();
    var data = { cluster };
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
            var newOption = `<option value="${project.name}">${project.name}</option>`;
            $("#projectSelect").append(newOption);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
