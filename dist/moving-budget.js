const budgetForm = document.querySelector("#budget-form");
const householdSize = document.querySelector("#household-size");
const currency = new Intl.NumberFormat("en-AU", {
  style: "decimal",
  maximumFractionDigits: 0
});
const formatAmount = (amount) => `A$${currency.format(amount)}`;

function updateBudget() {
  const values = [...budgetForm.querySelectorAll("[data-cost]")];
  const oneOff = values
    .filter((input) => input.dataset.cost === "one-off")
    .reduce((total, input) => total + Math.max(0, Number(input.value) || 0), 0);
  const monthly = values
    .filter((input) => input.dataset.cost === "monthly")
    .reduce((total, input) => total + Math.max(0, Number(input.value) || 0), 0);
  const householdCount = Math.min(20, Math.max(1, Math.floor(Number(householdSize.value) || 1)));
  const firstMonth = oneOff + monthly;

  document.querySelector("#one-off-total").textContent = formatAmount(oneOff);
  document.querySelector("#monthly-total").textContent = formatAmount(monthly);
  document.querySelector("#first-month-total").textContent = formatAmount(firstMonth);
  document.querySelector("#per-person-total").textContent = `${formatAmount(firstMonth / householdCount)} per person for arrival plus one month`;
}

budgetForm.addEventListener("input", updateBudget);
budgetForm.addEventListener("reset", () => requestAnimationFrame(updateBudget));
householdSize.addEventListener("input", updateBudget);
document.querySelector("#reset-budget").addEventListener("click", () => {
  householdSize.value = "1";
  requestAnimationFrame(updateBudget);
});
document.querySelector("#print-budget").addEventListener("click", () => window.print());

updateBudget();
