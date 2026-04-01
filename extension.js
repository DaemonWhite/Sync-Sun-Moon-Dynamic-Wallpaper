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
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';


import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import {QuickToggle, SystemIndicator} from 'resource:///org/gnome/shell/ui/quickSettings.js';


import { Timer } from './modules/timer.js';
import { Debug } from './debug.js'

const ExampleToggle = GObject.registerClass(
class ExampleToggle extends QuickToggle {
    constructor() {
        super({
            title: _('Smile'),
            iconName: 'face-smile-symbolic',
            toggleMode: true,
        });
        
    }
});

const ExampleIndicator = GObject.registerClass(
class ExampleIndicator extends SystemIndicator {
    constructor(settings) {
        super();
        this._settings = settings;
        this._indicator = this._addIndicator();
        this._indicator.iconName = 'face-smile-symbolic';

        const toggle = new ExampleToggle();
        
        this._settings.bind(
          'show-indicator', 
          toggle, 
          'checked',
          Gio.SettingsBindFlags.DEFAULT
        );
        
        toggle.bind_property('checked',
            this._indicator, 'visible',
            GObject.BindingFlags.SYNC_CREATE);
            
        this.quickSettingsItems.push(toggle);
    }
});

export default class QuickSettingsExampleExtension extends Extension {
    enable() {
        Debug.setUUID(this.metadata['uuid']);
        Debug.message('Enabling...');
        this._timer = new Timer();
        this._timer.enable();
        this._settings = this.getSettings('org.gnome.shell.extensions.SunMoonDynamic');
        this._indicator = new ExampleIndicator(this._settings);
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
        Debug.message('Enabled');
    }

    disable() {
        Debug.message('Disabling...');
        this._indicator.quickSettingsItems.forEach(item => item.destroy());
        this._indicator.destroy();
        this._settings = null;
        this._timer.disable();
        this._timer = null;
        Debug.message('Disabled');
    }
}
