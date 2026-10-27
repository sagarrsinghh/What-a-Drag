import * as fs from 'fs';
import * as path from 'path';

// Guards the CVE fixes applied to transitive dependencies:
// - body-parser bumped to 2.4.0 (GHSA-27r3-jxmh-p828) in the backend lockfile
// - zod bumped to 4.6.6 (GHSA-mrhx-c7xc-m3w5) in the frontend lockfile
describe('CVE dependency pins', () => {
  const backendLock = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'package-lock.json'), 'utf8'),
  );
  const frontendLock = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'drag-clothing-frontend', 'package-lock.json'),
      'utf8',
    ),
  );

  it('pins body-parser to 2.4.0', () => {
    const bp = backendLock.packages['node_modules/body-parser'];
    expect(bp).toBeDefined();
    expect(bp.version).toBe('2.4.0');
  });

  it('pins zod to 4.6.6', () => {
    const zod = frontendLock.packages['node_modules/zod'];
    expect(zod).toBeDefined();
    expect(zod.version).toBe('4.6.6');
  });
});
