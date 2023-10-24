function cardLink(type,id){
    const div = document.getElementById(id);
    div.addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'button') {
            return;
        }
        const newUrl = "/"+type+'/'+id+'/view/1'; 
        window.location.href = newUrl;
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