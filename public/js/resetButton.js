function ResetAll(){
    // for each form field, remove is-valid and is-invalid classes
    const form = document.querySelector('.needs-validation');
    const formFields = form.querySelectorAll('.form-control');
    formFields.forEach(field => {
        field.classList.remove('is-valid', 'is-invalid');
    });
    form.classList.remove('was-validated');

    form.reset();
}