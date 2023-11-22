function userDelete(profileID){
    data = {profileID};
    fetch('/adminUserDelete',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                window.location.href = "/accounts";
            } else {
                return response.json();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}