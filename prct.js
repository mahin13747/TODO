const financeForm = document.getElementById('financeForm');
const financeBody = document.getElementById('financeBody');
const expenseChart = document.getElementById('expenseChart');
const monthlyBudgetInput = document.getElementById('monthlyBudget');
const setBudgetButton = document.getElementById('setBudget');
const budgetStatus = document.getElementById('budgetStatus');
const savingsSummary = document.getElementById('savingsSummary');

let entries = JSON.parse(localStorage.getItem('entries')) || [];
let monthlyBudget = localStorage.getItem('monthlyBudget') || 0;

function updateTable() {
    financeBody.innerHTML = '';
    entries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.category}</td>
            <td>${entry.amount}</td>
            <td><button onclick="deleteEntry(${index})">Delete</button></td> <!-- Delete button -->
        `;
        financeBody.appendChild(row);
    });
    calculateSavings();
    updateChart();
}

function deleteEntry(index) {
    entries.splice(index, 1); // Remove the entry at the specified index
    localStorage.setItem('entries', JSON.stringify(entries)); // Update local storage
    updateTable(); // Refresh the table
}

function calculateSavings() {
    const totalIncome = entries.filter(entry => entry.category === 'Income')
                                .reduce((acc, entry) => acc + parseFloat(entry.amount), 0);
    const totalExpenses = entries.filter(entry => entry.category !== 'Income')
                                  .reduce((acc, entry) => acc + parseFloat(entry.amount), 0);
    const savings = totalIncome - totalExpenses;
    savingsSummary.textContent = `Total Income: $${totalIncome.toFixed(2)}, Total Expenses: $${totalExpenses.toFixed(2)}, Savings: $${savings.toFixed(2)}`;
}

function updateChart() {
    const categoryTotals = entries.reduce((acc, entry) => {
        if (entry.category !== 'Income') {
            acc[entry.category] = (acc[entry.category] || 0) + parseFloat(entry.amount);
        }
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const chart = new Chart(expenseChart, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expense Distribution',
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }]
        },
        options: {
            responsive: true
        }
    });
}

financeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;

    entries.push({ amount, date, category });
    localStorage.setItem('entries', JSON.stringify(entries));
    updateTable();
    financeForm.reset();
});

setBudgetButton.addEventListener('click', () => {
    monthlyBudget = monthlyBudgetInput.value;
    localStorage.setItem('monthlyBudget', monthlyBudget);
    budgetStatus.textContent = `Monthly Budget Set: $${monthlyBudget}`;
    checkBudget();
});

function checkBudget() {
    const totalExpenses = entries.filter(entry => entry.category !== 'Income')
                                  .reduce((acc, entry) => acc + parseFloat(entry.amount), 0);
    if (totalExpenses > monthlyBudget) {
        budgetStatus.textContent += ' - You are overspending!';
    } else {
        budgetStatus.textContent += ' - You are within your budget.';
    }
}

// Initial setup
updateTable();
checkBudget();
