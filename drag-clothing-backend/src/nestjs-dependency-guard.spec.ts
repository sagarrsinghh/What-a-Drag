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
const MINIMUM = [11, 2, 12] as const;

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

const updatedPackages = ['@nestjs/core', '@nestjs/platform-express'];

describe('NestJS dependency compatibility guard', () => {
  const pkg = readJson<PackageJson>('package.json');
  const lock = readJson<Lockfile>('package-lock.json');
  const commonMajor = parseVersion(pkg.dependencies?.['@nestjs/common'])[0];

  it.each(updatedPackages)(
    'pins %s to at least 11.2.12 without leaving the @nestjs/common major',
    (name) => {
      const pin = parseVersion(pkg.dependencies?.[name]);

      expect(rank(pin)).toBeGreaterThanOrEqual(rank(MINIMUM));
      expect(pin[0]).toBe(commonMajor);
    },
  );

  it.each(updatedPackages)(
    'resolves %s from the lockfile at the pinned major',
    (name) => {
      const resolved = lockVersion(lock, name);

      expect(resolved).toBeDefined();
      const version = parseVersion(resolved);

      expect(rank(version)).toBeGreaterThanOrEqual(rank(MINIMUM));
      expect(version[0]).toBe(commonMajor);
    },
  );
});
