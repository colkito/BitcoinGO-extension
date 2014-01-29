(function (){
    var settings = {
        url: 'https://www.bitstamp.net/api/ticker/',
        delay: 5
    };

    var timeout,
        xhr,
        lastValue = 0;

    var setBadge = function (data) {
        lastValue = data.last;
        var badgeColor = data.last >= lastValue ? '#27ae60' : '#c0392b';

        chrome.browserAction.setBadgeText({ text: lastValue });
        chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });
    };

    var setTitle = function (data){
        chrome.browserAction.setTitle({title: 'sell: ' + data.sell.display + ' buy: ' + data.buy.display});
    };

    var setData = function (data, time) {
        setBadge(data);
        setTitle(data);
        // setHistory(param, time);
    };

    var readyState = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data) {
                    setData(data);
                } else {
                    console.log('http api error', data);
                }
            } else {
                console.log('could not open http connection', xhr);
            }
            window.clearTimeout(timeout);
            timeout = setTimeout(sendRequest, settings.delay * 1000);
        }
    };

    var sendRequest = function () {
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = readyState;
        xhr.open('GET', settings.url);
        xhr.send();
    };

    var init = function (url, delay, parser) {
        window.clearTimeout(timeout);
        sendRequest();
    };

    init();
}());
