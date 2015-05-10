// ==UserScript==
// @name        VideoLinkGetter2
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   Kink
// @description Получение ссылок на видео
// @include     http://www.kinkarchive.com/*
// @version     1
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// ==/UserScript==

// добавляем кнопку в меню GreaseMonkey 
GM_registerMenuCommand('Download videos', function() { 
    addLinks();
}, 'r');

function addLinks() {
    // спрашиваем ссылки
    var links = prompt("Вставьте ссылки", "");
    
    if (links != null) {
        // превращаем ссылки в массив
        links = links.split(/\r|\n|\r\n/);

        // добавляем строки
        // links = links.map(function (e) {
        //     return 'STRING' + e;           
        // })

        // обнуляем localstorage
        localStorage.removeItem('videos');
        localStorage.removeItem('success');
        localStorage.removeItem('error');
        localStorage.removeItem('links');

        // сохраняем в localstorage
        localStorage.setItem('links', JSON.stringify(links));
        // и открываем первую же ссылку
        window.open(links[0], "_self");
    }    
}

// добавить в массив к элементу localstorage
function addToLS (key, value) {
    key = JSON.parse(localStorage.getItem(key)) || [];
    key.push(value);
    localStorage.setItem(key, JSON.stringify(key));
}

// on ready событие 
$(function () {
    // проверяем есть ли у нас ссылки в localStorage
    var links = JSON.parse(localStorage.getItem('links')) || [];
    // если у нас есть какие-то ссылки - качаем их 
    if (links.length) startDownload(links);

    // добавим кнопочку и на страничку
    $('.videoListContainer .zipsDownload').append('<button type="button" onclick="addLinks()">Add links!</button>');
})

var result_global;

// когда закончили скачивать
function completed (arguments) {
    // показываем информацию
    var videos = JSON.parse(localStorage.getItem('videos')) || [];
    var success = JSON.parse(localStorage.getItem('success')) || [];
    var error = JSON.parse(localStorage.getItem('error')) || [];

    var result = ['Ссылки на видео:'].concat(videos);
    if (error.length) result = result.concat('По этим ссылкам не удалось получить ссылки на видео:', error);
    result_global = result.join('\n');
    // prompt("Copy to clipboard: Ctrl+C, Enter", result.join('\n'));
    prompt("To copy result, paste this in console", 'copy(result_global)');
}

function startDownload (links) {
    // получаем первую ссылку из списка (одновременно она удаляется из массива)
    var link = links.shift();
    // перезаписываем оставшиеся 
    localStorage.setItem('links', JSON.stringify(links));

    // должна быть равна текущей ссылке
    if (link != window.location.href) {
        alert("Ссылки почему-то разнятся!\nВы запросили:\n"+link);
        // помечаем ссылку как неудавшуюся
        addToLS('error', link);

        // следующая
        window.open(links[0], "_self");
    } 

    var video_link = $('.videoListContainer .zipsDownload a:contains("HD")').attr('href');

    if (video_link) {
        addToLS('videos', video_link);
        addToLS('success', link);
    } else {
        // помечаем ссылку как неудавшуюся
        addToLS('error', link);
    }

    // если остались ещё ссылки
    if (links.length) 
        window.open(links[0], "_self");
    else // оповещаем о окончании
        completed();
}






// var urlsToLoad  = [
//  'http://www.kinkarchive.com/archive/clips.jsp?shootId=482'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=495'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=510'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=519'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=521'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=522'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=526'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=532'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=552'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=555'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=557'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=558'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=573'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=587'
// , 'http://www.kinkarchive.com/archive/clips.jsp?shootId=588'

// ];

// var linksToDownload      = [];
// var myListObj   = GM_getValue ("myListArray",  "");
// if (myListObj) 
// {
//     linksToDownload = JSON.parse (myListObj);
// }

// /*--- Since many of these sites load large pictures, Chrome's and 
//     Firefox's injection may fire a good deal before the image(s) 
//     finish loading.
//     So, insure script fires after load:
// */
// window.addEventListener ("load", FireTimer, false);
// if (document.readyState == "complete") {
//     FireTimer ();
// }
// //--- Catch new pages loaded by WELL BEHAVED ajax.
// window.addEventListener ("hashchange", FireTimer,  false);

// function FireTimer () {
//     //getLinks();
//     setTimeout (GotoNextURL, 1000); // 5000 == 5 seconds
// }

// function GotoNextURL () {
    
//     var numUrls     = urlsToLoad.length;
//     var urlIdx      = urlsToLoad.indexOf (location.href);
    
//     getLinks();
    
//     urlIdx++;
//     if (urlIdx >= numUrls)
//     {
//         for (var i = 0; i < linksToDownload.length; i++) 
//         {
//             console.log(linksToDownload[i]);
//         }
        
//         window.removeEventListener("hashchange", FireTimer);
        
//         return;
//     }
    
//     location.href   = urlsToLoad[urlIdx];
// }

// function xpath(query) {
//     return document.evaluate(query, document, null,
//         XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
// }

// function getLinks()
// {
//     var links = xpath(".//*[@id='mainContent']/div/p/a");
    
//     var thisA;
    
//     for (var i = 0; i < links.snapshotLength; i++) 
//     {
//         thisA = links.snapshotItem(i);
        
//         var contentType = thisA.textContent.trim();
//         if(contentType == "HD")
//         {
//             linksToDownload.push(thisA.href);
//         }
            
//     }   

    
//     GM_setValue ("myListArray",  JSON.stringify (linksToDownload) );
// }

// function setPage(id)
// {   
//     var page = "http://www.kinkarchive.com/archive/clips.jsp?shootId=";
//     window.open(page + id);
// }
