import { RuntimeVal, NumberVal, MK_NULL} from "./values.ts"
import { AssignmentExpr, BinaryExpr, Identifier,  NumericLiteral, ObjectLiteral, Program, Stmt, VarDeclaration } from "../frontend/ast.ts"
import Environment from './environment.ts'
import { eval_identifier, eval_binary_expr, eval_assignment, eval_object_expr } from "./eval/expressions.ts";
import { eval_program, eval_var_declaration } from "./eval/statements.ts";


/**
 * Evaluates an abstract syntax tree (AST) node.
 * @param astNode - The AST node to evaluate.
 * @param env - The environment where variables and constants are stored.
 * @returns The runtime value resulting from evaluating the node.
 */

export function evaluate(astNode: Stmt,env:Environment): RuntimeVal {
    // Determine the kind of AST node and handle evaluation accordingly.
    switch(astNode.kind){
        // Handle numeric literals by returning their value as a NumberVal.
        case "NumericLiteral":
            return {
                value:((astNode as NumericLiteral).value),
                type:"number",
            } as NumberVal;
        // Handle identifiers by evaluating them in the current environment.
        case "Identifier":
            return eval_identifier(astNode as Identifier,env)

        case "ObjectLiteral":
            return eval_object_expr(astNode as ObjectLiteral,env);

        // Handle assignment expressions by evaluating the assignment logic.
        case "AssignmentExpr":
            return eval_assignment(astNode as AssignmentExpr,env);

        // Handle binary expressions (e.g., arithmetic operations) by evaluating them.
        case "BinaryExpr":
            return eval_binary_expr(astNode as BinaryExpr,env);

        // Handle a program node by evaluating its body statements sequentially.
        case "Program":
            return eval_program(astNode as Program,env);


        // Handle variable declarations by evaluating and storing them in the environment.
        case "VarDeclaration":
            return eval_var_declaration(astNode as VarDeclaration,env)

        // Default case for unsupported AST nodes.
            default:
                console.error("this AST Node has not yet been setup for interpretation",astNode);
                Deno.exit(1);  // Exit the process if an unsupported node is encountered.
                return MK_NULL(); // Return a null value as a fallback.
    }
}

