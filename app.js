const log = console.log.bind(console)
function getEval({ onErr = log, onPrint = log } = {}) {
  const module = window.emjimtcl

  var eval_tcl = (function () {
    var interp = module.CreateInterp()
    module.interp = interp
    // Override default printing
    module.Module.print = onPrint
    module.Module.printErr = onErr

    return function (evalstr) {
      // This prints any stdout
      var retval = module.Eval(interp, evalstr)
      var retstr = module.GetStringResult(interp)
      const handler = retval ? onErr : onPrint
      if (retstr !== '') {
        handler(module.GetStringResult(interp))
      }
    };
  })();
  eval_tcl('puts "Jim Tcl v[info patchlevel]"')
  return eval_tcl
}

(function start() {
  const $result = document.querySelector('#result')
  const $input = document.querySelector('form > input[type=text]')
  const $form = document.querySelector('form')
  const $clear = document.querySelector('#clear')
  const $body = document.body

  function appendLine(line, className = '') {
    const div = document.createElement('div')
    div.className = className
    div.textContent = line
    $result.appendChild(div)
    $body.scrollTop = $result.scrollHeight - 100
  }

  const tclEval = getEval({ onErr: appendLine, onPrint: appendLine })

  function sendLine() {
    const line = $input.value
    if(!line) {
      return
    }
    appendLine(line, 'cmd')
    tclEval(line)
    $input.value = ''
  }

  $form.addEventListener('submit', e => {
    e.preventDefault()
    sendLine()
  })

  $clear.addEventListener('click', e => {
    e.preventDefault()
    $input.value = ''
  })

  document.body.addEventListener('click', e => {
    if(e.target.className == 'cmd') {
      $input.value = e.target.textContent
      setTimeout(() => $input.focus())
      return
    }
  })

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('pwabuilder-sw.js');
    });
  }
})();

