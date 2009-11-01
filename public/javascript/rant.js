String.prototype.reverse = function() {
  return this.split("").reverse().join("");
}

$(function() {

  var rant = function(value) {
    return $("textarea.rant").val(value);
  };
  
  $("textarea.rant").keyup(function(e) {
    var total = score(rant().reverse());
    $('span.chars').html(total);
    graph(total);
  });

  $("#send").click(function() {
    var r = rant();
    if (r == '') { return false; }
    $.post('/rant', { 'rant': r }, function() {
      rant('');
      $("ul.rants").prepend('<li>' + r + '</li>');
    });
    return false;
  });
  
  var score = function(rant) {
    return Math.floor(
      _.reduce(score_functions, 0, function(total, score) { return total + score(rant) })
    );
  };
  
  // a score function must take a rant and return a score
  // the final score is the sum of all scores
  var score_functions = [
    function(r) { var words = r.split(' '); return words.length * 5; },
    function(r) { return (r.match(/!/g)||[]).length * 2; },
    function(r) { return (r.match(/!{4}/g)||[]).length * -20; },
    function(r) { return (r.match(/tawt|dratsab|skcollob|ssa|esra/g)||[]).length * 8; },
    function(r) { return (r.match(/drater|norom|toidi|diputs/g)||[]).length * 5; },
    function(r) { return (r.match(/parc|tihs|kcuf/g)||[]).length * 10; },
    function(r) { return (r.match(/tnuc/g)||[]).length * 25; }
  ];

  var time = [1], scores = [0];
    
  var graph = function(total) {
    $('#holder svg').remove();
    var r = Raphael("holder");
    time.push(time.length);
    scores.push(total);
    // r.g.text(80, 50, "Rant Score");
    console.log("calling", time, scores);
    r.g.linechart(0, 0, 470, 100, time, scores);
  };
});

