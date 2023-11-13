document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('editAccount').style.display = 'none';
    const inputContainer = document.getElementById("inputContainer");
    const inputFields = inputContainer.querySelectorAll("input:not([type='checkbox'])");
    for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].disabled = true;
    }
    document.getElementById("deleteButton").onclick = () => {
        if (document.getElementById("deleteConfirm").value == "DELETE"){
            fetch('/deleteUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then(response => {
                    if (response.ok) {
                        location.href = "/";
                    } else {
                        
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }
});

function editAccount() {
    document.getElementById('editAccount').style.display = 'block';
    document.getElementById('profileAccount').style.display = 'none';
}

function backAccount() {
    document.getElementById('editAccount').style.display = 'none';
    document.getElementById('profileAccount').style.display = 'flex';
}

function clearAlert() {
    const alertIds = ['usernameAlert', 'currentPasswordAlert1', 'currentPasswordAlert2', 'matchingAlert2'];

    alertIds.forEach((id) => {
        const alertElement = document.getElementById(id);
        if (alertElement) {
            alertElement.innerHTML = '';
        }
    });
}


function cancelChanges(user) {
    const inputContainer = document.getElementById("inputContainer");
    const inputFields = inputContainer.querySelectorAll("input[type='text'], input[type='password']");
    for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].type === 'text') {
            inputFields[i].value = user;
        } else {
            inputFields[i].value = '';
        }
    }
}

// Hannah: I made it so that the checkbox is disabled when the other checkbox is checked 
// and it clears the text fields when the checkbox is unchecked
function toggleFields(targetId, checkbox, user) {
    const target = document.getElementById(targetId);
    const allInputs = document.querySelectorAll(`input[type='text'], input[type='password']`);
    const inputs = target.querySelectorAll('input');

    // Uncheck the other checkbox
    const otherCheckboxId = checkbox.id === 'checkUsername' ? 'checkPassword' : 'checkUsername';
    const otherCheckbox = document.getElementById(otherCheckboxId);
    otherCheckbox.checked = false;

    const inputsArray = Array.from(inputs);

    for (let input of allInputs) {
        if (!inputsArray.includes(input)) {
            input.disabled = true;
            cancelChanges(user);
            clearAlert();
        } else {
            if (checkbox.checked) {
                input.disabled = false;
            } else {
                input.disabled = true;
                cancelChanges(user);
                clearAlert();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let UsernameList = [];

    const updateUserUrl = '/retrieveUsernameList';
    fetch(updateUserUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (response.ok) {
                // Return the JSON promise
                return response.json();
            } else {
                throw new Error('Failed to retrieve username list');
            }
        })
        .then(data => {
            UsernameList = data.usernameList;
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });

    const saveChangesButton = document.getElementById('saveChanges');
    const checkUsernameCheckbox = document.getElementById('checkUsername');
    const checkPasswordCheckbox = document.getElementById('checkPassword');

    checkUsernameCheckbox.addEventListener('change', updateSubmitButtonState);
    checkPasswordCheckbox.addEventListener('change', updateSubmitButtonState);

    saveChangesButton.disabled = true;

    function updateSubmitButtonState() {

        saveChangesButton.disabled = !checkUsernameCheckbox.checked && !checkPasswordCheckbox.checked;
    }

    saveChangesButton.addEventListener('click', function (event) {
        event.preventDefault();
        updateUserInformation();
    });
});


function updateUserInformation() {
    const newUsername = document.getElementById('newUsername').value;
    const currentPassword1 = document.getElementById('currentPassword1').value;

    const newPassword = document.getElementById('newPass').value; 
    const confirmPassword = document.getElementById('confirmPass').value; 
    const currentPassword2 = document.getElementById('currentPassword2').value; 

    const currentPasswordAlert1 = document.getElementById('currentPasswordAlert1');
    const usernameAlert = document.getElementById('usernameAlert');
    const currentPasswordAlert2 = document.getElementById('currentPasswordAlert2');
    const checkUsernameCheckbox = document.getElementById('checkUsername');
    const checkPasswordCheckbox = document.getElementById('checkPassword');
    currentPasswordAlert1.innerHTML = '';
    usernameAlert.innerHTML = '';
    currentPasswordAlert2.innerHTML = '';

    const saveSuccessfulButton = document.getElementById('saveSuccessful');
    saveSuccessfulButton.addEventListener('click', function () {
        window.location.reload();
    });
    const requestBody = {
        newUsername: newUsername,
        currentPassword1: currentPassword1,

        newPassword: newPassword,
        confirmPassword: confirmPassword,
        currentPassword2: currentPassword2,
        checkUsernameCheckbox: checkUsernameCheckbox.checked,
        checkPasswordCheckbox: checkPasswordCheckbox.checked,
    };

    const updateUserUrl = '/editProfile'; 
    fetch(updateUserUrl, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(requestBody),
    })
    .then((response) => {
        if (response.ok) {
            $('#saveModal').modal('show');
            return response.json(); 
        } else {
            return response.json(); 
        }
    })
    .then(data => {
        if (data.errorType === 1) {
            // Handle errorType 1
            currentPasswordAlert1.style.color = 'red';
            currentPasswordAlert1.innerHTML = `✕ ${data.error}`;
        } else if (data.errorType === 2) {
            usernameAlert.style.color = 'red';
            usernameAlert.innerHTML = `✕ ${data.error}`;
        } else if (data.errorType === 3) {
            usernameAlert.style.color = 'red';
            usernameAlert.innerHTML = `✕ ${data.error}`;
        } else if (data.errorType === 4) {
            currentPasswordAlert1.style.color = 'red';
            currentPasswordAlert1.innerHTML = `✕ ${data.error}`;
        } else if (data.errorType === 5) {
            currentPasswordAlert2.style.color = 'red';
            currentPasswordAlert2.innerHTML = `✕ ${data.error}`;
        } else if (data.errorType === 6) {
            currentPasswordAlert2.style.color = 'red';
            currentPasswordAlert2.innerHTML = `✕ ${data.error}`;
        } else if (data.error) {
            const usernameAlert = document.getElementById('usernameAlert');
            usernameAlert.style.color = 'red';
            usernameAlert.innerHTML = `✕ ${data.error}`;
        } else {
           
        }
    })
    .catch((error) => {
        console.error('An error occurred:', error);
    });
    
}