import ReactMarkdown, { type Options } from 'react-markdown'
import rehypeRaw from 'rehype-raw'

const Markdown = ({ rehypePlugins, ...props }: Options) => {
  return (
    <ReactMarkdown
      className="markdown"
      rehypePlugins={[rehypeRaw, ...(rehypePlugins ?? [])]}
      {...props}
    />
  )
}

export default Markdown
