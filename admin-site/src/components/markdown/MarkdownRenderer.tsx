import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import 'highlight.js/styles/github-dark.css';

type Props = {
  content: string;
};

export function MarkdownRenderer({ content }: Props) {
  return (
    <div className="article-prose">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: CodeBlock,
          img: ({ alt, src }) => <img src={src} alt={alt ?? ''} loading="lazy" />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
