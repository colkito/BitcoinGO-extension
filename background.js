(function (){
    var settings = {
        url: 'https://www.bitstamp.net/api/ticker/',
        delay: 10
    };

    var timeout,
        xhr,
        lastValue = 0;

    var setBadge = function (data) {
        var badgeColor;
        if (data.last == lastValue) {
            badgeColor = [0, 0, 0, 150];
        } else if (data.last > lastValue) {
            badgeColor = [0, 150, 0, 150];
        } else {
            badgeColor = [255, 0, 0, 255];
        }

        lastValue = data.last;

        chrome.browserAction.setBadgeText({ text: lastValue });
        chrome.browserAction.setBadgeBackgroundColor({ color: badgeColor });
    };

    var setTitle = function (data){
        chrome.browserAction.setTitle({ title: 'sell: ' + data.ask + ' buy: ' + data.bid });
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
                    console.log('Data OK');
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
        sendRequest();

        chrome.browserAction.onClicked.addListener(function (tab) {
            chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
            chrome.browserAction.setBadgeText({ text: '...' });
            sendRequest();
        });
    };

    init();
}());
