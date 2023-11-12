document.addEventListener('DOMContentLoaded', function () {
    (() => {
        'use strict'
        const forms = document.querySelectorAll('.needs-validation'); // Fetch all the forms we want to apply custom Bootstrap validation styles to
        Array.from(forms).forEach(form => { // Loop over them and prevent submission
            form.addEventListener('submit', event => {
                if (form.name) { 
                    addCluster(event.target, form.name);
                }
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                event.preventDefault()
                form.classList.add('was-validated')
            }, false)
        })

        document.getElementById('clusterName').addEventListener('keyup', event => {
            const formNameInput = event.target;
            const invalidFeedback = formNameInput.nextElementSibling;
            formNameInput.setCustomValidity('');
            formNameInput.classList.remove('is-invalid');
            formNameInput.classList.remove('is-valid');
            invalidFeedback.textContent = '';
        });

    })()
    
});

function addCluster(form, nameInput){
    const formData = new FormData(form);
    const formDataObject = {};
    const formNameInput = nameInput;
    const invalidFeedback = formNameInput.nextElementSibling;

    // Convert FormData to plain object
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    if (formDataObject["name"]=='') {
        formNameInput.setCustomValidity('Invalid field.');
        formNameInput.classList.add('is-invalid');
        formNameInput.classList.remove('is-valid');
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
                    formNameInput.setCustomValidity('Invalid field.');
                    formNameInput.classList.add('is-invalid');
                    formNameInput.classList.remove('is-valid');
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
}