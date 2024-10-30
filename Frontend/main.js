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

//отображение привычек для выбранной даты
function displayHabitsForSelectedDate() {
    habitsContainer.innerHTML = '';

    const habitsForDate = habitsData[selectedDate] || [];

    habitsForDate.forEach(habit => {
        const habitElement = document.createElement('div');
        habitElement.classList.add('habit');
        habitElement.innerHTML = `
            <button class="delete-habit">-</button>
            <span>${habit.name}</span>
            <div class="habit-reminder">
                <p>${habit.reminderText}</p>
                <p>Повторение: ${habit.recurrence}</p>
            </div>
            <button class="complete-habit">+</button>
        `;
        habitsContainer.appendChild(habitElement);
    });
}

//добавление привычки в выбранный день
submitHabitButton.addEventListener('click', () => {
    const habitName = document.getElementById('habit-name').value;
    const habitDescription = document.getElementById('habit-description').value;
    const reminder = document.getElementById('habit-reminder').checked;
    const time = document.getElementById('habit-time').value;

    if (habitName && selectedDate) {
        const reminderText = reminder ? `Напоминание: ${time}` : 'Без напоминания';

        const newHabit = {
            name: habitName,
            description: habitDescription,
            reminderText: reminderText,
            recurrence: selectedDays.join(', ') || 'Нет'
        };

        addHabitWithRecurrence(newHabit);
        displayHabitsForSelectedDate();

        modal.style.display = 'none';
        document.getElementById('habit-name').value = '';
        document.getElementById('habit-description').value = '';
        document.getElementById('habit-reminder').checked = false;
        document.getElementById('habit-time').value = '10:00';
        selectedDays = [];
        recurrenceButtons.forEach(button => button.classList.remove('selected'));
    } else {
        alert('Пожалуйста, выберите день и введите название привычки');
    }
});


//добавление привычки на конкретную дату
function addHabitForDate(date, habit) {
    const dateStr = date.toISOString().split('T')[0];
    if (!habitsData[dateStr]) {
        habitsData[dateStr] = [];
    }
    habitsData[dateStr].push(habit);
}

//добавление привычек с учётом повторений
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
