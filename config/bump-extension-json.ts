import * as fs from 'fs';
import * as path from 'path';

const version = process.argv[2];
if (!version) {
	console.error('Version argument missing!');
	process.exit(1);
}

// bump extension.json
const extPath = path.join(__dirname, '../extension.json');
interface ExtensionJson {
	name: string;
	uuid: string;
	displayName: string;
	description: string;
	version: string;
	[key: string]: unknown;
}
const extContent = fs.readFileSync(extPath, 'utf8');
const extData: ExtensionJson = JSON.parse(extContent);

extData.version = version;

fs.writeFileSync(extPath, JSON.stringify(extData, null, 2) + '\n');
console.log(`extension.json bumped to version ${version}`);

// bump package.json
const pkgPath = path.join(__dirname, '../package.json');
const pkgContent = fs.readFileSync(pkgPath, 'utf8');
const pkgData = JSON.parse(pkgContent);

pkgData.version = version;

fs.writeFileSync(pkgPath, JSON.stringify(pkgData, null, 2) + '\n');
console.log(`package.json bumped to version ${version}`);

// bump package-lock.json
const pkgLockPath = path.join(__dirname, '../package-lock.json');
const pkgLockContent = fs.readFileSync(pkgLockPath, 'utf8');
const pkgLockData = JSON.parse(pkgLockContent);

pkgLockData.version = version;
pkgLockData[''].version = version;

fs.writeFileSync(pkgLockPath, JSON.stringify(pkgLockData, null, 2) + '\n');
console.log(`package-lock.json bumped to version ${version}`);
