import * as path from 'path';
import * as fs from 'fs';

const distFolder: string = path.join( `${ path.relative( process.cwd(), __dirname ) }`, 'dist' );
const libraryName: string = 'my-library';
const indexPath: string = 'index';
const moduleName: string = 'LIBModule';
const modulePath: string = 'src/library.module';
const serviceName: string = 'LIBDataService';
const servicePath: string = 'src/data/data.service';
const componentName: string = 'LIBInputComponent';
const componentPath: string = 'src/input/input.component';

describe( `Angular Package: Flat ES2015 module`, async() => {
	await testModule( `esm2015/${ libraryName }.js` );
} );

describe( `Angular Package: Flat ES2015 module source-map`, async() => {
	await testSourcemap( `esm2015/${ libraryName }.js.map` );
} );

describe( `Angular Package: Flat ES5 module`, async() => {
	await testModule( `esm5/${ libraryName }.js` );
} );

describe( `Angular Package: Flat ES5 module source-map`, async() => {
	await testSourcemap( `esm5/${ libraryName }.js.map` );
} );

describe( `Angular Package: UMD module`, async() => {
	await testModule( `bundles/${ libraryName }.umd.js` );
} );

describe( `Angular Package: UMD module source-map`, async() => {
	await testSourcemap( `bundles/${ libraryName }.umd.js.map` );
} );

describe( 'Angular Package: TypeScript definition files', () => {

	const filePaths: Array<string> = [
		path.join( distFolder, `${ libraryName }.d.ts` ),
		path.join( distFolder, `${ indexPath }.d.ts` ),
		path.join( distFolder, `${ modulePath }.d.ts` ),
		path.join( distFolder, `${ servicePath }.d.ts` ),
		path.join( distFolder, `${ componentPath }.d.ts` ),
	];

	it ( 'should exist', async() => {

		let fileContents: Array<string>;
		let currentError: Error | null = null;
		try {
			fileContents = await filePaths.map( ( path: string ): string => {
				return fs.readFileSync( path, 'utf-8' );
			} );
		} catch ( error ) {
			currentError = error;
		}

		expect( currentError ).toBeNull();

		fileContents.forEach( ( fileContent: string ): void => {
			expect( fileContent.length ).toBeGreaterThan( 0 );
		} );

	} );

} );

describe( 'Angular Package: Metadata', () => {

	let metadataJsonFile: string = '';
	let metadataJsonFileContent: any | null = null;

	it ( 'should exist', async() => {

		let currentError: Error | null = null;
		try {
			metadataJsonFile = await fs.readFileSync( path.join( distFolder, `${ libraryName }.metadata.json` ), 'utf-8' );
		} catch ( error ) {
			currentError = error;
		}

		expect( currentError ).toBeNull();
		expect( metadataJsonFile.length ).toBeGreaterThan( 0 );

	} );

	it ( 'should be valid JSON', () => {

		let currentError: Error | null = null;
		try {
			metadataJsonFileContent = JSON.parse( metadataJsonFile );
		} catch ( error ) {
			currentError = error;
		}

		expect( currentError ).toBeNull();
		expect( metadataJsonFileContent ).toEqual( expect.objectContaining( {} ) );

	} );

	it ( 'should contain the correct version', () => {

		expect( metadataJsonFileContent.version ).toBe( 4 );

	} );

	it ( 'should contain the correct import name', () => {

		expect( metadataJsonFileContent.importAs ).toBe( libraryName );

	} );

	it ( 'should contain all meta information', () => {

		const metadata: Array<string> = Object.keys( metadataJsonFileContent.metadata );
		const origins: Array<string> = Object.keys( metadataJsonFileContent.origins );

		expect( metadataJsonFileContent.__symbolic ).toBe( 'module' );

		const metadataStructure: any = expect.objectContaining( {
			__symbolic: expect.any( String ),
			decorators: expect.any( Array ),
			members: expect.any( Object )
		} );

		expect( metadata.length ).toBe( 3 );
		expect( metadataJsonFileContent.metadata[ moduleName ] ).toEqual( metadataStructure );
		expect( metadataJsonFileContent.metadata[ serviceName ] ).toEqual( metadataStructure );
		expect( metadataJsonFileContent.metadata[ componentName ] ).toEqual( metadataStructure );

		expect( origins.length ).toBe( 3 );
		expect( metadataJsonFileContent.origins[ moduleName ] ).toBe( `./${ modulePath }` );
		expect( metadataJsonFileContent.origins[ serviceName ] ).toBe( `./${ servicePath }` );
		expect( metadataJsonFileContent.origins[ componentName ] ).toBe( `./${ componentPath }` );

	} );

} );

