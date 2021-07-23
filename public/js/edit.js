console.log("Hi there ;)")

const editFormHandler = async (e) => {
    e.preventDefault();
console.log("click")
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('content').value;
    console.log('title', title);
    console.log('content', content);

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];


    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title,
            content
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok){
        document.location.replace('/dashboard')
    } else {
        alert(response.statusText);
    }
}

document.getElementById('edit').addEventListener('click', editFormHandler)



