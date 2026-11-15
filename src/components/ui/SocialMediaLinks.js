import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function InstagramIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

/**
 * SocialMediaLinks Component
 * Strictly renders only verified social media profiles if present in siteConfig.socialLinks.
 * If no verified accounts exist, returns null.
 */
export default function SocialMediaLinks({ className = "" }) {
  const links = siteConfig.socialLinks || [];

  if (links.length === 0) return null;

  const iconMap = {
    instagram: InstagramIcon,
    facebook: FacebookIcon,
    youtube: YoutubeIcon,
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {links.map((item) => {
        const key = (item.icon || item.name || "").toLowerCase();
        const Icon = iconMap[key] || InstagramIcon;
        const label = item.label || item.name;
        const href = item.url || item.href;

        return (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-heading font-medium text-charcoal hover:text-white bg-white hover:bg-terracotta transition-colors px-3 py-1.5 border border-border-subtle shadow-2xs group focus-visible:outline-2 focus-visible:outline-terracotta"
            aria-label={`Follow Dhanda Bhatta Company on ${label}`}
          >
            <Icon className="text-terracotta group-hover:text-white transition-colors shrink-0" />
            <span>{label}</span>
          </a>
        );
      })}
    </div>
  );
}
