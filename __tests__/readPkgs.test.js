// @flow
import normalizePackageData from 'normalize-package-data';
import path from 'path';
import readPkgs from '../src';
import packageOne from './fixtures/packageOne/package.json';
import packageTwo from './fixtures/packageTwo/package.json';
import packageThree from './fixtures/packageThree/package.json';

const normalPackageOne = {...packageOne};
const normalPackageTwo = {...packageTwo};
const normalPackageThree = {...packageThree};
normalizePackageData(normalPackageOne);
normalizePackageData(normalPackageTwo);
normalizePackageData(normalPackageThree);

describe('readPkgs', () => {
  describe('invariants', () => {
    it('rejects if "patterns" is undefined.', async () => {
      // $FlowFixMe
      await expect(readPkgs()).rejects.toThrow(
        '"patterns" must be a string or an array of strings.',
      );
    });

    it('rejects if "patterns" is an array with non-string elements.', async () => {
      // $FlowFixMe
      await expect(readPkgs([1])).rejects.toThrow(
        '"patterns" must be a string or an array of strings.',
      );
    });

    it('rejects if "options" is null.', async () => {
      // $FlowFixMe
      await expect(readPkgs('', null)).rejects.toThrow(
        '"options" must be a ReadPkgsOptions object or undefined.',
      );
    });

    it('rejects if "options" is not an object.', async () => {
      // $FlowFixMe
      await expect(readPkgs('', 1)).rejects.toThrow(
        '"options" must be a ReadPkgsOptions object or undefined.',
      );
    });
  });

  describe('loading packages', () => {
    it('loads all `package.json` under the given directory.', async () => {
      const pkgs = await readPkgs('__tests__/fixtures/*');
      expect(pkgs).toEqual(
        expect.arrayContaining([
          {
            directory: '__tests__/fixtures/packageOne',
            pkg: normalPackageOne,
          },
          {
            directory: '__tests__/fixtures/packageTwo',
            pkg: normalPackageTwo,
          },
          {
            directory: '__tests__/fixtures/packageThree',
            pkg: normalPackageThree,
          },
        ]),
      );
    });

    it('can run from a different "cwd".', async () => {
      const pkgs = await readPkgs('fixtures/*', {
        cwd: path.resolve('__tests__'),
      });
      expect(pkgs).toEqual(
        expect.arrayContaining([
          {
            directory: 'fixtures/packageOne',
            pkg: normalPackageOne,
          },
          {
            directory: 'fixtures/packageTwo',
            pkg: normalPackageTwo,
          },
          {
            directory: 'fixtures/packageThree',
            pkg: normalPackageThree,
          },
        ]),
      );
    });

    it('can load non-normalized `package.json` under the given directory.', async () => {
      const pkgs = await readPkgs('__tests__/fixtures/*', {normalize: false});
      expect(pkgs).toEqual(
        expect.arrayContaining([
          {
            directory: '__tests__/fixtures/packageOne',
            pkg: packageOne,
          },
          {
            directory: '__tests__/fixtures/packageTwo',
            pkg: packageTwo,
          },
          {
            directory: '__tests__/fixtures/packageThree',
            pkg: packageThree,
          },
        ]),
      );
    });
  });
});
