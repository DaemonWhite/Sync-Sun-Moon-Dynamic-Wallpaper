import Gio from 'gi://Gio';


export class ImageStep {
    constructor(duration, imagePath) {
        this.duration = duration;
        this.imagePath = imagePath;
    }
}


export class TransitionStep {
    constructor(duration, from, to, type) {
        this.from = from;
        this.to = to;
        this.duration = duration;
        this.type = type;
    }
}

export class DynamicImage {
    constructor(wallpaper) {
        this.wallpaper = wallpaper;
        this.startTime = {
            year: 2026, month: 1, day: 1,
            hour: 0, minute: 0, second: 0
        };
        this.steps = [];
    }
}

export class WallpaperInfo {

    constructor(name, filename, options) {
        this.name = name;
        this.filename = filename;
        this.options = options;
    }
}

/**

TODO Pour l'instant ça fera le taf
*/
export function buildDynamicImageByXmlFile(xmlWallpaper) {
    const dynamicImages = [];

    let wallpapers = [];

    const blockRegexWallpaper = /(<wallpaper [\s\S]*?>)([\s\S]*)(<\/wallpaper>)/g;
    let match;
    while ((match = blockRegexWallpaper.exec(xmlWallpaper)) !== null) {
        const block = match[0];

        let nameWallpaper = block.match(/<name>(.*?)<\/name>/)?.[1];
        let filename = block.match(/<filename>(.*?)<\/filename>/)?.[1];
        let options = block.match(/<options>(.*?)<\/options>/)?.[1];

        wallpapers.push( new WallpaperInfo( nameWallpaper, filename, options ))
    }

    match = null;

    const blockRegex = /<(static|transition)[\s\S]*?<\/\1>/g;

    for (let wallpaper of wallpapers) {
        const dynamicImage = new DynamicImage(wallpaper);
        let xmlDynamicWallpaper = null;
        const file = Gio.File.new_for_path(wallpaper.filename);
        try {
            const [success, contents] = file.load_contents(null);
            if (success) {
                xmlDynamicWallpaper = new TextDecoder().decode(contents);
            }
        } catch (e) {
            console.log(e)
            continue;
        }

        if (!xmlDynamicWallpaper) {
            continue
        }



        let match;

        while ((match = blockRegex.exec(xmlDynamicWallpaper)) !== null) {
            const block = match[0];
            const duration = block.match(/<duration>(.*?)<\/duration>/)?.[1];

            if (block.startsWith('<static')) {
                const file = block.match(/<file>(.*?)<\/file>/)?.[1];
                dynamicImage.steps.push(new ImageStep(duration, file));
            } else {
                const from = block.match(/<from>(.*?)<\/from>/)?.[1];
                const to = block.match(/<to>(.*?)<\/to>/)?.[1];
                const type = block.match(/type="(.*?)"/)?.[1];
                dynamicImage.steps.push(new TransitionStep(duration, from, to, type));
            }
        }
        dynamicImages.push(dynamicImage);
    }


    return dynamicImages;
}
