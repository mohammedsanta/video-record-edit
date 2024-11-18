document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authContainer = document.getElementById('auth-container');
    const signupContainer = document.getElementById('signup-container');
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const newUsernameInput = document.getElementById('new-username');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    // Handle Sign Up Form Submission
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = newUsernameInput.value.trim();
        const password = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Basic validation for sign-up
        if (!username || !password || !confirmPassword) {
            alert('All fields are required!');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        console.log('Signing up with:', username, password);
        alert('Sign-up successful!');
    });

    // Toggle to Sign Up form
    const signupBtn = document.getElementById('signup-btn');
    signupBtn.addEventListener('click', function() {
        authContainer.style.display = 'none';  // Hide login form
        signupContainer.style.display = 'block'; // Show sign-up form
    });

    // Toggle back to Login form
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', function() {
        signupContainer.style.display = 'none';  // Hide sign-up form
        authContainer.style.display = 'block'; // Show login form
    });
});
// signupBtn.addEventListener('click', function() {
//     authContainer.classList.add('hidden');
//     signupContainer.classList.add('visible');
// });

// loginBtn.addEventListener('click', function() {
//     signupContainer.classList.remove('visible');
//     authContainer.classList.remove('hidden');
// });
