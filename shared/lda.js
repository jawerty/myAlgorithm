const stop_words = [
  'a',
  'able',
  'about',
  'above',
  'abroad',
  'according',
  'accordingly',
  'across',
  'actually',
  'adj',
  'after',
  'afterwards',
  'again',
  'against',
  'ago',
  'ahead',
  'aint',
  'all',
  'allow',
  'allows',
  'almost',
  'alone',
  'along',
  'alongside',
  'already',
  'also',
  'although',
  'always',
  'am',
  'amid',
  'amidst',
  'among',
  'amongst',
  'an',
  'and',
  'another',
  'any',
  'anybody',
  'anyhow',
  'anyone',
  'anything',
  'anyway',
  'anyways',
  'anywhere',
  'apart',
  'appear',
  'appreciate',
  'appropriate',
  'are',
  'arent',
  'around',
  'as',
  'as',
  'aside',
  'ask',
  'asking',
  'associated',
  'at',
  'available',
  'away',
  'awfully',
  'b',
  'back',
  'backward',
  'backwards',
  'be',
  'became',
  'because',
  'become',
  'becomes',
  'becoming',
  'been',
  'before',
  'beforehand',
  'begin',
  'behind',
  'being',
  'believe',
  'below',
  'beside',
  'besides',
  'best',
  'better',
  'between',
  'beyond',
  'both',
  'brief',
  'but',
  'by',
  'c',
  'came',
  'can',
  'cannot',
  'cant',
  'cant',
  'caption',
  'cause',
  'causes',
  'certain',
  'certainly',
  'changes',
  'clearly',
  'cmon',
  'co',
  'co.',
  'com',
  'come',
  'comes',
  'concerning',
  'consequently',
  'consider',
  'considering',
  'constructor',
  'contain',
  'containing',
  'contains',
  'corresponding',
  'could',
  'couldnt',
  'course',
  'cs',
  'currently',
  'd',
  'dare',
  'darent',
  'definitely',
  'described',
  'despite',
  'did',
  'didnt',
  'different',
  'directly',
  'do',
  'does',
  'doesnt',
  'doing',
  'done',
  'dont',
  'down',
  'downwards',
  'during',
  'e',
  'each',
  'edu',
  'eg',
  'eight',
  'eighty',
  'either',
  'else',
  'elsewhere',
  'end',
  'ending',
  'enough',
  'entirely',
  'especially',
  'et',
  'etc',
  'even',
  'ever',
  'evermore',
  'every',
  'everybody',
  'everyone',
  'everything',
  'everywhere',
  'ex',
  'exactly',
  'example',
  'except',
  'f',
  'fairly',
  'far',
  'farther',
  'few',
  'fewer',
  'fifth',
  'first',
  'five',
  'followed',
  'following',
  'follows',
  'for',
  'forever',
  'former',
  'formerly',
  'forth',
  'forward',
  'found',
  'four',
  'from',
  'further',
  'furthermore',
  'g',
  'get',
  'gets',
  'getting',
  'given',
  'gives',
  'go',
  'goes',
  'going',
  'gone',
  'got',
  'gotten',
  'greetings',
  'h',
  'had',
  'hadnt',
  'half',
  'happens',
  'hardly',
  'has',
  'hasnt',
  'have',
  'havent',
  'having',
  'he',
  'hed',
  'hell',
  'hello',
  'help',
  'hence',
  'her',
  'here',
  'hereafter',
  'hereby',
  'herein',
  'heres',
  'hereupon',
  'hers',
  'herself',
  'hes',
  'hi',
  'him',
  'himself',
  'his',
  'hither',
  'hopefully',
  'how',
  'howbeit',
  'however',
  'hundred',
  'i',
  'id',
  'ie',
  'if',
  'ignored',
  'ill',
  'im',
  'immediate',
  'in',
  'inasmuch',
  'inc',
  'inc.',
  'indeed',
  'indicate',
  'indicated',
  'indicates',
  'inner',
  'inside',
  'insofar',
  'instead',
  'into',
  'inward',
  'is',
  'isnt',
  'it',
  'itd',
  'itll',
  'its',
  'its',
  'itself',
  'ive',
  'j',
  'just',
  'k',
  'keep',
  'keeps',
  'kept',
  'know',
  'known',
  'knows',
  'l',
  'last',
  'lately',
  'later',
  'latter',
  'latterly',
  'least',
  'less',
  'lest',
  'let',
  'lets',
  'like',
  'liked',
  'likely',
  'likewise',
  'little',
  'look',
  'looking',
  'looks',
  'low',
  'lower',
  'ltd',
  'm',
  'made',
  'mainly',
  'make',
  'makes',
  'many',
  'may',
  'maybe',
  'maynt',
  'me',
  'mean',
  'meantime',
  'meanwhile',
  'merely',
  'might',
  'mightnt',
  'mine',
  'minus',
  'miss',
  'more',
  'moreover',
  'most',
  'mostly',
  'mr',
  'mrs',
  'much',
  'must',
  'mustnt',
  'my',
  'myself',
  'n',
  'name',
  'namely',
  'nd',
  'near',
  'nearly',
  'necessary',
  'need',
  'neednt',
  'needs',
  'neither',
  'never',
  'neverf',
  'neverless',
  'nevertheless',
  'new',
  'next',
  'nine',
  'ninety',
  'no',
  'nobody',
  'non',
  'none',
  'nonetheless',
  'noone',
  'no-one',
  'nor',
  'normally',
  'not',
  'nothing',
  'notwithstanding',
  'novel',
  'now',
  'nowhere',
  'o',
  'obviously',
  'of',
  'off',
  'often',
  'oh',
  'ok',
  'okay',
  'old',
  'on',
  'once',
  'one',
  'ones',
  'ones',
  'only',
  'onto',
  'opposite',
  'or',
  'other',
  'others',
  'otherwise',
  'ought',
  'oughtnt',
  'our',
  'ours',
  'ourselves',
  'out',
  'outside',
  'over',
  'overall',
  'own',
  'p',
  'particular',
  'particularly',
  'past',
  'per',
  'perhaps',
  'placed',
  'please',
  'plus',
  'possible',
  'presumably',
  'probably',
  'provided',
  'provides',
  'q',
  'que',
  'quite',
  'qv',
  'r',
  'rather',
  'rd',
  're',
  'really',
  'reasonably',
  'recent',
  'recently',
  'regarding',
  'regardless',
  'regards',
  'relatively',
  'respectively',
  'right',
  'round',
  's',
  'said',
  'same',
  'saw',
  'say',
  'saying',
  'says',
  'second',
  'secondly',
  'see',
  'seeing',
  'seem',
  'seemed',
  'seeming',
  'seems',
  'seen',
  'self',
  'selves',
  'sensible',
  'sent',
  'serious',
  'seriously',
  'seven',
  'several',
  'shall',
  'shant',
  'she',
  'shed',
  'shell',
  'shes',
  'should',
  'shouldnt',
  'since',
  'six',
  'so',
  'some',
  'somebody',
  'someday',
  'somehow',
  'someone',
  'something',
  'sometime',
  'sometimes',
  'somewhat',
  'somewhere',
  'soon',
  'sorry',
  'specified',
  'specify',
  'specifying',
  'still',
  'sub',
  'such',
  'sup',
  'sure',
  't',
  'take',
  'taken',
  'taking',
  'tell',
  'tends',
  'th',
  'than',
  'thank',
  'thanks',
  'thanx',
  'that',
  'thatll',
  'thats',
  'thats',
  'thatve',
  'the',
  'their',
  'theirs',
  'them',
  'themselves',
  'then',
  'thence',
  'there',
  'thereafter',
  'thereby',
  'thered',
  'therefore',
  'therein',
  'therell',
  'therere',
  'theres',
  'theres',
  'thereupon',
  'thereve',
  'these',
  'they',
  'theyd',
  'theyll',
  'theyre',
  'theyve',
  'thing',
  'things',
  'think',
  'third',
  'thirty',
  'this',
  'thorough',
  'thoroughly',
  'those',
  'though',
  'three',
  'through',
  'throughout',
  'thru',
  'thus',
  'till',
  'to',
  'together',
  'too',
  'took',
  'toward',
  'towards',
  'tried',
  'tries',
  'truly',
  'try',
  'trying',
  'ts',
  'twice',
  'two',
  'u',
  'un',
  'under',
  'underneath',
  'undoing',
  'unfortunately',
  'unless',
  'unlike',
  'unlikely',
  'until',
  'unto',
  'up',
  'upon',
  'upwards',
  'us',
  'use',
  'used',
  'useful',
  'uses',
  'using',
  'usually',
  'v',
  'value',
  'various',
  'versus',
  'very',
  'via',
  'viz',
  'vs',
  'w',
  'want',
  'wants',
  'was',
  'wasnt',
  'way',
  'we',
  'wed',
  'welcome',
  'well',
  'well',
  'went',
  'were',
  'were',
  'werent',
  'weve',
  'what',
  'whatever',
  'whatll',
  'whats',
  'whatve',
  'when',
  'whence',
  'whenever',
  'where',
  'whereafter',
  'whereas',
  'whereby',
  'wherein',
  'wheres',
  'whereupon',
  'wherever',
  'whether',
  'which',
  'whichever',
  'while',
  'whilst',
  'whither',
  'who',
  'whod',
  'whoever',
  'whole',
  'wholl',
  'whom',
  'whomever',
  'whos',
  'whose',
  'why',
  'will',
  'willing',
  'wish',
  'with',
  'within',
  'without',
  'wonder',
  'wont',
  'would',
  'wouldnt',
  'x',
  'y',
  'yes',
  'yet',
  'you',
  'youd',
  'youll',
  'your',
  'youre',
  'yours',
  'yourself',
  'yourselves',
  'youve',
  'z',
  'zero',
]

