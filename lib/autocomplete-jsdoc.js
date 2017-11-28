'use babel';

import { Range } from 'atom';
import TOKENS from '../tokens';

const KEYWORDS = Object.keys(TOKENS);

/**
 * [JsDocKeywordProvider description]
 * @type {Object}
 * @constru
 */
class JsDocKeywordProvider {

  constructor () {
    this.selector = '.source.js .comment.block.documentation';
  }

  isTag (editor, position, prefix) {
    let start = position.column - prefix.length;
    let range = new Range(
      [position.row, start - 1],
      [position.row, start]
    );

    let prev = editor.getTextInBufferRange(range);
    return prev === '@';
  }

/**
 * [getSuggestions description]
 *
 *
 * @r
 */
  getSuggestions ({ editor, bufferPosition, scopeDescriptor, prefix }) {
    if ( !this.isTag(editor, bufferPosition, prefix) ) { return []; }

    let options = KEYWORDS.filter(kw => {
      return kw.indexOf(prefix) === 0;
    });

    options = options.map((o) => {
      let meta = TOKENS[o];
      return {
        text: meta.name,
        displayText: `@${meta.name}`,
        type: 'keyword',
        snippet: meta.snippet,
        description: meta.description,
        descriptionMoreURL: meta.url
      };
    });

    return options;
  }
};

export default {
  activate () {},

  provide () {
    if (!this.provider) {
      this.provider = new JsDocKeywordProvider();
    }
    return this.provider;
  }
};
