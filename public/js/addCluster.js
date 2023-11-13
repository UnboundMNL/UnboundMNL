document.addEventListener('DOMContentLoaded', function () {
    (() => {
        'use strict'
        const forms = document.querySelectorAll('.needs-validation.addForm'); // Fetch all the forms we want to apply custom Bootstrap validation styles to
        Array.from(forms).forEach(form => { // Loop over them and prevent submission
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    addCluster(event.target, form.name);
                }
                event.preventDefault();
                form.classList.add('was-validated');
                document.getElementById('clusterName').addEventListener('input', event => {
                    const formNameInput = event.target;
                    const invalidFeedback = formNameInput.nextElementSibling;
                    formNameInput.setCustomValidity('');
                    formNameInput.classList.remove('is-invalid');
                    formNameInput.classList.remove('is-valid');
                    if (document.getElementById('clusterName').value == "") {
                        formNameInput.classList.add('is-invalid');
                        invalidFeedback.textContent = 'Please enter a cluster name.';
                    } else {
                        invalidFeedback.textContent = '';
                    }
                });
            }, false)
        })
    })()

});

function addCluster(form, nameInput) {
    const formData = new FormData(form);
    const formDataObject = {};
    const formNameInput = nameInput;
    const invalidFeedback = formNameInput.nextElementSibling;
    // Convert FormData to plain object
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    // Check if all values in formDataObject are not empty
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
                invalidFeedback.textContent = data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here
        });
}