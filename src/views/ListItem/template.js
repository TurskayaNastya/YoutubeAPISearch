export default function () {
    var html = '';

    html += `<div class="wrapper">`;
    html += `<div class = 'title'><a href = 'https://www.youtube.com/watch?v=${this.data.videoId}'>${this.data.title}</a></div>`;
    html += `<img src = "${this.data.thumbnails.high.url}" />`;
    html += `<div class = 'viewCount'><span class="fa fa-eye" aria-hidden="true">${this.data.viewCount}</span><p>${this.data.publishedAt}</p></div>`;
    html += `<div class = 'description'>${this.data.description}</div>`;
    html += `<div class = "author">${this.data.author}</div>`;

    html += `</div>`;

    return html;
};
