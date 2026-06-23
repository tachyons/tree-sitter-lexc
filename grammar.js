/**
 * @file Lexc grammar for tree-sitter
 * @author Aboobacker MK
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "lexc",

  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    source_file: $ => seq(
      optional($.multichar_symbols_section),
      repeat($.lexicon_section),
    ),

    // ── Multichar_Symbols ─────────────────────────────────────────────────────

    multichar_symbols_section: $ => seq(
      choice("Multichar_Symbols", "Alphabet"),
      repeat($.multichar_symbol),
    ),

    multichar_symbol: $ => /[^\s;:!]+/,

    // ── LEXICON sections ──────────────────────────────────────────────────────

    lexicon_section: $ => seq(
      choice("LEXICON", "Lexicon"),
      field("name", $.lexicon_name),
      repeat($.lexicon_entry),
    ),

    lexicon_name: $ => /[A-Za-z_][A-Za-z0-9_#-]*/,

    // ── Entries ───────────────────────────────────────────────────────────────
    //
    // Key insight: model the entire "form" (everything before the continuation)
    // as a single atomic token. This avoids all upper/lower/continuation
    // ambiguity since the token boundary is clear.
    //
    // The form token matches:
    //   - anything containing ':' (colon pair: upper:lower, upper:, :lower, :)
    //   - OR a sequence starting with % or @ (special no-colon upper)
    //
    // Plain-word no-colon entries like "cat RegNounInfl ;" cannot be
    // distinguished without lookahead, so "cat" is parsed as the continuation
    // (empty-form entry). This is a known limitation for a simple parser.

    lexicon_entry: $ => seq(
      optional(field("form", $.entry_form)),
      field("continuation", $.continuation),
      ";",
    ),

    // entry_form is a single atomic token covering the entire upper[:lower] part
    entry_form: $ => token(
      choice(
        // Colon-bearing: upper:lower, upper:, :lower, :
        // upper and lower are sequences of non-whitespace non-semicolon chars
        seq(
          /[^:;\s!]*/,   // optional upper (may be empty)
          ":",
          /[^:;\s!]*/,   // optional lower (may be empty)
        ),
        // No-colon: must start with % or @ to be unambiguous
        seq(
          choice(
            seq("%", /[^\s]/),
            seq("@", /[^@\s]+/, "@"),
          ),
          repeat(
            choice(
              seq("%", /[^\s]/),
              seq("@", /[^@\s]+/, "@"),
              /[^%@:;\s!]+/,
            )
          )
        ),
      )
    ),

    continuation: $ => choice(
      "#",
      $.lexicon_name,
    ),

    comment: $ => /![^\n]*/,
  },
});
