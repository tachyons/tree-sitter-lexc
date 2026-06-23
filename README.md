# tree-sitter-lexc

A [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar for [lexc](https://wiki.apertium.org/wiki/Lexc) — the lexicon compiler format used by finite-state morphology tools such as [HFST](https://hfstol.readthedocs.io/) and [Foma](https://fomafst.github.io/).

## Features

- Parses `Multichar_Symbols` / `Alphabet` declarations
- Parses `LEXICON` sections with entries (upper/lower string pairs, continuations, comments)
- Syntax highlighting via `queries/highlights.scm`
- Supports `%`-escaped characters and flag diacritics (`@U.feat.val@`)

## Example

```lexc
Multichar_Symbols
%<n%> %<pl%> %<sg%>

LEXICON Root
NounRoot ;

LEXICON NounRoot
cat%<n%> RegNounInfl ;  ! A noun

LEXICON RegNounInfl
%<n%>%<sg%>:   # ;
%<n%>%<pl%>:s  # ;
```

## Usage

### CLI

```sh
tree-sitter parse file.lexc
tree-sitter highlight file.lexc
```

### Node.js

```js
import Parser from "tree-sitter";
import Lexc from "tree-sitter-lexc";

const parser = new Parser();
parser.setLanguage(Lexc);

const tree = parser.parse(`
LEXICON Root
NounRoot ;
`);
console.log(tree.rootNode.toString());
```

### Rust

```rust
let code = r#"
LEXICON Root
NounRoot ;
"#;
let mut parser = tree_sitter::Parser::new();
parser
    .set_language(&tree_sitter_lexc::LANGUAGE.into())
    .expect("Error loading Lexc parser");
let tree = parser.parse(code, None).unwrap();
assert!(!tree.root_node().has_error());
```

## Syntax Highlighting

The grammar ships with a `queries/highlights.scm` for editor integration.

| Capture | Meaning |
|---|---|
| `@keyword` | `Multichar_Symbols`, `LEXICON`, etc. |
| `@type` | Lexicon section names and continuation references |
| `@string` | Entry forms (upper/lower pairs) |
| `@string.special` | Declared multichar symbols |
| `@constant.builtin` | End-of-string marker `#` |
| `@comment` | `! ...` line comments |

## Known Limitations

Plain-word no-colon entries (e.g. `dog RegNounInfl ;`) cannot be fully disambiguated without an external scanner, since a plain word is lexically identical to a continuation lexicon name. Entries that contain `%`-escaped symbols or a `:` separator parse correctly. This is sufficient for syntax highlighting purposes.

## Development

```sh
# Generate the parser after editing grammar.js
tree-sitter generate

# Run tests
npm test        # Node.js
cargo test      # Rust

# Test highlighting
tree-sitter highlight path/to/file.lexc
```

## License

MIT
