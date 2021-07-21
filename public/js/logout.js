const logout = async () => {
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if(response.ok) {
        document.location.replace('/homepage')
    } else {
        console.log(response)
        alert(response.statusText);
    }
};

document.getElementById('logout').addEventListener('click', logout);