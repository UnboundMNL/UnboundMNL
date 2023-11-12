function validatePassword() {
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;
    const matchingAlert2 = document.getElementById('matchingAlert2');

    const minLength = 6; // TBD: Temp minimum length of password

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

function validateUsername() {
    const username = document.getElementById('newUsername').value;
    const usernameAlert = document.getElementById('usernameAlert');

    // Hannah: Check validity of username
    // 0 = username taken
    // 1 = username available
    
    const usernameValid = 1;
    if (username.length === 0) {
        usernameAlert.innerHTML = '';
    } else if (usernameValid === 0) {
        usernameAlert.style.color = 'red';
        usernameAlert.innerHTML = '✕ Username is taken';
    } else {
        usernameAlert.style.color = 'lime';
        usernameAlert.innerHTML = '✓ Username is available';
    }
}

// Hannah: I want it to show upon submitting the button but I hardcoded it for now
// to show where it would be
function validateCurrentPassword(currentPassword, currentPasswordAlert) {
    const currentPass = document.getElementById(currentPassword).value;
    const currentPassAlert = document.getElementById(currentPasswordAlert);

    // Hannah: Check validity of current password
    // 0 = password incorrect
    // 1 = password correct

    const currentPassValid = 1;
    if (currentPass.length === 0) {
        currentPassAlert.innerHTML = '';
    } else if (currentPassValid === 0) {
        currentPassAlert.style.color = 'red';
        currentPassAlert.innerHTML = '✕ Incorrect password';
    } else {
        currentPassAlert.style.color = 'lime';
        currentPassAlert.innerHTML = '✓ Correct password';
    }
}