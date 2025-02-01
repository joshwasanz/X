// let x = 45
// [let Token, Identifier Token, Equals Token, Number Token]

// Define the different types of tokens that can be identified by the lexer
export enum TokenType {
  Number, // Numeric values (e.g., 123, 4.56)
  Identifier, // Variable or function names (e.g., foo, bar)
  String, // String literals (e.g., "hello")
  Let, // `let` keyword
  Const, // `const` keyword
  Equals, // Assignment operator `=`
  Semicolon, // Semicolon `;`
  OpenParen, // Open parenthesis `(`
  CloseParen, // Close parenthesis `)`
  BinaryOperator, // Operators like `+`, `-`, `*`, `/`, `%`
  EOF, // End-of-file marker
  Comma,
  Colon,
  OpenBracket, //[
  CloseBracket, // ]
  OpenBrace, // }
  CloseBrace ,//{
  Dot,
}

// Map of reserved keywords to their token types
const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
};

// Interface for a token, which consists of a value and a type
export interface Token {
  value: string;
  type: TokenType;
}

// Utility function to create a token
function token(value = "", type: TokenType): Token {
  return { value, type };
}

// Utility function to check if a character is alphabetic (A-Z, a-z)
function isalpha(src: string) {
  return src.toUpperCase() != src.toLocaleLowerCase();
}

// Utility function to check if a character is whitespace or other ignorable characters
function isskippable(str: string) {
  return str == " " || str == "\n" || str == "\t" || str == "\r";
}

// Utility function to check if a character is numeric (0-9)
function isint(str: string) {
  const c = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];

  return c >= bounds[0] && c <= bounds[1];
}

// Main function to tokenize the source code into an array of tokens
export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>(); // Array to store the generated tokens
  const src = sourceCode.split(""); // Split source code into an array of characters

  //Build each token until end of file
  // Process each character in the source code

  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (src[0] == "{") {
      tokens.push(token(src.shift(), TokenType.OpenBrace));
    } else if (src[0] == "}") {
      tokens.push(token(src.shift(), TokenType.CloseBrace));
    }else if (src[0] == "[") {
        tokens.push(token(src.shift(), TokenType.OpenBracket));
      } else if (src[0] == "]") {
        tokens.push(token(src.shift(), TokenType.CloseBracket));
    } else if (src[0] == "+" || src[0] == "-") {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == "*" || src[0] == "/" || src[0] == "%") {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else if (src[0] == ";") {
      tokens.push(token(src.shift(), TokenType.Semicolon));
    } 
    else if (src[0] == ",") {
      tokens.push(token(src.shift(), TokenType.Comma));
    } 
    else if (src[0] == ".") {
      tokens.push(token(src.shift(), TokenType.Dot));
    } 
    else if (src[0] == ":") {
      tokens.push(token(src.shift(), TokenType.Colon));
    } 
    else {
      //Handle multicharacter tokens
      // Handle multi-character tokens like numbers and identifiers
      if (isint(src[0])) {
        let num = "";
        // Accumulate digits to form a complete number
        while (src.length > 0 && isint(src[0])) {
          num += src.shift();
        }
        tokens.push(token(num, TokenType.Number));
      } else if (isalpha(src[0])) {
        let ident = ""; // let foo
        // Accumulate characters to form an identifier or keyword
        while (src.length > 0 && isalpha(src[0])) {
          ident += src.shift();
        }
        //check for reserved keywords
        // Check if the identifier is a reserved keyword
        const reserved = KEYWORDS[ident];

        if (reserved !== undefined) {
          tokens.push(token(ident, reserved));
        } else {
          tokens.push(token(ident, TokenType.Identifier));
        }
      } else if (isskippable(src[0])) {
        // Skip whitespace or ignorable characters
        src.shift();
      } else {
        // Handle unrecognized characters
        console.log("Unrecognized charcter found in source: ", src[0]);
        Deno.exit(1);
      }
    }
  }
  // Add the end-of-file token
  tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
  return tokens;
}

// const source = await Deno.readTextFile("./main.x");
// for (const token of tokenize(source)) {
//   // console.log(token);
// }
