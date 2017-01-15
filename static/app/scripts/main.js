/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }
  //Navigation Functions
  //********************
  $(document).on('click', 'a.mdl-navigation__link', function(e) {
    var currentClickedObj = $(e.currentTarget);
    if (currentClickedObj.data('link')) {
      $('main .tab').hide();
      $('main #' + currentClickedObj.data('link')).show();
    }
  });

  //Charting functions:
  //********************
  var times = function(n) {
    return Array.apply(null, new Array(n));
  };

  var data = times(52).map(Math.random).reduce(function(data, rnd, index) {
    data.labels.push(index + 1);
    data.series.forEach(function(series) {
      series.push(Math.random() * 100)
    });

    return data;
  }, {
    labels: [],
    series: times(2).map(function() { return new Array() })
  });

  var options = {
    showLine: false,
    axisX: {
      labelInterpolationFnc: function(value, index) {
        return index % 13 === 0 ? 'W' + value : null;
      }
    }
  };

  var responsiveOptions = [
    ['screen and (min-width: 640px)', {
      axisX: {
        labelInterpolationFnc: function(value, index) {
          return index % 4 === 0 ? 'W' + value : null;
        }
      }
    }]
  ];

  var mychart = new Chartist.Line('.ct-chart', data, options, responsiveOptions).on('draw', addCircles);

  function addCircles(data) {
    //debugger;
    if (data.type === 'grid' && data.index === 0) {
      // create a custom label element to insert into the bar
      var width=40, barHorizontalCenter = (data.x1 + (data.element.width() * .5)),
        barVerticalCenter =  (data.y1 + (width * .12)),
        label = new Chartist.Svg("text");
      label.text('test!');
      label.attr({
        x: barHorizontalCenter,
        y: barVerticalCenter,
        "text-anchor": "middle",
        style: "font-family: 'proxima-nova-alt', Helvetica, Arial, sans-serif; font-size: 12px; fill: black"
      });

      // add the new custom text label to the bar
      data.group.append(label);
    }

  }
  function searchNow() {
    var $progressBar = $('.searchContainer .searchProgress'),
      $searchButton = $('.searchContainer .searchnow'),
      $searchBox1 = $('.searchContainer #search1'),
      $searchBox2 = $('.searchContainer #search2');

    //Start search
    $searchButton.attr('disabled', true);
    $progressBar.fadeIn();
    var searchObj = {
      'search1':$searchBox1.val() || '',
      'search2':$searchBox2.val() || ''
    };
    function processResults(data){
      debugger;
      $searchButton.attr('disabled', false);
      $progressBar.fadeOut();
      for(var obj in data.matchingPatentNums) {
        $('.dataresults').append('<li class="mdl-list__item center"><i class="material-icons mdl-list__item-icon">description</i>' +
          JSON.stringify(data.matchingPatentNums[obj]) +'</li>');
      }
    }
    $.ajax({
      url: 'http://localhost:5000/venn/api/v1.0/search',
      contentType: "application/json",
      dataType:'json',
      method:'POST',
      //data is the search term
      data:JSON.stringify(searchObj),
      success: processResults,
      error: function(){
        $searchButton.attr('disabled', false);
        $progressBar.fadeOut();
        var snackbarContainer = document.querySelector('#demo-toast-example'),
          showToastButton = document.querySelector('#demo-show-toast'),
          data = {message: 'Search Error Occurred'};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
      }
    });
  }
  //Add Search Function
  $(".searchContainer").on('click','.searchnow', searchNow);

})();
