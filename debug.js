/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

export class Debug {
    /**
     * Represents a utility class for debugging GJS messages with
     * UUID-based formatting.
     *
     * The reason is that it is difficult to find your way back with all the
     * Gnome Shell logs
     *
     * There needs to be an initializer in Main for them to pass their UUID
     *
     * @class Debug
     * @example
     * Debug.setUUID('SunMoonDynamic.DaemonWhite.fr');
     * Debug.message('Init passed');
     * // Display
     * // GTK-Message : [SunMoonDynamic.DaemonWhite.fr] : Init passed
     */

    static #UUID = 'Undefined';

    /**
     * Sets the UUID for debugging messages.
     *
     * @static
     * @param {string} uuid - The UUID to set for debugging.
     */
    static setUUID(uuid) {
        this.#UUID = uuid;
    }

    /**
     * Gets the current UUID used for debugging messages.
     *
     * @static
     * @returns {string} The current UUID.
     */
    static getUUID() {
        return this.#UUID;
    }

    /**
     * Formats a message with the current UUID.
     *
     * @private
     * @param {string} msg - The message to format.
     * @returns {string} The formatted message.
     */
    static #format(msg) {
        return `[${this.#UUID}] : ${msg}`;
    }

    /**
     * Logs a debug message with the current UUID.
     *
     * @static
     * @param {string} msg - The message to log.
     */
    static message(msg) {
        console.log(this.#format(msg));
    }

    /**
     * Logs a warning message with the current UUID.
     *
     * @static
     * @param {string} msg - The warning message to log.
     */
    static messageWarning(msg) {
        console.warn(this.#format(msg));
    }

    /**
     * Logs an error message with the current UUID.
     *
     * @static
     * @param {string} msg - The error message to log.
     */
    static messageError(msg) {
        console.error(this.#format(msg));
    }
}
