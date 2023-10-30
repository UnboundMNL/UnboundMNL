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

function search (partname){
    var searchButton = document.getElementById("button-addon2");
    searchButton.onclick = function(){
        var searchBar = document.getElementById("searchBar").value;
        if (partname=="cluster"){
            window.location.href= "/cluster/view/1?search="+searchBar;
        }
        if (partname=="Sub-Projects"){
            window.location.href = "/project/view/1?search="+searchBar;
        }
        if (partname=="SHG"){
            window.location.href = "/group/view/1?search="+searchBar;
        }
    }
    
}