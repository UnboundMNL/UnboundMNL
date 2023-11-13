document.addEventListener('DOMContentLoaded', function () {
    const editCluster = document.getElementById('editcluster') //edit cluster button
    if (editCluster) {
        editCluster.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget; // Button that triggered the modal
            // Extract info from data-bs-name attribute
            const clusterId = button.getAttribute('id');
            $('#editclusterFormDiv').load(`/editClusterForm/${clusterId}`); // Update the modal's content.
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
});