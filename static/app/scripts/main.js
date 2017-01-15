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
      showGrid: true,
      showLabel: false,
      offset: 0
    },
    axisY: {
      showGrid: true,
      showLabel: false,
      offset: 0
    },
    plugins: [
        Chartist.plugins.tooltip()
      ]
    //
    // axisX: {
    //   labelInterpolationFnc: function(value, index) {
    //     return index % 13 === 0 ? 'W' + value : null;
    //   }
    // }
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
  var test = 0;
  function addCircles(data) {
    //debugger;
    if (data.type === 'grid' && data.index === 0 && test === 0) {
      test += 1;
      // create a custom label element to insert into the bar
      var label = new Chartist.Svg("circle");
      label.text('test!');
      label.attr({
        cx: 480,
        cy: 280,
        r:[200],
        "text-anchor": "middle",
        "fill":"blue",
        "fill-opacity":".5"
        // style: "color: white"
      });

      // add the new custom text label to the bar
      data.group.append(label);
    }
    if (data.type === 'grid' && data.index === 0 && test === 1) {
      test += 1;
      label = new Chartist.Svg("circle");
      label.text('test!');
      label.attr({
        cx: 280,
        cy: 160,
        r:[150],
        "text-anchor": "middle",
        "fill":"red",
        "fill-opacity":".5"
        // style: "color: white"
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
    if (searchObj['search1'] === '' && searchObj['search2'] !== '') {
      searchObj.search1 = searchObj.search2;
      searchObj.search2 = '';
    }
    function processResults(data){
      //Successfully made search
      populateApiResults(data);
      //todo draw graph here

      showToast('Search Finished');
      $searchButton.attr('disabled', false);
      $progressBar.fadeOut();
    }
    $.ajax({
      // url: '/venn/api/v1.0/search',
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
        showToast('Search Error Occurred.');
      }
    });
  }

  function populateApiResults(data) {
    var $docsFound = $('.docFound'),
      $searchTermsUsed = $('.searchedTerms');
    $docsFound.empty();
    $searchTermsUsed.empty();
    for(var obj in data.matchingPatentNums) {
      $docsFound.append('<li class="mdl-list__item center">' +
        '<span class="mdl-chip mdl-chip--contact">'+
        '<span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">' +
        ' <i class="material-icons mdl-list__item-icon">description</i>' +
        '</span>'+
        ' <span class="mdl-chip__text">'+data.matchingPatentNums[obj] +'</span></span>' +
        '</li>');
    }
    for(var terms in data.searchedTerms) {
      $searchTermsUsed.append('<li class="mdl-list__item center">' +
        '<span class="mdl-chip mdl-chip--contact">'+
        '<span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">' +
        ' <i class="material-icons mdl-list__item-icon">find_in_page</i>' +
        '</span>'+
        ' <span class="mdl-chip__text">'+ data.searchedTerms[terms] +'</span></span>' +
        '</li>');
    }
    if (data.matchingPatentNums.length < 1) {
      $docsFound.append('<li class="mdl-list__item center">' +
        '<span class="mdl-chip mdl-chip--contact">'+
        '<span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">' +
        ' <i class="material-icons mdl-list__item-icon">description</i>' +
        '</span>'+
        ' <span class="mdl-chip__text">None Found</span></span>' +
        '</li>');
    }
    if (data.searchedTerms.length < 1) {
      $searchTermsUsed.append('<li class="mdl-list__item center">' +
        '<span class="mdl-chip mdl-chip--contact">'+
        '<span class="mdl-chip__contact mdl-color--teal mdl-color-text--white">' +
        ' <i class="material-icons mdl-list__item-icon">find_in_page</i>' +
        '</span>'+
        ' <span class="mdl-chip__text">None Used.</span></span>' +
        '</li>');
    }
  }

  function showToast(text) {
    var snackbarContainer = document.querySelector('#demo-toast-example'),
      showToastButton = document.querySelector('#demo-show-toast'),
      toastMessage = {message: text};
    snackbarContainer.MaterialSnackbar.showSnackbar(toastMessage);
  }

  function createPlotChart() {
    // //needs plugin
    // var chart = new Chartist.Line('.ct-chart', {
    //   labels: [1, 2, 3],
    //   series: [
    //     [
    //       {meta: 'description', value: 1},
    //       {meta: 'description', value: 5},
    //       {meta: 'description', value: 3}
    //     ],
    //     [
    //       {meta: 'other description', value: 2},
    //       {meta: 'other description', value: 4},
    //       {meta: 'other description', value: 2}
    //     ]
    //   ]
    // }, {
    //   plugins: [
    //     Chartist.plugins.tooltip()
    //   ]
    // });
  }
  //Add Search Function
  $(".searchContainer").on('click','.searchnow', searchNow);

  //Add enter to search function
  $(document).keypress(function(event){

    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      $('.searchnow').click();
    }
  });
  //Navigation Functions
  //********************
  $(document).on('click', 'a.mdl-navigation__link', function(e) {
    var currentClickedObj = $(e.currentTarget);
    if (currentClickedObj.data('link')) {
      event.preventDefault();
      $('main .tab').hide();
      $('main #' + currentClickedObj.data('link')).show();
    }
  });

})();
