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
    if (type != "member") {
        const div = document.getElementById("delete_" + id);
        div.addEventListener('click', function () {
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
        const div = document.getElementById("deleteButton");
        div.addEventListener('click', function () {
            if (document.getElementById("deleteConfirm").value == "DELETE") {
                let data = '/' + type + '/' + id + '/delete';
                fetch(data, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                    .then(response => {
                        if (response.ok) {
                            window.location.href = "/member";
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
