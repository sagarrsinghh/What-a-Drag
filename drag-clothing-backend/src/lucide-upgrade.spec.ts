import * as fs from 'fs';
import * as path from 'path';

const frontendRoot = path.resolve(__dirname, '../../drag-clothing-frontend');
const sourceRoot = path.join(frontendRoot, 'src');

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(fullPath);
    return /\.jsx?$/.test(entry.name) ? [fullPath] : [];
  });
}

function importedLucideNames(source: string): string[] {
  const importPattern =
    /(?:^|\n)\s*import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"]/g;
  const names: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = importPattern.exec(source)) !== null) {
    for (const part of match[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim();
      if (name) names.push(name);
    }
  }

  return names;
}

describe('lucide-react 1.74 upgrade', () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(frontendRoot, 'package.json'), 'utf8'),
  );

  it('pins lucide-react to the release that renames the centerline icon family to axis', () => {
    const range: string = packageJson.dependencies['lucide-react'];
    const minimum = range.replace(/^[^0-9]*/, '');
    const [major, minor] = minimum.split('.').map(Number);

    expect(major > 1 || (major === 1 && minor >= 74)).toBe(true);
  });

  it('does not import brand icons that lucide-react 1.x removed from the package', () => {
    const removedIcons = new Set(['Github', 'Instagram', 'Linkedin', 'Twitter']);
    const files = sourceFiles(sourceRoot);
    const offenders: string[] = [];

    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      for (const name of importedLucideNames(fs.readFileSync(file, 'utf8'))) {
        if (removedIcons.has(name)) {
          offenders.push(`${path.relative(frontendRoot, file)}: ${name}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('does not use the old Centerline icon components', () => {
    const files = sourceFiles(sourceRoot);
    const offenders: string[] = [];

    for (const file of files) {
      for (const name of importedLucideNames(fs.readFileSync(file, 'utf8'))) {
        if (name.includes('Centerline')) {
          offenders.push(`${path.relative(frontendRoot, file)}: ${name}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
