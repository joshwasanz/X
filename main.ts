import Parser from "./frontend/parser.ts"
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { NumberVal } from "./runtime/values.ts";

X();


function X(){
    const parser = new Parser();
    const env = new Environment();
    env.declareVar("x", { value: 100, type: "number" } as NumberVal);
    console.log("\nX v0.1");

    while(true){
        const input = prompt("-> ");
        // check for no user input or exit keyword
        if(!input || input.includes("exit")){
            Deno.exit(1);
        }

        const program = parser.productAST(input!);
        
        const result = evaluate(program,env);
        console.log(result);

        
        
    }   
}