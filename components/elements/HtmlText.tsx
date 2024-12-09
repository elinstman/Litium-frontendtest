/**
 * Renders a html text component
 * @param className CSS class names.
 * @param innerHTML use for loading HTML content.
 */
export function HtmlText({
  className,
  innerHTML,
  ...props
}: {
  className?: string;
  innerHTML: string;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: innerHTML }}
      {...props}
    ></div>
  );
}
