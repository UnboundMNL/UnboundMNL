$(document).on('click', '#logout', function() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) {
            location.href="/";
        } else {
            return response.json().then(data => {
                // var errorDiv = document.getElementById("error");
                // errorDiv.style.display="block";
                // errorDiv.textContent=data.error;
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

});


function authCheck(authority){
    if(authority=="Admin"){
        console.log(authority)
        forEach
    }else if (authority=="SEDO"){
        console.log(authority)
    }else{
        console.log(authority)
    }
}