var stemmer = {},
  cache = {}

stemmer.except = function (word, exceptions) {
  if (exceptions instanceof Array) {
    if (~exceptions.indexOf(word)) return word
  } else {
    for (var k in exceptions) {
      if (k === word) return exceptions[k]
    }
  }
  return false
}

// word - String
// offset - Integer (optional)
// replace - Key/Value Array of pattern, string, and function.
stemmer.among = function among(word, offset, replace) {
  if (replace == null) return among(word, 0, offset)

  // Store the intial value of the word.
  var initial = word.slice(),
    pattern,
    replacement

  for (var i = 0; i < replace.length; i += 2) {
    pattern = replace[i]
    pattern = cache[pattern] || (cache[pattern] = new RegExp(replace[i] + '$'))
    replacement = replace[i + 1]

    if (typeof replacement === 'function') {
      word = word.replace(pattern, function (m) {
        var off = arguments['' + (arguments.length - 2)]
        if (off >= offset) {
          return replacement.apply(null, arguments)
        } else {
          return m + ' '
        }
      })
    } else {
      word = word.replace(pattern, function (m) {
        var off = arguments['' + (arguments.length - 2)]
        return off >= offset ? replacement : m + ' '
      })
    }

    if (word !== initial) break
  }

  return word.replace(/ /g, '')
}

