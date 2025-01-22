export type NodeType =
  | "Program"           // Root node of the program
  | "VarDeclaration"    // Variable declaration (e.g., let x = 10;)
  | "AssignmentExpr"    // Assignment expression (e.g., x = 5)
  | "NumericLiteral"    // Numeric literal (e.g., 42, 3.14)
  | "Identifier"        // Identifier (e.g., variable names like x, foo)
  | "BinaryExpr"        // Binary expression (e.g., a + b, x * y)
  | "CallExpr"          // Function call expression (e.g., foo(1, 2))
  | "UnaryExpr"         // Unary expression (e.g., -x, !flag)
  | "FunctionDeclaration"; // Function declaration (e.g., function foo() {})


// Base interface for all AST nodes
export interface Stmt {
    kind: NodeType; // The type of the AST node
}

// Root node of the program, which contains a list of statements
export interface Program extends Stmt {
    kind : "Program",
    body: Stmt[];  // Array of statements in the program
}

// Node representing a variable declaration
export interface VarDeclaration extends Stmt{
    kind: "VarDeclaration";
    constant:boolean,   // Indicates if the variable is a constant (true for `const`, false for `let`)
    identifier:string,  // Name of the variable
    value?:Expr,        // Optional initial value of the variable
}

// Base interface for all expressions
export interface Expr extends Stmt {}

// Node representing an assignment expression
export interface AssignmentExpr extends Expr{
    kind:"AssignmentExpr";
    assigne:Expr;          // The target being assigned a value (e.g., variable name)
    value:Expr;             // The value being assigned
}

// Node representing a binary expression (e.g., a + b)
export interface BinaryExpr extends Expr{
    kind:"BinaryExpr";
    left: Expr;         // Left operand of the binary expression
    right :Expr;        // Right operand of the binary expression
    operator:string;    // The operator (e.g., "+", "-", "*", "/")
}

// Node representing an identifier (e.g., variable names)
export interface Identifier extends Expr {
    kind:"Identifier";
    symbol:string;      // The name of the identifier
}

// Node representing a numeric literal (e.g., 123, 4.56)
export interface NumericLiteral extends Expr{
    kind:"NumericLiteral";
    value:number;       // The numeric value
}
