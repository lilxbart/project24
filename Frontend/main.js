const modal = document.getElementById('habit-modal');
const addHabitButton = document.getElementById('add-habit-button');
const closeButton = document.querySelector('.close-button');
const submitHabitButton = document.getElementById('submit-habit');
const habitsContainer = document.getElementById('habits-container');
let selectedDate = null;
let habitsData = {};

addHabitButton.addEventListener('click', () => {
    if (selectedDate) {
        modal.style.display = 'flex';
    } else {
        alert("Пожалуйста, выберите дату, прежде чем добавлять привычку.");
    }
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

//логика выбора дней для повторения привычек
const recurrenceButtons = document.querySelectorAll('.habit-recurrence button');
let selectedDays = [];

recurrenceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const day = button.textContent;

        if (selectedDays.includes(day)) {
            selectedDays = selectedDays.filter(selectedDay => selectedDay !== day);
            button.classList.remove('selected');
        } else {
            selectedDays.push(day);
            button.classList.add('selected');
        }
    });
});


//текущей даты в заголовке
function setCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    const today = new Date();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('ru-RU', options);

    currentDateElement.textContent = formattedDate;
}

setCurrentDate();
updateCalendar();

//создание календаря
function updateCalendar() {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = '';

    const today = new Date();
    const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

    for (let i = 30; i > 0; i--) {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - i);

        const dayElement = createDayElement(pastDate, daysOfWeek);
        calendarContainer.appendChild(dayElement);
    }

    const todayElement = createDayElement(today, daysOfWeek, true);
    calendarContainer.appendChild(todayElement);

    for (let i = 1; i <= 30; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);

        const dayElement = createDayElement(futureDate, daysOfWeek);
        calendarContainer.appendChild(dayElement);
    }

    todayElement.scrollIntoView({ inline: 'center', behavior: 'smooth' });
}

//создание элемента дня
function createDayElement(date, daysOfWeek, isToday = false) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    if (isToday) dayElement.classList.add('active');

    const dayName = daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    dayElement.setAttribute('data-date', date.toISOString().split('T')[0]);
    dayElement.innerHTML = `
        <div class="day-header">${dayName}<br><span>${day}.${month}</span></div>
    `;

    dayElement.addEventListener('click', () => {
        selectedDate = dayElement.getAttribute('data-date');
        document.querySelectorAll('.day').forEach(d => d.classList.remove('selected'));
        dayElement.classList.add('selected');
        displayHabitsForSelectedDate();
    });

    return dayElement;
}



//Функция для отображения привычек на выбранную дату
function displayHabitsForSelectedDate() {
    habitsContainer.innerHTML = '';

    const habitsForDate = habitsData[selectedDate] || [];

    habitsForDate.forEach((habit) => {
        const habitElement = document.createElement('div');
        habitElement.classList.add('habit');

        habitElement.innerHTML = `
            <button class="delete-habit" data-id="${habit.id}">-</button>
            <span>${habit.name}</span>
            <div class="habit-reminder">
                <p>${habit.reminderText}</p>
                <p>Повторение: ${habit.recurrence}</p>
            </div>
            <button class="complete-habit">+</button>
        `;

        //обработчик кнопки удаления
        habitElement.querySelector('.delete-habit').addEventListener('click', (e) => {
            const habitId = e.target.getAttribute('data-id');
            confirmHabitDeletion(habitId, habit.name);
        });
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate === today) {
            habitElement.querySelector('.complete-habit').addEventListener('click', () => {
                markHabitAsCompleted(habit.id, habitElement);
            });
        } else {
            habitElement.querySelector('.complete-habit').disabled = true; // Отключаем кнопку для других дней
        }

        habitsContainer.appendChild(habitElement);
    });
}

//для подтверждения удаления привычки
function confirmHabitDeletion(habitId, habitName) {
    if (confirm(`Вы уверены, что хотите удалить привычку "${habitName}"?`)) {
        deleteHabitFromServer(habitId); // Вызываем удаление на сервере после подтверждения
    }
}

//для удаления привычки на сервере
async function deleteHabitFromServer(habitId) {
    try {
        const response = await fetch(`/api/habits/${habitId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (data.success) {
            alert('Привычка успешно удалена');
            displayHabitsForSelectedDate();
        } else {
            alert('Ошибка при удалении привычки');
        }
    } catch (error) {
        console.error("Ошибка при удалении привычки:", error);
    }
}




//ПРИВЫЧКИ
//для сбора данных привычки из полей формы
function getHabitFromForm() {
    const habitName = document.getElementById('habit-name').value;
    const habitDescription = document.getElementById('habit-description').value;
    const reminder = document.getElementById('habit-reminder').checked;
    const time = document.getElementById('habit-time').value;
    const recurrence = selectedDays.join(', ') || 'Нет';

    return {
        username: localStorage.getItem('username'),//замена на реальное имя, если из БД
        habit_name: habitName,
        description: habitDescription,
        reminder_text: reminder ? `Напоминание: ${time}` : 'Без напоминания',
        recurrence: recurrence
    };
}
//очистка формы привычки
function resetHabitForm() {
    document.getElementById('habit-name').value = '';
    document.getElementById('habit-description').value = '';
    document.getElementById('habit-reminder').checked = false;
    document.getElementById('habit-time').value = '10:00';
    selectedDays = [];
    recurrenceButtons.forEach(button => button.classList.remove('selected'));
}
//привычки на сервере
async function saveHabit(habit) {
    try {
        const response = await fetch('/api/habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habit)
        });

        const data = await response.json();
        if (data.success) {
            alert('Привычка успешно сохранена');
        } else {
            alert('Ошибка при сохранении привычки');
        }
    } catch (error) {
        console.error("Ошибка при отправке привычки:", error);
    }
}
//на конкретную дату
function addHabitForDate(date, habit) {
    const dateStr = date.toISOString().split('T')[0];
    if (!habitsData[dateStr]) {
        habitsData[dateStr] = [];
    }
    habitsData[dateStr].push(habit);
}
//с учетом повторений
function addHabitWithRecurrence(habit) {
    const startDate = new Date(selectedDate);
    const recurrenceDays = selectedDays;

    for (let i = 0; i < 365; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        if (recurrenceDays.includes("КАЖДЫЙ ДЕНЬ")) {
            addHabitForDate(currentDate, habit);
        } else {
            const dayOfWeek = currentDate.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase();
            if (recurrenceDays.includes(dayOfWeek)) {
                addHabitForDate(currentDate, habit);
            }
        }
    }
}
//добавления привычки
submitHabitButton.addEventListener('click', () => {
    if (!selectedDate) {
        alert('Пожалуйста, выберите день и введите название привычки');
        return;
    }

    const newHabit = getHabitFromForm();
    addHabitWithRecurrence(newHabit);
    saveHabit(newHabit);  //на сервер

    displayHabitsForSelectedDate();

    modal.style.display = 'none';
    resetHabitForm();
});





async function loadUserData() {
    try {
        //получения данных пользователя
        const response = await fetch('/api/user-data');
        if (!response.ok) throw new Error('Ошибка получения данных с сервера');

        const data = await response.json();

        if (data.username) {
            document.getElementById('username-display').textContent = `Привет, ${data.username}`;
            document.getElementById('progress-display').textContent = `Твой прогресс: ${data.progressDays || 0} дней`;
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
document.addEventListener('DOMContentLoaded', loadUserData);


