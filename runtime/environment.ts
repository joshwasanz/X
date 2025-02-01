import {MK_BOOL, MK_NATIVE_FN, MK_NULL, MK_NUMBER, RuntimeVal} from './values.ts';


/**
 * Represents an environment for variable storage and resolution.
 * Each environment has a scope and can have a parent environment to form a chain of scopes.
 */

export function createGlobalEnv(){
    const env = new Environment();

    //create default gloabl environment
    env.declareVar("true",MK_BOOL(true),true);
    env.declareVar("false",MK_BOOL(false),true);
    env.declareVar("null",MK_NULL(),true);

    //define a native builting mathod
    env.declareVar("print",MK_NATIVE_FN((args,scope)=>{
        console.log(...args);
        return MK_NULL();
    }),true)

    function timeFunction(args:RuntimeVal[],env:Environment){
        return MK_NUMBER(Date.now());
    }
    env.declareVar("time",MK_NATIVE_FN(timeFunction),true);

    return env;

}

export default class Environment{

    private parent?: Environment;  // Reference to the parent environment (if any)
    private variables: Map<string,RuntimeVal>;  // Map of variable names to their runtime values
    private constants:Set<string>;              // Set of constant variable names


    
    /**
     * Creates a new environment instance.
     * @param parentEnv - The parent environment (optional).
     */

    constructor(parentEnv?:Environment){
        const global = parentEnv? true : false;
        this.parent = parentEnv;
        this.variables = new Map();
        this.constants = new Set();

        
    }


     /**
     * Declares a new variable in the current environment.
     * Throws an error if the variable is already defined.
     * @param varname - The name of the variable.
     * @param value - The value to assign to the variable.
     * @param constant - Whether the variable is a constant.
     * @returns The runtime value of the declared variable.
     */

    public declareVar(varname:string,value:RuntimeVal,constant:boolean):RuntimeVal{
        if (this.variables.has(varname)){
            throw `Cannot declare variable ${varname}. As its already defined`
        }

        this.variables.set(varname,value);

        if(constant){
            this.constants.add(varname);  // Mark the variable as constant if specified
        }
        return value
    }

     /**
     * Assigns a value to an existing variable.
     * Throws an error if the variable is constant or cannot be resolved.
     * @param varname - The name of the variable.
     * @param value - The new value to assign.
     * @returns The newly assigned value.
     */

    public assignVar(varname:string, value:RuntimeVal):RuntimeVal{
        const env = this.resolve(varname);  // Resolve the variable in the environment chain
        if(env.constants.has(varname)){
            throw `Cannot reaasign to variable ${varname} as it was declared constant`
        }
        env.variables.set(varname,value);
        return value;
    }

     /**
     * Looks up the value of a variable.
     * Resolves the variable from the current environment or parent environments.
     * @param varname - The name of the variable to look up.
     * @returns The runtime value of the variable.
     */


    public lookupVar(varname:string):RuntimeVal{
        const env = this.resolve(varname);  // Resolve the variable in the environment chain
        return env.variables.get(varname) as RuntimeVal;
    }


       /**
     * Resolves the environment where a variable is declared.
     * Searches the current environment and parent environments recursively.
     * @param varname - The name of the variable to resolve.
     * @returns The environment where the variable is declared.
     * @throws An error if the variable cannot be resolved.
     */


    public resolve(varname:string):Environment{
        if(this.variables.has(varname)){
            return this; // Return the current environment if the variable is found
        }

        if (this.parent == undefined){
            throw `Cannot resolve ${varname} as it does not exist.`
        }
        return this.parent.resolve(varname);  // Recur to the parent environment
    }
}