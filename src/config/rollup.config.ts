import * as path from 'path';

import { Options, Bundle, Warning, Plugin, WriteOptions } from 'rollup';
import * as commonjs from 'rollup-plugin-commonjs';
import * as nodeResolve from 'rollup-plugin-node-resolve';

import { angularDependencies } from './../static/angular.dependencies';
import { getSafeDependencyName } from './../utilities/get-safe-dependency-name';
import { RollupInputConfig, RollupOutputConfig } from './rollup.config.interface';
import { rxjsDependencies } from './../static/rxjs.dependencies';

/**
 * Get Rollup Input Config
 */
export function getRollupInputConfig( sourcePath: string, name: string, dependencies: Array<string> ): RollupInputConfig {

	return {
		external: Object.keys( getRollupDependencies( dependencies ) ),
		input: path.join( sourcePath, `${ name }.js` ), // Previously 'entry' which is now deprecated
		onwarn: ( warning ) => {
			console.warn( warning.message );
		},
		plugins: [
			nodeResolve(),
			commonjs()
		]
	};

}

/**
 * Get Rollup Output Config
 */
export function getRollupOutputConfig( name: string, format: 'es' | 'umd', dependencies: Array<string> ): RollupOutputConfig {

	return {
		exports: 'named', // We export multiple things
		format,
		globals: getRollupDependencies( dependencies ),
		name, // Required for UMD bundles
		sourcemap: true
	};

}

/**
 * Get rollup dependency map
 */
function getRollupDependencies( dependencies: Array<string> ): { [ dependency: string ]: string } {

	const otherDependencies: { [ dependency: string ]: string } = dependencies

		// Filter out Angular and RxJS dependencies
		.filter( ( dependency: string ) => {
			return !dependency.startsWith( '@angular/' ) && dependency !== 'rxjs';
		} )

		// Create the package -> name map
		.reduce( ( dependencies: { [ dependency: string ]: string }, dependency: string): { [ dependencies: string ]: string } => {
			dependencies[ dependency ] = getSafeDependencyName( dependency );
			return dependencies;
		}, {} );

	return Object.assign( angularDependencies, rxjsDependencies, otherDependencies ); // Let dependencies overwrite pre-defined ones

}
