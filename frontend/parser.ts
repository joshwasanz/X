import { Stmt,Program,Expr,BinaryExpr,NumericLiteral,Identifier, VarDeclaration } from "../frontend/ast.ts";
import {tokenize, Token, TokenType} from "../frontend/lexer.ts";

export default class Parser {
    private tokens:Token[] = []

    private not_eof():boolean{
        return this.tokens[0].type != TokenType.EOF;
    }

    private at(){
        return this.tokens[0] as Token;
    }

    private eat(){
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect(type:TokenType, err){
        const prev = this.tokens.shift() as Token;
        if(!prev || prev.type != type){
            console.error("Parser Error:\n",err,prev,"-Expecting:",type);
            Deno.exit(1)
        }
        return prev
    }

    public productAST(sourceCode:string): Program {
        this.tokens = tokenize(sourceCode)
        const program:Program = {
            kind: "Program",
            body: [],
        };
        
        // Parse untill end of the file
        while(this.not_eof()){
            program.body.push(this.parse_stmt())
        }

        return program
    }

    private parse_stmt():Stmt{
        // skip to parse expr
        switch(this.at().type){
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_var_declaration()
            default:
                return this.parse_expr()
        }
        
    }

    parse_var_declaration():Stmt{
        const isConstant = this.eat().type == TokenType.Const;
        const identifier = this.expect(
            TokenType.Identifier,
            "Expected identifier name following let | const keywords.",
        ).value;

        if(this.at().type == TokenType.Semicolon){
            this.eat()
            if(isConstant){
                throw "Must assign value to contant expression. No value provided";
            }
            return {kind:"VarDeclaration",identifier,constant:false,value:undefined} as VarDeclaration
        }

        this.expect(TokenType.Equals,"Expected equals token following identifier in var declaration");
        const declaration = {
            kind:"VarDeclaration",
            value:this.parse_expr(),
            identifier,
            constant:isConstant
        } as VarDeclaration

        this.expect(TokenType.Semicolon,"Add the mothafucking semi colon");
        return declaration
    }

    private parse_expr():Expr{
        return this.parse_additive_expr();
    }

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

    private parse_primary_expr():Expr{
        const tk = this.at().type;

        switch(tk){
            case TokenType.Identifier:
                return { kind:"Identifier",symbol:this.eat().value } as Identifier

            case TokenType.Number:
                return {kind:"NumericLiteral",value:parseFloat(this.eat().value)
                } as NumericLiteral

            case TokenType.OpenParen:
                this.eat(); // eat the opening paren
                const value = this.parse_expr();
                this.expect(TokenType.CloseParen,"Unexpected token found inside parenthesised expression. Expected closing parenthesis");
                return value; // eat the closing paren
            default:
                console.error("Unexpected token found during parsing",this.at());
                Deno.exit(1);
                return {} as Expr; // Add this line to satisfy the return type
        }
    }
}