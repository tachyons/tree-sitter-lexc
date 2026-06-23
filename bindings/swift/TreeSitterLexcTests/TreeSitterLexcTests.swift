import XCTest
import SwiftTreeSitter
import TreeSitterLexc

final class TreeSitterLexcTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_lexc())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Lexc grammar")
    }
}
