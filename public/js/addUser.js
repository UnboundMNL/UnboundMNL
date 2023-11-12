document.addEventListener('DOMContentLoaded', function () {

    const selectIDs = ["#clusterSelect", "#spuSelect", "#shgSelect"];
    for (let i = 0; i < selectIDs.length - 1; i++) {
        if ($(selectIDs[i]).is('select')) {

            $(selectIDs[i]).change(function () {
                if (document.getElementById("accountType").value !== "Admin" && document.getElementById("accountType").value !== "SEDO") {
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

    const saveButton = document.getElementById("saveChanges");
    saveButton.onclick = () => {
        const pass = document.getElementById("pass").value;
        const repass = document.getElementById("repass").value;
        const username = document.getElementById("username").value;
        const usernameAlert = document.getElementById('usernameAlert');
        usernameAlert.style.color = 'red';
        const matchingAlert2 = document.getElementById('matchingAlert2');
        matchingAlert2.style.color = 'red';
        const noPart = document.getElementById('noPart');
        noPart.style.color = 'red';
        const passwordRegex = /^[^\s]{6,}$/;
        let error = false;
        if (username.length === 0) {
            usernameAlert.innerHTML = '✕ Enter your username';
            error = true;
        }
        if (pass == "") {
            matchingAlert2.innerHTML = '✕ Enter your password';
            error = true;
        } else if (pass.length < 6) {
            matchingAlert2.innerHTML = '✕ Password must be at least 6 characters';
            error = true;
        } else if (!passwordRegex.test(pass)) {
            matchingAlert2.innerHTML = '✕ Password must not have spaces';
            error = true;
        } else if (repass == "") {
            matchingAlert2.innerHTML = '✕ Confirm your password';
            error = true;
        } else if (pass !== repass) {
            matchingAlert2.innerHTML = '✕ Use the same password';
            error = true;
        }
        const accountType= document.getElementById("accountType").value;
        if (accountType ==""){
            noPart.innerHTML = '✕ Choose an account type';
            error = true;
        } else if (accountType=="SEDO" && document.getElementById("clusterSelect").value==""){
            noPart.innerHTML = '✕ Choose a valid cluster';
            error = true;
        } else if (accountType=="Treasurer" && document.getElementById("shgSelect").value==""){
            noPart.innerHTML = '✕ Choose a valid Group';
            error = true;
        }
        document.getElementById("username").oninput = () => {
            document.getElementById('usernameAlert').innerHTML = '';
        };

        document.getElementById("pass").oninput = () => {
            document.getElementById('matchingAlert2').innerHTML = '';
        };

        document.getElementById("repass").oninput = () => {
            document.getElementById('matchingAlert2').innerHTML = '';
        };

        document.getElementById("clusterSelect").onchange = () => {
            document.getElementById('noPart').innerHTML = '';
        };

        document.getElementById("spuSelect").onchange = () => {
            document.getElementById('noPart').innerHTML = '';
        };

        document.getElementById("shgSelect").onchange = () => {
            document.getElementById('noPart').innerHTML = '';
        };

        if (!error) {
            let data;
            if (document.getElementById("accountType").value == "Admin") {
                data = { username, password: pass, authority: "Admin" }
            } else if (document.getElementById("accountType").value == "SEDO") {
                data = { username, password: pass, authority: "SEDO", validCluster: document.getElementById('clusterSelect').value }
            } else {
                data = { username, password: pass, authority: "Treasurer", validGroup: document.getElementById('shgSelect').value }
            }
            fetch('/register', {
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
                    if (data.error) {
                        usernameAlert.innerHTML = '✕ Username already exists';
                    } else {
                        showModal();
                        const saveSuccessful = document.getElementById('saveSuccessful');
                        saveSuccessful.onclick = () => {
                            window.location.reload();
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
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
            if (data.project.length !== 0) {
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

function accountTypeSelect(clusterChoicesName, clusterChoicesId) {
    var accountType = document.getElementById("accountType").value;
    var elementsToHandle = ["clusterSelect", "spuSelect", "shgSelect"];

    if (accountType == "Admin") {
        elementsToHandle.forEach(function (elementId) {
            var element = document.getElementById(elementId);
            element.disabled = true;
            element.value = "";
            $("#"+elementId).empty();
        });
    } else if (accountType == "SEDO") {
        elementsToHandle.forEach(function (elementId) {
            if (elementId !== "clusterSelect") {
                var element = document.getElementById(elementId);
                element.disabled = true;
                element.value = "";
                $("#"+elementId).empty();
                
            } else {
                var element = document.getElementById(elementId);
                element.disabled = false;
                clusterChoicesName = JSON.parse(clusterChoicesName);
                clusterChoicesId = JSON.parse(clusterChoicesId);
                $("#clusterSelect").empty();
                $("#clusterSelect").append('<option value="" selected hidden default> Choose..</option>');
                for (let i = 0; i < clusterChoicesName.length; i++) {
                    let newOption = `<option value="${clusterChoicesId[i]}">${clusterChoicesName[i]}</option>`;
                    $("#clusterSelect").append(newOption);
                }

            }
        });
    } else {
        elementsToHandle.forEach(function (elementId) {
            document.getElementById(elementId).disabled = false;
            var element = document.getElementById(elementId);
            element.disabled = false;
            $("#"+elementId).empty();
            $("#"+elementId).append('<option value="" selected hidden default> Choose...</option>');
        });
            fetch('/clusterChoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch data');
                    }
                })
                .then(data => {
                    data.cluster.forEach((cluster) => {
                        let newOption = `<option value="${cluster._id}">${cluster.name}</option>`;
                        $("#clusterSelect").append(newOption);
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
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