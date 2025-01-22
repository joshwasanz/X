import {ValueType, RuntimeVal, NumberVal, NullVal} from "./values.ts"
import { BinaryExpr, Identifier, NodeType, NumericLiteral, Program, Stmt } from "../frontend/ast.ts"
import {Environment} from './environment.ts'

function eval_program(program:Program,env:Environment):RuntimeVal{
    let lastEvaluated:RuntimeVal = { type:"null",value:"null"} as NullVal

    for (const statement of program.body){
        lastEvaluated = evaluate(statement,env);
    }

    return lastEvaluated;
}

function eval_numeric_binary_expr(lhs:NumberVal,rhs:NumberVal,operator:string):NumberVal{
    let result :number;

    if (operator == "+"){
        result = lhs.value + rhs.value
    }else if(operator == "-"){
        result = lhs.value - rhs.value
    }else if(operator == "*"){
        result = lhs.value * rhs.value
    }else if(operator == "/"){
        result = lhs.value / rhs.value
    }else{
        result = lhs.value % rhs.value
    }

    return {value:result,type:"number"}
}

function eval_binary_expr(binop:BinaryExpr,env:Environment):RuntimeVal{
    const lhs = evaluate(binop.left,env);
    const rhs = evaluate(binop.right,env)

    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal,binop.operator)
    }

    return {type:'null',value:"null"} as NullVal
}

    function eval_identifier(ident:Identifier,env:Environment):RuntimeVal{
        const val = env.lookupVar(ident.symbol)
        return val;
    }

export function evaluate(astNode: Stmt,env:Environment): RuntimeVal {

    switch(astNode.kind){
        case "NumericLiteral":
            return {
                value:((astNode as NumericLiteral).value),
                type:"number",
            } as NumberVal;

        case "NullLiteral":
            return {value:"null",type:"null"} as NullVal;

        case "Identifier":
            return eval_identifier(astNode as Identifier,env)

        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr,env);

        case "Program":
            return eval_program(astNode as Program,env);


            default:
                console.error("thid AST Node has not yet been setup for interpretation",astNode);
                Deno.exit(1);
                return {value:"null",type:"null"} as NullVal;

    }

}