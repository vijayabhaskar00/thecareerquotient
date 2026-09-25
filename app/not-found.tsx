import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">404</p>
      <h1 className="mt-2 text-display-lg font-bold text-navy-900">We couldn&apos;t find that page.</h1>
      <p className="mt-4 text-navy-700">
        The page you&apos;re looking for may have moved or no longer exists. Try one of the links below.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button render={<Link href="/">Go Home</Link>} />
        <Button variant="outline" render={<Link href="/services">Browse Services</Link>} />
        <Button variant="outline" render={<Link href="/contact">Contact Us</Link>} />
      </div>
    </div>
  );
}
