import {  Program, VarDeclaration } from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, MK_NULL } from "../values.ts";


/**
 * Evaluate a program node, which represents the top-level structure of the code.
 * Iterates through all statements in the program and evaluates them in sequence.
 * @param program - The `Program` AST node containing a list of statements.
 * @param env - The current environment where variable bindings are stored.
 * @returns The value of the last evaluated statement in the program.
 */

export function eval_program(program:Program,env:Environment):RuntimeVal{
    let lastEvaluated:RuntimeVal = MK_NULL()  // Initialize the result to null

    // Iterate through each statement in the program's body and evaluate it
    for (const statement of program.body){
        lastEvaluated = evaluate(statement,env);
    }

    return lastEvaluated;  // Return the result of the last evaluated statement
}

/**
 * Evaluate a variable declaration, such as `let x = 5;`.
 * Declares a new variable in the current environment, optionally assigning it a value.
 * @param declaration - The `VarDeclaration` AST node.
 * @param env - The current environment where the variable should be declared.
 * @returns The runtime value of the declared variable.
 */

export function eval_var_declaration(
    declaration: VarDeclaration, 
    env: Environment): RuntimeVal {
        // Evaluate the value expression if provided, otherwise default to null
        const value = declaration.value 
        ?evaluate(declaration.value,env) // Evaluate the expression for the variable's value
        : MK_NULL(); // Default to null if no value is provided

        // Declare the variable in the environment
        return env.declareVar(declaration.identifier, value, declaration.constant);

}

