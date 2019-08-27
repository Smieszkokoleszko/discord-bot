import { RichEmbed } from 'discord.js';
import { FileDetails } from 'steam-workshop';
const filesize = require('filesize');
const moment = require('moment');

const DESCRIPTION_LENGTH_LIMIT = 150;
const DESCRIPTION_ELLIPSIZE = '...';

const formatDescription = (description: string) => {
    const cleanDescription = description.replace(/(\r\n|\n|\r)/gm, ' ');

    if (cleanDescription.length <= DESCRIPTION_LENGTH_LIMIT + DESCRIPTION_ELLIPSIZE.length) {
        return cleanDescription;
    }

    return cleanDescription.substring(0, DESCRIPTION_LENGTH_LIMIT) + DESCRIPTION_ELLIPSIZE;
};

const formatTimestamp = (timestamp: number) => {
    return moment(timestamp * 1000).format('YYYY-MM-DD');
};

export default function workshopItem(item: FileDetails) {
    const {
        title,
        description,
        preview_url: thumbnail,
        publishedfileid: id,
        file_size: size,
        time_updated: updated,
    } = item;

    const url = `https://steamcommunity.com/sharedfiles/filedetails/${id}`;
    const formattedSize = filesize(size);

    return new RichEmbed()
        .setTitle(title)
        .setURL(url)
        .setThumbnail(thumbnail)
        .setDescription(formatDescription(description))
        .addField('Size', formattedSize, true)
        .addField('Last Updated', formatTimestamp(updated), true);
}
