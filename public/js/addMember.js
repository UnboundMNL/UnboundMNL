document.addEventListener('DOMContentLoaded', function () {
    (() => {
        'use strict'
        const forms = document.querySelectorAll('.needs-validation.addForm'); // Fetch all the forms we want to apply custom Bootstrap validation styles to
        Array.from(forms).forEach(form => { // Loop over them and prevent submission
            form.addEventListener('submit', event => {
                checkDateValidity()
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    addMember(event.target);
                }
                event.preventDefault();
                form.classList.add('was-validated');
                document.getElementById('orgId').addEventListener('input', event => {
                    const formNameInput = event.target;
                    const invalidFeedback = formNameInput.nextElementSibling;
                    formNameInput.setCustomValidity('');
                    formNameInput.classList.remove('is-invalid');
                    formNameInput.classList.remove('is-valid');
                    if (document.getElementById('orgId').value == "") {
                        formNameInput.classList.add('is-invalid');
                        invalidFeedback.textContent = 'ID required.';
                    } else {
                        invalidFeedback.textContent = '';
                    }
                });
                document.getElementById('orgId').addEventListener('input', event => {
                    const formNameInput = event.target;
                    const invalidFeedback = formNameInput.nextElementSibling;
                    formNameInput.setCustomValidity('');
                    formNameInput.classList.remove('is-invalid');
                    formNameInput.classList.remove('is-valid');
                    if (document.getElementById('orgId').value == "") {
                        formNameInput.classList.add('is-invalid');
                        invalidFeedback.textContent = 'ID required.';
                    } else {
                        invalidFeedback.textContent = '';
                    }
                });
            }, false)
        })
    })()

});

function addMember(form) {
    const formData = new FormData(form);
    const formDataObject = {};
    const formNameInput =  document.getElementById('orgId');
    const invalidFeedback = formNameInput.nextElementSibling;

    // Convert FormData to plain object
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    // Check if all values in formDataObject are not empty
    fetch('/newMember', {
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


function checkDateValidity() {
    var birthdateInput = document.getElementById("birthdate");
    const invalidFeedback = birthdateInput.nextElementSibling;
    if (birthdateInput.validity.valueMissing) {
        invalidFeedback.textContent = "Birthday is required.";
    } else if (birthdateInput.validity.rangeUnderflow) {
        invalidFeedback.textContent = "Please select a date on or after January 1, 1900.";
    } else if (birthdateInput.validity.rangeOverflow) {
        invalidFeedback.textContent = "Please select a date on or before December 31, 2200.";
    } else {
        invalidFeedback.textContent = ""; // Clear the error message
    }

    birthdateInput.addEventListener('input', event => {
        const formNameInput = event.target;
        const invalidFeedback = formNameInput.nextElementSibling;
        formNameInput.setCustomValidity('');
        formNameInput.classList.remove('is-invalid');
        formNameInput.classList.remove('is-valid');
        const birthdateInput=document.getElementById('birthdate');
        if (birthdateInput.validity.valueMissing) {
            formNameInput.classList.add('is-invalid');
            invalidFeedback.textContent = 'Birthday is required.';
        } else if (birthdateInput.validity.rangeUnderflow) {
            invalidFeedback.textContent = "Please select a date on or after January 1, 1900.";
        } else if (birthdateInput.validity.rangeOverflow) {
            invalidFeedback.textContent = "Please select a date on or before December 31, 2200.";
        } else {
            invalidFeedback.textContent = ""; // Clear the error message
        }
    });
}
