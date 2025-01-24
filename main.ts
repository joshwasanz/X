import Parser from "./frontend/parser.ts"
import Environment, { createGlobalEnv } from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_NUMBER, MK_BOOL } from "./runtime/values.ts";

// X();
run("./main.x")


async function run(filename:string){
    const parser = new Parser();
    const env = createGlobalEnv();

    const input = await Deno.readTextFile(filename);
    const program = parser.productAST(input);
    const result = evaluate(program,env);
    console.log(result);
}


function X(){
    const parser = new Parser();
    const env = createGlobalEnv();


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