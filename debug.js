/**
 * Print a message uuid
 *
 * @param {string} msg Message to print.
 */
export function message(msg) {
  console.log(` ${SND.metadata['uuid']} => ${msg} `);
}

export function messageWarning(msg) {
  console.warn(` ${SND.metadata['uuid']} => ${msg} `);
}

export function messageError(msg) {
  console.error(` ${SND.metadata['uuid']} => ${msg} `);
}
