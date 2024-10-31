// Uložení stavu checkboxů do místního úložiště
function saveCheckboxes() {
    const supplements = ['creatine', 'protein', 'testosterone', 'zinc_calcium_magnesium', 'vitamin_c', 'vitamin_d'];
    supplements.forEach(id => {
        localStorage.setItem(id, document.getElementById(id).checked);
    });
}

// Načtení stavu checkboxů z místního úložiště při načtení stránky
function loadCheckboxes() {
    const supplements = ['creatine', 'protein', 'testosterone', 'zinc_calcium_magnesium', 'vitamin_c', 'vitamin_d'];
    supplements.forEach(id => {
        document.getElementById(id).checked = JSON.parse(localStorage.getItem(id)) || false;
        updateCardStyle(id);
    });
}

// Funkce na změnu stylu karty podle stavu checkboxu
function updateCardStyle(id) {
    const checkbox = document.getElementById(id);
    const card = checkbox.closest('.supplement');
    if (checkbox.checked) {
        card.classList.add('checked');
    } else {
        card.classList.remove('checked');
    }
}

// Přepínání splněných dnů v kalendáři
function toggleCompletionForDate(dateStr) {
    let completedDays = JSON.parse(localStorage.getItem('completedDays')) || [];
    if (completedDays.includes(dateStr)) {
        completedDays = completedDays.filter(day => day !== dateStr);
    } else {
        completedDays.push(dateStr);
    }
    localStorage.setItem('completedDays', JSON.stringify(completedDays));
}

// Automatické označení dnešního dne jako splněného, pokud jsou všechny doplňky zaškrtnuté
function checkAllSupplementsCompleted() {
    const supplements = ['creatine', 'protein', 'testosterone', 'zinc_calcium_magnesium', 'vitamin_c', 'vitamin_d'];
    const allChecked = supplements.every(id => document.getElementById(id).checked);

    if (allChecked) {
        const today = new Date().toISOString().slice(0, 10);
        let completedDays = JSON.parse(localStorage.getItem('completedDays')) || [];

        // Přidat dnešní den do splněných, pokud tam ještě není
        if (!completedDays.includes(today)) {
            completedDays.push(today);
            localStorage.setItem('completedDays', JSON.stringify(completedDays));
            updateCalendar(); // Aktualizace kalendáře pro zobrazení změn
        }
    }
}

// Aktualizace kalendáře
function updateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Vyčistí kalendář
    const completedDays = JSON.parse(localStorage.getItem('completedDays')) || [];

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    // Název měsíce
    const monthName = today.toLocaleString('default', { month: 'long' });
    calendar.innerHTML += `<h3>${monthName} ${year}</h3>`;

    // Dny v měsíci
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isCompleted = completedDays.includes(dateStr);

        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        if (isCompleted) {
            dayElement.classList.add('completed');
        }
        dayElement.innerText = day;

        // Přepínání stavu dne při kliknutí
        dayElement.addEventListener('click', () => {
            toggleCompletionForDate(dateStr);
            updateCalendar();
        });

        calendar.appendChild(dayElement);
    }
}

// Načtení stavu checkboxů a kalendáře při načtení stránky
window.onload = function() {
    loadCheckboxes();
    updateCalendar();

    document.querySelectorAll('.supplement').forEach(card => {
        card.addEventListener('click', () => {
            const checkbox = card.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            saveCheckboxes();
            updateCardStyle(checkbox.id);
            checkAllSupplementsCompleted(); // Kontrola, zda jsou všechny karty zaškrtnuté
        });
    });
}
