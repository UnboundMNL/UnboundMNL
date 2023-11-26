document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('usernameChange').style.display = 'block';
    document.getElementById('passwordChange').style.display = 'none';    
});

function displayFields(targetId, checkboxId) {
    const contentBlock = document.getElementById(targetId);

    // Show the selected content
    contentBlock.style.display = "block";

    // Hide the other content
    const otherContent = targetId === 'usernameChange' ? 'passwordChange' : 'usernameChange';
    const contentHide = document.getElementById(otherContent);
    contentHide.style.display = "none";

     // Remove 'active' class from all labels
     document.querySelectorAll('.nav-link').forEach(function (label) {
        label.classList.remove('active');
    });

    // Add 'active' class to the clicked label
    var associatedLabel = document.querySelector('label[for="' + checkboxId + '"]');
    if (associatedLabel) {
        associatedLabel.classList.add('active');
    }
}

// diisplayng the delete modal for user and member
function displayDeleteModal(memberName, memberId, pageName) {
    // Show the modal using Bootstrap's modal method
    $('#deleteProfileModal').modal('show');
    if (pageName == "Members Masterlist") {
        $('#memberNameToDelete').text(memberName);
        cardDelete("masterlist", memberId);
    } else {
        $('#userToDelete').text(memberName);
        $('#deleteButton').click(function () {
            userDelete(memberId);
        });
    }
}

// changing middleware for members
function redirectMember(id) {
    data = { memberId: id };
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

// user delete for admins
function userDelete(profileID) {
    data = { profileID };
    fetch('/adminUserDelete', {
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

