function displayDeleteModal(memberName, memberId, pageName) {
    // Show the modal using Bootstrap's modal method
    $('#deleteProfileModal').modal('show');
    if (pageName == "Members Masterlist") {
        $('#memberNameToDelete').text(memberName);
        cardDelete("masterlist", memberId);
    } else {
        $('#userToDelete').text(memberName);
        $('#deleteButton').click(function() {
            userDelete(memberId);
        });
    }
}

function redirectMember(id){
    data = { memberId:id };
    fetch('/redirectMiddle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                window.location.href = "/memberInfo";
            } else {
                return response.json();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

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

