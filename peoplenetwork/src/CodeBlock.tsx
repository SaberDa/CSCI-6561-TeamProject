import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type CodeBlockProps = {
    language: string,
    value: string,
}

class CodeBlock extends PureComponent<CodeBlockProps, {}> {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string
  };

  static defaultProps = {
    language: null
  };

  render() {
    const {language, value} = this.props;
    return (
      <SyntaxHighlighter language={language}>
        {value}
      </SyntaxHighlighter>    
    );
  }
}

export default CodeBlock;