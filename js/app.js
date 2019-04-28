class UI {
  constructor() {

    //Budget Form
    this.budgetForm = document.querySelector('.budget-form')
    this.budgetFeedback = document.querySelector('#budget-feedback');
    this.expenseFeedback = document.querySelector('#expense-feedback');
    this.budgetInput = document.querySelector('#budget-input');
    this.calculateBudget = document.querySelector('#calc-budget');
    this.budgetBalance = document.querySelector('#budget-balance');

    //Feedback Area
    this.budgetAmount = document.querySelector('#budget-amount');
    this.expenseTotal = document.querySelector('#expense-total');

    // Expense Form
    this.expenseForm = document.querySelector('.expense-form');
    this.expenseName = document.querySelector('#expense-name');
    this.expenseAmount = document.querySelector('#expense-amount');
    this.expenseTable = document.querySelector('.expense-table');
    this.trashButtons = document.querySelectorAll('.fa-trash');

    //Global Variabales
    this._budget = 0;
    this._totalExpenses = 0;
    this._budgetBalance = 0;
    this._expenses = [];

  }
}

let budget = new UI();

function validateIsNumber(input, errorDiv) {
  if (isNaN(input) || input < 0 || input === "") {
    errorDiv.innerHTML = `${input} is not a valid number`;
    errorDiv.classList.remove('hidden');
    return false;
  } else {
    errorDiv.classList.add('hidden');
    return true;
  }

}

function calcBudget() {
  
  budget._totalExpenses = budget._expenses.reduce((acc, current) => {
    return acc + parseFloat(current.expenseAmount); 
  }, 0);
  budget._budgetBalance = budget._budget - budget._totalExpenses;
  

  // Updating page
  budget.budgetBalance.innerHTML = "£" + budget._budgetBalance;
  budget.expenseTotal.innerHTML = "£" + budget._totalExpenses;


  //Add conditional formating to budget area for +ve/-ve numbers
  if (budget._budget > 0) {
    budget.budgetBalance.classList.add('positive');
  } else if (budget._budget < 0) {
    budget.budgetBalance.classList.add('negative');
  } else {
    budget.budgetBalance.classList.remove('negative');
    budget.budgetBalance.classList.remove('positive');
  }

}

function setBudget() {

  //Run if valid input given
  if (validateIsNumber(budget.budgetInput.value, budget.budgetFeedback)) {

    //Set Update page and calculate budget balance
    budget._budget = parseFloat(budget.budgetInput.value);
    budget.budgetAmount.innerHTML = "£" + budget._budget;
    calcBudget();
    budget.budgetInput.value = "";

  }
}

function createThreeColTableRow(col1, col2) {
  let tableRow = document.createElement('tr');
  tableRow.setAttribute(`data-expense-name`, `${col1}`);
  tableRow.setAttribute(`data-expense-amount`, `${col2}`);
  tableRow.innerHTML = `<td>${col1}</td><td>${col2}</td><td><i class="far fa-edit"></i>
  <i class="fas fa-trash"></i></td>`;
  console.log(tableRow);
  budget.expenseTable.appendChild(tableRow);

}

function addExpense() {
  if (validateIsNumber(budget.expenseAmount.value, budget.expenseFeedback)) {

    let expenseName = budget.expenseName.value;
    let expenseAmount = budget.expenseAmount.value;
    createThreeColTableRow(expenseName, expenseAmount);
    budget._expenses.push({ expenseName: expenseName, expenseAmount: expenseAmount });
    budget.expenseTable.classList.remove('hidden');
    budget.expenseName.value = "";
    budget.expenseAmount.value = "";

    //Update Expenses total
    budget._totalExpenses = budget._expenses.reduce((accumulator, current) => {
      return accumulator += parseFloat(current.expenseAmount);
    }, 0);

    budget.expenseTotal.innerHTML = `£${budget._totalExpenses}`;
    calcBudget();

  }
}

function removeExpense(tableRow){
    console.log(tableRow);
    let expenseName = tableRow.getAttribute('data-expense-name');
    let expenseAmount = tableRow.getAttribute('data-expense-amount');
    budget._expenses = budget._expenses.filter( expense => (expense.expenseName !== expenseName && expense.expenseAmount !== expenseAmount));
    console.log(budget._expenses);
    calcBudget();
}

//Submit Budget Form
budget.budgetForm.addEventListener('submit', function (e) {
  e.preventDefault();
  setBudget();
});

//Submit Expense Form
budget.expenseForm.addEventListener('submit', function (e) {
  e.preventDefault();
  addExpense();
});

budget.expenseTable.addEventListener('click', function (e) {
  if (e.target.getAttribute('class') === 'fas fa-trash') {
    let trashButton = e.target;
    let tableRow = trashButton.parentNode.parentNode;
    tableRow.remove();
    removeExpense(tableRow);
  }
});




