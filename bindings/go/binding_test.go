package tree_sitter_lexc_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_lexc "github.com/tree-sitter/tree-sitter-lexc/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_lexc.Language())
	if language == nil {
		t.Errorf("Error loading Lexc grammar")
	}
}
