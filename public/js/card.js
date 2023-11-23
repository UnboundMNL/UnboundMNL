function cardLink(type, id) {
    let data;
    const div = document.getElementById(id);
    div.addEventListener('click', function (event) {
        if (event.target.tagName.toLowerCase() === 'button') {
            return;
        }
        data = { id };
        const href = '/' + type;
        let fetchURL;
        if (type == "project") {
            fetchURL = '/clusterMiddle';
        }
        else if (type == "group") {
            fetchURL = '/projectMiddle';
        }
        else if (type == "member") {
            fetchURL = '/groupMiddle';
        }
        fetch(fetchURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = href;
                } else {
                    return response.json();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

function cardDelete(type, id) {
    if (type != "member" && type != "masterlist") {
        const button = document.getElementById("delete_" + id);
        button.addEventListener('click', function () {
            if (document.getElementById(id + "Confirm").value == "DELETE") {
                const data = '/' + type + '/' + id + '/delete';
                fetch(data, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => {
                        if (response.ok) {
                            window.location.reload();
                        } else {
                            throw new Error('Failed to fetch data');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });
    } else {
        const button = document.getElementById("deleteButton");
        button.addEventListener('click', function () {
            if (document.getElementById("deleteConfirm").value == "DELETE") {
                let href;
                let data;
                switch (type) {
                    case "masterlist":
                        href = "/masterlist";
                        data = '/member/' + id + '/delete';
                        break;
                    case "member":
                        href = "/member";
                        data = '/' + type + '/' + id + '/delete';
                        break;
                }
                fetch(data, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => {
                        if (response.ok) {
                            window.location.href = href;
                        } else {
                            throw new Error('Failed to fetch data');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });
    }

}

function linkMemberPage(id, className) {
    let data;
    const divs = document.querySelectorAll("." + className);
    divs.forEach(div => {
        div.addEventListener('click', function () {
            data = { id };

            const href = '/memberInfo';
            let fetchURL = 'memberMiddle';

            fetch(fetchURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.ok) {
                        window.location.href = href;
                    } else {
                        return response.json();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });

        });
    });
}

function displayExportMessage(e, name, id, type) {
    e.stopPropagation();
    name = name.replace(/[^a-zA-Z0-9]/g, '');
    if (name == ''){
        name= "export";
    }
    console.log(name)
    var toastEl = document.querySelector('.toast');
    if (toastEl) {
        var toastBodyEl = toastEl.querySelector('.toast-body');

        toastBodyEl.textContent = 'Exporting ' + name + '...';

        var toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
    let fetchLink, format;
    if (type === "All") {
        format = 'zip';
        fetchLink = `/exportAdminClusters?format=${format}`;
    } else if (type=="Cluster") {
        format = 'zip';
        // Handle exporting a specific cluster
        fetchLink = `/exportCluster/${id}?format=${format}`;
    } else if (type=="SHG") {
        format = 'xlsx';
        // Handle exporting a specific group
        fetchLink = `/exportGroup/${id}?format=${format}`;
    } else if (type=="Sub-Projects") {
        format = 'xlsx';
        // Handle exporting a specific project
        fetchLink = `/exportProject/${id}?format=${format}`;
    }
    fetch(fetchLink, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) {
            // Trigger download
            response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${name}.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            });
        } else {
            return response.json();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}




