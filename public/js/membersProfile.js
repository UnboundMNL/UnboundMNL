document.addEventListener("DOMContentLoaded", (event) => {
    displayContent("profile");
});

function displayContent(section) {
    console.log("Displaying " + section);
    const containerDisplay = document.getElementById("containerDisplay");
    const contentDisplay = document.getElementById(section + "Content");

    // Hide all content divs
    const contentDivs = containerDisplay.getElementsByClassName("content");
    for (let div of contentDivs) {
        div.style.display = "none";
    }

    // Show the selected content
    contentDisplay.style.display = "block";
}

function editProfile() {
    const contentDisplay = document.getElementById("profileContent");
    contentDisplay.style.display = "none";
    const contentEdit = document.getElementById("editContent");
    contentEdit.style.display = "block";
}

function backProfile() {
    const contentEdit = document.getElementById("editContent");
    contentEdit.style.display = "none";
    const contentDisplay = document.getElementById("profileContent");
    contentDisplay.style.display = "block";

    resetForm();
}

/* KABAN */
function setKabanStatusRadio(status) {
    const radios = {
        'Active': 'activeRadio',
        'RwS': 'retiredNoSavingsRadio',
        'RwoS': 'retiredWithSavingsRadio'
    };

    if (radios[status]) {
        document.getElementById(radios[status]).checked = true;
        document.getElementById(radios[status]).disabled = false;
    }
}

function cancelChanges(inputValues, dateValues, dropdownValues, projectChoicesName, projectChoicesId, groupChoicesName, groupChoicesId) {
    resetForm();
    displayCancellationMessage();

    inputValues = JSON.parse(inputValues);
    //  Restore the original values of input Fields
    const formContainer = document.getElementById("infoContainer");
    const inputFields = formContainer.querySelectorAll("input[type='text']:not([disabled])");
    for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].value = inputValues[i];
    }
    const dateFields = document.querySelectorAll("input[type='date']");
    for (let i = 0; i < dateFields.length; i++) {
        dateFields[i].value = dateValues;
    }
    projectChoicesName = JSON.parse(projectChoicesName);
    projectChoicesId = JSON.parse(projectChoicesId);
    $("#projectSelect").empty();
    for (let i = 0; i < projectChoicesName.length; i++) {
        $("#projectSelect").append(`<option value="${projectChoicesId[i]}">${projectChoicesName[i]}</option>`)
    }
    groupChoicesName = JSON.parse(groupChoicesName);
    groupChoicesId = JSON.parse(groupChoicesId);
    $("#groupSelect").empty();
    for (let i = 0; i < groupChoicesName.length; i++) {
        $("#groupSelect").append(`<option value="${groupChoicesId[i]}">${groupChoicesName[i]}</option>`)
    }
    dropdownValues = JSON.parse(dropdownValues);
    const dropdownFields = document.querySelectorAll("select");
    for (let i = 0; i < dropdownFields.length; i++) {
        for (let j = 0; j < dropdownFields[i].options.length; j++) {
            if (dropdownFields[i].options[j].value === dropdownValues[i]) {
                dropdownFields[i].selectedIndex = j;
                break;
            }
        }
    }
    // const contentDisplay = document.getElementById("profileContent");
    // contentDisplay.style.display = "block";
    // const contentEdit = document.getElementById("editContent");
    // contentEdit.style.display = "none";
}

displayCancellationMessage = () => {
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl)
    })
    toastList.forEach(toast => toast.show())
}