import { Chip } from "@/components/ui/chip";

const topics = [
  "World Cup",
  "IPL",
  "Social Media",
  "Business & Markets",
  "Health & Medicine",
  "Soccer",
  "Artificial Intelligence",
  "Arsenal FC",
  "Extreme Weather and Disasters",
];

export function CategoryBar() {
  return (
    <nav aria-label="Popular topics" className="overflow-x-auto border-b border-border bg-bg-primary scrollbar-none">
      <div className="mx-auto flex min-h-10 w-max min-w-full max-w-app items-center gap-2 px-4 sm:px-6">
        <span aria-hidden="true" className="mr-1 text-text-secondary">+</span>
        {topics.map((topic) => (
          <Chip key={topic} label={topic} addable className="shrink-0 px-3 py-1 text-body-sm" />
        ))}
      </div>
    </nav>
  );
}