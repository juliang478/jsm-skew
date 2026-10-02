import Link from "next/link";

function SocialIcon({ kind }: { kind: "x" | "linkedin" | "youtube" }) {
  if (kind === "x") {
    return <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l7.3-8.4L1.8 2h6.5l4.4 6.8L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />;
  }

  if (kind === "linkedin") {
    return <path d="M5.2 8.4H1.8V22h3.4V8.4ZM3.5 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM22.2 13.7c0-4.1-2.2-6-5.1-6a4.4 4.4 0 0 0-4 2.2V8.4H9.7V22h3.5v-6.7c0-1.8.3-3.6 2.6-3.6s2.3 2.1 2.3 3.7V22h3.5l.6-8.3Z" />;
  }

  return <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />;
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h2 className="mb-3 text-body-sm font-semibold">{title}</h2>
      <ul className="grid gap-1.5 text-caption text-bg-primary/75">
        {links.map((label) => (
          <li key={label}><Link href="/" className="hover:text-bg-primary">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const socialLinks = [
    { kind: "x", label: "Skew on X" },
    { kind: "linkedin", label: "Skew on LinkedIn" },
    { kind: "youtube", label: "Skew on YouTube" },
  ] as const;

  return (
    <footer className="bg-text-primary text-bg-primary">
      <div className="mx-auto grid max-w-app grid-cols-2 gap-x-8 gap-y-7 px-5 py-7 sm:grid-cols-4 sm:px-8">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" aria-label="Skew News home" className="inline-flex flex-col leading-none">
            <span className="text-h3 font-bold">Skew</span>
            <span className="self-end text-caption">News</span>
          </Link>
          <p className="mt-3 text-caption leading-relaxed text-bg-primary/75">
            Balanced news coverage<br />powered by AI.
          </p>
        </div>
        <FooterLinks title="Company" links={["About", "Careers", "Press", "Contact"]} />
        <FooterLinks title="Help" links={["Help Center", "Guidelines", "Privacy Policy", "Terms of Service"]} />
        <div>
          <h2 className="mb-3 text-body-sm font-semibold">Connect</h2>
          <div className="flex items-center gap-4 text-bg-primary/85">
            {socialLinks.map(({ kind, label }) => (
              <Link key={kind} href="/" aria-label={label} className="hover:text-bg-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <SocialIcon kind={kind} />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-bg-primary/20">
        <div className="mx-auto max-w-app px-5 py-2 text-caption text-bg-primary/65 sm:px-8">
          © 2026 Skew News. All rights reserved.
        </div>
      </div>
    </footer>
  );
}