function changeForm(action, partname){
    var form = document.getElementById("edit"+partname+"Form");
    form.action = "/cluster/"+action+"/edit";
}
