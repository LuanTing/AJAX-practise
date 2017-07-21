
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var addressStr = streetStr + ", " + cityStr;
    $greeting.text('So, you want to live at ' + addressStr + ' ?');
    var locationstr = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + addressStr + '';
    $body.append('<img class="bgimg" src="' + locationstr + '"  alt="streetimg">');

    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=5965ae174fd5419d860716743919d135';
    $.getJSON(nytimesUrl, function (data) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        var articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a herf="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        };
    }).error(function (e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    })
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    //action=opensearch 搜索wiki使用开放搜索协议，search意味着执行全文搜索
    var wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp:false,
        //jsonpCallback:'wikiCallback'
    }).done(function (response) {
        var articlelist = response[1];
        for (var i = 0; i < articlelist.length; i++) {
            articleStr = articlelist[i];
            var url = 'https://en.wikipedia.org/wiki/' + articleStr;
            $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
        };
        clearTimeout(wikiRequestTimeout);
    }
        )
    return false;
};
$('#form-container').submit(loadData);
