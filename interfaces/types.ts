


export interface GptMessage {
    role: string,
    content: string
}

export interface GptResponseChoice {

    message: GptMessage,
    finish_reason?: string,
    index: number
}

 

export interface TurboGptResponse {
 

        id:string,
        object:string,
        created:number,
        model:string, 
        choices: GptResponseChoice[]
    
}



export type AssertionResult<T> = AssertionSuccess<T> | AssertionFailure;


export interface AssertionSuccess<T> {
    success:boolean,
    data: T,
}

export interface AssertionFailure {
    success:boolean,
    error?: string,
}