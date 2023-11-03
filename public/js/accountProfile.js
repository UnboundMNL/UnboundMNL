document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('editAccount').style.display = 'none';
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
    var pass = document.getElementById('pass').value;
    var confirm_pass = document.getElementById('confirm_pass').value;
    var matching_alert = document.getElementById('matching_alert');
    var saveChanges = document.getElementById('saveChanges');

    // TBD: Temp minimum length of password
    var min_length = 1;

    if (pass.length > min_length && confirm_pass.length > min_length) {
        if (pass !== confirm_pass) {
            matching_alert.style.color = 'red';
            matching_alert.innerHTML = '✕ Use the same password';
            // saveChanges.disabled = true;
            // saveChanges.style.opacity = 0.4;
        } else {
            matching_alert.style.color = 'lime';
            matching_alert.innerHTML = '✓ Password Matched';
            // saveChanges.disabled = false;
            // saveChanges.style.opacity = 1;
        }
    } else if (pass.length == 0 && confirm_pass.length == 0) {
        matching_alert.innerHTML = '';
        // saveChanges.disabled = false;
        // saveChanges.style.opacity = 1;
    } else {
        matching_alert.style.color = 'red';
        matching_alert.innerHTML = '✕ Password too short';
        // saveChanges.disabled = true;
        // saveChanges.style.opacity = 0.4;
    }
}

function cancelChanges(user) {
    // Clear the input fields
    const inputFields = document.querySelectorAll("input");
    for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].value = '';
        if (i == 0) {
            inputFields[i].value = user;
        }
    }
}