let alphabet = 'abcdefghijklmnopqrstuvwxyz',
  vowels = 'aeiouy',
  v_wxy = vowels + 'wxY',
  valid_li = 'cdeghkmnrt',
  r1_re = RegExp('^.*?([' + vowels + '][^' + vowels + ']|$)'),
  r1_spec = /^(gener|commun|arsen)/,
  doubles = /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/,
  y_cons = RegExp('([' + vowels + '])y', 'g'),
  y_suff = RegExp('(.[^' + vowels + '])[yY]$'),
  exceptions1 = {
    skis: 'ski',
    skies: 'sky',
    dying: 'die',
    lying: 'lie',
    tying: 'tie',

    idly: 'idl',
    gently: 'gentl',
    ugly: 'ugli',
    early: 'earli',
    only: 'onli',
    singly: 'singl',

    sky: 'sky',
    news: 'news',
    howe: 'howe',

    atlas: 'atlas',
    cosmos: 'cosmos',
    bias: 'bias',
    andes: 'andes',
  },
  exceptions2 = [
    'inning',
    'outing',
    'canning',
    'herring',
    'earring',
    'proceed',
    'exceed',
    'succeed',
  ]

function stem(word) {
  // Exceptions 1
  var stop = stemmer.except(word, exceptions1)
  if (stop) return stop

  // No stemming for short words.
  if (word.length < 3) return word

  // Y = "y" as a consonant.
  if (word[0] === 'y') word = 'Y' + word.substr(1)
  word = word.replace(y_cons, '$1Y')

  // Identify the regions of the word.
  var r1, m
  if ((m = r1_spec.exec(word))) {
    r1 = m[0].length
  } else {
    r1 = r1_re.exec(word)[0].length
  }

  var r2 = r1 + r1_re.exec(word.substr(r1))[0].length

  // Step 0
  word = word.replace(/^'/, '')
  word = word.replace(/'(s'?)?$/, '')

  // Step 1a
  word = stemmer.among(word, [
    'sses',
    'ss',
    '(ied|ies)',
    function (match, _, offset) {
      return offset > 1 ? 'i' : 'ie'
    },
    '([' + vowels + '].*?[^us])s',
    function (match, m1) {
      return m1
    },
  ])

  stop = stemmer.except(word, exceptions2)
  if (stop) return stop

  // Step 1b
  word = stemmer.among(word, [
    '(eed|eedly)',
    function (match, _, offset) {
      return offset >= r1 ? 'ee' : match + ' '
    },
    '([' + vowels + '].*?)(ed|edly|ing|ingly)',
    function (match, prefix, suffix, off) {
      if (/(?:at|bl|iz)$/.test(prefix)) {
        return prefix + 'e'
      } else if (doubles.test(prefix)) {
        return prefix.substr(0, prefix.length - 1)
      } else if (
        shortv(word.substr(0, off + prefix.length)) &&
        off + prefix.length <= r1
      ) {
        return prefix + 'e'
      } else {
        return prefix
      }
    },
  ])

  // Step 1c
  word = word.replace(y_suff, '$1i')

  // Step 2
  word = stemmer.among(word, r1, [
    '(izer|ization)',
    'ize',
    '(ational|ation|ator)',
    'ate',
    'enci',
    'ence',
    'anci',
    'ance',
    'abli',
    'able',
    'entli',
    'ent',
    'tional',
    'tion',
    '(alism|aliti|alli)',
    'al',
    'fulness',
    'ful',
    '(ousli|ousness)',
    'ous',
    '(iveness|iviti)',
    'ive',
    '(biliti|bli)',
    'ble',
    'ogi',
    function (m, off) {
      return word[off - 1] === 'l' ? 'og' : 'ogi'
    },
    'fulli',
    'ful',
    'lessli',
    'less',
    'li',
    function (m, off) {
      return ~valid_li.indexOf(word[off - 1]) ? '' : 'li'
    },
  ])

  // Step 3
  word = stemmer.among(word, r1, [
    'ational',
    'ate',
    'tional',
    'tion',
    'alize',
    'al',
    '(icate|iciti|ical)',
    'ic',
    '(ful|ness)',
    '',
    'ative',
    function (m, off) {
      return off >= r2 ? '' : 'ative'
    },
  ])

  // Step 4
  word = stemmer.among(word, r2, [
    '(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ism|ate|iti|ous|ive|ize)',
    '',
    'ion',
    function (m, off) {
      return ~'st'.indexOf(word[off - 1]) ? '' : m
    },
  ])

  // Step 5
  word = stemmer.among(word, r1, [
    'e',
    function (m, off) {
      return off >= r2 || !shortv(word, off - 2) ? '' : 'e'
    },
    'l',
    function (m, off) {
      return word[off - 1] === 'l' && off >= r2 ? '' : 'l'
    },
  ])

  word = word.replace(/Y/g, 'y')

  return word
}

