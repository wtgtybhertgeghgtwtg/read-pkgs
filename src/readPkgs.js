// @flow
import fastGlob from 'fast-glob';
import getStream from 'get-stream';
import isobject from 'isobject';
import path from 'path';
import readPkg from 'read-pkg';
import {Transform} from 'stream';

type ReadPkgsOptions = {
  cwd?: string,
  normalize?: boolean,
};

export default function readPkgs(
  patterns: string | Array<string>,
  options?: ReadPkgsOptions = {},
): Promise<Array<{directory: string, pkg: Object}>> {
  if (typeof patterns === 'string') {
    patterns = [patterns];
  } else if (
    !Array.isArray(patterns) ||
    patterns.some(pattern => typeof pattern !== 'string')
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
      .stream(patterns.map(pattern => path.join(pattern, 'package.json')), {
        cwd,
      })
      .pipe(
        new Transform({
          objectMode: true,
          transform(directory, encoding, callback) {
            readPkg(path.resolve(cwd, directory), {normalize}).then(pkg =>
              callback(null, {directory: path.dirname(directory), pkg}),
            );
          },
        }),
      ),
  );
}
