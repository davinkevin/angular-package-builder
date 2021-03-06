// import * as copy from 'copy';
import { copy } from 'cpx';

/**
 * Copy a file or a folder (recursively)
 *
 * @param   sourcePattern  - Pattern (glob) for the source
 * @param   desinationPath - Path to the destination folder
 * @returns                - Promise, resolves with File content (parsed if JSON)
 */
export function copyFiles( sourcePattern: string, destinationPath: string ): Promise<void> {
	return new Promise<void>( ( resolve: () => void, reject: ( error: Error ) => void ): void => {

		copy( sourcePattern, destinationPath, ( copyFilesError: Error | null ) => {
			if ( copyFilesError ) {
				reject( new Error( `An error occured while copying everything matching "${ sourcePattern }" to "${ destinationPath }". [${ copyFilesError.message }]` ) );
				return;
			}
			resolve();
		} );

	} );
}
