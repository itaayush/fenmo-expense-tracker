const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/expenses";

async function fetchExpenses(filters = {}) {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch expenses.");
  }

  return response.json();
}

async function submitExpense(expenseData, idempotencyKey) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {}),
    },
    body: JSON.stringify(expenseData),
  });

  if (!response.ok) {
    let message = "Failed to submit expense.";

    try {
      const data = await response.json();
      if (data && data.error) {
        message = data.error;
      }
    } catch {
      // Ignore JSON parse errors and use the default message.
    }

    throw new Error(message);
  }

  return response.json();
}

export { fetchExpenses, submitExpense };
