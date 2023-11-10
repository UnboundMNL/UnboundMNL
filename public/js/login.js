// login button
$(document).on('click', '#login', function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("pw").value;
    const remember = document.getElementById("remember-me").checked;
    if (username == '' || password == '') {
        const errorDiv = document.getElementById("error");
        errorDiv.style.display = "block";
        errorDiv.textContent = "Please fill out all fields";
    } else {
        const data = {
            username,
            password,
            remember
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
});
