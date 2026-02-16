import SignaturePad from '../../../../components/SignaturePad';

export default function InvoiceEditPage({ params }) {
  return (
    <main>
      <h1>Invoice Editor: {params.id}</h1>
      <form style={{ display: 'grid', gap: 12, maxWidth: 700 }}>
        <label>Findings<textarea rows={3} /></label>
        <label>Treatment<textarea rows={3} /></label>
        <label>Recommendation<textarea rows={3} /></label>
        <label>Product details<textarea rows={3} /></label>
        <label>Warranty<textarea rows={2} /></label>
        <label>Payment summary<textarea rows={2} /></label>
        <SignaturePad />
        <button type="submit">Save & Re-send for Approval</button>
      </form>
    </main>
  );
}
