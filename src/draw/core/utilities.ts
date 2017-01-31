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

export function saveFile(blob: Blob, name: string) {
    let url = URL.createObjectURL(blob);
    let downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

export async function loadFile() {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    fileInput.click();
    let promise = new Promise<string>((resolve, reject) => {
        fileInput.onchange = (e: any) => {
            try {
                let file = e.target.files[0];
                if (file == null) {
                    return;
                }
                let reader = new FileReader();
                reader.onload = (e: any) => {
                    try {
                        let contents = e.target.result;
                        resolve(contents && contents.trim());
                    }
                    catch (e) {
                        reject(e);
                    }
                };
                reader.onerror = (e: any) => {
                    reject(e);
                }
                reader.readAsText(file);
            }
            catch (e) {
                reject(e);
            }
        };
    });

    let result: string = null;
    try {
        result = await promise;
    }
    catch (e) {
        console.info('Unable to load file:', e);
    }
    finally {
        document.body.removeChild(fileInput);
        return result;
    }
}