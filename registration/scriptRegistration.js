const JWT_SECRET = "your-secret-key-here";

document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('auth-modal');
    const authCloseBtn = document.querySelector('.auth-close-button');

    // Password toggles
    document.getElementById('reg-show-password').addEventListener('change', function() {
        document.getElementById('reg-password').type = this.checked ? 'text' : 'password';
    });

    document.getElementById('login-show-password').addEventListener('change', function() {
        document.getElementById('login-password').type = this.checked ? 'text' : 'password';
    });

    // Auth state management
    const checkAuth = () => localStorage.getItem('currentUser');

    const updateAuthState = () => {
        const isLoggedIn = checkAuth();
        const headerRegisterBtn = document.getElementById('header-register-btn');
        const headerLogoutBtn = document.getElementById('header-logout-btn');
        const welcomeMessage = document.getElementById('welcome-message');
        const userInfo = document.getElementById('user-info');

        headerRegisterBtn.style.display = isLoggedIn ? 'none' : 'block';
        headerLogoutBtn.style.display = isLoggedIn ? 'block' : 'none';
        userInfo.style.display = isLoggedIn ? 'flex' : 'none';

        if (isLoggedIn) {
            const payload = KJUR.jws.JWS.parse(isLoggedIn).payloadObj;
            welcomeMessage.textContent = `${payload.username}`;
        }
    };

    // Modal controls
    const showAuthModal = () => {
        authModal.classList.remove('hidden');
        authModal.classList.add('active');
        showAuthPage('auth-choices');
        resetForms();
    };

    const closeAuthModal = () => {
        authModal.classList.remove('active');
        authModal.classList.add('hidden');
        resetForms();
    };

    const showAuthPage = (pageId) => {
        document.querySelectorAll('.auth-page').forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
    };

    const resetForms = () => {
        document.getElementById('reg-username').value = '';
        document.getElementById('reg-password').value = '';
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('reg-error').textContent = '';
        document.getElementById('login-error').textContent = '';
    };

    // Event listeners
    document.getElementById('header-register-btn').addEventListener('click', showAuthModal);
    authCloseBtn.addEventListener('click', closeAuthModal);
    window.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAuthModal();
    });

    document.querySelectorAll('.auth-back-btn').forEach(btn => {
        btn.addEventListener('click', () => showAuthPage('auth-choices'));
    });

    document.getElementById('modal-register-btn').addEventListener('click', () => showAuthPage('register-form'));
    document.getElementById('modal-login-btn').addEventListener('click', () => showAuthPage('login-form'));

    // Registration form
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const errorElement = document.getElementById('reg-error');

        if (!/^[a-zA-Z0-9]{1,32}$/.test(username) || !/^[a-zA-Z0-9]{1,32}$/.test(password)) {
            errorElement.textContent = 'Имя и пароль должны содержать 1-32 латинских букв или цифр';
            return;
        }

        if (localStorage.getItem(username)) {
            errorElement.textContent = 'Это имя уже занято';
            return;
        }

        const token = KJUR.jws.JWS.sign(null, {alg: 'HS256'}, {
            username: username,
            password: password,
            exp: KJUR.jws.IntDate.get('now + 1hour')
        }, JWT_SECRET);

        localStorage.setItem(username, token);
        alert('Регистрация успешна! Войдите в систему.');
        showAuthPage('login-form');
        document.getElementById('login-username').value = username;
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorElement = document.getElementById('login-error');
        const token = localStorage.getItem(username);

        if (!token) {
            errorElement.textContent = 'Пользователь не найден';
            return;
        }

        try {
            const isValid = KJUR.jws.JWS.verifyJWT(token, JWT_SECRET, {alg: ['HS256']});
            const payload = KJUR.jws.JWS.parse(token).payloadObj;

            if (!isValid || payload.password !== password) {
                throw new Error('Invalid credentials');
            }

            localStorage.setItem('currentUser', token);
            updateAuthState();
            alert('Вход выполнен!');
            closeAuthModal();
        } catch (error) {
            errorElement.textContent = 'Неверные данные для входа';
        }
    });

    // Logout handler
    document.getElementById('header-logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        updateAuthState();
        alert('Вы вышли из системы');
    });

    // Initial setup
    updateAuthState();
});