function changeForm(action, partname){
    console.log(partname);
    if (partname=="cluster"){
        var form = document.getElementById("edit"+partname+"Form");
        form.action = "/cluster/"+action+"/edit";
    }
    if (partname=="Sub-Projects"){
        var form = document.getElementById("edit"+partname+"Form");
        form.action = "/project/"+action+"/edit";
    }
    if (partname=="SHG"){
        var form = document.getElementById("edit"+partname+"Form");
        form.action = "/group/"+action+"/edit";
    }
}
