
declare module 'steam-workshop' {

    export interface FileDetails {
        publishedfileid: string;
        result: number;
        /** Creator SteamID */
        creator: string;
        creator_app_id: number;
        description: string;
        preview_url: string;
        file_size: number;
        file_url: string;
        filename: string;
        subscriptions: number;
        tags: Array<any>;
        time_created: number;
        time_updated: number;
        title: string;
        views: number;
    }

    type publishedFileDetailsCallback = (error: any, files: FileDetails[]) => any;

    export default class SteamWorkshop {
        constructor();
        getPublishedFileDetails(ids: number|number[], cb: publishedFileDetailsCallback): void
    }
}
