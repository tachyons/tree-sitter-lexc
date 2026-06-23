; Keywords
"Multichar_Symbols" @keyword
"Alphabet" @keyword
"LEXICON" @keyword
"Lexicon" @keyword

; Lexicon section name
(lexicon_section name: (lexicon_name) @type)

; Continuation lexicon reference
(continuation (lexicon_name) @type)

; End-of-string marker '#'
(continuation "#" @constant.builtin)

; Entry form (upper:lower pair or special upper)
(entry_form) @string

; Multichar symbols declared in header
(multichar_symbol) @string.special

; Comments
(comment) @comment
