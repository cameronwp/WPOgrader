var psiDiv = document.querySelector("#PSI");
var framerateDiv = document.querySelector("#framerate");

function psiTest() {

  var studentURL = document.querySelector('#stdURL').value;    // should be moved
  console.log("Running PS Insights Test against: " + studentURL);

  var apiKey = "AIzaSyAHehZ3CRwWG3cpCGF3WRTLdWxD0XXDdaI";  //identified as localhost
  var psiURL = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?';
  
  // Object that will hold the callbacks that process results from the
  // PageSpeed Insights API.
  var callbacks = {}

  // callbacks.displayResult = function(_result) {
  //     var res = document.createElement("div");
  //     res.text = _result;
  //     psiDiv.appendChild(res);
  //   }

  callbacks.displayTopPageSpeedSuggestions = function(result) {
    var results = [];
    var ruleResults = result.formattedResults.ruleResults;
    for (var i in ruleResults) {
      var ruleResult = ruleResults[i];
      // Don't display lower-impact suggestions.
      if (ruleResult.ruleImpact < 3.0) continue;
      results.push({name: ruleResult.localizedRuleName,
                    impact: ruleResult.ruleImpact});
    }
    results.sort(sortByImpact);
    var ul = document.createElement('ul');
    for (var i = 0, len = results.length; i < len; ++i) {
      var r = document.createElement('li');
      r.innerHTML = results[i].name;
      ul.insertBefore(r, null);
    }
    if (ul.hasChildNodes()) {
      // document.body.insertBefore(ul, null);
      psiDiv.appendChild(div, null);
    } else {
      var div = document.createElement('div');
      div.innerHTML = 'No high impact suggestions. Good job!';
      // document.body.insertBefore(div, null);
      psiDiv.appendChild(div, null);
    }
  };

  // Helper function that sorts results in order of impact.
  function sortByImpact(a, b) { return b.impact - a.impact; }

  // Our JSONP callback. Checks for errors, then invokes our callback handlers.
  function runPagespeedCallbacks(result) {
    if (result.error) {
      var errors = result.error.errors;
      for (var i = 0, len = errors.length; i < len; ++i) {
        if (errors[i].reason == 'badRequest' && apiKey == 'yourAPIKey') {
          alert('Please specify your Google API key in the apiKey variable.');
        } else {
          psiDiv.text = "Could not execute PageSpeed Insights Test. See below.\n" + errors[i].message;
        }
      }
      psiDiv.text = errors;
      return;
    }

    // Dispatch to each function on the callbacks object.
    for (var fn in callbacks) {
      var f = callbacks[fn];
      if (typeof f == 'function') {
        callbacks[fn](result);
      }
    }
  }

  // Invokes the PageSpeed Insights API. The response will contain
  // JavaScript that invokes our callback with the PageSpeed results.
  function runPagespeed() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    var query = [
      'url=' + studentURL,
      'callback=runPagespeedCallbacks',
      'key=' + apiKey,
      'strategy=' + 'desktop',
    ].join('&');
    s.src = psiURL + query;
    document.head.insertBefore(s, null);
  }

  // Invoke the callback that fetches results. Async here so we're sure
  // to discover any callbacks registered below, but this can be
  // synchronous in your code.
  // setTimeout(runPagespeed, 0);     // async, could be useful
  runPagespeed();                     // sync


}

function runTests() {
  psiTest();
  // framerateTest();
}