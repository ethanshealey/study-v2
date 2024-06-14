import React from 'react'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeBlock = (props: any) => {
    const {children, className, node } = props
    const match = /language-(\w+)/.exec(className || '')
    return match ? (
      <SyntaxHighlighter
        PreTag="div"
        children={String(children ?? '').replace(/\n$/, '')}
        language={match[1]}
        style={oneDark}
      />
    ) : (
      <code className={className}>
        {children}
      </code>
    )
}

export default CodeBlock