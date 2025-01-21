import Parser from "./frontend/parser.ts"

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
    }   
}