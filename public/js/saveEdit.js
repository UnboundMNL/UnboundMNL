 function saveEdit(link, actionForm, saveID) {
    const saveButton = document.getElementById(saveID);
    saveButton.onclick = async() => {
        const orgId = document.getElementById("id").value;
        const address = document.getElementById("address").value;
        const birthdate = document.getElementById("birthdate").value;
        const sex = document.getElementById("sex").value;
        const status = document.getElementById("status").value;
        const MemberFirstName = document.getElementById("MemberFirstName").value;
        const MemberLastName = document.getElementById("MemberLastName").value;
        const MotherFirstName = document.getElementById("MotherFirstName").value;
        const MotherLastName = document.getElementById("MotherLastName").value;
        const FatherFirstName = document.getElementById("FatherFirstName").value;
        const FatherLastName = document.getElementById("FatherLastName").value;
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
                MemberLastName, MotherFirstName, MotherLastName,
                FatherFirstName, FatherLastName, clusterId, projectId, groupId
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