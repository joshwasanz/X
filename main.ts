import Parser from "./frontend/parser.ts"
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_NUMBER, MK_BOOL } from "./runtime/values.ts";

X();


function X(){
    const parser = new Parser();
    const env = new Environment();
    env.declareVar("sample", MK_NUMBER(10),true);
    env.declareVar("true",MK_BOOL(true),true);
    env.declareVar("false",MK_BOOL(true),true);
    env.declareVar("null",MK_NULL(),true);

    console.log("\nX🔥 v0.1");

    while(true){
        const input = prompt("-> ");
        // check for no user input or exit keyword
        if(!input || input.includes("exit")){
            Deno.exit(1);
        }

        const program = parser.productAST(input!);
        
        const result = evaluate(program,env);
        console.log(result['value']);

        
        
    }   
}