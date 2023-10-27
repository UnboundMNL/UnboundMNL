document.addEventListener('DOMContentLoaded', function() {
    
    //edit cluster button
    const editCluster = document.getElementById('editcluster')
    if (editCluster) {
    editCluster.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget

        // Extract info from data-bs-name attribute
        const clusterName = button.getAttribute('data-bs-name')


        // Update the modal's content.
        $('#editclusterFormDiv').load(`/editClusterForm/${clusterName}`)
    })
    }

    //edit project button
    const editProject = document.getElementById('editSub-Projects')
    if (editProject) {
    editProject.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget

        // Extract info from data-bs-name attribute
        const projectName = button.getAttribute('data-bs-name')

        // Update the modal's content.
        $('#editSub-ProjectsFormDiv').load(`/editSubProjectsForm/${projectName}`)
    })
    }

    //edit SHG button
    const editSHG = document.getElementById('editSHG')
    if (editSHG) {
    editSHG.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget

        // Extract info from data-bs-name attribute
        const shgName = button.getAttribute('data-bs-name')

        // Update the modal's content.
        $('#editSHGFormDiv').load(`/editSHGForm/${shgName}`)
    })
    }
});