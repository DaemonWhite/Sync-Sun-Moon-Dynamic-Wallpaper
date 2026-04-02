import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import { buildDynamicImageByXmlFile } from './modules/imageDynamic.js';
import { getBackgroundProperties } from './modules/utils.js';
import { Debug } from './debug.js';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export default class ExamplePreferences extends ExtensionPreferences {

    #window = null;
    #listDynamicImage = [];

    #buildMainPage() {
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        
        const group = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Configure the appearance of the extension'),
        });
        page.add(group);

        // Create a new preferences row
        const row = new Adw.SwitchRow({
            title: _('Show Indicator'),
            subtitle: _('Whether to show the panel indicator'),
        });
        group.add(row);

        // Create a settings object and bind the row to the `show-indicator` key
        window._settings = this.getSettings();
        window._settings.bind('show-indicator', row, 'active',
            Gio.SettingsBindFlags.DEFAULT);

        this.#window.add(page);
    }

    #buildPicturePage() {
        const page = new Adw.PreferencesPage({
            title: _('picturePage'),
            icon_name: 'dialog-information-symbolic',
        });

        this.#window.add(page)
    }

    fillPreferencesWindow(window) {
        this.#window = window;
        Debug.setUUID(this.metadata['uuid']);
        const pathImages = getBackgroundProperties();

        Debug.message(`list images detected :  ${pathImages}`);

        for (let pathImage of pathImages) {
            const images = buildDynamicImageByXmlFile(pathImage);
            for (let dynamicImage of images) {
                Debug.message(dynamicImage.wallpaper.name);
                this.#listDynamicImage.push(dynamicImage);
            }
        }

        Debug.message(`DynamicImage loaded : ${this.#listDynamicImage}`);


        /* BUILD PAGE */

        this.#buildMainPage();
        this.#buildPicturePage();


    }
}

