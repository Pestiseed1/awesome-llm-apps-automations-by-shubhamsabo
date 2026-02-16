import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Pest Control Compliance Automation</h1>
      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/invoices/INV_DEMO/edit">Invoice Editor</Link></li>
      </ul>
    </main>
  );
}
