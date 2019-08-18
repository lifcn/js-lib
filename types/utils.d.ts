import { EoneoCallback, EoneoError } from 'types/library'
export declare function createError(message: string): EoneoError
export declare function emitError(message: string | string[], callback?: EoneoCallback<any>): EoneoError | Promise<never> | undefined
