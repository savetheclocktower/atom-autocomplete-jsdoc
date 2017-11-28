'use babel';

import AutocompleteJsdoc from '../lib/autocomplete-jsdoc';
import { Point } from 'atom';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('AutocompleteJsdoc', () => {
  let workspaceElement, activationPromise;
  let provider;

  let setText;

  function suggest (editor, prefix) {
    let bufferPosition = editor.getCursorBufferPosition();
    let cursor = editor.getLastCursor();
    let scopeDescriptor = cursor.getScopeDescriptor();

    console.log('cursor:', cursor);
    console.log('scope:', scopeDescriptor);

    return provider.getSuggestions({
      editor,
      bufferPosition,
      scopeDescriptor,
      prefix
    });
  }

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage('autocomplete-jsdoc');
    });

    waitsForPromise(() => {
      return atom.packages.activatePackage('autocomplete-plus');
    });

    waitsForPromise(() => {
      return atom.packages.activatePackage('language-javascript');
    });

    waitsForPromise(() => {
      return atom.workspace.open();
    });

    runs(() => {
      provider = AutocompleteJsdoc.provide();
      editor = atom.workspace.getActiveTextEditor();
      setText = function (text) {
        console.log('setting text:', text);
        editor.setText(`/**
 * ${text}
 */`);
        editor.setCursorBufferPosition(
          new Point(1, text.length + 3)
        );
      };
    });
  });

  describe('when asked for suggestions', () => {
    beforeEach(() => {
      runs(() => {
        editor.setGrammar(
          atom.grammars.grammarForScopeName('source.js')
        );
      });
    });

    it('offers matches when preceded by @', function () {
      setText('@ret');
      let suggestions = suggest(editor, 'ret');
      expect(suggestions.length).toBe(2);
      expect(suggestions[0].text).toBe('returns');
      expect(suggestions[1].text).toBe('return');
    });

    it('offers no matches when not preceded by @', function () {
      setText('ret');
      let suggestions = suggest(editor, 'ret');
      expect(suggestions.length).toBe(0);
    });

    it('offers no matches when not in a comment scope', function () {
      editor.setText(`lorem`);
      editor.setCursorBufferPosition( new Point(0, 5) );
      let suggestions = suggest(editor, 'lorem');
      expect(suggestions.length).toBe(0);
    });
  });
});
