import { Stmt,Program,Expr,BinaryExpr,NumericLiteral,Identifier, VarDeclaration, AssignmentExpr, Property, ObjectLiteral } from "../frontend/ast.ts";
import {tokenize, Token, TokenType} from "../frontend/lexer.ts";

export default class Parser {
    private tokens:Token[] = []; // List of tokens to be processed by the parser

      // Check if there are more tokens to parse
    private not_eof():boolean{
        return this.tokens[0].type != TokenType.EOF;
    }

      // Get the current token being processed
    private at(){
        return this.tokens[0] as Token;
    }

      // Consume the current token and move to the next one
    private eat(){
        const prev = this.tokens.shift() as Token;
        return prev;
    }

      // Ensure the current token matches the expected type, otherwise throw an error
    private expect(type:TokenType, err){
        const prev = this.tokens.shift() as Token;
        if(!prev || prev.type != type){
            console.error("Parser Error:\n",err,prev,"-Expecting:",type);
            Deno.exit(1)   // Exit if the expected token is not found
        }
        return prev
    }

  // Entry point for parsing the source code and producing an AST
    public productAST(sourceCode:string): Program {
        this.tokens = tokenize(sourceCode) // Tokenize the source code
        const program:Program = {
            kind: "Program",
            body: [],           // Initialize the body as an empty array
        };
        
        // Parse untill end of the file
        // Parse all statements in the source code
        while(this.not_eof()){
            program.body.push(this.parse_stmt())
        }

        return program
    }

      // Parse a statement (e.g., variable declaration, expression)
    private parse_stmt():Stmt{
        // skip to parse expr
        switch(this.at().type){
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_var_declaration() // Handle variable declarations
            default:
                return this.parse_expr()        // Parse as an expression by default
        }
        
    }
      // Parse a variable declaration (e.g., `let x = 10;`)
    parse_var_declaration():Stmt{
        const isConstant = this.eat().type == TokenType.Const; // Check if it's a `const` declaration
        const identifier = this.expect(
            TokenType.Identifier,
            "Expected identifier name following let | const keywords.",
        ).value;

        // Handle uninitialized variable declarations (e.g., `let x;`)
        if(this.at().type == TokenType.Semicolon){
            this.eat()
            if(isConstant){
                throw "Must assign value to contant expression. No value provided";
            }
            return {kind:"VarDeclaration",identifier,constant:false,value:undefined} as VarDeclaration
        }

        // Ensure an assignment is present for the variable
        this.expect(TokenType.Equals,"Expected equals token following identifier in var declaration");
        const declaration = {
            kind:"VarDeclaration",
            value:this.parse_expr(),
            identifier,
            constant:isConstant
        } as VarDeclaration

        // Ensure a semicolon terminates the declaration
        this.expect(TokenType.Semicolon,"Add the mothafucking semi colon");
        return declaration
    }
  // Parse an expression
    private parse_expr():Expr{
        return this.parse_assignment_expr();
    }

      // 
    private parse_assignment_expr():Expr{
        const left = this.parse_object_expr();

        // Check if it's an assignment expression
        if(this.at().type == TokenType.Equals){
            this.eat();
            const value = this.parse_assignment_expr();
            return {value, assigne:left,kind:"AssignmentExpr"} as AssignmentExpr;
        }
        return left; // If not, return the left-hand side as-is
    }

    private parse_object_expr():Expr{
        if(this.at().type !== TokenType.OpenBrace){
            return this.parse_additive_expr();
        }

        this.eat() //advance past open brace
        const properties = new Array<Property>();

        while (this.not_eof() && this.at().type != TokenType.CloseBarce){
            // {key: val, key2: val}
            const key = this.expect(TokenType.Identifier,"Object literal key expected").value;

            // allows shorthand key: pair -> {key,}
            if(this.at().type == TokenType.Comma){
                this.eat(); //advance past the comma
                properties.push({key, kind:"Property"} as Property);
                continue;
            } // Allows shorthand key:pair -> { key }
            else if(this.at().type == TokenType.CloseBarce){
                properties.push({key, kind:"Property"});
                continue;
            }

            // {key: val}
            this.expect(TokenType.Colon, "Missing colon following identifier in ObjectExpr");
            const value = this.parse_expr();

            properties.push({kind:"Property",value,key});
            if(this.at().type != TokenType.CloseBarce){
                this.expect(TokenType.Comma,"Expected comma or Closing Bracket following Property");
            }
        }
        this.expect(TokenType.CloseBarce, "Object literal missing closing brace.");
        return { kind: "ObjectLiteral", properties } as ObjectLiteral;
    }

    // Parse an additive expression (e.g., `a + b`)
    private parse_additive_expr() :Expr{
        let left = this.parse_multiplicative_expr();

        while (this.at().value == "+" || this.at().value == "-"){
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind:"BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr
        }

        return left
    }

      // Parse a multiplicative expression (e.g., `a * b`)
    private parse_multiplicative_expr() :Expr{
        let left = this.parse_primary_expr();

        while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%"){
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind:"BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr
        }

        return left
    }

    // order of precidence 
    //assignment expr
    //memeber expr
    //function call
    //logical expr
    //comparision expr
    //Additive expr
    //multiplicative expr
    //unaryexpr
    //primary expr

    // Parse the most basic expressions (e.g., literals, identifiers, parenthesized expressions)
    private parse_primary_expr():Expr{
        const tk = this.at().type;

        switch(tk){
            case TokenType.Identifier:
                return { kind:"Identifier",symbol:this.eat().value } as Identifier

            case TokenType.Number:
                return {kind:"NumericLiteral",value:parseFloat(this.eat().value)
                } as NumericLiteral

            case TokenType.OpenParen:
                this.eat(); // eat the opening paren // Consume the opening parenthesis
                const value = this.parse_expr(); // Parse the inner expression
                this.expect(TokenType.CloseParen,"Unexpected token found inside parenthesised expression. Expected closing parenthesis");
                return value; // Return the inner expression
            default:
                console.error("Unexpected token found during parsing",this.at());
                Deno.exit(1);  // Exit on unexpected token
                return {} as Expr; // Add this line to satisfy the return type  // Added for type safety
        }
    }
}