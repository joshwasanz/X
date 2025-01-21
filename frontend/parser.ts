import { Stmt,Program,Expr,BinaryExpr,NumericLiteral,Identifier } from "../frontend/ast.ts";
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
        return this.parse_expr();
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

            default:
                console.error("Unexpected token found during parsing",this.at());
                Deno.exit(1);
                return {} as Expr; // Add this line to satisfy the return type
        }
    }
}