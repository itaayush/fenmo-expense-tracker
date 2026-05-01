function ExpenseTable({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <p>No expenses found.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "8px" }}>Date</th>
          <th style={{ textAlign: "left", padding: "8px" }}>Category</th>
          <th style={{ textAlign: "left", padding: "8px" }}>Description</th>
          <th style={{ textAlign: "right", padding: "8px" }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td style={{ padding: "8px", borderTop: "1px solid #e0e0e0" }}>
              {expense.date}
            </td>
            <td style={{ padding: "8px", borderTop: "1px solid #e0e0e0" }}>
              {expense.category}
            </td>
            <td style={{ padding: "8px", borderTop: "1px solid #e0e0e0" }}>
              {expense.description || "-"}
            </td>
            <td
              style={{
                padding: "8px",
                borderTop: "1px solid #e0e0e0",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              ${`${(expense.amount / 100).toFixed(2)}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ExpenseTable;
