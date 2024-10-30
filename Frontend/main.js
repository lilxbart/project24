// Открытие и закрытие модального окна
const modal = document.getElementById('habit-modal');
const addHabitButton = document.getElementById('add-habit-button');
const closeButton = document.querySelector('.close-button');

// Открываем модальное окно при нажатии на кнопку "Добавить привычку"
addHabitButton.addEventListener('click', () => {
    modal.style.display = 'flex'; // Показываем модальное окно
});

// Закрываем модальное окно при нажатии на крестик
closeButton.addEventListener('click', () => {
    modal.style.display = 'none'; // Скрываем модальное окно
});

// Закрываем модальное окно при клике вне его
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none'; // Закрываем модальное окно при клике вне окна
    }
});

// Логика для выбора дней недели
const recurrenceButtons = document.querySelectorAll('.habit-recurrence button');
let selectedDays = [];

// Добавляем обработчики для выбора дней недели
recurrenceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const day = button.textContent;

        // Если день уже выбран, убираем его
        if (selectedDays.includes(day)) {
            selectedDays = selectedDays.filter(selectedDay => selectedDay !== day);
            button.classList.remove('selected'); // Убираем выделение
        } else {
            // Добавляем день к выбранным
            selectedDays.push(day);
            button.classList.add('selected'); // Выделяем кнопку
        }
    });
});

// Делегирование событий для контейнера привычек
const habitsContainer = document.getElementById('habits-container');

// Удаление привычки
habitsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-habit')) {
        event.target.closest('.habit').remove(); // Удаляем привычку
    }
});

// Пометка привычки как выполненной
habitsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('complete-habit')) {
        const habitElement = event.target.closest('.habit');
        habitElement.style.backgroundColor = '#a9dfbf'; // Меняем цвет на зеленый
    }
});

// Добавление новой привычки через модальное окно
const submitHabitButton = document.getElementById('submit-habit');
submitHabitButton.addEventListener('click', () => {
    const habitName = document.getElementById('habit-name').value;
    const habitDescription = document.getElementById('habit-description').value;
    const reminder = document.getElementById('habit-reminder').checked;
    const time = document.getElementById('habit-time').value;

    if (habitName) {
        // Создаем новый элемент привычки
        const newHabit = document.createElement('div');
        newHabit.classList.add('habit');
        
        // Формируем блок с информацией о напоминании
        const reminderText = reminder ? `Напоминание: ${time}` : 'Без напоминания';
        
        // Добавляем новую привычку
        newHabit.innerHTML = `
            <button class="delete-habit">-</button>
            <span>${habitName}</span>
            <div class="habit-reminder">
                <p>${reminderText}</p>
                <p>Повторение: ${selectedDays.join(', ') || 'Нет'}</p>
            </div>
            <button class="complete-habit">+</button>
        `;

        // Добавляем новую привычку в контейнер
        habitsContainer.appendChild(newHabit);

        // Закрыть модальное окно
        modal.style.display = 'none';

        // Очищаем поля формы
        document.getElementById('habit-name').value = '';
        document.getElementById('habit-description').value = '';
        document.getElementById('habit-reminder').checked = false;
        document.getElementById('habit-time').value = '10:00';
        selectedDays = []; // Сбрасываем выбранные дни
        recurrenceButtons.forEach(button => button.classList.remove('selected')); // Убираем выделение с кнопок
    } else {
        alert('Введите название привычки');
    }
});

// Устанавливаем текущую дату в верхней панели
function setCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    const today = new Date();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('ru-RU', options);

    currentDateElement.textContent = formattedDate;
}

// Обновляем календарь и выделяем текущий день
function updateCalendar() {
    const today = new Date();
    const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    const calendarDays = document.querySelectorAll('.calendar .day');
    
    for (let i = 0; i < 7; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        
        const dayName = daysOfWeek[futureDate.getDay() === 0 ? 6 : futureDate.getDay() - 1];
        const day = futureDate.getDate().toString().padStart(2, '0');
        const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');

        calendarDays[i].innerHTML = `${dayName}<br><span>${day}.${month}</span>`;
    }
}

// Выделяем текущий день
function highlightCurrentDay() {
    const today = new Date();
    const calendarDays = document.querySelectorAll('.calendar .day');
    calendarDays[0].classList.add('active'); // Текущий день всегда первый в списке
}

// Вызываем функции для установки даты и обновления календаря при загрузке страницы
setCurrentDate();
updateCalendar();
highlightCurrentDay();
