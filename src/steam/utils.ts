import * as Url from 'url';
import { FileDetails } from 'steam-workshop';
const SteamWorkshop = require('steam-workshop');
const steamWorkshop = new SteamWorkshop();

const steamWorkshopUrlMatch = /https?:\/\/steamcommunity.com\/sharedfiles\/filedetails\/?\d*\/?\??[^\s]*/ig;

export function parseSteamUrls(text: string) {
    const matches = text.match(steamWorkshopUrlMatch);

    if (matches && matches.length > 0) {
        return matches;
    }

    return [];
}

export function parseSteamId(text: string) {
    const url = Url.parse(text, true);

    if (url.query.id) {
        // tslint:disable-next-line: radix
        return parseInt(url.query.id as string);
    }

    const idInPath = url.pathname.match(/\d+/g);
    if (idInPath && idInPath[0]) {
        return parseInt(idInPath[0], 10);
    }

    return undefined;
}

export function getWorkshopItems(ids: number|number[]): Promise<FileDetails[]> {
    return new Promise((resolve, reject) => {
        steamWorkshop.getPublishedFileDetails(ids, (err, files) => {
            if (err) {
                return reject(err);
            }

            return resolve(files);
        });
    });
}
