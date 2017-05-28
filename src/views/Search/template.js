export default function () {
    var html = '';

    html += '<form id = "searchForm">';
    html += '<div class="searchWrap">';
    html += '<span class="fa fa-search"></span>';
    html += '<input type="text" class="field" placeholder="Search term"/>';
    html += '<input type="submit" value="Search" />';
    html += '</div>';
    html += '</form>';

	return html;
};
