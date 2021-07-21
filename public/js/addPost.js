const newPostFormHandler = async(e) => {
    // e.preventDefault();
    
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('content').value;

    if(title && content) {
        const response = await fetch(`/api/posts`, {
            method: 'POST',
            body: JSON.stringify({ title, content }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    
        if (response.ok) {
            document.location.replace('/dashboard');
            console.log('click')
        } else {
            alert(response.statusText);
        }

    }

};


document.getElementById('newPost').addEventListener('submit', newPostFormHandler);