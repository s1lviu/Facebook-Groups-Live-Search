var group_url = "";

var query = {active: true, currentWindow: true};

function callback(tabs) {
    var currentTab = tabs[0]; // there will be only one in this array

    var g_url_regex = /^https:\/\/www\.facebook\.com\/groups\/.*?\//;
    group_url = currentTab.url.match(g_url_regex);
    if (group_url !== null) {
        group_url = group_url[0];
        if (group_url.endsWith('/')) {
            group_url = group_url.slice(0, -1);
        }
    }
    else {
        $("#liveSearch").prop('disabled', true).attr("placeholder", "Go to a Facebook Group first");
        $("#intro").text('First, go to a Facebook Group');

    }
}

chrome.tabs.query(query, callback);


function search(query) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", group_url + "/search/?query=" + query, false);
    xhr.send();
    var result = xhr.responseText;
    var patt1 = /<div.*id=.BrowseResultsContainer.>.*?<\/div>/g;
    var x = result.match(patt1);
    x = decodeURIComponent(x);
    var decoded = $('<textarea/>').html(x).text();
    var post_regex = /data-bt="{"id":([\s\S]*?),/g;
    var post_id = post_regex.exec(decoded);
    var searchInput = $('#liveSearch').val();
    $('#answer_results').empty();
    if (post_id === null) {
        $('#answer_results').append('<p id="answer_results">No result found for <b>' + searchInput + '</b></p>');
    } else {
        post_id = post_id[1];
        var photo_regex = /src="(.*?)"/g;
        var user_photo = photo_regex.exec(decoded)[1];
        $('#answer_results').append('<a target="_blank" id="answer_results" href=' + group_url + '/permalink/' + post_id + '><br><img src="' + user_photo + '"> posted about <b>' + searchInput + '</b></a>');
    }
}

$('#liveSearch').keypress(function (e) {
    var key = e.which;
    if (key === 13 || key === 32)  //enter or space key
    {
        $("#answer_results").addClass("loader");
        var searchInput = $('#liveSearch').val();
        search(searchInput);
        $("#answer_results").removeClass("loader");
    }
});

