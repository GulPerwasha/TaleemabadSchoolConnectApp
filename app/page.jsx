import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <div className="card">
        <h1>Unified Multi-Channel Educator Funnel</h1>
        <p>
          This Next.js app provides a local preview of the WhatsApp funnel flows
          and exposes webhook endpoints for Meta verification/testing.
        </p>
        <ul>
          <li>
            <Link href="/preview">Open preview UI</Link>
          </li>
          <li>
            Webhook endpoints: <code>GET /api/webhook</code> (verify) and{" "}
            <code>POST /api/webhook</code> (events, mock log)
          </li>
        </ul>
      </div>
    </main>
  );
}

