document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addclusterForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formDataObject = {};

        // Convert FormData to plain object
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });
        if (formDataObject["name"]=='') {
            const clusterNameInput = document.getElementById('clusterName');
            clusterNameInput.setCustomValidity(' ');
            clusterNameInput.reportValidity();
            const invalidFeedback = clusterNameInput.nextElementSibling;
            invalidFeedback.textContent = 'Please enter a cluster name.';
        }
        // Check if all values in formDataObject are not empty
        const fieldEmpty = Object.values(formDataObject).every(value => value !== '');

        if (fieldEmpty) {
            fetch('/newCluster', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataObject)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.reload();
                    } else if (data.error) {
                        const clusterNameInput = document.getElementById('clusterName');
                        clusterNameInput.setCustomValidity(' ');
                        clusterNameInput.reportValidity();
                        const invalidFeedback = clusterNameInput.nextElementSibling;
                        invalidFeedback.textContent = 'The cluster name is already in use';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Handle errors here
                });
        } else {
            // Handle case where at least one value is empty
            console.log('Please fill in all fields.');
            // You might want to provide user feedback or take appropriate action.
        }
    });
});
