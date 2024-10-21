// Получаем элементы
const toggleButton = document.getElementById('toggle-button');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const mainPageLink = document.getElementById('main-page-link');

// Добавляем обработчик событий на кнопку переключения
toggleButton.addEventListener('click', function () {
    // Если форма регистрации видима, переключаемся на форму входа
    if (!signupForm.classList.contains('hidden')) {
        signupForm.classList.add('hidden');
        signinForm.classList.remove('hidden');
        toggleButton.textContent = 'Switch to Sign Up';  // Меняем текст кнопки
    } else {
        // Если форма входа видима, переключаемся на форму регистрации
        signinForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        toggleButton.textContent = 'Switch to Sign In';  // Меняем текст кнопки
    }
});

// Обработка формы входа
signinForm.addEventListener('submit', function(e) {
    e.preventDefault();  // Отменяем стандартную отправку формы

    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    // Простая проверка полей
    if (username && password) {
        // Здесь можно сделать API-запрос на бэкенд для проверки данных
        console.log('Logged in as:', username);

        // Имитация перехода на главную страницу
        mainPageLink.click();  // Перенаправляем на главную страницу
    } else {
        alert('Please fill in all fields.');
    }
});
