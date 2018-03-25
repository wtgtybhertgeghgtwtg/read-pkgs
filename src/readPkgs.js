// @flow
import assert from 'assert';
import fastGlob from 'fast-glob';
import getStream from 'get-stream';
import isobject from 'isobject';
import path from 'path';
import readPkg from 'read-pkg';
import through from 'through2';

type ReadPkgsOptions = {
  cwd?: string,
  normalize?: boolean,
};

export default async function readPkgs(
  patterns: string | Array<string>,
  options?: ReadPkgsOptions = {},
) {
  assert(
    typeof patterns === 'string' ||
      (Array.isArray(patterns) &&
        patterns.every(pattern => typeof pattern === 'string')),
    '"patterns" must be a string or an array of strings.',
  );
  assert(
    isobject(options),
    '"options" must be a ReadPkgsOptions object or undefined.',
  );
  const {cwd = process.cwd(), normalize = true} = options;
  assert(
    typeof normalize === 'boolean',
    '"options.normalize" must be a boolean or undefined.',
  );
  return getStream.array(
    fastGlob
      .stream(patterns, {
        cwd,
        onlyDirectories: true,
        onlyFiles: false,
      })
      .pipe(
        through.obj((directory, enc, callback) => {
          readPkg(path.resolve(cwd, directory), {normalize}).then(pkg =>
            callback(null, {directory, pkg}),
          );
        }),
      ),
  );
}
