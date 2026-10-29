import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="mx-auto w-full min-w-0 max-w-3xl wrap-break-word text-[15px] leading-7 text-foreground **:min-w-0 [&_img]:max-w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 mt-2 scroll-m-20 wrap-break-word text-4xl font-bold tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 mt-10 scroll-m-20 wrap-break-word border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-8 scroll-m-20 wrap-break-word text-xl font-semibold tracking-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-6 wrap-break-word text-lg font-semibold tracking-tight">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-5 wrap-break-word leading-7 text-muted-foreground">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="wrap-break-word font-medium text-primary underline underline-offset-4 hover:opacity-80"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-6 ml-6 list-disc space-y-2 [&>li]:pl-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-6 ml-6 list-decimal space-y-2 [&>li]:pl-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="wrap-break-word pl-1 leading-7 text-muted-foreground">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-6 wrap-break-word border-l-4 border-primary/40 pl-5 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-border" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          pre: ({ children }) => (
            <pre className="my-6 max-w-full overflow-x-auto rounded-xl border bg-muted/50 p-5 font-mono text-sm leading-6">
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className?.includes("language-"));

            return isBlock ? (
              <code
                className={`${className ?? ""} font-mono text-sm`}
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="break-all rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="my-6 w-full max-w-full overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b bg-muted/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t px-4 py-3">{children}</td>
          ),
          input: ({ ...props }) => (
            <input
              {...props}
              disabled
              className="mr-2 size-4 translate-y-0.5 accent-primary"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
