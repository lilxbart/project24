const modal = document.getElementById('habit-modal');
const addHabitButton = document.getElementById('add-habit-button');
const closeButton = document.querySelector('.close-button');

addHabitButton.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

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

const habitsContainer = document.getElementById('habits-container');

habitsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-habit')) {
        event.target.closest('.habit').remove();
    }
});

habitsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('complete-habit')) {
        const habitElement = event.target.closest('.habit');
        habitElement.style.backgroundColor = '#a9dfbf';
    }
});

const submitHabitButton = document.getElementById('submit-habit');
submitHabitButton.addEventListener('click', () => {
    const habitName = document.getElementById('habit-name').value;
    const habitDescription = document.getElementById('habit-description').value;
    const reminder = document.getElementById('habit-reminder').checked;
    const time = document.getElementById('habit-time').value;

    if (habitName) {
        const newHabit = document.createElement('div');
        newHabit.classList.add('habit');
        
        const reminderText = reminder ? `Напоминание: ${time}` : 'Без напоминания';
        
        newHabit.innerHTML = `
            <button class="delete-habit">-</button>
            <span>${habitName}</span>
            <div class="habit-reminder">
                <p>${reminderText}</p>
                <p>Повторение: ${selectedDays.join(', ') || 'Нет'}</p>
            </div>
            <button class="complete-habit">+</button>
        `;

        habitsContainer.appendChild(newHabit);

        modal.style.display = 'none';

        document.getElementById('habit-name').value = '';
        document.getElementById('habit-description').value = '';
        document.getElementById('habit-reminder').checked = false;
        document.getElementById('habit-time').value = '10:00';
        selectedDays = [];
        recurrenceButtons.forEach(button => button.classList.remove('selected')); // Убираем выделение с кнопок
    } else {
        alert('Введите название привычки');
    }
});

function setCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    const today = new Date();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('ru-RU', options);

    currentDateElement.textContent = formattedDate;
}

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

function highlightCurrentDay() {
    const today = new Date();
    const calendarDays = document.querySelectorAll('.calendar .day');
    calendarDays[0].classList.add('active');
}

setCurrentDate();
updateCalendar();
highlightCurrentDay();
