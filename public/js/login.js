$(document).on('click', '#login', function() {
	var username = document.getElementById("username").value;
    var password = document.getElementById("pw").value;
    var remember = document.getElementById("remember-me").checked;
    console.log(username)
    console.log(password)
    console.log(remember)
    if (username==''||password==''){
        var errorDiv = document.getElementById("error");
        errorDiv.style.display="block";
        errorDiv.textContent="No info inputted";
    }else{
        var data = {
            username,
            password,
            remember
        }
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                location.href="/dashboard";
            } else {
                return response.json().then(data => {
                    var errorDiv = document.getElementById("error");
                    errorDiv.style.display="block";
                    errorDiv.textContent=data.error;
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});
