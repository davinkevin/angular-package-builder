import * as fsExtra from 'fs-extra';
import * as path from 'path';

import { resolvePath } from './resolve-path';

/**
 * Clean a folder
 *
 * @param   folderPath - Path to the folder
 * @returns            - Promise, resolves with File content (parsed if JSON)
 */
export function cleanFolder( folderPath: string ): Promise<void> {
	return new Promise<void>( ( resolve: () => void, reject: ( error: Error ) => void ) => {

		// Resolve file path to an absolute one
		const resolvedFolderPath: string = resolvePath( folderPath );

		// Read file asynchronously
		fsExtra.emptyDir( resolvedFolderPath, ( readFileError: NodeJS.ErrnoException | null, fileContent: string ) => {

			// Handle errors
			if ( readFileError ) {
				reject( new Error( `An error occured while cleaning the folder "${ resolvedFolderPath }". [Code "${ readFileError.code }", Number "${ readFileError.errno }"]` ) );
				return;
			}

			resolve();

		} );

	} );
}
