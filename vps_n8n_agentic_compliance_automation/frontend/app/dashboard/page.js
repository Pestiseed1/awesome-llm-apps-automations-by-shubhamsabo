export default function DashboardPage() {
  return (
    <main>
      <h1>Compliance Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
        <Card title="Today's invoices" value="8" />
        <Card title="Draft invoices" value="3" />
        <Card title="Pending approval" value="4" />
        <Card title="Product update alerts" value="2" />
      </div>
      <button style={{ marginTop: 20 }}>Check for Product Update</button>
    </main>
  );
}

function Card({ title, value }) {
  return (
    <article style={{ border: '1px solid #ddd', borderRadius: 10, padding: 16 }}>
      <h3>{title}</h3>
      <p style={{ fontSize: 24, margin: 0 }}>{value}</p>
    </article>
  );
}
