import {ValueType, RuntimeVal, NumberVal, MK_NULL} from "./values.ts"
import { BinaryExpr, Identifier, NodeType, NumericLiteral, Program, Stmt, VarDeclaration } from "../frontend/ast.ts"
import {Environment} from './environment.ts'
import { eval_identifier, eval_binary_expr } from "./eval/expressions.ts";
import { eval_program, eval_var_declaration } from "./eval/statements.ts";


export function evaluate(astNode: Stmt,env:Environment): RuntimeVal {

    switch(astNode.kind){
        case "NumericLiteral":
            return {
                value:((astNode as NumericLiteral).value),
                type:"number",
            } as NumberVal;
        case "Identifier":
            return eval_identifier(astNode as Identifier,env)

        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr,env);

        case "Program":
            return eval_program(astNode as Program,env);

        case "VarDeclaration":
            return eval_var_declaration(astNode as VarDeclaration,env)

            default:
                console.error("this AST Node has not yet been setup for interpretation",astNode);
                Deno.exit(1);
                return MK_NULL()

    }

}

