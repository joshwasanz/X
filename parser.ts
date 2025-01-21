import { Stmt,Program,Expr,BinaryExpr,NumericLiteral,Identifier } from "./ast";
import {tokenize, Token, TokenType} from "./lexer.ts"

export default class Parser {
    private tokens:Token[] = []

    private not_eof():boolean{
        return this.tokens[0].type != TokenType.EOF;
    }

    private at(){
        return this.tokens[0] as Token;
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
        return this.parse_primary_expr();
    }

    private parse_primary_expr():Expr{
        const tk = this.at().type;

        switch(tk){
            case TokenType.Identifier:
                return { kind:"Identifier",symbol:this.at().value} as Identifier

            default:
                return {} as Stmt;
        }
    }
}