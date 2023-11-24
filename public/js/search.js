function search(partname) {
    const searchButton = document.getElementById("button-addon2");
    searchButton.onclick = function () {
        const searchBar = document.getElementById("searchBar").value;
        if (partname == "Cluster") {
            window.location.href = "/cluster/view/1?search=" + searchBar;
        }
        if (partname == "Sub-Projects") {
            window.location.href = "/project/view/1?search=" + searchBar;
        }
        if (partname == "SHG") {
            window.location.href = "/group/view/1?search=" + searchBar;
        }
    }
    const searchBar = document.getElementById("searchBar");
    searchBar.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {

            const searchBarValue = document.getElementById("searchBar").value;
            if (partname == "Cluster") {
                window.location.href = "/cluster/view/1?search=" + searchBarValue;
            }
            if (partname == "Sub-Projects") {
                window.location.href = "/project/view/1?search=" + searchBarValue;
            }
            if (partname == "SHG") {
                window.location.href = "/group/view/1?search=" + searchBarValue;
            }
        }
    });
}