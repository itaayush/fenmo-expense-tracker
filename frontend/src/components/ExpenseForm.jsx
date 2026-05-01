import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { submitExpense } from "../api/expenseApi";

const categories = [
  "Housing",
  "Food",
  "Transportation",
  "Utilities",
  "Health",
  "Entertainment",
  "Other",
];

function ExpenseForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    amount: "",
    category: categories[0],
    description: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setIdempotencyKey(uuidv4());
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const amountNumber = Number.parseFloat(formData.amount);
    const amountInCents = Math.round(amountNumber * 100);

    try {
      await submitExpense(
        {
          amount: amountInCents,
          category: formData.category,
          description: formData.description,
          date: formData.date,
        },
        idempotencyKey
      );

      setFormData({
        amount: "",
        category: categories[0],
        description: "",
        date: "",
      });
      setIdempotencyKey(uuidv4());

      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (submitError) {
      setError(submitError.message || "Failed to submit expense.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="amount">Amount (USD)</label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%" }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          type="text"
          value={formData.description}
          onChange={handleChange}
          style={{ display: "block", width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          max={today}
          value={formData.date}
          onChange={handleChange}
          required
          style={{ display: "block", width: "100%" }}
        />
      </div>

      {error ? (
        <div style={{ color: "#b00020", marginBottom: 12 }}>{error}</div>
      ) : null}

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;
