import Link from "next/link";

export default function NotFound() {
  return <main className="not-found shell"><span>404</span><h1>Quest not found.</h1><p>This route is not part of the current maker business map.</p><Link className="button button-primary" href="/">Return to mission control</Link></main>;
}
