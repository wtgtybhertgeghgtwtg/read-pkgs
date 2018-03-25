// @flow
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

export default function readPkgs(
  patterns: string | Array<string>,
  options?: ReadPkgsOptions = {},
): Promise<Array<{directory: string, pkg: Object}>> {
  if (
    typeof patterns !== 'string' &&
    !(
      Array.isArray(patterns) &&
      patterns.every(pattern => typeof pattern === 'string')
    )
  ) {
    return Promise.reject(
      new Error('"patterns" must be a string or an array of strings.'),
    );
  }
  if (!isobject(options)) {
    return Promise.reject(
      new Error('"options" must be a ReadPkgsOptions object or undefined.'),
    );
  }

  const {cwd = process.cwd(), normalize = true} = options;
  if (typeof normalize !== 'boolean') {
    return Promise.reject(
      new Error('"options.normalize" must be a boolean or undefined.'),
    );
  }
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
