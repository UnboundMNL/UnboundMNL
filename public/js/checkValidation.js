function validatePassword() {
    const newPass = document.getElementById('newPass').value;
    const confirmPass = document.getElementById('confirmPass').value;
    const matchingAlert2 = document.getElementById('matchingAlert2');
    const minLength = 8; // TBD: Temp minimum length of password
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
    const username = document.getElementById('checkUsername').value;
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