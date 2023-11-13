
document.addEventListener('DOMContentLoaded', function () {
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
});