function shortv(word, i) {
  if (i == null) i = word.length - 2
  if (word.length < 3) i = 0 //return true
  return !!(
    (!~vowels.indexOf(word[i - 1]) &&
      ~vowels.indexOf(word[i]) &&
      !~v_wxy.indexOf(word[i + 1])) ||
    (i === 0 && ~vowels.indexOf(word[i]) && !~vowels.indexOf(word[i + 1]))
  )
}

const _LDA = function (
  sentences,
  numberOfTopics,
  numberOfTermsPerTopic,
  languages,
  alphaValue,
  betaValue,
  randomSeed
) {
  // The result will consist of topics and their included terms [[{"term":"word1", "probability":0.065}, {"term":"word2", "probability":0.047}, ... ], [{"term":"word1", "probability":0.085}, {"term":"word2", "probability":0.024}, ... ]].
  var result = []
  // Index-encoded array of sentences, with each row containing the indices of the words in the vocabulary.
  var documents = new Array()
  // Hash of vocabulary words and the count of how many times each word has been seen.
  var f = {}
  // Vocabulary of unique words (porter stemmed).
  var vocab = new Array()
  // Vocabulary of unique words in their original form.
  var vocabOrig = {}
  // Array of stop words
  languages = languages || Array('en')

  if (sentences && sentences.length > 0) {
    var stopwords = new Array()

    languages.forEach(function (value) {
      stopwords = stopwords.concat(stop_words)
    })

    for (var i = 0; i < sentences.length; i++) {
      if (sentences[i] == '') continue
      documents[i] = new Array()

      var words = sentences[i] ? sentences[i].split(/[\s,\"]+/) : null

      if (!words) continue
      for (var wc = 0; wc < words.length; wc++) {
        var w = words[wc]
          .toLowerCase()
          .replace(/[^a-z\'A-Z0-9\u00C0-\u00ff ]+/g, '')
        var wStemmed = stem(w)
        if (
          w == '' ||
          !wStemmed ||
          w.length == 1 ||
          stopwords.indexOf(w.replace("'", '')) > -1 ||
          stopwords.indexOf(wStemmed) > -1 ||
          w.indexOf('http') == 0
        )
          continue
        if (f[wStemmed]) {
          f[wStemmed] = f[wStemmed] + 1
        } else if (wStemmed) {
          f[wStemmed] = 1
          vocab.push(wStemmed)
          vocabOrig[wStemmed] = w
        }

        documents[i].push(vocab.indexOf(wStemmed))
      }
    }

    var V = vocab.length
    var M = documents.length
    var K = parseInt(numberOfTopics)
    var alpha = alphaValue || 0.1 // per-document distributions over topics
    var beta = betaValue || 0.01 // per-topic distributions over words
    documents = documents.filter((doc) => {
      return doc.length
    }) // filter empty documents

    lda.configure(documents, V, 10000, 2000, 100, 10, randomSeed)
    lda.gibbs(K, alpha, beta)

    var theta = lda.getTheta()
    var phi = lda.getPhi()

    var text = ''

    //topics
    var topTerms = numberOfTermsPerTopic
    for (var k = 0; k < phi.length; k++) {
      var things = new Array()
      for (var w = 0; w < phi[k].length; w++) {
        things.push(
          '' +
            phi[k][w].toPrecision(2) +
            '_' +
            vocab[w] +
            '_' +
            vocabOrig[vocab[w]]
        )
      }
      things.sort().reverse()
      //console.log(things);
      if (topTerms > vocab.length) topTerms = vocab.length

      //console.log('Topic ' + (k + 1));
      var row = []

      for (var t = 0; t < topTerms; t++) {
        var topicTerm = things[t].split('_')[2]
        var prob = parseInt(things[t].split('_')[0] * 100)
        if (prob < 2) continue

        //console.log('Top Term: ' + topicTerm + ' (' + prob + '%)');

        var term = {}
        term.term = topicTerm
        term.probability = parseFloat(things[t].split('_')[0])
        row.push(term)
      }

      result.push(row)
    }
  }

  return result
}

function makeArray(x) {
  var a = new Array()
  for (var i = 0; i < x; i++) {
    a[i] = 0
  }
  return a
}

function make2DArray(x, y) {
  var a = new Array()
  for (var i = 0; i < x; i++) {
    a[i] = new Array()
    for (var j = 0; j < y; j++) a[i][j] = 0
  }
  return a
}

var lda = new (function () {
  var documents, z, nw, nd, nwsum, ndsum, thetasum, phisum, V, K, alpha, beta
  var THIN_INTERVAL = 20
  var BURN_IN = 100
  var ITERATIONS = 1000
  var SAMPLE_LAG
  var RANDOM_SEED
  var dispcol = 0
  var numstats = 0
  this.configure = function (
    docs,
    v,
    iterations,
    burnIn,
    thinInterval,
    sampleLag,
    randomSeed
  ) {
    this.ITERATIONS = iterations
    this.BURN_IN = burnIn
    this.THIN_INTERVAL = thinInterval
    this.SAMPLE_LAG = sampleLag
    this.RANDOM_SEED = randomSeed
    this.documents = docs
    this.V = v
    this.dispcol = 0
    this.numstats = 0
  }
  this.initialState = function (K) {
    var i
    var M = this.documents.length
    this.nw = make2DArray(this.V, K)
    this.nd = make2DArray(M, K)
    this.nwsum = makeArray(K)
    this.ndsum = makeArray(M)
    this.z = new Array()
    for (i = 0; i < M; i++) this.z[i] = new Array()
    for (var m = 0; m < M; m++) {
      var N = this.documents[m].length
      this.z[m] = new Array()
      for (var n = 0; n < N; n++) {
        var topic = parseInt('' + this.getRandom() * K)
        this.z[m][n] = topic
        this.nw[this.documents[m][n]][topic]++
        this.nd[m][topic]++
        this.nwsum[topic]++
      }
      this.ndsum[m] = N
    }
  }

  this.gibbs = function (K, alpha, beta) {
    var i
    this.K = K
    this.alpha = alpha
    this.beta = beta
    if (this.SAMPLE_LAG > 0) {
      this.thetasum = make2DArray(this.documents.length, this.K)
      this.phisum = make2DArray(this.K, this.V)
      this.numstats = 0
    }
    this.initialState(K)
    //document.write("Sampling " + this.ITERATIONS
    //   + " iterations with burn-in of " + this.BURN_IN + " (B/S="
    //   + this.THIN_INTERVAL + ").<br/>");
    for (i = 0; i < this.ITERATIONS; i++) {
      for (var m = 0; m < this.z.length; m++) {
        for (var n = 0; n < this.z[m].length; n++) {
          var topic = this.sampleFullConditional(m, n)
          this.z[m][n] = topic
        }
      }
      if (i < this.BURN_IN && i % this.THIN_INTERVAL == 0) {
        //document.write("B");
        this.dispcol++
      }
      if (i > this.BURN_IN && i % this.THIN_INTERVAL == 0) {
        //document.write("S");
        this.dispcol++
      }
      if (i > this.BURN_IN && this.SAMPLE_LAG > 0 && i % this.SAMPLE_LAG == 0) {
        this.updateParams()
        //document.write("|");
        if (i % this.THIN_INTERVAL != 0) this.dispcol++
      }
      if (this.dispcol >= 100) {
        //document.write("*<br/>");
        this.dispcol = 0
      }
    }
  }

  this.sampleFullConditional = function (m, n) {
    var topic = this.z[m][n]
    this.nw[this.documents[m][n]][topic]--
    this.nd[m][topic]--
    this.nwsum[topic]--
    this.ndsum[m]--
    var p = makeArray(this.K)
    for (var k = 0; k < this.K; k++) {
      p[k] =
        (((this.nw[this.documents[m][n]][k] + this.beta) /
          (this.nwsum[k] + this.V * this.beta)) *
          (this.nd[m][k] + this.alpha)) /
        (this.ndsum[m] + this.K * this.alpha)
    }
    for (var k = 1; k < p.length; k++) {
      p[k] += p[k - 1]
    }
    var u = this.getRandom() * p[this.K - 1]
    for (topic = 0; topic < p.length; topic++) {
      if (u < p[topic]) break
    }
    this.nw[this.documents[m][n]][topic]++
    this.nd[m][topic]++
    this.nwsum[topic]++
    this.ndsum[m]++
    return topic
  }

  this.updateParams = function () {
    for (var m = 0; m < this.documents.length; m++) {
      for (var k = 0; k < this.K; k++) {
        this.thetasum[m][k] +=
          (this.nd[m][k] + this.alpha) / (this.ndsum[m] + this.K * this.alpha)
      }
    }
    for (var k = 0; k < this.K; k++) {
      for (var w = 0; w < this.V; w++) {
        this.phisum[k][w] +=
          (this.nw[w][k] + this.beta) / (this.nwsum[k] + this.V * this.beta)
      }
    }
    this.numstats++
  }

  this.getTheta = function () {
    var theta = new Array()
    for (var i = 0; i < this.documents.length; i++) theta[i] = new Array()
    if (this.SAMPLE_LAG > 0) {
      for (var m = 0; m < this.documents.length; m++) {
        for (var k = 0; k < this.K; k++) {
          theta[m][k] = this.thetasum[m][k] / this.numstats
        }
      }
    } else {
      for (var m = 0; m < this.documents.length; m++) {
        for (var k = 0; k < this.K; k++) {
          theta[m][k] =
            (this.nd[m][k] + this.alpha) / (this.ndsum[m] + this.K * this.alpha)
        }
      }
    }
    return theta
  }

  this.getPhi = function () {
    var phi = new Array()
    for (var i = 0; i < this.K; i++) phi[i] = new Array()
    if (this.SAMPLE_LAG > 0) {
      for (var k = 0; k < this.K; k++) {
        for (var w = 0; w < this.V; w++) {
          phi[k][w] = this.phisum[k][w] / this.numstats
        }
      }
    } else {
      for (var k = 0; k < this.K; k++) {
        for (var w = 0; w < this.V; w++) {
          phi[k][w] =
            (this.nw[w][k] + this.beta) / (this.nwsum[k] + this.V * this.beta)
        }
      }
    }
    return phi
  }

  this.getRandom = function () {
    if (this.RANDOM_SEED) {
      // generate a pseudo-random number using a seed to ensure reproducable results.
      var x = Math.sin(this.RANDOM_SEED++) * 1000000
      return x - Math.floor(x)
    } else {
      // use standard random algorithm.
      return Math.random()
    }
  }
})()

export {
  _LDA
}