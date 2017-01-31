/**
 * A class for signifying that an error is a "handleable" error that comes from the
 * NG Canvas Library, as opposed to an error that comes from some internal operation
 * or runtime error.
 */
export class DrawError extends Error {
    /**
     * @constructor
     *
     * @param message Error message to be propagated.
    */
    constructor(message: string, stage: string) {
        super(message);
        this.name = 'draw Error';
        this.message = `Error during ${stage}: ${message}`;
        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, this.constructor);
        }
        else {
            let error = new Error();
            if (error.stack) {
                let last_part = error.stack.match(/[^\s]+$/);
                this.stack = `${this.name} at ${last_part}`;
            }
        }
    }
}
