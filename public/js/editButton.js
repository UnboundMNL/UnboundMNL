document.addEventListener('DOMContentLoaded', function() {
    
    const editCluster = document.getElementById('editCluster')
    console.log(editCluster)
    if (editCluster) {
    editCluster.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget
        // Extract info from data-bs-type attribute
        // Possible types: Cluster, Sub-Project, Group
        const clusterName = button.getAttribute('data-bs-name')


        // Update the modal's content.
        $('#editClusterFormDiv').load(`/editClusterForm/${clusterName}`)
    })
    }
});