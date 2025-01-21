import Parser from "./frontend/parser.ts"
import { evaluate } from "./runtime/interpreter.ts";

X();


function X(){
    const parser = new Parser();
    console.log("\nX v0.1");

    while(true){
        const input = prompt("-> ");
        // check for no user input or exit keyword
        if(!input || input.includes("exit")){
            Deno.exit(1);
        }

        const program = parser.productAST(input!);
        console.log(program);  
        
        const result = evaluate(program);
        console.log(result);

        console.log("_________\n\n\n");
        
        
    }   
}