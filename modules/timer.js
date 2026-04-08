import Geoclue from 'gi://Geoclue';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import GLib from 'gi://GLib';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';

import { Debug } from '../debug.js';


export class Timer extends GObject.Object {
    #geoclue = null;
    #cancellable = null;
    #timeoutId = null;

    static {
        GObject.registerClass({}, this);
    }

    constructor() {
        super();
    }

    enable() {
        this.#cancellable = new Gio.Cancellable();


        Debug.message('Stating GeoClue');

        this.#timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 10, () => {
            Debug.messageError('Geoclue timeout: service took too long to respond.');
            this._abortGeoclue();
            return GLib.SOURCE_REMOVE;
        });

        Geoclue.Simple.new(
            'org.gnome.shell.extensions.SunMoonDynamic',
            Geoclue.AccuracyLevel.EXACT,
            this.#cancellable,
            (source, result) => {
                if (this.#timeoutId > 0) {
                    GLib.Source.remove(this.#timeoutId);
                    this.#timeoutId = 0;
                }
                this.#onGeoclueReady(source, result);
            }
        );

        Debug.message('Timer started');

    }

    _abortGeoclue() {
        if (this.#cancellable) {
            this.#cancellable.cancel();
            this.#cancellable = null;
        }
        this.#timeoutId = null;
    }

    disable() {
        this._abortGeoclue();
        if (this.#geoclue) {
            this.#geoclue = null
        }
        Debug.message('Timer killed');
    }

    #onGeoclueReady(_source, result) {
        try {

            this.#geoclue = Geoclue.Simple.new_finish(result);

            const location = this.#geoclue.get_location();
            const msg = `Connected to geoclue. Lat: ${location.latitude}, Lon: ${location.longitude}`;
            Debug.message(msg);

            Main.notify('SunMoonDynamic Position', msg);

            this.#geoclue.connect('notify::location', () => {
                Debug.message('Location changed!');

                const newLocation = this.#geoclue.get_location();
                const msg = `Location updated. Lat: ${newLocation.latitude}, Lon: ${newLocation.longitude}`;
                Debug.message(msg);
                Main.notify('SunMoonDynamic Update Position', msg);
            });

        } catch (e) {
            Debug.messageError('Failed to connect to Geoclue: ' + e);
            Main.notify('SunMoonDynamic Failled', 'Impossible to detected localisation, Enable WiFi or GPS and authorised location in Gnome Settings');
        }
    }

}
