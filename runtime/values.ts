// Define the possible types of values that can exist in the runtime.
export type ValueType = "null" | "number" | "boolean" | "objects";

// Base interface for all runtime values.
export interface RuntimeVal {
    type:ValueType;  // Specifies the type of the runtime value (e.g., "null", "number", "boolean").
}

// Interface for null values in the runtime.
export interface NullVal extends RuntimeVal{
    type: "null";   // Indicates the value is of type "null".
    value: null;    // The actual value, which is always null.
}

/**
 * Factory function to create a null value.
 * @returns A `NullVal` object representing a null value in the runtime.
 */

export function MK_NULL(){
    return {type: "null", value:null} as NullVal
}

// Interface for boolean values in the runtime.
export interface BooleanVal extends RuntimeVal{
    type:"boolean", // Indicates the value is of type "boolean".
    value:boolean   // The actual boolean value (true or false).
}

/**
 * Factory function to create a boolean value.
 * @param b - The boolean value to assign, defaults to true.
 * @returns A `BooleanVal` object representing the boolean value.
 */

export function MK_BOOL(b=true){
    return {type: "boolean", value:b} as BooleanVal;
}

// Interface for numeric values in the runtime.
export interface NumberVal extends RuntimeVal{
    type: "number"; // Indicates the value is of type "number".
    value: number;  // The actual numeric value.
}


/**
 * Factory function to create a numeric value.
 * @param n - The number to assign as the value.
 * @returns A `NumberVal` object representing the numeric value.
 */

export function MK_NUMBER(n:number){
    return {type: "number", value:n} as NumberVal
}

export function ObjectVal(n:number){
    type:"object";
    properties: Map<String,RuntimeVal>;
}
