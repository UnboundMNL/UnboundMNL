document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('editAccount').style.display = 'none';

    // Disable text input fields
    const inputContainer = document.getElementById("inputContainer");
    const inputFields = inputContainer.querySelectorAll("input:not([type='checkbox'])");
    for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].disabled = true;
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

function validatePassword() {
    var newPass = document.getElementById('newPass').value;
    var confirmPass = document.getElementById('confirmPass').value;
    var matchingAlert2 = document.getElementById('matchingAlert2');
    var saveChanges = document.getElementById('saveChanges');

    // TBD: Temp minimum length of password
    var minLength = 8;

    if (newPass.length === 0 && confirmPass.length === 0) {
        matchingAlert2.innerHTML = '';
    } else if (newPass !== confirmPass || newPass.length < minLength) {
        matchingAlert2.style.color = 'red';
        if (newPass !== confirmPass && confirmPass.length > 0) {
            matchingAlert2.innerHTML = '✕ Use the same password';
        } else if (newPass.length >= minLength && confirmPass.length === 0) {
            matchingAlert2.innerHTML = '✕ Confirm your password';
        } else if (newPass.length < minLength) {
            matchingAlert2.innerHTML = '✕ Password must be at least ' + minLength + ' characters';
        }
        // Add code to disable the save button if needed
    } else {
        matchingAlert2.style.color = 'lime';
        matchingAlert2.innerHTML = '✓ Password Matched';
        // Add code to enable the save button if needed
    }
}

function clearAlert() {
    var matchingAlert2 = document.getElementById('matchingAlert2');
    matchingAlert2.innerHTML = '';
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
    const inputs = target.querySelectorAll('input');

    if (!checkbox.checked) {
        cancelChanges(user);
        clearAlert();
    }
    
    for (const input of inputs) {
        input.disabled = !checkbox.checked;
    }

    const otherCheckboxId = checkbox.id === 'checkUsername' ? 'checkPassword' : 'checkUsername';
    const otherCheckbox = document.getElementById(otherCheckboxId);
    otherCheckbox.disabled = checkbox.checked;
}