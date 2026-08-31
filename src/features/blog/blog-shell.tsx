import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const RULE = "border-frame/25";

const GUTTER = "px-6 max-md:px-4";

export function BlogShell({
  children,
  actions,
  heading,
  backHref,
  wide = false,
  fill = false,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  heading?: string;
  backHref: string;
  wide?: boolean;
  fill?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-[image:var(--art-page)] text-frame",
        fill ? "h-screen" : "min-h-screen py-8 max-md:py-5",
      )}
    >
      <div
        className={cn(
          "w-[92%] max-w-3xl",
          wide && "max-w-5xl",
          fill && "h-[90%]",
        )}
      >
        <Card
          padded={false}
          hoverable={false}
          className={cn("flex flex-col", fill && "h-full")}
        >
          <header
            className={cn(
              "flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b-2 py-4",
              GUTTER,
              RULE,
            )}
          >
            <div className="flex items-baseline gap-2">
              <Link
                href="/blog"
                className="text-xl font-semibold text-ink hover:text-accent"
              >
                Blog
              </Link>
              {heading && (
                <>
                  <span aria-hidden className="text-muted">
                    /
                  </span>
                  <h1 className="text-base font-normal text-muted">{heading}</h1>
                </>
              )}
            </div>

            {actions && (
              <div className="flex flex-wrap items-center gap-2">{actions}</div>
            )}
          </header>

          <main
            className={cn(
              "py-8 max-md:py-6",
              GUTTER,
              fill && "min-h-0 flex-1 overflow-y-auto",
            )}
          >
            {children}
          </main>

          <footer
            className={cn(
              "flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t-2 py-4",
              GUTTER,
              RULE,
            )}
          >
            <span className="text-xs text-muted">
              &copy; {site.copyrightYear} {site.title}
            </span>
            <ButtonLink
              href={backHref}
              target="_self"
              className="px-3 py-1.5 text-sm"
            >
              Back
            </ButtonLink>
          </footer>
        </Card>
      </div>
    </div>
  );
}
