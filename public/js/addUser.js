document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("accountType").onchange = function() {
        accountTypeSelect();
    };
    const selectIDs = ["#clusterSelect", "#spuSelect", "#shgSelect"];
    for (let i = 0; i < selectIDs.length - 1; i++) {
        if ($(selectIDs[i]).is('select')) {

            $(selectIDs[i]).change(function () {
                console.log(document.getElementById("accountType").value)
                if (document.getElementById("accountType").value!=="Admin" && document.getElementById("accountType").value!=="SEDO"){
                    if (selectIDs[i] === "#clusterSelect") {
                        getProject();
                    }
                    else if (selectIDs[i] === "#spuSelect") {
                        getSHG();
                    }
                }
            });
        }
    }
});

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
            $("#spuSelect").empty();
            data.project.forEach((project, index) => {
                let newOption = `<option value="${project._id}" ${index === 0 ? 'selected' : ''}>${project.name}</option>`;
                $("#spuSelect").append(newOption);
            });
            if (data.project.length!==0){
                getSHG();
            } else {
                $("#shgSelect").empty();
            }
            
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getSHG() {
    const projectId = $('#spuSelect').find(":selected").val();
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
            $("#shgSelect").empty();
            data.shg.forEach((shg, index) => {
                let newOption = `<option value="${shg._id}" ${index === 0 ? 'selected' : ''}>${shg.name}</option>`;
                $("#shgSelect").append(newOption);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function showModal() {
    const saveModal = new bootstrap.Modal(document.getElementById("saveModal"));
    saveModal.show();
}
function accountTypeSelect() {
    var accountType = document.getElementById("accountType").value;
    var elementsToHandle = ["clusterSelect", "spuSelect", "shgSelect"];

    if (accountType == "Admin") {
        elementsToHandle.forEach(function (elementId) {
            var element = document.getElementById(elementId);
            element.disabled = true;
            element.value = "";
        });
    } else if (accountType == "SEDO") {
        elementsToHandle.forEach(function (elementId) {
            if (elementId !== "clusterSelect") {
                var element = document.getElementById(elementId);
                element.disabled = true;
                element.value = "";
            } else {
                var element = document.getElementById(elementId);
                element.disabled = false;
                element.value = "Choose...";
            }
        });
    } else {
        elementsToHandle.forEach(function (elementId) {
            document.getElementById(elementId).disabled = false;
            var element = document.getElementById(elementId);
            element.disabled = false;
            element.value = "Choose...";
        });
    }
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