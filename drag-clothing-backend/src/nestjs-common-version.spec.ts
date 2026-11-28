import * as fs from 'fs';
import * as path from 'path';

interface PackageJson {
  dependencies?: Record<string, string>;
}

interface LockPackage {
  version?: string;
}

interface Lockfile {
  packages?: Record<string, LockPackage>;
}

const backendRoot = path.resolve(__dirname, '..');
const MINIMUM: readonly [number, number, number] = [11, 2, 12];

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(backendRoot, file), 'utf8')) as T;
}

function parseVersion(value: string | undefined): [number, number, number] {
  if (!value) {
    throw new Error('missing version');
  }

  const match = value.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    throw new Error(`unparsable version: ${value}`);
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function rank([major, minor, patch]: readonly [
  number,
  number,
  number,
]): number {
  return major * 1_000_000 + minor * 1_000 + patch;
}

function lockVersion(lock: Lockfile, name: string): string | undefined {
  return lock.packages?.[`node_modules/${name}`]?.version;
}

describe('@nestjs/common version alignment', () => {
  const pkg = readJson<PackageJson>('package.json');
  const lock = readJson<Lockfile>('package-lock.json');

  it('pins @nestjs/common to the latest 11.x release compatible with the installed stack', () => {
    const pin = parseVersion(pkg.dependencies?.['@nestjs/common']);

    expect(rank(pin)).toBeGreaterThanOrEqual(rank(MINIMUM));
  });

  it('resolves @nestjs/common from the lockfile at the pinned version', () => {
    const resolved = parseVersion(lockVersion(lock, '@nestjs/common'));

    expect(rank(resolved)).toBeGreaterThanOrEqual(rank(MINIMUM));
    expect(resolved[0]).toBe(
      parseVersion(pkg.dependencies?.['@nestjs/common'])[0],
    );
  });

  it('keeps @nestjs/common on the same major as @nestjs/core so peer ranges resolve', () => {
    const commonMajor = parseVersion(lockVersion(lock, '@nestjs/common'))[0];
    const coreMajor = parseVersion(lockVersion(lock, '@nestjs/core'))[0];

    expect(commonMajor).toBe(coreMajor);
  });
});
