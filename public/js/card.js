function cardLink(type,id){
    var data;
    const div = document.getElementById(id);
    div.addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'button') {
            return;
        }
        data={id};
        if (type=="project"){
            fetch('/clusterMiddle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/project";
                } else {
                    return response.json().then(data => {
                        // var errorDiv = document.getElementById("error");
                        // errorDiv.style.display="block";
                        // errorDiv.textContent=data.error;
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
            
        } else if (type == "group"){
            fetch('/projectMiddle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/group";
                } else {
                    return response.json().then(data => {
                        // var errorDiv = document.getElementById("error");
                        // errorDiv.style.display="block";
                        // errorDiv.textContent=data.error;
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
            
        } else if (type == "member"){

            fetch('/groupMiddle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = "/member";
                } else {
                    return response.json().then(data => {
                        // var errorDiv = document.getElementById("error");
                        // errorDiv.style.display="block";
                        // errorDiv.textContent=data.error;
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
            
        }
        
        
    });
}

function cardDelete(type, id){
    const div = document.getElementById("delete_"+id);
    div.addEventListener('click', function() {
        var data; 
        if (type=="cluster"){
            data='/cluster/'+id+'/delete';
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

        if (type=="project"){
            data='/project/'+id+'/delete';
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
        if (type=="SHG"){
            data='/group/'+id+'/delete';
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
}