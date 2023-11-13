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