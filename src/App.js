import Event from './event';

import Main from './views/Main/Main';

import debug from './debug';
import request from './helpers/request';
import globalData from './globalData';

class App {
    constructor(target) {
        this.emitter = Event({});
        this.root = target;

        this.render();

        this.bind();
        this.subscribe();
    }

    GOOGLE_API_KEY = 'AIzaSyBIg5Ur1MD9zlEe3LOp_HVb8qDOqz1pnwQ'

    on(...args) {
        return this.emitter.on(...args);
    }

    off(...args) {
        return this.emitter.off(...args);
    }

    trigger(...args) {
        return this.emitter.trigger(...args);
    }

    render() {
        return this.view = new Main({}, this.emitter).attachTo(this.root);
    }

    bind() {
        const methods = ['onSearch', 'getVideosInfo', 'onVideoInfoLoaded', 'getVideo'];

        for (let i = 0, len = methods.length; i < len; i++) {
            this[methods[i]] = this[methods[i]].bind(this);
        }
    }

    subscribe() {
        this.on('search', this.onSearch);
        this.on('getMoreVideos', this.getVideo);
    }

    onSearch(string) {
        debug.log(`Search for ${string}`);
        if (globalData.searchString != string) {
            globalData.searchString = this.encode_utf8(string);
            globalData.loadedVideoItems = [];
            globalData.currPage = 1;
        }
        this.getVideo();
    }

    encode_utf8(s) {
        return encodeURIComponent(s);
    }

    getVideo(){
        if (globalData.nextToken == '')
            request(`https://www.googleapis.com/youtube/v3/search?key=${this.GOOGLE_API_KEY}&type=video&part=snippet&maxResults=${globalData.maxSearchResults}&q=${globalData.searchString}`)
                .then(this.getVideosInfo, this.onError);
        else
            request(`https://www.googleapis.com/youtube/v3/search?key=${this.GOOGLE_API_KEY}&type=video&part=snippet&maxResults=${globalData.maxSearchResults}&q=${globalData.searchString}&pageToken=${globalData.nextToken}`)
                .then(this.getVideosInfo, this.onError);
    }

    getVideosInfo(respons) {
        console.log(`LOADED ${respons}`);
        let result = JSON.parse(respons);

        globalData.nextToken = result.nextPageToken;

        this.view.data.totalSearchResultAmount = result.pageInfo.totalResults;
        this.resultsPerPage = result.resultsPerPage;

        let videoIds = [];
        for (let i = 0, len = result.items.length; i < len; i++) {
            videoIds.push(result.items[i].id.videoId);
        }
        let videoIdsString = videoIds.reduce((res, id) =>
            res + id +",", "");
        videoIdsString = videoIdsString.slice(0, videoIdsString.length - 2);

        request(`https://www.googleapis.com/youtube/v3/videos?key=${this.GOOGLE_API_KEY}&id=${videoIdsString}&part=snippet,statistics,id`)
            .then(this.onVideoInfoLoaded, this.onError);
    }

    onVideoInfoLoaded(respons) {
        let result = JSON.parse(respons);
        let items = [];

        result.items.map(item => {
                items.push({
                    videoId: item.id,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    publishedAt: item.snippet.publishedAt.match( /\d{4}-\d{2}-\d{2}/i ),
                    viewCount: item.statistics.viewCount,
                    author: item.snippet.channelTitle,
                    thumbnails: {
                        default: {
                            url: item.snippet.thumbnails.default.url,
                            width: item.snippet.thumbnails.default.width,
                            height: item.snippet.thumbnails.default.height
                        },
                        medium: {
                            url: item.snippet.thumbnails.medium.url,
                            width: item.snippet.thumbnails.medium.width,
                            height: item.snippet.thumbnails.medium.height
                        },
                        high: {
                            url: item.snippet.thumbnails.high.url,
                            width: item.snippet.thumbnails.high.width,
                            height: item.snippet.thumbnails.high.height
                        }
                    }
                })
            }
        );

        globalData.loadedVideoItems = globalData.loadedVideoItems.concat(items);
        this.trigger('updateData');
    }

    onError() {
        console.log('ERROR');
    }

}

export default App;
