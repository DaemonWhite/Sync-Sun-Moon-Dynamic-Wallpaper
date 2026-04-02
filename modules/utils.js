import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import { Debug } from '../debug.js';

export function getBackgroundProperties() {
    const xmlImages = [];
    const userDataDir = GLib.get_user_data_dir();
    const backgroundPropertiesPath = GLib.build_filenamev([
        userDataDir,
        'gnome-background-properties'
    ]);

    const folder = Gio.File.new_for_path(backgroundPropertiesPath);

    Debug.message(backgroundPropertiesPath);

    try {

        let files = folder.enumerate_children(
            'standard::name,standard::type',
            Gio.FileQueryInfoFlags.NONE,
            null
        );

        let info;

        while ((info = files.next_file(null)) !== null) {
            let fileName = info.get_name();
            let fileType = info.get_file_type();

            if (fileType === Gio.FileType.REGULAR && fileName.endsWith('.xml')) {
                xmlImages.push(files.get_child(info).get_path() );
            }
        }

    } catch (e) {
        Debug.messageError(`load Background properties ${e}`);
    }

    return xmlImages;
}

export function loadXMLFile(xmlPath) {
    const file = Gio.File.new_for_path(xmlPath);

    try {
        const [success, contents] = file.load_contents(null);
        if (success) {
            let xmlString = new TextDecoder().decode(contents);
            const images = buildDynamicImageByXmlFile(xmlString)
        }
        Debug.message(`File loaded : ${xmlPath}`)
    } catch (e) {
        Debug.messageError("File not loaded : " + e.message);
    }

    return
}
