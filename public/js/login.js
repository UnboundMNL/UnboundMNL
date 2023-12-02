// login button click event
$(document).on('click', '#login', function () {
    handleLogin();
});

// password input field keydown event
$(document).on('keydown', '#pw', function (event) {
    if (event.key === 'Enter') {
        handleLogin();
    }
});

// function to handle login
function handleLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("pw").value;

    if (username == '' || password == '') {
        const errorDiv = document.getElementById("error");
        errorDiv.style.display = "block";
        errorDiv.textContent = "Please fill out all fields";
    } else {
        const data = {
            username,
            password,
        };
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    location.href = "/dashboard";
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
    }
}
