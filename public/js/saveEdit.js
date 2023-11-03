function saveEdit(link,actionForm,saveID){
    var saveButton = document.getElementById(saveID);  
    saveButton.onclick = () =>{
        var id = document.getElementById("id").value;
        var address = document.getElementById("address").value;
        var birthdate = document.getElementById("birthdate").value;
        var sex = document.getElementById("sex").value;
        var status = document.getElementById("status").value;
        var MemberFirstName = document.getElementById("MemberFirstName").value;
        var MemberLastName = document.getElementById("MemberLastName").value;
        var MotherFirstName = document.getElementById("MotherFirstName").value;
        var MotherLastName = document.getElementById("MotherLastName").value;
        var FatherFirstName = document.getElementById("FatherFirstName").value;
        var FatherLastName = document.getElementById("FatherLastName").value;
        fetch(actionForm, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, address, birthdate, sex, status, MemberFirstName, 
                MemberLastName, MotherFirstName, MotherLastName, 
                FatherFirstName, FatherLastName })
        })
        .then(response => {
            if (response.ok) {
                var saveModal = new bootstrap.Modal(document.getElementById("saveModal"));
                var saveSuccessful = document.getElementById("saveSuccessful");
                saveSuccessful.onclick = () =>{
                    window.location.href = link;
                }
                saveModal.show();
            } else {
                return response.json().then(data => {
                    // var errorDiv = document.getElementById("error");
                    // errorDiv.style.display="block";
                    // errorDiv.textContent=data.error;
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}