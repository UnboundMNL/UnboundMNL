function resetForm() {
    const forms = document.querySelectorAll('.needs-validation'); // Fetch all the forms we want to apply custom Bootstrap validation styles to
    Array.from(forms).forEach(form => { // Loop over them and prevent submission
        form.classList.remove('was-validated');

        // Remove 'was-validated' class from all input elements
        const allInputs = form.querySelectorAll('input, textarea, select');
        Array.from(allInputs).forEach(input => {
            input.classList.remove('was-validated');
        });
    });
}

function validateForm() {
    (() => {
        'use strict'
        const forms = document.querySelectorAll('.needs-validation'); // Fetch all the forms we want to apply custom Bootstrap validation styles to
        Array.from(forms).forEach(form => { // Loop over them and prevent submission
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
    })()
}