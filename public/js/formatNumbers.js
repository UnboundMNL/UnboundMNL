document.addEventListener('DOMContentLoaded', function () {
    let x = document.querySelectorAll(".format-number");
    for (let i = 0, len = x.length; i < len; i++) {
        let num = Number(x[i].innerHTML).toLocaleString('en');
        x[i].innerHTML = num;
        x[i].classList.add("currSign");
    }
});
