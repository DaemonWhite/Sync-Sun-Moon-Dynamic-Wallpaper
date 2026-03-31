/**
 * Print a message uuid
 *
 * @param {string} msg Message to print.
 */
export function message(msg) {
  console.log(` ${NTS.metadata['uuid']} => ${msg} `);
}

export function messageWarning(msg) {
  console.warn(` ${NTS.metadata['uuid']} => ${msg} `);
}

export function messageError(msg) {
  console.error(` ${NTS.metadata['uuid']} => ${msg} `);
}