async function testModule( modulePath: string ): Promise<void> {

	let moduleFileContent: any = null;

	it ( 'should exist', async() => {

		moduleFileContent = await import( `./dist/${ modulePath }` );

		expect( moduleFileContent ).not.toBeNull();

	} );

	it ( 'should contain classes with attached metadata', () => {

		// Module
		expect( moduleFileContent[ moduleName ] ).toEqual( expect.any( Function ) );
		expect( moduleFileContent[ moduleName ].decorators ).toEqual( expect.any( Array ) );
		expect( moduleFileContent[ moduleName ].ctorParameters ).toEqual( expect.any( Function ) );

		// Service
		expect( moduleFileContent[ serviceName ] ).toEqual( expect.any( Function ) );
		expect( moduleFileContent[ serviceName ].decorators ).toEqual( expect.any( Array ) );
		expect( moduleFileContent[ serviceName ].ctorParameters ).toEqual( expect.any( Function ) );

		// Component
		expect( moduleFileContent[ componentName ] ).toEqual( expect.any( Function ) );
		expect( moduleFileContent[ componentName ].decorators ).toEqual( expect.any( Array ) );
		expect( moduleFileContent[ componentName ].propDecorators ).toEqual( expect.any( Object ) );
		expect( moduleFileContent[ componentName ].ctorParameters ).toEqual( expect.any( Function ) );

	} );

	it ( 'should contain inlined component template', () => {

		const componentDecorator: any = moduleFileContent[ componentName ].decorators[ 0 ].args[ 0 ];

		expect( componentDecorator.templateUrl ).toBeUndefined();
		expect( componentDecorator.template ).toEqual( expect.any( String ) );
		expect( componentDecorator.template.length ).toBeGreaterThan( 0 );

	} );

	it ( 'should contain inlined component styles', () => {

		const componentDecorator: any = moduleFileContent[ componentName ].decorators[ 0 ].args[ 0 ];

		expect( componentDecorator.styleUrls ).toBeUndefined();
		expect( componentDecorator.styles ).toEqual( expect.any( Array ) );
		expect( componentDecorator.styles.length ).toBe( 1 );
		expect( componentDecorator.styles[ 0 ] ).toEqual( expect.any( String ) );
		expect( componentDecorator.styles[ 0 ].length ).toBeGreaterThan( 0 );

	} );

}

async function testSourcemap( sourcemapPath: string ): Promise<void> {

	let sourceMapFile: string = '';
	let sourceMapFileContent: any | null = null;

	it ( 'should exist', async() => {

		let currentError: Error | null = null;
		try {
			sourceMapFile = await fs.readFileSync( path.join( distFolder, sourcemapPath ), 'utf-8' );
		} catch ( error ) {
			currentError = error;
		}

		expect( currentError ).toBeNull();
		expect( sourceMapFile.length ).toBeGreaterThan( 0 );

	} );

	it ( 'should be valid JSON', () => {

		let currentError: Error | null = null;
		try {
			sourceMapFileContent = JSON.parse( sourceMapFile );
		} catch ( error ) {
			currentError = error;
		}

		expect( currentError ).toBeNull();
		expect( sourceMapFileContent ).toEqual( expect.objectContaining( {} ) );

	} );

	it ( 'should contain the correct version', () => {

		expect( sourceMapFileContent.version ).toBe( 3 );

	} );

	it ( 'should contain all sources', () => {

		expect( sourceMapFileContent.sources ).toEqual( [
			`${ servicePath }.js`,
			`${ componentPath }.js`,
			`${ modulePath }.js`,
			`${ indexPath }.js`,
			`${ libraryName }.js`,
		] );

		expect( sourceMapFileContent.sourcesContent.length ).toBe( 5 );

	} );

	if ( sourcemapPath.indexOf( 'umd' ) !== -1 ) {
		it ( 'should contain all names', () => {

			expect( sourceMapFileContent.names ).toEqual( expect.any( Array ) );
			expect( sourceMapFileContent.names.length ).toBeGreaterThan( 0 );

		} );
	}

}
