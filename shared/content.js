const API = chrome || browser;
(function (history) {
  var pushState = history.pushState
  history.pushState = function (state) {
    if (typeof history.onpushstate == 'function') {
      history.onpushstate({ state: state })
    }
    return pushState.apply(history, arguments)
  }
})(window.history)
;(function () {
  const myAlgorithmRoutine = function () {
    const sourceDomain = window.location.hostname
    const getMetaTags = function () {
      const messages = []
      if (
        window.location.pathname !== '/' &&
        !['www.youtube.com'].includes(window.location.hostname)
      ) {
        const metaKeywords = document.querySelector('meta[name="keywords"]')
        if (metaKeywords) {
          messages.push({
            text: metaKeywords.getAttribute('content'),
            type: 'meta-keywords',
          })
        }
      }

      const metaOGTitle = document.querySelector('meta[property="og:title"]')
      if (metaOGTitle) {
        messages.push({
          text: metaOGTitle.getAttribute('content'),
          type: 'meta-title',
        })
      } else {
        const metaTwitterTitle = document.querySelector(
          'meta[property="twitter:title"]'
        )
        if (metaTwitterTitle) {
          messages.push({
            text: metaTwitterTitle.getAttribute('content'),
            type: 'meta-title',
          })
        }
      }

      for (let message of messages) {
        message.text = message.text.split(' ')
        API.runtime.sendMessage(
          Object.assign(
            {
              action: 'newEngagementText',
              sourceDomain,
            },
            message
          )
        )
      }
    }

    getMetaTags()

    if (window.location.hostname === 'www.youtube.com') {
      const As = document.querySelectorAll('a')

      document.body.addEventListener(
        'click',
        (e) => {
          const element = e.target

          if (element.getAttribute('id') === 'video-title') {
            API.runtime.sendMessage({
              action: 'newEngagementText',
              text: element.innerText.split(' '),
              type: 'link-click',
              sourceDomain,
            })
          }
        },
        true
      )
    } else {
      document.onclick = function (e) {
        const origin = e.target.closest(`a`)
        console.log(origin)
        if (origin) {
          console.log(origin.innerText.split(' '))
          API.runtime.sendMessage({
            action: 'newEngagementText',
            text: origin.innerText.split(' '),
            type: 'link-click',
            sourceDomain,
          })
        }
      }
      if (
        ['www.twitter.com', 'twitter.com'].includes(window.location.hostname) &&
        (window.location.pathname === '/' ||
          window.location.pathname === '/home')
      ) {
        document.body.addEventListener(
          'click',
          (e) => {
            const origin = e.target.closest(`article`)
            if (origin) {
              const elements = origin.querySelectorAll('div > span')
              if (elements && elements.length > 0) {
                const textInElement = [...elements].map((el) => {
                  return { el, length: el.innerText.length }
                })
                const elementWithMostText = textInElement.sort((a, b) => {
                  return b.length - a.length
                })[0]
                console.log(elementWithMostText.el.innerText.split(' '))
                API.runtime.sendMessage({
                  action: 'newEngagementText',
                  text: elementWithMostText.el.innerText.split(' '),
                  type: 'content-click',
                  sourceDomain,
                })
              }
            }
          },
          true
        )
      }
    }

    //setup before functions
    const allTextInputs = document.querySelectorAll(
      'input[type="text"], textarea'
    )

    allTextInputs.forEach(function (textInput) {
      let firstKeydown = false
      let start

      function debounce(callback, wait) {
        let timeout
        return (...args) => {
          clearTimeout(timeout)
          timeout = setTimeout(function () {
            callback.apply(this, args)
          }, wait)
        }
      }

      textInput.addEventListener('keydown', function (e) {
        if (!firstKeydown) {
          firstKeydown = true
          start = e.target.selectionStart
          console.log('first', start)
        }
      })

      textInput.addEventListener(
        'keyup',
        debounce((e) => {
          if (e.target.value) {
            console.log(start, e.target.selectionEnd)
            const newText = e.target.value.slice(start, e.target.selectionEnd)
            console.log('newText', newText)
            API.runtime.sendMessage({
              action: 'newEngagementText',
              text: newText.split(' '),
              type: 'input-type',
              sourceDomain,
            })
          }

          firstKeydown = false
        }, 1000)
      )
    })
  }
  window.onload = myAlgorithmRoutine()

  window.onpopstate = history.onpushstate = function (e) {
    myAlgorithmRoutine()
  }

  const wakeup = () => {
    setTimeout(function () {
      API.runtime.sendMessage('ping', function () {})
      wakeup()
    }, 10000)
  }
})()
