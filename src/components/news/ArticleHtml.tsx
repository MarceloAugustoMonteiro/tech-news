import "server-only";
import { sanitizeGuardianHtml } from "@/lib/guardian-html";

interface ArticleHtmlProps {
  html: string;
  className: string;
}

export default function ArticleHtml({ html, className }: ArticleHtmlProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeGuardianHtml(html) }}
    />
  );
}
