// Relays the bank's answer to the Finbase desktop app (finbase://callback).
// No network request, no storage, no third-party code. The code is single-use and
// useless without the private key kept on the user's computer.
(function () {
  'use strict';
  var SAFE = /^[A-Za-z0-9._~\-]{1,1024}$/;
  var params = new URLSearchParams(window.location.search);
  var code = params.get('code');
  var state = params.get('state');
  var error = params.get('error');

  // Remove the code from the address bar and the history entry.
  if (window.location.search) window.history.replaceState(null, '', window.location.pathname);

  function show(id) { document.getElementById(id).hidden = false; }

  if (error && state && SAFE.test(state)) {
    show('refused');
    var errorLink = 'finbase://callback?' + new URLSearchParams({ error: error.slice(0, 64), state: state }).toString();
    window.location.href = errorLink;
    return;
  }
  if (!code || !state || !SAFE.test(code) || !SAFE.test(state)) {
    show('invalid');
    return;
  }

  var link = 'finbase://callback?' + new URLSearchParams({ code: code, state: state }).toString();
  document.getElementById('open').href = link;
  document.getElementById('link').value = link;
  show('ok');

  document.getElementById('copy').addEventListener('click', function () {
    var field = document.getElementById('link');
    var done = function () { document.getElementById('copied').textContent = 'Adresse copiée.'; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(done, function () { field.select(); });
    } else {
      field.select();
    }
  });

  window.location.href = link;
})();
