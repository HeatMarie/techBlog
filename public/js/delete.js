const deletePostHandler = async(e) => {
    const id = e.target.getAttribute('data-id');
    const response = await fetch(`/api/posts/delete/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
};

document.getElementById('delete').addEventListener('click', deletePostHandler);