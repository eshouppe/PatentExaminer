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
  var test = 2;
  var seq = 0;
  var mychart = buildInitialChart();

  function buildInitialChart() {

    var data = {
      series: [
        // [
        //   {x: 1, y: 100, meta:'tttt'},
        //   {x: 2, y: 50},
        //   {x: 3, y: 25},
        //   {x: 5, y: 12.5},
        //   {x: 8, y: 6.25}
        // ],
        // [
        //   {x: 10, y: 67},
        //   {x: 2, y: 25},
        //   {x: 15, y: 34},
        //   {x: 13, y: 65.5},
        //   {x: 25, y: 12.25}
        // ]
      ]
    };
    var options = {
      showLine: false,
      axisX: {
        showGrid: true,
        showLabel: false,
        type: Chartist.AutoScaleAxis,
        labelInterpolationFnc: function(value, index) {
          return index % 13 === 0 ? 'x' + value : null;
        }
      },
      axisY: {
        showGrid: true,
        showLabel: false
      },
      plugins: [
        Chartist.plugins.tooltip()
      ]
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
    return new Chartist.Line('#resultsChart', data, options, responsiveOptions).on('draw', onDrawUpdates);
  }

  function drawGraph(data){
    //TODO: Parse Data here
    debugger;
    var newData = {
      series:[
        [],
        [],
        []
      ]
    };
    if (data.resultsToPlot) {
      for (var idx in data.resultsToPlot) {
        var doc = data.resultsToPlot[idx];
        doc.meta = doc.patent_ID;
        newData.series[doc.series - 1].push(doc);
      }
    }
    debugger;
    test = 0;
    seq = 0;
    mychart.update(newData)

  }

  function onDrawUpdates(data) {
    animatePoints(data);
    addCircles(data);
  }
  function animatePoints(data) {
    if(data.type === 'point') {
          // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
      data.element.animate({
        opacity: {
          // The delay when we like to start the animation
          begin: seq++ * 80,
          // Duration of the animation
          dur: 50,
          // The value where the animation should start
          from: 0,
          // The value where it should end
          to: 1
        },
        x1: {
          begin: seq++ * 80,
          dur: 50,
          from: data.x - 100,
          to: data.x,
          // You can specify an easing function name or use easing functions from Chartist.Svg.Easing directly
          easing: Chartist.Svg.Easing.easeOutQuart
        }
      });
    }
  }
  function addCircles(data) {

    if (data.type === 'grid' && data.index === 0 && test === 0) {
      test += 1;
      // create a custom label element to insert into the bar
      var label = new Chartist.Svg("circle");
      label.text('test!');
      label.attr({
        cx: 480,
        cy: 280,
        r:[200],
        "class":"vennCircle1"
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
        "class":"vennCircle2"
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
      drawGraph(data);
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
      error: function(response){
        //var errorCode = JSON.parse(xhr.responseText);
        $searchButton.attr('disabled', false);
        $progressBar.fadeOut();
        showToast('Search Error Occurred - Code:' + response.status);
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
