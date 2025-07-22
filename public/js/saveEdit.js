// save member edit
function saveEdit(link, actionForm, saveID) {
    const saveButton = document.getElementById(saveID);
    saveButton.onclick = async () => {
        const orgId = document.getElementById("id").value;
        const address = document.getElementById("address").value;
        const birthdate = document.getElementById("birthdate").value;
        const sex = document.getElementById("sex").value;
        const status = document.getElementById("status").value;
        const MemberFirstName = document.getElementById("MemberFirstName").value;
        const MemberLastName = document.getElementById("MemberLastName").value;
        const ParentFirstName = document.getElementById("ParentFirstName").value;
        const ParentLastName = document.getElementById("ParentLastName").value;
        const clusterId = document.getElementById("clusterSelect").value;
        const projectId = document.getElementById("projectSelect").value;
        const groupId = document.getElementById("groupSelect").value;

        await fetch(actionForm, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orgId, address, birthdate, sex, status, MemberFirstName,
                MemberLastName, ParentFirstName, ParentLastName, clusterId, projectId, groupId
            })
        })
            .then(response => {
                if (response.ok) {
                    const saveModal = new bootstrap.Modal(document.getElementById("saveModal"));
                    let saveSuccessful = document.getElementById("saveSuccessful");
                    saveSuccessful.onclick = () => {
                        window.location.href = link;
                    }
                    saveModal.show();
                } else {
                    return response.json().then(data => {
                        let errorDiv = document.getElementById("error");
                        errorDiv.style.display = "block";
                        errorDiv.textContent = data.error;
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        validateForm();
    }
}