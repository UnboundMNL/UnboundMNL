function validatePassword() {
    const saveChangesButton = document.getElementById('saveChanges');
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
            saveChangesButton.disabled = true;
        } else if (newPass.length < minLength) {
            matchingAlert2.innerHTML = '✕ Password must be at least ' + minLength + ' characters';
            saveChangesButton.disabled = true
        }
        // Add code to disable the save button if needed
    } else {
        matchingAlert2.style.color = 'lime';
        matchingAlert2.innerHTML = '✓ Password Matched';
        saveChangesButton.disabled = false;
        // Add code to enable the save button if needed
    }
}

// // This variable will hold the list of usernames
// let UsernameList;

// // This function will be called after fetching the username list
// function handleUsernameList(data) {
//     UsernameList = data.usernameList;
//     console.log('Username list:', UsernameList);
//     validateUsername();
// }

// // This function fetches the username list
// async function fetchUsernameList() {
//     const updateUserUrl = '/retrieveUsernameList';
//     await fetch(updateUserUrl, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 throw new Error('Failed to retrieve username list');
//             }
//         })
//         .then(data => {
//             handleUsernameList(data);
//         })
//         .catch(error => {
//             console.error('An error occurred:', error);
//         });
// }

// // Call the fetchUsernameList function when the DOM is loaded
// document.addEventListener('DOMContentLoaded', function () {
//     fetchUsernameList();
// });

// function validateUsername() {
//     const username = document.getElementById('newUsername').value;
//     const usernameAlert = document.getElementById('usernameAlert');

//     // Check if the username is in the list
//     const usernameValid = UsernameList.includes(username) ? 0 : 1;
//     console.log("asda", UsernameList);

//     if (username.length === 0) {
//         usernameAlert.innerHTML = '';
//     } else if (usernameValid === 0) {
//         usernameAlert.style.color = 'red';
//         usernameAlert.innerHTML = '✕ Username is taken';
//     } else {
//         usernameAlert.style.color = 'lime';
//         usernameAlert.innerHTML = '✓ Username is available';
//     }
// }

// // Hannah: I want it to show upon submitting the button but I hardcoded it for now
// // to show where it would be
// function validateCurrentPassword(currentPassword, currentPasswordAlert) {
//     const currentPass = document.getElementById(currentPassword).value;
//     const currentPassAlert = document.getElementById(currentPasswordAlert);

//     // Hannah: Check validity of current password
//     // 0 = password incorrect
//     // 1 = password correct

//     const currentPassValid = 1;
//     if (currentPass.length === 0) {
//         currentPassAlert.innerHTML = '';
//     } else if (currentPassValid === 0) {
//         currentPassAlert.style.color = 'red';
//         currentPassAlert.innerHTML = '✕ Incorrect password';
//     } else {
//         currentPassAlert.style.color = 'lime';
//         currentPassAlert.innerHTML = '✓ Correct password';
//     }
// }