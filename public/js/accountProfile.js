document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('editAccount').style.display = 'none';
    const inputContainer = document.getElementById("inputContainer");
    const inputFields = inputContainer.querySelectorAll("input:not([type='checkbox'])");

    // Show selected content
    displayFields('usernameChange', 'checkUsername');

    // Disable all input fields
    for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].closest('#usernameChange') === null) {
            inputFields[i].disabled = true;
        }
    }
    // delete user button
    document.getElementById("deleteButton").onclick = () => {
        if (document.getElementById("deleteConfirm").value == "DELETE") {
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
    document.getElementById('editAccount').style.display = 'flex';
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

function toggleFields(targetId, checkboxId, user) {
    const target = document.getElementById(targetId);
    const allInputs = document.querySelectorAll(`input[type='text'], input[type='password']`);
    const inputs = target.querySelectorAll('input');

    // Uncheck the other checkbox 
    const otherCheckboxId = checkboxId === 'checkUsername' ? 'checkPassword' : 'checkUsername';
    const otherCheckbox = document.getElementById(otherCheckboxId);
    otherCheckbox.checked = false;

    for (let input of allInputs) {
            if (input.closest(`#${targetId}`) !== null) {
            input.disabled = false;
        } else if (input.closest(`#${targetId}`) === null) {
            input.disabled = true;
            cancelChanges(user);
            clearAlert();
        }
    }

    displayFields(targetId, checkboxId);
}

function displayFields(targetId, checkboxId) {
    console.log("Displaying " + targetId);
    const contentBlock = document.getElementById(targetId);

    // Show the selected content
    contentBlock.style.display = "block";

    // Hide the other content
    const otherContent = targetId === 'usernameChange' ? 'passwordChange' : 'usernameChange';
    const contentHide = document.getElementById(otherContent);
    contentHide.style.display = "none";

     // Remove 'active' class from all labels
     document.querySelectorAll('.nav-link').forEach(function (label) {
        label.classList.remove('active');
    });

    // Add 'active' class to the clicked label
    var associatedLabel = document.querySelector('label[for="' + checkboxId + '"]');
    if (associatedLabel) {
        associatedLabel.classList.add('active');
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

    // saveChangesButton.disabled = true;

    console.log(checkUsernameCheckbox.checked, checkPasswordCheckbox.checked);
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
                const saveSuccessfulButton = document.getElementById('saveSuccessful');
                saveSuccessfulButton.addEventListener('click', function () {
                    window.location.reload();
                });

            }
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });

}