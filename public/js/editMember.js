$(document).ready(function () {
    const selectIDs = ["#clusterSelect", "#projectSelect", "#groupSelect"];
    for (let i = 0; i < selectIDs.length - 1; i++) {
        if ($(selectIDs[i]).is('select')) {

            $(selectIDs[i]).change(function () {

                if (selectIDs[i] === "#clusterSelect") {
                    getProject();
                }
                else if (selectIDs[i] === "#projectSelect") {
                    getSHG();
                }
            });
        }
    }
});

function getSHG() {
    const projectId = $('#projectSelect').find(":selected").val();
    const data = { projectId };
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
                let newOption = `<option value="${shg._id}" ${index === 0 ? 'selected' : ''}>${shg.name}</option>`;
                $("#groupSelect").append(newOption);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getProject() {
    const clusterId = $('#clusterSelect').find(":selected").val();
    const data = { clusterId };
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
                let newOption = `<option value="${project._id}" ${index === 0 ? 'selected' : ''}>${project.name}</option>`;
                $("#projectSelect").append(newOption);
            });
            getSHG();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}