document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('editAccount').style.display = 'none';
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
    const inputs = target.querySelectorAll('input');
    if (!checkbox.checked) {
        cancelChanges(user);
        clearAlert();
    }

    for (let input of inputs) {
        input.disabled = !checkbox.checked;
    }
    const otherCheckboxId = checkbox.id === 'checkUsername' ? 'checkPassword' : 'checkUsername';
    const otherCheckbox = document.getElementById(otherCheckboxId);
    otherCheckbox.disabled = checkbox.checked;
}

function updateUserInformation() {
    // Get the user input values that you want to update
    const newUsername = document.getElementById('usernameChange').value; // Example field for username
    const newPassword = document.getElementById('newPass').value; // Example field for password
    // Define the request body (data to be sent to the server)
    const requestBody = {
        username: newUsername,
        password: newPassword,
        // Add more properties as needed
    };

    // Define the URL for your server endpoint that handles user updates
    const updateUserUrl = '/updateUser'; // Replace with the actual endpoint URL

    // Send a POST request with the updated user information
    fetch(updateUserUrl, {
        method: 'POST', // You can use PUT if it's more appropriate for your use case
        headers: {
            'Content-Type': 'application/json', // Adjust the content type if needed
        },
        body: JSON.stringify(requestBody),
    })
        .then((response) => {
            if (response.ok) {
                // User information updated successfully
                // You can add code to handle success, such as displaying a success message
                console.log('User information updated successfully');
            } else {
                // Handle errors or display error messages if needed
                console.error('Failed to update user information');
            }
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
}