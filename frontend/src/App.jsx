import { useEffect, useMemo, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import { fetchExpenses } from "./api/expenseApi";

const categories = [
  "All",
  "Housing",
  "Food",
  "Transportation",
  "Utilities",
  "Health",
  "Entertainment",
  "Other",
];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("date_desc");

  async function loadExpenses() {
    const filters = {
      category: categoryFilter === "All" ? "" : categoryFilter,
      sort: sortOrder,
    };

    try {
      const data = await fetchExpenses(filters);
      setExpenses(data);
    } catch {
      setExpenses([]);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, [categoryFilter, sortOrder]);

  const totalAmount = useMemo(() => {
    const totalInCents = expenses.reduce(
      (sum, expense) => sum + (expense.amount || 0),
      0
    );
    return (totalInCents / 100).toFixed(2);
  }, [expenses]);

  return (
    <div style={{ padding: "32px 20px", fontFamily: "system-ui" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Resilient Expense Tracker</h1>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 1fr) 2fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <section style={{ padding: 16, border: "1px solid #e5e7eb" }}>
          <h2 style={{ marginTop: 0 }}>Add Expense</h2>
          <ExpenseForm onSuccess={loadExpenses} />
        </section>

        <section style={{ padding: 16, border: "1px solid #e5e7eb" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 16,
              alignItems: "center",
            }}
          >
            <div>
              <label htmlFor="categoryFilter" style={{ marginRight: 8 }}>
                Category
              </label>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sortOrder" style={{ marginRight: 8 }}>
                Sort
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
              </select>
            </div>

            <div style={{ marginLeft: "auto", fontWeight: 600 }}>
              Total Visible Expenses: ${totalAmount}
            </div>
          </div>

          <ExpenseTable expenses={expenses} />
        </section>
      </div>
    </div>
  );
}

export default App;
