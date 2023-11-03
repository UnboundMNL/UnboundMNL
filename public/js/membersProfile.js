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

}

function cancelChanges(personalInfo) {
    // Clear the input fields
    const inputFields = document.querySelectorAll("input[type='text']");
    for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].value = '';
    }

    // Restore the original values
    for (let i = 0; i < personalInfo.length; i++) {
        inputFields[i].value = personalInfo[i];
    }
}