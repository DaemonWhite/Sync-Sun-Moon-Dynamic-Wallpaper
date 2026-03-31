import Geoclue from 'gi://Geoclue';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';

import { gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';

// Use GObject.registerClass to wrap the class
export const Timer = GObject.registerClass(
    {
        GTypeName: 'SunMoonDynamicTimer', 
    },
    class Timer extends GObject.Object {
        #geoclue = null;
        #cancellable = null;

        constructor() {
            super();
            console.debug("Système de timer initialisé");
        }

        enable() {
            this.#cancellable = new Gio.Cancellable();
            
            console.log("world");
            
            Geoclue.Simple.new(
                'org.gnome.Shell',
                Geoclue.AccuracyLevel.CITY,
                this.#cancellable,
                (obj, res) => {
                    try {
                        this.#geoclue = Geoclue.Simple.new_finish(res);
                        this.#onGeoclueReady();
                    } catch (error) {
                        console.error("Erreur lors de l'initialisation de GeoClue:", error);
                    }
                }
            );
        }

        #onGeoclueReady() {
            console.log("Geoclue prêt");
            const location = this.#geoclue.get_location();
            Main.notify(
              'Simple Notification', 
              `Latitude: ${location.latitude}, Longitude: ${location.longitude}`
            );
        }
    }
);
