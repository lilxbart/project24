const toggleButton = document.getElementById('toggle-button');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const mainPageLink = document.getElementById('main-page-link');

toggleButton.addEventListener('click', function () {
    if (!signupForm.classList.contains('hidden')) {
        signupForm.classList.add('hidden');
        signinForm.classList.remove('hidden');
        toggleButton.textContent = 'Перейти к регистрации';
    } else {
        signinForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        toggleButton.textContent = 'Перейти к входу в систему';
    }
});

signinForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    if (username && password) {
        console.log('Logged in as:', username);

        mainPageLink.click();
    } else {
        alert('Please fill in all fields.');
    }
});


async function registerUser(username, email, password) {
    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    return response.json();
}

async function loginUser(username, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}
