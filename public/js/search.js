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