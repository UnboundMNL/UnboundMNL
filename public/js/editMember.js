$(document).ready(function() {
    const selectIDs = ["#clusterSelect", "#projectSelect", "#groupSelect"];
    for(let i = 0; i < selectIDs.length-1; i++){
        if($(selectIDs[i]).is('select')){

            $(selectIDs[i]).change(function() {

                if(selectIDs[i] === "#clusterSelect"){
                    getProject();
                }
                else if(selectIDs[i] === "#projectSelect"){
                    getSHG();
                }
            });
        }
        // if the user is a SEDO
        else if ($(selectIDs[i]).is('input')){

        }
    }
});

function getSHG() {
    var projectId = $('#projectSelect').find(":selected").val();
    var data = { projectId };
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
        $("#groupSelect").empty();
        data.shg.forEach((shg, index) => {
            var newOption =  `<option value="${shg._id}" ${index === 0 ? 'selected' : ''}>${shg.name}</option>`;
            $("#groupSelect").append(newOption);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getProject() {
    var clusterId = $('#clusterSelect').find(":selected").val();
    var data = { clusterId };
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
        $("#projectSelect").empty();
        data.project.forEach((project, index) => {
            var newOption = `<option value="${project._id}" ${index === 0 ? 'selected' : ''}>${project.name}</option>`;
            $("#projectSelect").append(newOption);
        });
        getSHG();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}