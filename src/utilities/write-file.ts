import * as fsExtra from 'fs-extra';
import * as path from 'path';

import { resolvePath } from './resolve-path';

/**
 * Write content into a file
 *
 * @param   filePath    - Path to the file
 * @param   fileContent - Content of the file
 * @returns             - Promise
 */
export function writeFile( filePath: string, fileContent: string | Object ): Promise<void> {
	return new Promise<void>( ( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Resolve file path to an absolute one
		const resolvedFilePath: string = resolvePath( filePath )

		// Write file asynchronously; implicitely creates the file (and the directory) if necessary
		fsExtra.outputFile( resolvedFilePath, fileContent, 'utf-8', ( writeFileError: NodeJS.ErrnoException | null ) => {

			// Handle errors
			if ( writeFileError ) {
				reject( new Error( `An error occured while writing the file "${ resolvedFilePath }". [Code "${ writeFileError.code }", Number "${ writeFileError.errno }"]` ) );
				return;
			}

			resolve();

		} );

	} );
}
