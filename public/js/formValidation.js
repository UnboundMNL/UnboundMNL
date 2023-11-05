
    document.addEventListener('DOMContentLoaded', function() {
        (() => {
            'use strict'
        
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            const forms = document.querySelectorAll('.needs-validation')
        
            // Loop over them and prevent submission
            Array.from(forms).forEach(form => {
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

//none of this works lol

// document.addEventListener('DOMContentLoaded', function() {
//     (() => {
//         'use strict';
    
//         const forms = document.querySelectorAll('.needs-validation');
    
//         Array.from(forms).forEach(form => {
//             form.addEventListener('submit', async event => {
//                 if (!form.checkValidity()) {
//                     event.preventDefault();
//                     event.stopPropagation();
//                 } else {
//                     event.preventDefault();

//                     // Assuming you are using fetch for your form submission
//                     const formData = new FormData(form);
//                     const response = await fetch(form.action, {
                        
//                         method: form.method,
//                         body: formData,
//                     });

//                     // Check the response for errors
//                     if (response.ok) {
//                         form.classList.add('was-validated');
//                     } else {
//                         const data = await response.json();

//                         // Display the error message in an element with the "error" id
//                         const errorDiv = document.getElementById("error");
//                         errorDiv.style.display = "block";
//                         errorDiv.textContent = data.error;

//                         // Optionally, you can highlight the specific form elements with errors
//                         // For example, if your server returns field-specific errors:
//                         // Object.keys(data.fieldErrors).forEach(fieldName => {
//                         //     const field = form.elements[fieldName];
//                         //     const fieldError = data.fieldErrors[fieldName];
//                         //     const fieldErrorDiv = document.getElementById(`${fieldName}-error`);
//                         //     fieldErrorDiv.textContent = fieldError;
//                         //     field.classList.add('is-invalid');
//                         // });
//                     }
//                 }
//             }, false);
//         });
//     })();
// });



// document.addEventListener('DOMContentLoaded', function() {
//     (() => {
//         'use strict';

//         const forms = document.querySelectorAll('.needs-validation');
//         console.log(forms);

//         Array.from(forms).forEach(form => {
//             form.addEventListener('submit', async event => {
//                 console.log(form)
//                 if (!form.checkValidity()) {
//                     event.preventDefault();
//                     event.stopPropagation();
//                 } else {

//                     form.classList.add('was-validated')
//                     // Prevent the default form submission
//                 }
//             }, false);
//         });
//         form.addEventListener('submit', async event => {
//             event.preventDefault();
//         //const addAction = form.getAttribute('add'); // Get the action URL from data-action attribute

//                     // Assuming you are using fetch for your form submission
//                     const formData = new FormData(form);
//                     console.log("Form data:", formData);

//                     const response =fetch(addAction, { // Use addAction as the URL
//                         method: form.method,
//                         body: formData,
//                     });

//                     // Check the response for errors
//                     if (response.ok) {
//                         // Form submission was successful
//                         form.classList.add('was-validated');
//                     } else {
//                         // Form submission had errors
//                         const data = await response.json();
//                         const errorDiv = document.getElementById("error");
//                         errorDiv.style.display = "block";
//                         errorDiv.textContent = data.error;
//                     }
//                 }, false);

//     }
//     )();
// });

