const newCommentFormHandler = async(e) => {
    e.preventDefault();
    
    const content = document.getElementById('newComment').value;
    const id = window.location.toString().split('/')[window.location.toString().split('/').length - 1];

    if(content) {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            body: JSON.stringify({ content, id }),
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


document.getElementById('newComment').addEventListener('submit', newCommentHandler);