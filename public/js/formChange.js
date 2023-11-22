function changeForm(action, partname) {
    let route;
    if (partname == "Cluster") {
        route = "/cluster/" + action + "/edit";
        (() => {
            'use strict'
            const forms = document.querySelectorAll('.needs-validation.editForm'); // Fetch all the forms we want to apply custom Bootstrap validation styles to
            Array.from(forms).forEach(form => { // Loop over them and prevent submission
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        editCluster(event.target, form.name);
                    }
                    event.preventDefault();
                    form.classList.add('was-validated');
                    document.getElementById('editClusterName').addEventListener('input', event => {
                        const formNameInput = event.target;
                        const invalidFeedback = formNameInput.nextElementSibling;
                        formNameInput.setCustomValidity('');
                        formNameInput.classList.remove('is-invalid');
                        formNameInput.classList.remove('is-valid');
                        if (document.getElementById('editClusterName').value == "") {
                            formNameInput.classList.add('is-invalid');
                            invalidFeedback.textContent = 'Please enter a cluster name.';
                        } else {
                            invalidFeedback.textContent = '';
                        }
                    });
                }, false)
            })
        })()
        function editCluster(form, nameInput) {
            const formData = new FormData(form);
            const formDataObject = {};
            const formNameInput = nameInput;
            const invalidFeedback = formNameInput.nextElementSibling;
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });
            fetch(route, {
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
                });
        }
    }
    if (partname == "Sub-Projects") {
        route = "/project/" + action + "/edit";
        (() => {
            'use strict'
            const forms = document.querySelectorAll('.needs-validation.editForm'); // Fetch all the forms we want to apply custom Bootstrap validation styles to
            Array.from(forms).forEach(form => { // Loop over them and prevent submission
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        editProject(event.target, form.name);
                    }
                    event.preventDefault();
                    form.classList.add('was-validated');
                    document.getElementById('editProjectName').addEventListener('input', event => {
                        const formNameInput = event.target;
                        const invalidFeedback = formNameInput.nextElementSibling;
                        formNameInput.setCustomValidity('');
                        formNameInput.classList.remove('is-invalid');
                        formNameInput.classList.remove('is-valid');
                        if (document.getElementById('editProjectName').value == "") {
                            formNameInput.classList.add('is-invalid');
                            invalidFeedback.textContent = 'Please enter a sub-project name.';
                        } else {
                            invalidFeedback.textContent = '';
                        }
                    });
                }, false)
            })
        })()

        function editProject(form, nameInput) {
            const formData = new FormData(form);
            const formDataObject = {};
            const formNameInput = nameInput;
            const invalidFeedback = formNameInput.nextElementSibling;

            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });

            fetch(route, {
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
                });

        }
    }
    if (partname == "SHG") {
        route = "/group/" + action + "/edit";
        (() => {
            'use strict'
            const forms = document.querySelectorAll('.needs-validation.editForm'); // Fetch all the forms we want to apply custom Bootstrap validation styles to
            Array.from(forms).forEach(form => { // Loop over them and prevent submission
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        editGroup(event.target, form.name);
                    }
                    event.preventDefault();
                    form.classList.add('was-validated');
                    document.getElementById('editSHGName').addEventListener('input', event => {
                        const formNameInput = event.target;
                        const invalidFeedback = formNameInput.nextElementSibling;
                        formNameInput.setCustomValidity('');
                        formNameInput.classList.remove('is-invalid');
                        formNameInput.classList.remove('is-valid');
                        if (document.getElementById('editSHGName').value == "") {
                            formNameInput.classList.add('is-invalid');
                            invalidFeedback.textContent = 'Please enter a SHG name.';
                        } else {
                            invalidFeedback.textContent = '';
                        }
                    });
                }, false)
            })
        })()
        function editGroup(form, nameInput) {
            const formData = new FormData(form);
            const formDataObject = {};
            const formNameInput = nameInput;
            const invalidFeedback = formNameInput.nextElementSibling;
            // Convert FormData to plain object
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });
            // Check if all values in formDataObject are not empty
            fetch(route, {
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
    }
    if (partname == "EditUser") {
        route = "/account/" + action + "/edit";
    
        (() => {
            'use strict';
    
            const forms = document.querySelectorAll('.needs-validation.editForm');
    
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        editUser(event.target);
                    }
    
                    event.preventDefault();
                    form.classList.add('was-validated');
                }, false);
            });
        })();
    
        function editUser(form) {
            const formData = new FormData(form);
            const formDataObject = {};
            const usernameInput = form.querySelector('[name="name"]');
            const invalidFeedback = usernameInput.nextElementSibling;
    
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });
    
            fetch(route, {
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
                        usernameInput.setCustomValidity('Invalid field.');
                        usernameInput.classList.add('is-invalid');
                        usernameInput.classList.remove('is-valid');
                        invalidFeedback.textContent = data.error;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }    
}