import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/ui/external-link";
import { contact, socials } from "@/content/profile";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-muted italic">{children}</p>;
}

export function ContactTile({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <h2 className="mb-2 text-xl font-semibold">Contact me!</h2>

      <FieldLabel>E-mail</FieldLabel>
      <p className="mb-4">
        <a href={`mailto:${contact.email}`} className="hover:text-accent">
          {contact.email}
        </a>
      </p>

      <FieldLabel>Phone number</FieldLabel>
      <p className="mb-4">
        <a href={`tel:${contact.phone}`} className="hover:text-accent">
          {contact.phone}
        </a>
      </p>

      <FieldLabel>Social Media</FieldLabel>
      {socials.map((social) => (
        <p key={social.label}>
          <ExternalLink href={social.href}>{social.label}</ExternalLink>
        </p>
      ))}
    </Card>
  );
}
