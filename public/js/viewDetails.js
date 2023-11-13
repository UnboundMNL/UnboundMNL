document.addEventListener('DOMContentLoaded', function () {
    const toggleButtons = document.querySelectorAll('.toggle-details');
    toggleButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const targetId = button.getAttribute('data-target');
            const additionalInfo = document.getElementById(targetId);
            additionalInfo.classList.toggle('d-none');
        });
    });
});
