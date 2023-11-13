// registration.js

document.addEventListener('DOMContentLoaded', function () {
    const accountTypeSelect = document.getElementById('accountType');
    const clusterSelect = document.getElementById('clusterSelect');
    const spuSelect = document.getElementById('spuSelect');
    const shgSelect = document.getElementById('shgSelect');

    accountTypeSelect.addEventListener('change', function () {
        const selectedAccountType = accountTypeSelect.value;

        // Reset dropdowns
        clusterSelect.innerHTML = '<option selected>Choose...</option>';
        spuSelect.innerHTML = '<option selected>Choose...</option>';
        shgSelect.innerHTML = '<option selected>Choose...</option>';

        if (selectedAccountType === '2' || selectedAccountType === '3') {
            // Fetch clusters from the server
            fetchClusters();
        }
    });

    clusterSelect.addEventListener('change', function () {
        const selectedCluster = clusterSelect.value;

        // Reset downstream dropdowns
        spuSelect.innerHTML = '<option selected>Choose...</option>';
        shgSelect.innerHTML = '<option selected>Choose...</option>';

        // Fetch projects based on the selected cluster
        if (selectedCluster) {
            fetchProjects(selectedCluster);
        }
    });

    spuSelect.addEventListener('change', function () {
        const selectedProject = spuSelect.value;

        // Reset downstream dropdown
        shgSelect.innerHTML = '<option selected>Choose...</option>';

        // Fetch groups based on the selected project
        if (selectedProject) {
            fetchGroups(selectedProject);
        }
    });

    function fetchClusters() {
        // Fetch clusters from the server and populate the cluster dropdown
        fetch('/getClusters')
            .then(response => response.json())
            .then(data => {
                data.clusters.forEach(cluster => {
                    const option = document.createElement('option');
                    option.value = cluster.name;
                    option.text = cluster.name;
                    clusterSelect.add(option);
                });
            })
            .catch(error => console.error('Error fetching clusters:', error));
    }

    function fetchProjects(cluster) {
        // Fetch projects from the server based on the selected cluster and populate the project dropdown
        fetch('/getProjects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cluster })
        })
            .then(response => response.json())
            .then(data => {
                data.projects.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project.name;
                    option.text = project.name;
                    spuSelect.add(option);
                });
            })
            .catch(error => console.error('Error fetching projects:', error));
    }

    function fetchGroups(project) {
        // Fetch groups from the server based on the selected project and populate the group dropdown
        fetch('/getGroups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ project })
        })
            .then(response => response.json())
            .then(data => {
                data.groups.forEach(group => {
                    const option = document.createElement('option');
                    option.value = group.name;
                    option.text = group.name;
                    shgSelect.add(option);
                });
            })
            .catch(error => console.error('Error fetching groups:', error));
    }
});
