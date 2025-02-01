import {
  BinaryExpr,
  Identifier,
  AssignmentExpr,
  ObjectLiteral,
  CallExpr
} from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, MK_NULL, NumberVal, ObjectVal, NativeFnValue } from "../values.ts";

/**
 * Evaluate a numeric binary expression.
 * Handles arithmetic operations such as addition, subtraction, multiplication, division, and modulo.
 * @param lhs - The left-hand side operand as a NumberVal.
 * @param rhs - The right-hand side operand as a NumberVal.
 * @param operator - The binary operator to apply (+, -, *, /, %).
 * @returns A NumberVal containing the result of the operation.
 */

function eval_numeric_binary_expr(
  lhs: NumberVal,
  rhs: NumberVal,
  operator: string
): NumberVal {
  let result: number;

  // Perform the appropriate arithmetic operation
  if (operator == "+") {
    result = lhs.value + rhs.value;
  } else if (operator == "-") {
    result = lhs.value - rhs.value;
  } else if (operator == "*") {
    result = lhs.value * rhs.value;
  } else if (operator == "/") {
    result = lhs.value / rhs.value;
  } else {
    result = lhs.value % rhs.value;
  }

  return { value: result, type: "number" };
}

/**
 * Evaluate a binary expression, such as arithmetic or logical operations.
 * @param binop - The binary expression AST node.
 * @param env - The current environment containing variable bindings.
 * @returns The result of the binary expression as a RuntimeVal.
 */

export function eval_binary_expr(
  binop: BinaryExpr,
  env: Environment
): RuntimeVal {
  const lhs = evaluate(binop.left, env); // Evaluate left-hand side expression
  const rhs = evaluate(binop.right, env); // Evaluate right-hand side expression

  // Handle numeric binary expressions
  if (lhs.type == "number" && rhs.type == "number") {
    return eval_numeric_binary_expr(
      lhs as NumberVal,
      rhs as NumberVal,
      binop.operator
    );
  }

  // Default to null if unsupported types are encountered
  return MK_NULL();
}

/**
 * Evaluate an identifier by looking it up in the environment.
 * @param ident - The identifier AST node.
 * @param env - The current environment.
 * @returns The value associated with the identifier.
 */

export function eval_identifier(
  ident: Identifier,
  env: Environment
): RuntimeVal {
  const val = env.lookupVar(ident.symbol); // Fetch variable from environment
  return val;
}

/**
 * Evaluate an assignment expression, such as `x = 5`.
 * Updates the variable in the current environment.
 * @param node - The assignment expression AST node.
 * @param env - The current environment.
 * @returns The value assigned to the variable.
 */

export function eval_assignment(
  node: AssignmentExpr,
  env: Environment
): RuntimeVal {
  // Ensure the left-hand side is a valid identifier
  if (node.assigne.kind !== "Identifier") {
    throw `Invalid LHS assignment expr ${JSON.stringify(node.assigne)}`;
  }
  // Extract the variable name and evaluate the right-hand side expression
  const varname = (node.assigne as Identifier).symbol;
  return env.assignVar(varname, evaluate(node.value, env)); // Assign the value to the variable in the environment
}

export function eval_object_expr(
  obj: ObjectLiteral,
  env: Environment
): RuntimeVal {
  const object = { type: "object", properties: new Map() } as ObjectVal;
  for (const { key, value } of obj.properties) {
    const runtimeVal =
      value == undefined ? env.lookupVar(key) : evaluate(value, env);

    object.properties.set(key, runtimeVal);
  }
  return object;
}

export function eval_call_expr(
  expr: CallExpr,
  env: Environment
): RuntimeVal {
  const args = expr.args.map((arg)=> evaluate(arg, env));

  const fn = evaluate(expr.caller,env);

  if(fn.type !== "native-fn"){
    throw "Cannot call value that is not a function" + JSON.stringify(fn);
  }

  const result = (fn as NativeFnValue).call(args,env);
  return result
}