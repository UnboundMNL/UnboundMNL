function changeForm(action, partname) {
    let form;
    if (partname == "cluster") {
        form = document.getElementById("edit" + partname + "Form");
        form.action = "/cluster/" + action + "/edit";
    }
    if (partname == "Sub-Projects") {
        form = document.getElementById("edit" + partname + "Form");
        form.action = "/project/" + action + "/edit";
    }
    if (partname == "SHG") {
        form = document.getElementById("edit" + partname + "Form");
        form.action = "/group/" + action + "/edit";
    }
}

function search(partname) {
    const searchButton = document.getElementById("button-addon2");
    searchButton.onclick = function () {
        const searchBar = document.getElementById("searchBar").value;
        if (partname == "cluster") {
            window.location.href = "/cluster/view/1?search=" + searchBar;
        }
        if (partname == "Sub-Projects") {
            window.location.href = "/project/view/1?search=" + searchBar;
        }
        if (partname == "SHG") {
            window.location.href = "/group/view/1?search=" + searchBar;
        }
    }
}