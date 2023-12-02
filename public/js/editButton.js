// show edit modals
document.addEventListener('DOMContentLoaded', function () {

    const editCluster = document.getElementById('editCluster') //edit cluster button

    if (editCluster) {
        editCluster.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget; // Button that triggered the modal
            // Extract info from data-bs-name attribute
            const clusterId = button.getAttribute('id');

            $('#editClusterFormDiv').load(`/editClusterForm/${clusterId}`); // Update the modal's content.

        })
    }
    //edit project button
    const editProject = document.getElementById('editSub-Projects');
    if (editProject) {
        editProject.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget; // Button that triggered the modal
            // Extract info from data-bs-name attribute
            const projectId = button.getAttribute('id');
            $('#editSub-ProjectsFormDiv').load(`/editSubProjectsForm/${projectId}`); // Update the modal's content.
        })
    }
    //edit SHG button
    const editSHG = document.getElementById('editSHG');
    if (editSHG) {
        editSHG.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget; // Button that triggered the modal
            // Extract info from data-bs-name attribute
            const shgId = button.getAttribute('id');
            $('#editSHGFormDiv').load(`/editSHGForm/${shgId}`); // Update the modal's content.
        })
    }

    const editUser = document.getElementById('editUser');
    if (editUser) {
        editUser.addEventListener('show.bs.modal', event => {
            document.getElementById('editUserForm').classList.remove('was-validated');
            const button = event.relatedTarget; // Button that triggered the modal
            // Extract info from data-bs-name attribute
            const username = button.getAttribute('data-bs-username');

            const usernameInput = document.getElementById('editUsernameInput');
            usernameInput.value = username;

            //set data-bs-id of usernameInput to objetId
            const objectId = button.getAttribute('data-bs-id');
            usernameInput.setAttribute('data-bs-id', objectId);
        })
    }
});