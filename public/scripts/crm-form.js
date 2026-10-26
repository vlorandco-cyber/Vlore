/* Inquiry form (#contactForm) -> Vlore CRM.
   The only submit handler on the form. The CRM receives name, email, phone and message;
   every other field the visitor filled in (business, website, interests) is written into
   message, so nothing is lost. Success shows only once the CRM confirms; on failure the
   visitor's inputs stay as typed and they can send again. */
(function(){
  var form = document.getElementById('contactForm');
  if (!form) return;
  var ENDPOINT = form.action;                                   // https://crm.vlore.ca/functions/publicFormSubmit
  var PUBLIC_KEY = form.elements.public_key.value;
  var TIMEOUT_MS = 20000;
  var btn = document.getElementById('contactSubmitBtn'), label = btn.innerHTML;
  var errEl = document.getElementById('formError'), okEl = document.getElementById('formSuccess');
  var sending = false;

  function val(name){
    var el = form.elements[name];
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  }
  function checked(name){
    return [].slice.call(form.querySelectorAll('input[name="' + name + '"]:checked')).map(function(i){ return i.value; });
  }
  // The visitor's message first, then every other detail they gave, labelled.
  function buildMessage(){
    var details = [];
    if (val('company')) details.push('Business: ' + val('company'));
    if (val('website')) details.push('Website: ' + val('website'));
    var interests = checked('interests');
    if (interests.length) details.push('Interested in: ' + interests.join(', '));
    details.push('Sent from: ' + document.title.split(' | ')[0] + ' (' + location.origin + location.pathname + ')');
    return (val('message') || '(No message written)') + '\n\n— Inquiry details —\n' + details.join('\n');
  }

  function setSending(on){
    sending = on;
    btn.disabled = on;
    form.setAttribute('aria-busy', on ? 'true' : 'false');
    if (on) btn.textContent = 'Sending…'; else btn.innerHTML = label;
  }
  function showError(){
    errEl.textContent = "We couldn't send your message. Please check your connection and try again, or email hello@vlore.ca.";
    errEl.style.display = 'block';
  }
  function showOk(){
    form.style.display = 'none';
    okEl.style.display = 'block';
    okEl.setAttribute('tabindex', '-1');
    okEl.focus({ preventScroll: true });
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (sending) return;                                        // one request per submission
    errEl.style.display = 'none';
    var payload = {
      public_key: PUBLIC_KEY,
      name: val('name'),
      email: val('email'),
      phone: val('phone'),
      message: buildMessage(),
      _honeypot: form.elements._honeypot.value                  // empty for people; bots fill it
    };
    setSending(true);
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = ctrl && setTimeout(function(){ ctrl.abort(); }, TIMEOUT_MS);
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function(res){
      return res.json().then(function(json){
        if (!res.ok || !json || json.error || json.success === false) throw new Error((json && json.error) || 'Submission failed');
      });
    }).then(function(){
      clearTimeout(timer);
      showOk();                                                 // stays "sending" so it cannot be resent
    }).catch(function(){
      clearTimeout(timer);
      setSending(false);                                        // inputs untouched: the visitor can retry
      showError();
    });
  });
})();
