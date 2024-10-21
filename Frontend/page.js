document.getElementById('habit-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const habitInput = document.getElementById('habit-input');
    const habitList = document.getElementById('habit-list');
    
    const newHabit = document.createElement('li');
    newHabit.textContent = habitInput.value;
    
    habitList.appendChild(newHabit);
    
    habitInput.value = '';  // Очищаем поле ввода
});
