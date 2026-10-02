import { Button } from "@/components/ui/button";

export function NewsletterCta() {
  return (
    <section aria-label="Newsletter subscription" className="mt-8 flex flex-col gap-4 rounded-md border border-border bg-bg-primary p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <h2 className="text-body-md font-semibold text-text-primary">Stay Informed. Stay Balanced.</h2>
        <p className="mt-1 text-caption text-text-secondary">Get the top stories and bias analysis delivered to your inbox.</p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <input aria-label="Email address" type="email" placeholder="Enter your email" className="h-9 min-w-0 rounded-sm border border-border bg-bg-primary px-3 text-body-sm outline-none placeholder:text-text-secondary focus:border-accent sm:w-56" />
        <Button className="shrink-0">Subscribe</Button>
      </div>
    </section>
  );
}