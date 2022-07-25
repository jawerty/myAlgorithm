var e, t
;(e = this),
  (t = function () {
    var e = {
        methods: { one: {}, two: {}, three: {}, four: {} },
        model: { one: {}, two: {}, three: {} },
        compute: {},
        hooks: [],
      },
      t = {
        compute: function (e) {
          const { world: t } = this,
            n = t.compute
          return (
            'string' == typeof e && n.hasOwnProperty(e)
              ? n[e](this)
              : ((e) => '[object Array]' === Object.prototype.toString.call(e))(
                  e
                )
              ? e.forEach((r) => {
                  t.compute.hasOwnProperty(r)
                    ? n[r](this)
                    : console.warn('no compute:', e)
                })
              : 'function' == typeof e
              ? e(this)
              : console.warn('no compute:', e),
            this
          )
        },
      },
      n = {
        forEach: function (e) {
          return (
            this.fullPointer.forEach((t, n) => {
              let r = this.update([t])
              e(r, n)
            }),
            this
          )
        },
        map: function (e, t) {
          let n = this.fullPointer.map((t, n) => {
            let r = this.update([t])
            return e(r, n)
          })
          if (0 === n.length) return t || this.update([])
          if (void 0 !== n[0]) {
            if ('string' == typeof n[0]) return n
            if ('object' == typeof n[0] && (null === n[0] || !n[0].isView))
              return n
          }
          let r = []
          return (
            n.forEach((e) => {
              r = r.concat(e.fullPointer)
            }),
            this.toView(r)
          )
        },
        filter: function (e) {
          let t = this.fullPointer
          return (
            (t = t.filter((t, n) => {
              let r = this.update([t])
              return e(r, n)
            })),
            this.update(t)
          )
        },
        find: function (e) {
          let t = this.fullPointer.find((t, n) => {
            let r = this.update([t])
            return e(r, n)
          })
          return this.update([t])
        },
        some: function (e) {
          return this.fullPointer.some((t, n) => {
            let r = this.update([t])
            return e(r, n)
          })
        },
        random: function (e = 1) {
          let t = this.fullPointer,
            n = Math.floor(Math.random() * t.length)
          return (
            n + e > this.length && ((n = this.length - e), (n = n < 0 ? 0 : n)),
            (t = t.slice(n, n + e)),
            this.update(t)
          )
        },
      }
    const r = {
      termList: function () {
        return this.methods.one.termList(this.docs)
      },
      terms: function (e) {
        let t = this.match('.')
        return 'number' == typeof e ? t.eq(e) : t
      },
      groups: function (e) {
        if (e || 0 === e) return this.update(this._groups[e] || [])
        let t = {}
        return (
          Object.keys(this._groups).forEach((e) => {
            t[e] = this.update(this._groups[e])
          }),
          t
        )
      },
      eq: function (e) {
        let t = this.pointer,
          n = this._cache || []
        if ((t || (t = this.docs.map((e, t) => [t])), t[e])) {
          let r = this.update([t[e]])
          return (r._cache = n[e]), r
        }
        return this.none()
      },
      first: function () {
        return this.eq(0)
      },
      last: function () {
        let e = this.fullPointer.length - 1
        return this.eq(e)
      },
      firstTerms: function () {
        return this.match('^.')
      },
      lastTerms: function () {
        return this.match('.$')
      },
      slice: function (e, t) {
        let n = this.pointer || this.docs.map((e, t) => [t])
        return (n = n.slice(e, t)), this.update(n)
      },
      all: function () {
        return this.update().toView()
      },
      fullSentences: function () {
        let e = this.fullPointer.map((e) => [e[0]])
        return this.update(e).toView()
      },
      none: function () {
        return this.update([])
      },
      isDoc: function (e) {
        if (!e || !e.isView) return !1
        let t = this.fullPointer,
          n = e.fullPointer
        return (
          !t.length !== n.length &&
          t.every(
            (e, t) =>
              !!n[t] && e[0] === n[t][0] && e[1] === n[t][1] && e[2] === n[t][2]
          )
        )
      },
      wordCount: function () {
        return this.docs.reduce(
          (e, t) => (e += t.filter((e) => '' !== e.text).length),
          0
        )
      },
    }
    ;(r.group = r.groups),
      (r.fullSentence = r.fullSentences),
      (r.sentence = r.fullSentences),
      (r.lastTerm = r.lastTerms),
      (r.firstTerm = r.firstTerms)
    var a = r
    const o = Object.assign({}, a, t, n)
    o.get = o.eq
    var i = o
    class View {
      constructor(t, n, r = {}) {
        ;[
          ['document', t],
          ['world', e],
          ['_groups', r],
          ['_cache', null],
          ['viewType', 'View'],
        ].forEach((e) => {
          Object.defineProperty(this, e[0], { value: e[1], writable: !0 })
        }),
          (this.ptrs = n)
      }
      get docs() {
        let t = this.document
        return (
          this.ptrs && (t = e.methods.one.getDoc(this.ptrs, this.document)), t
        )
      }
      get pointer() {
        return this.ptrs
      }
      get methods() {
        return this.world.methods
      }
      get model() {
        return this.world.model
      }
      get hooks() {
        return this.world.hooks
      }
      get isView() {
        return !0
      }
      get found() {
        return this.docs.length > 0
      }
      get length() {
        return this.docs.length
      }
      get fullPointer() {
        let { docs: e, ptrs: t, document: n } = this
        return (t || e.map((e, t) => [t])).map((e) => {
          let [t, r, a, o, i] = e
          return (
            (r = r || 0),
            (a = a || (n[t] || []).length),
            n[t] &&
              n[t][r] &&
              ((o = o || n[t][r].id), n[t][a - 1] && (i = i || n[t][a - 1].id)),
            [t, r, a, o, i]
          )
        })
      }
      update(e) {
        let t = new View(this.document, e)
        if (t._cache && e && e.length > 1) {
          let n = []
          e.forEach((e) => {
            1 === e.length && n.push(t._cache[e[0]])
          }),
            (t._cache = n)
        }
        return (t.world = this.world), t
      }
      toView(e) {
        return void 0 === e && (e = this.pointer), new View(this.document, e)
      }
      fromText(e) {
        const { methods: t } = this
        let n = t.one.tokenize.fromString(e, this.world),
          r = new View(n)
        return (
          (r.world = this.world),
          r.compute(['normal', 'lexicon']),
          this.world.compute.preTagger && r.compute('preTagger'),
          r
        )
      }
      clone() {
        let e = this.document.slice(0)
        e = e.map((e) =>
          e.map((e) => (((e = Object.assign({}, e)).tags = new Set(e.tags)), e))
        )
        let t = this.update(this.pointer)
        return (t.document = e), (t._cache = this._cache), t
      }
    }
    Object.assign(View.prototype, i)
    var s = View
    const l = function (e) {
      return e && 'object' == typeof e && !Array.isArray(e)
    }
    var u = function (e, t, n, r) {
      const { methods: a, model: o, compute: i, hooks: s } = t
      e.methods &&
        (function (e, t) {
          for (const n in t) (e[n] = e[n] || {}), Object.assign(e[n], t[n])
        })(a, e.methods),
        e.model &&
          (function e(t, n) {
            if (l(n))
              for (const r in n)
                l(n[r])
                  ? (t[r] || Object.assign(t, { [r]: {} }), e(t[r], n[r]))
                  : Object.assign(t, { [r]: n[r] })
            return t
          })(o, e.model),
        e.compute && Object.assign(i, e.compute),
        s && (t.hooks = s.concat(e.hooks || [])),
        e.api && e.api(n),
        e.lib && Object.keys(e.lib).forEach((t) => (r[t] = e.lib[t])),
        e.tags && r.addTags(e.tags),
        e.words && r.addWords(e.words),
        e.mutate && e.mutate(t)
    }
    const c = function (e) {
      return '[object Array]' === Object.prototype.toString.call(e)
    }
    var h = function (e, t, n) {
      const { methods: r } = n
      let a = new t([])
      return (
        (a.world = n),
        'number' == typeof e && (e = String(e)),
        e
          ? 'string' == typeof e
            ? new t(r.one.tokenize.fromString(e, n))
            : ((o = e),
              '[object Object]' === Object.prototype.toString.call(o) &&
              e.isView
                ? new t(e.document, e.ptrs)
                : c(e)
                ? c(e[0])
                  ? new t(
                      e.map((e) =>
                        e.map((e) => ({
                          text: e,
                          normal: e,
                          pre: '',
                          post: ' ',
                          tags: new Set(),
                        }))
                      )
                    )
                  : new t(
                      (function (e) {
                        return e.map((e) =>
                          e.terms.map(
                            (e) => (c(e.tags) && (e.tags = new Set(e.tags)), e)
                          )
                        )
                      })(e)
                    )
                : a)
          : a
      )
      var o
    }
    let d = Object.assign({}, e)
    const p = function (e, t) {
      t && p.addWords(t)
      let n = h(e, s, d)
      return e && n.compute(d.hooks), n
    }
    Object.defineProperty(p, '_world', { value: d, writable: !0 }),
      (p.tokenize = function (e, t) {
        const { compute: n } = this._world
        t && p.addWords(t)
        let r = h(e, s, d)
        return (
          n.contractions &&
            r.compute(['alias', 'normal', 'machine', 'contractions']),
          r
        )
      }),
      (p.plugin = function (e) {
        return u(e, this._world, s, this), this
      }),
      (p.extend = p.plugin),
      (p.world = function () {
        return this._world
      }),
      (p.model = function () {
        return this._world.model
      }),
      (p.methods = function () {
        return this._world.methods
      }),
      (p.hooks = function () {
        return this._world.hooks
      }),
      (p.verbose = function (e) {
        const t =
          'undefined' != typeof process && process.env
            ? process.env
            : self.env || {}
        return (
          (t.DEBUG_TAGS = 'tagger' === e || !0 === e || ''),
          (t.DEBUG_MATCH = 'match' === e || !0 === e || ''),
          (t.DEBUG_CHUNKS = 'chunker' === e || !0 === e || ''),
          this
        )
      }),
      (p.version = '14.3.1')
    var m = p
    const g = {
      cache: function () {
        return (this._cache = this.methods.one.cacheDoc(this.document)), this
      },
      uncache: function () {
        return (this._cache = null), this
      },
    }
    var f = {
      api: function (e) {
        Object.assign(e.prototype, g)
      },
      compute: {
        cache: function (e) {
          e._cache = e.methods.one.cacheDoc(e.document)
        },
      },
      methods: {
        one: {
          cacheDoc: function (e) {
            return e.map((e) => {
              let t = new Set()
              return (
                e.forEach((e) => {
                  '' !== e.normal && t.add(e.normal),
                    e.switch && t.add(`%${e.switch}%`),
                    e.implicit && t.add(e.implicit),
                    e.machine && t.add(e.machine),
                    e.root && t.add(e.root),
                    e.alias && e.alias.forEach((e) => t.add(e))
                  let n = Array.from(e.tags)
                  for (let e = 0; e < n.length; e += 1) t.add('#' + n[e])
                }),
                t
              )
            })
          },
        },
      },
    }
    const b = (e) => /^\p{Lu}[\p{Ll}'’]/u.test(e) || /^\p{Lu}$/u.test(e),
      v = (e, t, n) => {
        if ((n.forEach((e) => (e.dirty = !0)), e)) {
          let r = [t, 0].concat(n)
          Array.prototype.splice.apply(e, r)
        }
        return e
      },
      y = function (e) {
        let t = e[e.length - 1]
        !t || / $/.test(t.post) || /[-–—]/.test(t.post) || (t.post += ' ')
      },
      w = (e, t, n) => {
        const r = /[-.?!,;:)–—'"]/g
        let a = e[t - 1]
        if (!a) return
        let o = a.post
        if (r.test(o)) {
          let e = o.match(r).join(''),
            t = n[n.length - 1]
          ;(t.post = e + t.post), (a.post = a.post.replace(r, ''))
        }
      },
      k = function (e, t, n, r) {
        let [a, o, i] = t
        0 === o || i === r[a].length ? y(n) : (y(n), y([e[t[1]]])),
          (function (e, t, n) {
            let r = e[t]
            if (0 !== t || !b(r.text)) return
            n[0].text = n[0].text.replace(/^\p{Ll}/u, (e) => e.toUpperCase())
            let a = e[t]
            a.tags.has('ProperNoun') ||
              a.tags.has('Acronym') ||
              (b(a.text) &&
                a.text.length > 1 &&
                (a.text = a.text.replace(/^\p{Lu}/u, (e) => e.toLowerCase())))
          })(e, o, n),
          v(e, o, n)
      }
    let P = 0
    const A = (e) => ((e = e.length < 3 ? '0' + e : e).length < 3 ? '0' + e : e)
    var j = function (e) {
      let [t, n] = e.index || [0, 0]
      P += 1
      var r = P
      ;(r = parseInt(r, 10)),
        (t = t > 46655 ? 46655 : t),
        (n = n > 1294 ? 1294 : n)
      let a = A((r = r > 46655 ? 46655 : r).toString(36))
      a += A(t.toString(36))
      let o = n.toString(36)
      return (
        (o = o.length < 2 ? '0' + o : o),
        (a += o),
        (a += parseInt(36 * Math.random(), 10).toString(36)),
        e.normal + '|' + a.toUpperCase()
      )
    }
    const x = function (e) {
        e.has('@hasContraction') &&
          e.grow('@hasContraction').contractions().expand()
      },
      E = (e) => '[object Array]' === Object.prototype.toString.call(e),
      N = function (e, t, n) {
        const { document: r, world: a } = t
        let o = t.fullPointer,
          i = t.fullPointer
        t.forEach((s, l) => {
          let u = s.fullPointer[0],
            [c] = u,
            h = r[c],
            d = (function (e, t) {
              const { methods: n } = t
              return 'string' == typeof e
                ? n.one.tokenize.fromString(e, t)[0]
                : 'object' == typeof e && e.isView
                ? e.clone().docs[0]
                : E(e)
                ? E(e[0])
                  ? e[0]
                  : e
                : []
            })(e, a)
          ;(d = (function (e) {
            return e.map((e) => ((e.id = j(e)), e))
          })(d)),
            n
              ? (x(t.update([u]).firstTerm()), k(h, u, d, r))
              : (x(t.update([u]).lastTerm()),
                (function (e, t, n, r) {
                  let [a, , o] = t,
                    i = (r[a] || []).length
                  o < i
                    ? (w(e, o, n), y(n))
                    : i === o &&
                      (y(e),
                      w(e, o, n),
                      r[a + 1] && (n[n.length - 1].post += ' ')),
                    v(e, t[2], n),
                    (t[4] = n[n.length - 1].id)
                })(h, u, d, r)),
            r[c] && r[c][u[1]] && (u[3] = r[c][u[1]].id),
            (i[l] = u),
            (u[2] += d.length),
            (o[l] = u)
        })
        let s = t.toView(o)
        return (
          (t.ptrs = i),
          s.compute(['id', 'index', 'lexicon']),
          s.world.compute.preTagger && s.compute('preTagger'),
          s
        )
      },
      I = {
        insertAfter: function (e) {
          return N(e, this, !1)
        },
        insertBefore: function (e) {
          return N(e, this, !0)
        },
      }
    ;(I.append = I.insertAfter),
      (I.prepend = I.insertBefore),
      (I.insert = I.insertAfter)
    var T = I
    const G = /\$[0-9a-z]+/g,
      D = {
        replaceWith: function (e, t = {}) {
          let n = this.fullPointer,
            r = this
          if ('function' == typeof e)
            return (function (e, t) {
              return (
                e.forEach((e) => {
                  let n = t(e)
                  e.replaceWith(n)
                }),
                e
              )
            })(r, e)
          e = (function (e, t) {
            if ('string' != typeof e) return e
            let n = t.groups()
            return e.replace(G, (e) => {
              let t = e.replace(/\$/, '')
              return n.hasOwnProperty(t) ? n[t].text() : e
            })
          })(e, r)
          let a = this.update(n)
          n = n.map((e) => e.slice(0, 3))
          let o = (a.docs[0] || []).map((e) => Array.from(e.tags))
          r.insertAfter(e),
            a.has('@hasContraction') &&
              r.contractions &&
              r.grow('@hasContraction+').contractions().expand(),
            r.delete(a)
          let i = r.toView(n).compute(['index', 'lexicon'])
          return (
            i.world.compute.preTagger && i.compute('preTagger'),
            t.tags &&
              i.terms().forEach((e, t) => {
                e.tagSafe(o[t])
              }),
            t.case &&
              i.docs[0] &&
              i.docs[0][0] &&
              0 === i.docs[0][0].index[1] &&
              (i.docs[0][0].text = i.docs[0][0].text.replace(
                /\w\S*/g,
                (e) => e.charAt(0).toUpperCase() + e.substring(1).toLowerCase()
              )),
            i
          )
        },
        replace: function (e, t, n) {
          if (e && !t) return this.replaceWith(e, n)
          let r = this.match(e)
          return r.found ? r.replaceWith(t, n) : this
        },
      }
    var C = D,
      O = function (e, t) {
        t.forEach((t) => {
          let [n, r, a] = t,
            o = a - r
          e[n] &&
            (a === e[n].length &&
              a > 1 &&
              (function (e, t) {
                let n = e.length - 1,
                  r = e[n],
                  a = e[n - t]
                a &&
                  r &&
                  ((a.post += r.post),
                  (a.post = a.post.replace(/ +([.?!,;:])/, '$1')),
                  (a.post = a.post.replace(/[,;:]+([.?!])/, '$1')))
              })(e[n], o),
            e[n].splice(r, o))
        })
        for (let t = e.length - 1; t >= 0; t -= 1)
          if (
            0 === e[t].length &&
            (e.splice(t, 1), t === e.length && e[t - 1])
          ) {
            let n = e[t - 1],
              r = n[n.length - 1]
            r && (r.post = r.post.trimEnd())
          }
        return e
      }
    const V = {
      remove: function (e) {
        const { indexN: t } = this.methods.one.pointer
        let n = this.all(),
          r = this
        e && ((n = this), (r = this.match(e))),
          n.has('@hasContraction') &&
            n.contractions &&
            n.grow('@hasContraction').contractions().expand()
        let a = n.fullPointer,
          o = r.fullPointer.reverse(),
          i = O(this.document, o)
        return (
          (a = (function (e, t) {
            return (
              (e = e.map((e) => {
                let [n] = e
                return t[n]
                  ? (t[n].forEach((t) => {
                      let n = t[2] - t[1]
                      e[1] <= t[1] && e[2] >= t[2] && (e[2] -= n)
                    }),
                    e)
                  : e
              })).forEach((t, n) => {
                if (0 === t[1] && 0 == t[2])
                  for (let t = n + 1; t < e.length; t += 1)
                    (e[t][0] -= 1), e[t][0] < 0 && (e[t][0] = 0)
              }),
              (e = (e = e.filter((e) => e[2] - e[1] > 0)).map(
                (e) => ((e[3] = null), (e[4] = null), e)
              ))
            )
          })(a, t(o))),
          (n.ptrs = a),
          (n.document = i),
          n.compute('index'),
          e ? n.toView(a) : ((this.ptrs = []), n.none())
        )
      },
    }
    V.delete = V.remove
    var B = V
    const z = {
      pre: function (e, t) {
        return void 0 === e && this.found
          ? this.docs[0][0].pre
          : (this.docs.forEach((n) => {
              let r = n[0]
              !0 === t ? (r.pre += e) : (r.pre = e)
            }),
            this)
      },
      post: function (e, t) {
        if (void 0 === e) {
          let e = this.docs[this.docs.length - 1]
          return e[e.length - 1].post
        }
        return (
          this.docs.forEach((n) => {
            let r = n[n.length - 1]
            !0 === t ? (r.post += e) : (r.post = e)
          }),
          this
        )
      },
      trim: function () {
        if (!this.found) return this
        let e = this.docs,
          t = e[0][0]
        t.pre = t.pre.trimStart()
        let n = e[e.length - 1],
          r = n[n.length - 1]
        return (r.post = r.post.trimEnd()), this
      },
      hyphenate: function () {
        return (
          this.docs.forEach((e) => {
            e.forEach((t, n) => {
              0 !== n && (t.pre = ''), e[n + 1] && (t.post = '-')
            })
          }),
          this
        )
      },
      dehyphenate: function () {
        const e = /[-–—]/
        return (
          this.docs.forEach((t) => {
            t.forEach((t) => {
              e.test(t.post) && (t.post = ' ')
            })
          }),
          this
        )
      },
      toQuotations: function (e, t) {
        return (
          (e = e || '"'),
          (t = t || '"'),
          this.docs.forEach((n) => {
            n[0].pre = e + n[0].pre
            let r = n[n.length - 1]
            r.post = t + r.post
          }),
          this
        )
      },
      toParentheses: function (e, t) {
        return (
          (e = e || '('),
          (t = t || ')'),
          this.docs.forEach((n) => {
            n[0].pre = e + n[0].pre
            let r = n[n.length - 1]
            r.post = t + r.post
          }),
          this
        )
      },
    }
    ;(z.deHyphenate = z.dehyphenate), (z.toQuotation = z.toQuotations)
    var $ = z,
      F = {
        alpha: (e, t) =>
          e.normal < t.normal ? -1 : e.normal > t.normal ? 1 : 0,
        length: (e, t) => {
          let n = e.normal.trim().length,
            r = t.normal.trim().length
          return n < r ? 1 : n > r ? -1 : 0
        },
        wordCount: (e, t) =>
          e.words < t.words ? 1 : e.words > t.words ? -1 : 0,
        sequential: (e, t) =>
          e[0] < t[0] ? 1 : e[0] > t[0] ? -1 : e[1] > t[1] ? 1 : -1,
        byFreq: function (e) {
          let t = {}
          return (
            e.forEach((e) => {
              ;(t[e.normal] = t[e.normal] || 0), (t[e.normal] += 1)
            }),
            e.sort((e, n) => {
              let r = t[e.normal],
                a = t[n.normal]
              return r < a ? 1 : r > a ? -1 : 0
            }),
            e
          )
        },
      }
    const S = new Set([
        'index',
        'sequence',
        'seq',
        'sequential',
        'chron',
        'chronological',
      ]),
      H = new Set(['freq', 'frequency', 'topk', 'repeats']),
      M = new Set(['alpha', 'alphabetical'])
    var L = {
      unique: function () {
        let e = new Set()
        return this.filter((t) => {
          let n = t.text('machine')
          return !e.has(n) && (e.add(n), !0)
        })
      },
      reverse: function () {
        let e = this.pointer || this.docs.map((e, t) => [t])
        return (e = [].concat(e)), (e = e.reverse()), this.update(e)
      },
      sort: function (e) {
        let { docs: t, pointer: n } = this
        if ('function' == typeof e)
          return (function (e, t) {
            let n = e.fullPointer
            return (
              (n = n.sort(
                (n, r) => ((n = e.update([n])), (r = e.update([r])), t(n, r))
              )),
              (e.ptrs = n),
              e
            )
          })(this, e)
        e = e || 'alpha'
        let r = n || t.map((e, t) => [t]),
          a = t.map((e, t) => ({
            index: t,
            words: e.length,
            normal: e.map((e) => e.machine || e.normal || '').join(' '),
            pointer: r[t],
          }))
        return (
          S.has(e) && (e = 'sequential'),
          M.has(e) && (e = 'alpha'),
          H.has(e)
            ? ((a = F.byFreq(a)), this.update(a.map((e) => e.pointer)))
            : 'function' == typeof F[e]
            ? ((a = a.sort(F[e])), this.update(a.map((e) => e.pointer)))
            : this
        )
      },
    }
    const W = function (e, t) {
      let n = e[e.length - 1],
        r = n[n.length - 1]
      return !1 === / /.test(r.post) && (r.post += ' '), (e = e.concat(t))
    }
    var J = {
        concat: function (e) {
          const { methods: t, document: n, world: r } = this
          if ('string' == typeof e) {
            let a = t.one.tokenize.fromString(e, r),
              o = this.fullPointer,
              i = o[o.length - 1][0]
            return v(n, i + 1, a), this.compute('index')
          }
          if ('object' == typeof e && e.isView)
            return (function (e, t) {
              if (e.document === t.document) {
                let n = e.fullPointer.concat(t.fullPointer)
                return e.toView(n).compute('index')
              }
              return (
                t.fullPointer.forEach((t) => {
                  t[0] += e.document.length
                }),
                (e.document = W(e.document, t.document)),
                e.all()
              )
            })(this, e)
          if (
            ((a = e), '[object Array]' === Object.prototype.toString.call(a))
          ) {
            let t = W(this.document, e)
            return (this.document = t), this.all()
          }
          var a
          return this
        },
      },
      q = {
        harden: function () {
          return (this.ptrs = this.fullPointer), this
        },
        soften: function () {
          let e = this.ptrs
          return (
            !e ||
              e.length < 1 ||
              ((e = e.map((e) => e.slice(0, 3))), (this.ptrs = e)),
            this
          )
        },
      }
    const K = Object.assign(
      {},
      {
        toLowerCase: function () {
          return (
            this.termList().forEach((e) => {
              e.text = e.text.toLowerCase()
            }),
            this
          )
        },
        toUpperCase: function () {
          return (
            this.termList().forEach((e) => {
              e.text = e.text.toUpperCase()
            }),
            this
          )
        },
        toTitleCase: function () {
          return (
            this.termList().forEach((e) => {
              e.text = e.text.replace(/^ *[a-z\u00C0-\u00FF]/, (e) =>
                e.toUpperCase()
              )
            }),
            this
          )
        },
        toCamelCase: function () {
          return (
            this.docs.forEach((e) => {
              e.forEach((t, n) => {
                0 !== n &&
                  (t.text = t.text.replace(/^ *[a-z\u00C0-\u00FF]/, (e) =>
                    e.toUpperCase()
                  )),
                  n !== e.length - 1 && (t.post = '')
              })
            }),
            this
          )
        },
      },
      T,
      C,
      B,
      $,
      L,
      J,
      q
    )
    var R = {
        api: function (e) {
          Object.assign(e.prototype, K)
        },
        compute: {
          id: function (e) {
            let t = e.docs
            for (let e = 0; e < t.length; e += 1)
              for (let n = 0; n < t[e].length; n += 1) {
                let r = t[e][n]
                r.id = r.id || j(r)
              }
          },
        },
      },
      U = {
        one: {
          contractions: [
            { word: '@', out: ['at'] },
            { word: 'alot', out: ['a', 'lot'] },
            { word: 'brb', out: ['be', 'right', 'back'] },
            { word: 'cannot', out: ['can', 'not'] },
            { word: 'cant', out: ['can', 'not'] },
            { word: 'dont', out: ['do', 'not'] },
            { word: 'dun', out: ['do', 'not'] },
            { word: 'wont', out: ['will', 'not'] },
            { word: "can't", out: ['can', 'not'] },
            { word: "shan't", out: ['should', 'not'] },
            { word: "won't", out: ['will', 'not'] },
            { word: "that's", out: ['that', 'is'] },
            { word: "what's", out: ['what', 'is'] },
            { word: "let's", out: ['let', 'us'] },
            { word: "there's", out: ['there', 'is'] },
            { word: 'dunno', out: ['do', 'not', 'know'] },
            { word: 'gonna', out: ['going', 'to'] },
            { word: 'gotta', out: ['have', 'got', 'to'] },
            { word: 'gimme', out: ['give', 'me'] },
            { word: 'tryna', out: ['trying', 'to'] },
            { word: 'gtg', out: ['got', 'to', 'go'] },
            { word: 'im', out: ['i', 'am'] },
            { word: 'imma', out: ['I', 'will'] },
            { word: 'imo', out: ['in', 'my', 'opinion'] },
            { word: 'irl', out: ['in', 'real', 'life'] },
            { word: 'ive', out: ['i', 'have'] },
            { word: 'rn', out: ['right', 'now'] },
            { word: 'tbh', out: ['to', 'be', 'honest'] },
            { word: 'wanna', out: ['want', 'to'] },
            { word: "c'mere", out: ['come', 'here'] },
            { word: "c'mon", out: ['come', 'on'] },
            { word: 'howd', out: ['how', 'did'] },
            { word: 'whatd', out: ['what', 'did'] },
            { word: 'whend', out: ['when', 'did'] },
            { word: 'whered', out: ['where', 'did'] },
            { word: 'tis', out: ['it', 'is'] },
            { word: 'twas', out: ['it', 'was'] },
            { word: "y'know", out: ['you', 'know'] },
            { word: "ne'er", out: ['never'] },
            { word: "o'er", out: ['over'] },
            { after: 'll', out: ['will'] },
            { after: 've', out: ['have'] },
            { after: 're', out: ['are'] },
            { after: 'm', out: ['am'] },
            { before: 'c', out: ['ce'] },
            { before: 'm', out: ['me'] },
            { before: 'n', out: ['ne'] },
            { before: 'qu', out: ['que'] },
            { before: 's', out: ['se'] },
            { before: 't', out: ['tu'] },
          ],
        },
      },
      Q = function (e, t, n) {
        let [r, a] = t
        n &&
          0 !== n.length &&
          ((n = n.map(
            (e, t) => (
              (e.implicit = e.text),
              (e.machine = e.text),
              (e.pre = ''),
              (e.post = ''),
              (e.text = ''),
              (e.normal = ''),
              (e.index = [r, a + t]),
              e
            )
          ))[0] &&
            ((n[0].pre = e[r][a].pre),
            (n[n.length - 1].post = e[r][a].post),
            (n[0].text = e[r][a].text),
            (n[0].normal = e[r][a].normal)),
          e[r].splice(a, 1, ...n))
      }
    const _ = /'/,
      Z = new Set(['what', 'how', 'when', 'where', 'why']),
      Y = new Set(['be', 'go', 'start', 'think', 'need']),
      X = new Set(['been', 'gone'])
    var ee = function (e, t) {
        let n = e[t].normal.split(_)[0]
        if (Z.has(n)) return [n, 'did']
        if (e[t + 1]) {
          if (X.has(e[t + 1].normal)) return [n, 'had']
          if (Y.has(e[t + 1].normal)) return [n, 'would']
        }
        return null
      },
      te = function (e, t) {
        return "ain't" === e[t].normal || 'aint' === e[t].normal
          ? null
          : [e[t].normal.replace(/n't/, ''), 'not']
      }
    const ne = /'/
    var re = (e, t) => ['je', e[t].normal.split(ne)[1]],
      ae = (e, t) => {
        let n = e[t].normal.split(ne)[1]
        return n && n.endsWith('e') ? ['la', n] : ['le', n]
      },
      oe = (e, t) => {
        let n = e[t].normal.split(ne)[1]
        return n && n.endsWith('e')
          ? ['du', n]
          : n && n.endsWith('s')
          ? ['des', n]
          : ['de', n]
      }
    const ie = /^([0-9.]{1,4}[a-z]{0,2}) ?[-–—] ?([0-9]{1,4}[a-z]{0,2})$/i,
      se =
        /^([0-9]{1,2}(:[0-9][0-9])?(am|pm)?) ?[-–—] ?([0-9]{1,2}(:[0-9][0-9])?(am|pm)?)$/i,
      le = /^[0-9]{3}-[0-9]{4}$/
    var ue = function (e, t) {
      let n = e[t],
        r = n.text.match(ie)
      return null !== r
        ? !0 === n.tags.has('PhoneNumber') || le.test(n.text)
          ? null
          : [r[1], 'to', r[2]]
        : ((r = n.text.match(se)), null !== r ? [r[1], 'to', r[4]] : null)
    }
    const ce = /'/,
      he = /^[0-9][^-–—]*[-–—].*?[0-9]/,
      de = function (e, t, n, r) {
        let a = t.update()
        a.document = [e]
        let o = n + r
        n > 0 && (n -= 1),
          e[o] && (o += 1),
          (a.ptrs = [[0, n, o]]),
          a.compute('lexicon'),
          a.world.compute.preTagger && a.compute('preTagger')
      },
      pe = { t: (e, t) => te(e, t), d: (e, t) => ee(e, t) },
      me = {
        j: (e, t) => re(e, t),
        l: (e, t) => ae(e, t),
        d: (e, t) => oe(e, t),
      },
      ge = function (e, t, n, r) {
        for (let a = 0; a < e.length; a += 1) {
          let o = e[a]
          if (o.word === t.normal) return o.out
          if (null !== r && r === o.after) return [n].concat(o.out)
          if (null !== n && n === o.before) return o.out.concat(r)
        }
        return null
      },
      fe = function (e, t) {
        let n = t.fromText(e.join(' '))
        return n.compute('id'), n.docs[0]
      }
    var be = {
        model: U,
        compute: {
          contractions: (e) => {
            let { world: t, document: n } = e
            const { model: r, methods: a } = t
            let o = r.one.contractions || []
            n.forEach((r, i) => {
              for (let s = r.length - 1; s >= 0; s -= 1) {
                let l = null,
                  u = null
                !0 === ce.test(r[s].normal) && ([l, u] = r[s].normal.split(ce))
                let c = ge(o, r[s], l, u)
                !c && pe.hasOwnProperty(u) && (c = pe[u](r, s, t)),
                  !c && me.hasOwnProperty(l) && (c = me[l](r, s)),
                  c
                    ? ((c = fe(c, e)),
                      Q(n, [i, s], c),
                      de(n[i], e, s, c.length))
                    : he.test(r[s].normal) &&
                      ((c = ue(r, s)),
                      c &&
                        ((c = fe(c, e)),
                        Q(n, [i, s], c),
                        a.one.setTag(c, 'NumberRange', t),
                        c[2] &&
                          c[2].tags.has('Time') &&
                          a.one.setTag([c[0]], 'Time', t),
                        de(n[i], e, s, c.length)))
              }
            })
          },
        },
        hooks: ['contractions'],
      },
      ve = function (e, t, n) {
        const { model: r, methods: a } = n,
          o = a.one.setTag,
          i = r.one._multiCache || {},
          s = r.one.lexicon || {}
        let l = e[t],
          u = l.machine || l.normal
        return void 0 !== e[t + 1] && !0 === i[u]
          ? (function (e, t, n, r, a) {
              let o = t + 4 > e.length ? e.length - t : 4,
                i = e[t].machine || e[t].normal
              for (let s = 1; s < o; s += 1) {
                let o = e[t + s]
                if (
                  ((i += ' ' + (o.machine || o.normal)),
                  !0 === n.hasOwnProperty(i))
                ) {
                  let o = n[i]
                  return (
                    r(e.slice(t, t + s + 1), o, a, !1, '1-multi-lexicon'), !0
                  )
                }
              }
              return !1
            })(e, t, s, o, n)
          : null
      }
    const ye = /^(under|over|mis|re|un|dis|semi|pre|post)-?/,
      we = new Set([
        'Verb',
        'Infinitive',
        'PastTense',
        'Gerund',
        'PresentTense',
        'Adjective',
        'Participle',
      ])
    var ke = function (e, t, n) {
        const { model: r, methods: a } = n,
          o = a.one.setTag,
          i = r.one.lexicon
        let s = e[t],
          l = s.machine || s.normal
        if (void 0 !== i[l] && i.hasOwnProperty(l))
          return o([s], i[l], n, !1, '1-lexicon'), !0
        if (s.alias) {
          let e = s.alias.find((e) => i.hasOwnProperty(e))
          if (e) return o([s], i[e], n, !1, '1-lexicon-alias'), !0
        }
        if (!0 === ye.test(l)) {
          let e = l.replace(ye, '')
          if (i.hasOwnProperty(e) && e.length > 3 && we.has(i[e]))
            return o([s], i[e], n, !1, '1-lexicon-prefix'), !0
        }
        return null
      },
      Pe = {
        model: { one: { lexicon: {}, _multiCache: {} } },
        methods: {
          one: {
            expandLexicon: function (e) {
              let t = {},
                n = {}
              return (
                Object.keys(e).forEach((r) => {
                  let a = e[r],
                    o = (r = r.toLowerCase().trim()).split(/ /)
                  o.length > 1 && (n[o[0]] = !0), (t[r] = t[r] || a)
                }),
                delete t[''],
                delete t.null,
                delete t[' '],
                { lex: t, _multi: n }
              )
            },
          },
        },
        compute: {
          lexicon: function (e) {
            const t = e.world
            e.docs.forEach((e) => {
              for (let n = 0; n < e.length; n += 1)
                if (0 === e[n].tags.size) {
                  let r = null
                  ;(r = r || ve(e, n, t)), (r = r || ke(e, n, t))
                }
            })
          },
        },
        lib: {
          addWords: function (e) {
            const t = this.world(),
              { methods: n, model: r } = t
            if (e)
              if (
                (Object.keys(e).forEach((t) => {
                  'string' == typeof e[t] &&
                    e[t].startsWith('#') &&
                    (e[t] = e[t].replace(/^#/, ''))
                }),
                n.two.expandLexicon)
              ) {
                let { lex: a, _multi: o } = n.two.expandLexicon(e, t)
                Object.assign(r.one.lexicon, a),
                  Object.assign(r.one._multiCache, o)
              } else if (n.one.expandLexicon) {
                let { lex: a, _multi: o } = n.one.expandLexicon(e, t)
                Object.assign(r.one.lexicon, a),
                  Object.assign(r.one._multiCache, o)
              } else Object.assign(r.one.lexicon, e)
          },
        },
        hooks: ['lexicon'],
      },
      Ae = function (e, t) {
        let n = [{}],
          r = [null],
          a = [0],
          o = [],
          i = 0
        e.forEach(function (e) {
          let a = 0,
            o = (function (e, t) {
              const { methods: n, model: r } = t
              return n.one.tokenize
                .splitTerms(e, r)
                .map(n.one.tokenize.splitWhitespace)
                .map((e) => e.text.toLowerCase())
            })(e, t)
          for (let e = 0; e < o.length; e++) {
            let t = o[e]
            n[a] && n[a].hasOwnProperty(t)
              ? (a = n[a][t])
              : (i++, (n[a][t] = i), (n[i] = {}), (a = i), (r[i] = null))
          }
          r[a] = [o.length]
        })
        for (let e in n[0]) (i = n[0][e]), (a[i] = 0), o.push(i)
        for (; o.length; ) {
          let e = o.shift(),
            t = Object.keys(n[e])
          for (let s = 0; s < t.length; s += 1) {
            let l = t[s],
              u = n[e][l]
            for (o.push(u), i = a[e]; i > 0 && !n[i].hasOwnProperty(l); )
              i = a[i]
            if (n.hasOwnProperty(i)) {
              let e = n[i][l]
              ;(a[u] = e),
                r[e] && ((r[u] = r[u] || []), (r[u] = r[u].concat(r[e])))
            } else a[u] = 0
          }
        }
        return { goNext: n, endAs: r, failTo: a }
      }
    const je = function (e, t, n) {
        let r = 0,
          a = []
        for (let o = 0; o < e.length; o++) {
          let i = e[o][n.form] || e[o].normal
          for (
            ;
            r > 0 && (void 0 === t.goNext[r] || !t.goNext[r].hasOwnProperty(i));

          )
            r = t.failTo[r] || 0
          if (
            t.goNext[r].hasOwnProperty(i) &&
            ((r = t.goNext[r][i]), t.endAs[r])
          ) {
            let n = t.endAs[r]
            for (let t = 0; t < n.length; t++) {
              let r = n[t],
                i = e[o - r + 1],
                [s, l] = i.index
              a.push([s, l, l + r, i.id])
            }
          }
        }
        return a
      },
      xe = function (e, t) {
        for (let n = 0; n < e.length; n += 1) if (!0 === t.has(e[n])) return !1
        return !0
      }
    var Ee = function (e, t, n) {
      let r = []
      n.form = n.form || 'normal'
      let a = e.docs
      if (!t.goNext || !t.goNext[0])
        return console.error('Compromise invalid lookup trie'), e.none()
      let o = Object.keys(t.goNext[0])
      for (let i = 0; i < a.length; i++) {
        if (e._cache && e._cache[i] && !0 === xe(o, e._cache[i])) continue
        let s = a[i],
          l = je(s, t, n)
        l.length > 0 && (r = r.concat(l))
      }
      return e.update(r)
    }
    const Ne = (e, t) => {
      for (let n = e.length - 1; n >= 0; n -= 1)
        if (e[n] !== t) return (e = e.slice(0, n + 1))
      return e
    }
    var Ie = function (e) {
        return (
          (e.goNext = e.goNext.map((e) => {
            if (0 !== Object.keys(e).length) return e
          })),
          (e.goNext = Ne(e.goNext, void 0)),
          (e.failTo = Ne(e.failTo, 0)),
          (e.endAs = Ne(e.endAs, null)),
          e
        )
      },
      Te = {
        api: function (e) {
          e.prototype.lookup = function (e, t = {}) {
            if (!e) return this.none()
            'string' == typeof e && (e = [e])
            let n =
              ((r = e),
              '[object Object]' === Object.prototype.toString.call(r)
                ? e
                : Ae(e, this.world))
            var r
            let a = Ee(this, n, t)
            return (a = a.settle()), a
          }
        },
        lib: {
          compile: function (e) {
            const t = Ae(e, this.world())
            return Ie(t)
          },
        },
      }
    const Ge = function (e, t) {
        return t
          ? (e.forEach((e) => {
              let n = e[0]
              t[n] && ((e[0] = t[n][0]), (e[1] += t[n][1]), (e[2] += t[n][1]))
            }),
            e)
          : e
      },
      De = function (e, t) {
        let { ptrs: n, byGroup: r } = e
        return (
          (n = Ge(n, t)),
          Object.keys(r).forEach((e) => {
            r[e] = Ge(r[e], t)
          }),
          { ptrs: n, byGroup: r }
        )
      },
      Ce = (e) => '[object Object]' === Object.prototype.toString.call(e),
      Oe = (e) => e && Ce(e) && !0 === e.isView,
      Ve = (e) => e && Ce(e) && !0 === e.isNet
    var Be = {
        matchOne: function (e, t, n) {
          const r = this.methods.one
          if (Oe(e)) return this.intersection(e).eq(0)
          if (Ve(e)) return this.sweep(e, { tagger: !1, matchOne: !0 }).view
          'string' == typeof e &&
            ((e = r.killUnicode(e, this.world)),
            (e = r.parseMatch(e, n, this.world)))
          let a = { regs: e, group: t, justOne: !0 },
            o = r.match(this.docs, a, this._cache),
            { ptrs: i, byGroup: s } = De(o, this.fullPointer),
            l = this.toView(i)
          return (l._groups = s), l
        },
        match: function (e, t, n) {
          const r = this.methods.one
          if (Oe(e)) return this.intersection(e)
          if (Ve(e)) return this.sweep(e, { tagger: !1 }).view.settle()
          'string' == typeof e &&
            ((e = r.killUnicode(e, this.world)),
            (e = r.parseMatch(e, n, this.world)))
          let a = { regs: e, group: t },
            o = r.match(this.docs, a, this._cache),
            { ptrs: i, byGroup: s } = De(o, this.fullPointer),
            l = this.toView(i)
          return (l._groups = s), l
        },
        has: function (e, t, n) {
          const r = this.methods.one
          if (Oe(e)) return e.fullPointer.length > 0
          if (Ve(e)) return this.sweep(e, { tagger: !1 }).view.found
          'string' == typeof e &&
            ((e = r.killUnicode(e, this.world)),
            (e = r.parseMatch(e, n, this.world)))
          let a = { regs: e, group: t, justOne: !0 }
          return r.match(this.docs, a, this._cache).ptrs.length > 0
        },
        if: function (e, t, n) {
          const r = this.methods.one
          if (Oe(e)) return this.filter((t) => t.intersection(e).found)
          if (Ve(e)) {
            let t = this.sweep(e, { tagger: !1 }).view.settle()
            return this.if(t)
          }
          'string' == typeof e &&
            ((e = r.killUnicode(e, this.world)),
            (e = r.parseMatch(e, n, this.world)))
          let a = { regs: e, group: t, justOne: !0 },
            o = this.fullPointer,
            i = this._cache || []
          o = o.filter((e, t) => {
            let n = this.update([e])
            return r.match(n.docs, a, i[t]).ptrs.length > 0
          })
          let s = this.update(o)
          return this._cache && (s._cache = o.map((e) => i[e[0]])), s
        },
        ifNo: function (e, t, n) {
          const { methods: r } = this,
            a = r.one
          if (Oe(e)) return this.filter((t) => !t.intersection(e).found)
          if (Ve(e)) {
            let t = this.sweep(e, { tagger: !1 }).view.settle()
            return this.ifNo(t)
          }
          'string' == typeof e &&
            ((e = a.killUnicode(e, this.world)),
            (e = a.parseMatch(e, n, this.world)))
          let o = this._cache || [],
            i = this.filter((n, r) => {
              let i = { regs: e, group: t, justOne: !0 }
              return 0 === a.match(n.docs, i, o[r]).ptrs.length
            })
          return this._cache && (i._cache = i.ptrs.map((e) => o[e[0]])), i
        },
      },
      ze = {
        before: function (e, t, n) {
          const { indexN: r } = this.methods.one.pointer
          let a = [],
            o = r(this.fullPointer)
          Object.keys(o).forEach((e) => {
            let t = o[e].sort((e, t) => (e[1] > t[1] ? 1 : -1))[0]
            t[1] > 0 && a.push([t[0], 0, t[1]])
          })
          let i = this.toView(a)
          return e ? i.match(e, t, n) : i
        },
        after: function (e, t, n) {
          const { indexN: r } = this.methods.one.pointer
          let a = [],
            o = r(this.fullPointer),
            i = this.document
          Object.keys(o).forEach((e) => {
            let t = o[e].sort((e, t) => (e[1] > t[1] ? -1 : 1))[0],
              [n, , r] = t
            r < i[n].length && a.push([n, r, i[n].length])
          })
          let s = this.toView(a)
          return e ? s.match(e, t, n) : s
        },
        growLeft: function (e, t, n) {
          'string' == typeof e &&
            (e = this.world.methods.one.parseMatch(e, n, this.world)),
            (e[e.length - 1].end = !0)
          let r = this.fullPointer
          return (
            this.forEach((n, a) => {
              let o = n.before(e, t)
              if (o.found) {
                let e = o.terms()
                ;(r[a][1] -= e.length), (r[a][3] = e.docs[0][0].id)
              }
            }),
            this.update(r)
          )
        },
        growRight: function (e, t, n) {
          'string' == typeof e &&
            (e = this.world.methods.one.parseMatch(e, n, this.world)),
            (e[0].start = !0)
          let r = this.fullPointer
          return (
            this.forEach((n, a) => {
              let o = n.after(e, t)
              if (o.found) {
                let e = o.terms()
                ;(r[a][2] += e.length), (r[a][4] = null)
              }
            }),
            this.update(r)
          )
        },
        grow: function (e, t, n) {
          return this.growRight(e, t, n).growLeft(e, t, n)
        },
      }
    const $e = function (e, t) {
        return [e[0], e[1], t[2]]
      },
      Fe = (e, t, n) => {
        return 'string' == typeof e ||
          ((r = e), '[object Array]' === Object.prototype.toString.call(r))
          ? t.match(e, n)
          : e || t.none()
        var r
      },
      Se = function (e, t) {
        let [n, r, a] = e
        return (
          t.document[n] &&
            t.document[n][r] &&
            ((e[3] = e[3] || t.document[n][r].id),
            t.document[n][a - 1] && (e[4] = e[4] || t.document[n][a - 1].id)),
          e
        )
      },
      He = {
        splitOn: function (e, t) {
          const { splitAll: n } = this.methods.one.pointer
          let r = Fe(e, this, t).fullPointer,
            a = n(this.fullPointer, r),
            o = []
          return (
            a.forEach((e) => {
              o.push(e.passthrough),
                o.push(e.before),
                o.push(e.match),
                o.push(e.after)
            }),
            (o = o.filter((e) => e)),
            (o = o.map((e) => Se(e, this))),
            this.update(o)
          )
        },
        splitBefore: function (e, t) {
          const { splitAll: n } = this.methods.one.pointer
          let r = Fe(e, this, t).fullPointer,
            a = n(this.fullPointer, r),
            o = []
          return (
            a.forEach((e) => {
              o.push(e.passthrough),
                o.push(e.before),
                e.match && e.after
                  ? o.push($e(e.match, e.after))
                  : (o.push(e.match), o.push(e.after))
            }),
            (o = o.filter((e) => e)),
            (o = o.map((e) => Se(e, this))),
            this.update(o)
          )
        },
        splitAfter: function (e, t) {
          const { splitAll: n } = this.methods.one.pointer
          let r = Fe(e, this, t).fullPointer,
            a = n(this.fullPointer, r),
            o = []
          return (
            a.forEach((e) => {
              o.push(e.passthrough),
                e.before && e.match
                  ? o.push($e(e.before, e.match))
                  : (o.push(e.before), o.push(e.match)),
                o.push(e.after)
            }),
            (o = o.filter((e) => e)),
            (o = o.map((e) => Se(e, this))),
            this.update(o)
          )
        },
      }
    He.split = He.splitAfter
    var Me = He
    const Le = Object.assign({}, Be, ze, Me)
    ;(Le.lookBehind = Le.before),
      (Le.lookBefore = Le.before),
      (Le.lookAhead = Le.after),
      (Le.lookAfter = Le.after),
      (Le.notIf = Le.ifNo)
    var We = function (e) {
      Object.assign(e.prototype, Le)
    }
    const Je = /(?:^|\s)([![^]*(?:<[^<]*>)?\/.*?[^\\/]\/[?\]+*$~]*)(?:\s|$)/,
      qe = /([!~[^]*(?:<[^<]*>)?\([^)]+[^\\)]\)[?\]+*$~]*)(?:\s|$)/,
      Ke = / /g,
      Re = (e) => /^[![^]*(<[^<]*>)?\//.test(e) && /\/[?\]+*$~]*$/.test(e),
      Ue = function (e) {
        return (e = (e = e.map((e) => e.trim())).filter((e) => e))
      }
    var Qe = function (e) {
      let t = e.split(Je),
        n = []
      t.forEach((e) => {
        Re(e) ? n.push(e) : (n = n.concat(e.split(qe)))
      }),
        (n = Ue(n))
      let r = []
      return (
        n.forEach((e) => {
          ;((e) => /^[![^]*(<[^<]*>)?\(/.test(e) && /\)[?\]+*$~]*$/.test(e))(
            e
          ) || Re(e)
            ? r.push(e)
            : (r = r.concat(e.split(Ke)))
        }),
        (r = Ue(r)),
        r
      )
    }
    const _e = /\{([0-9]+)?(, *[0-9]*)?\}/,
      Ze = /&&/,
      Ye = new RegExp(/^<\s*(\S+)\s*>/),
      Xe = (e) => e.charAt(0).toUpperCase() + e.substring(1),
      et = (e) => e.charAt(e.length - 1),
      tt = (e) => e.charAt(0),
      nt = (e) => e.substring(1),
      rt = (e) => e.substring(0, e.length - 1),
      at = function (e) {
        return (e = nt(e)), (e = rt(e))
      },
      ot = function (e, t) {
        let n = {}
        for (let r = 0; r < 2; r += 1) {
          if (
            ('$' === et(e) && ((n.end = !0), (e = rt(e))),
            '^' === tt(e) && ((n.start = !0), (e = nt(e))),
            ('[' === tt(e) || ']' === et(e)) &&
              ((n.group = null),
              '[' === tt(e) && (n.groupStart = !0),
              ']' === et(e) && (n.groupEnd = !0),
              (e = (e = e.replace(/^\[/, '')).replace(/\]$/, '')),
              '<' === tt(e)))
          ) {
            const t = Ye.exec(e)
            t.length >= 2 && ((n.group = t[1]), (e = e.replace(t[0], '')))
          }
          if (
            ('+' === et(e) && ((n.greedy = !0), (e = rt(e))),
            '*' !== e &&
              '*' === et(e) &&
              '\\*' !== e &&
              ((n.greedy = !0), (e = rt(e))),
            '?' === et(e) && ((n.optional = !0), (e = rt(e))),
            '!' === tt(e) && ((n.negative = !0), (e = nt(e))),
            '~' === tt(e) &&
              '~' === et(e) &&
              e.length > 2 &&
              ((e = at(e)),
              (n.fuzzy = !0),
              (n.min = t.fuzzy || 0.85),
              !1 === /\(/.test(e)))
          )
            return (n.word = e), n
          if ('(' === tt(e) && ')' === et(e)) {
            Ze.test(e)
              ? ((n.choices = e.split(Ze)), (n.operator = 'and'))
              : ((n.choices = e.split('|')), (n.operator = 'or')),
              (n.choices[0] = nt(n.choices[0]))
            let r = n.choices.length - 1
            ;(n.choices[r] = rt(n.choices[r])),
              (n.choices = n.choices.map((e) => e.trim())),
              (n.choices = n.choices.filter((e) => e)),
              (n.choices = n.choices.map((e) =>
                e.split(/ /g).map((e) => ot(e, t))
              )),
              (e = '')
          }
          if ('/' === tt(e) && '/' === et(e))
            return (
              (e = at(e)),
              t.caseSensitive && (n.use = 'text'),
              (n.regex = new RegExp(e)),
              n
            )
          if ('{' === tt(e) && '}' === et(e))
            return (
              (e = at(e)),
              /\//.test(e) ? ((n.sense = e), (n.greedy = !0)) : (n.machine = e),
              n
            )
          if ('<' === tt(e) && '>' === et(e))
            return (e = at(e)), (n.chunk = Xe(e)), (n.greedy = !0), n
          if ('%' === tt(e) && '%' === et(e))
            return (e = at(e)), (n.switch = e), n
        }
        return (
          !0 === _e.test(e) &&
            (e = e.replace(
              _e,
              (e, t, r) => (
                void 0 === r
                  ? ((n.min = Number(t)), (n.max = Number(t)))
                  : ((r = r.replace(/, */, '')),
                    void 0 === t
                      ? ((n.min = 0), (n.max = Number(r)))
                      : ((n.min = Number(t)), (n.max = Number(r || 999)))),
                (n.greedy = !0),
                n.min || (n.optional = !0),
                ''
              )
            )),
          '#' === tt(e)
            ? ((n.tag = nt(e)), (n.tag = Xe(n.tag)), n)
            : '@' === tt(e)
            ? ((n.method = nt(e)), n)
            : '.' === e
            ? ((n.anything = !0), n)
            : '*' === e
            ? ((n.anything = !0), (n.greedy = !0), (n.optional = !0), n)
            : (e &&
                ((e = (e = e.replace('\\*', '*')).replace('\\.', '.')),
                t.caseSensitive ? (n.use = 'text') : (e = e.toLowerCase()),
                (n.word = e)),
              n)
        )
      }
    var it = ot
    const st = /[a-z0-9][-–—][a-z]/i
    var lt = function (e, t) {
        let n = t.model.one.prefixes
        for (let t = e.length - 1; t >= 0; t -= 1) {
          let r = e[t]
          if (r.word && st.test(r.word)) {
            let a = r.word.split(/[-–—]/g)
            if (n.hasOwnProperty(a[0])) continue
            ;(a = a.filter((e) => e).reverse()),
              e.splice(t, 1),
              a.forEach((n) => {
                let a = Object.assign({}, r)
                ;(a.word = n), e.splice(t, 0, a)
              })
          }
        }
        return e
      },
      ut = function (e) {
        return (e = (function (e) {
          return e.map(
            (e) => (
              e.fuzzy &&
                e.choices &&
                e.choices.forEach((t) => {
                  1 === t.length &&
                    t[0].word &&
                    ((t[0].fuzzy = !0), (t[0].min = e.min))
                }),
              e
            )
          )
        })(
          (e = (e = (function (e) {
            let t = 0,
              n = null
            for (let r = 0; r < e.length; r++) {
              const a = e[r]
              !0 === a.groupStart &&
                ((n = a.group), null === n && ((n = String(t)), (t += 1))),
                null !== n && (a.group = n),
                !0 === a.groupEnd && (n = null)
            }
            return e
          })(e)).map((e) => {
            if (void 0 !== e.choices) {
              if ('or' !== e.operator) return e
              if (!0 === e.fuzzy) return e
              !0 ===
                e.choices.every((e) => {
                  if (1 !== e.length) return !1
                  let t = e[0]
                  return (
                    !0 !== t.fuzzy &&
                    !t.start &&
                    !t.end &&
                    void 0 !== t.word &&
                    !0 !== t.negative &&
                    !0 !== t.optional &&
                    !0 !== t.method
                  )
                }) &&
                ((e.fastOr = new Set()),
                e.choices.forEach((t) => {
                  e.fastOr.add(t[0].word)
                }),
                delete e.choices)
            }
            return e
          }))
        ))
      },
      ct = function (e, t, n) {
        if (null == e || '' === e) return []
        ;(t = t || {}), 'number' == typeof e && (e = String(e))
        let r = Qe(e)
        return (r = r.map((e) => it(e, t))), (r = lt(r, n)), (r = ut(r)), r
      }
    const ht = function (e, t) {
      for (let n of t) if (e.has(n)) return !0
      return !1
    }
    var dt = function (e, t) {
        for (let n = 0; n < e.length; n += 1) {
          let r = e[n]
          if (!0 !== r.optional && !0 !== r.negative && !0 !== r.fuzzy) {
            if (void 0 !== r.word && !1 === t.has(r.word)) return !0
            if (void 0 !== r.tag && !1 === t.has('#' + r.tag)) return !0
            if (r.fastOr && !1 === ht(r.fastOr, t)) return !1
          }
        }
        return !1
      },
      pt = function (e, t, n = 3) {
        if (e === t) return 1
        if (e.length < n || t.length < n) return 0
        const r = (function (e, t) {
          let n = e.length,
            r = t.length
          if (0 === n) return r
          if (0 === r) return n
          let a = (r > n ? r : n) + 1
          if (Math.abs(n - r) > (a || 100)) return a || 100
          let o,
            i,
            s,
            l,
            u,
            c,
            h = []
          for (let e = 0; e < a; e++) (h[e] = [e]), (h[e].length = a)
          for (let e = 0; e < a; e++) h[0][e] = e
          for (let a = 1; a <= n; ++a)
            for (i = e[a - 1], o = 1; o <= r; ++o) {
              if (a === o && h[a][o] > 4) return n
              ;(s = t[o - 1]),
                (l = i === s ? 0 : 1),
                (u = h[a - 1][o] + 1),
                (c = h[a][o - 1] + 1) < u && (u = c),
                (c = h[a - 1][o - 1] + l) < u && (u = c)
              let r =
                a > 1 &&
                o > 1 &&
                i === t[o - 2] &&
                e[a - 2] === s &&
                (c = h[a - 2][o - 2] + l) < u
              h[a][o] = r ? c : u
            }
          return h[n][r]
        })(e, t)
        let a = Math.max(e.length, t.length)
        return 1 - (0 === a ? 0 : r / a)
      }
    const mt =
        /([\u0022\uFF02\u0027\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F])/,
      gt =
        /([\u0022\uFF02\u0027\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4])/,
      ft = /^[-–—]$/,
      bt = / [-–—] /,
      vt = (e, t) => -1 !== e.post.indexOf(t),
      yt = (e, t) => -1 !== e.pre.indexOf(t),
      wt = {
        hasQuote: (e) => mt.test(e.pre) || gt.test(e.post),
        hasComma: (e) => vt(e, ','),
        hasPeriod: (e) => !0 === vt(e, '.') && !1 === vt(e, '...'),
        hasExclamation: (e) => vt(e, '!'),
        hasQuestionMark: (e) => vt(e, '?') || vt(e, '¿'),
        hasEllipses: (e) =>
          vt(e, '..') || vt(e, '…') || yt(e, '..') || yt(e, '…'),
        hasSemicolon: (e) => vt(e, ';'),
        hasSlash: (e) => /\//.test(e.text),
        hasHyphen: (e) => ft.test(e.post) || ft.test(e.pre),
        hasDash: (e) => bt.test(e.post) || bt.test(e.pre),
        hasContraction: (e) => Boolean(e.implicit),
        isAcronym: (e) => e.tags.has('Acronym'),
        isKnown: (e) => e.tags.size > 0,
        isTitleCase: (e) => /^\p{Lu}[a-z'\u00C0-\u00FF]/u.test(e.text),
        isUpperCase: (e) => /^\p{Lu}+$/u.test(e.text),
      }
    wt.hasQuotation = wt.hasQuote
    var kt = wt
    let Pt = function () {}
    Pt = function (e, t, n, r) {
      let a = (function (e, t, n, r) {
        if (!0 === t.anything) return !0
        if (!0 === t.start && 0 !== n) return !1
        if (!0 === t.end && n !== r - 1) return !1
        if (void 0 !== t.word) {
          if (t.use) return t.word === e[t.use]
          if (null !== e.machine && e.machine === t.word) return !0
          if (void 0 !== e.alias && e.alias.hasOwnProperty(t.word)) return !0
          if (!0 === t.fuzzy) {
            if (t.word === e.root) return !0
            if (pt(t.word, e.normal) >= t.min) return !0
          }
          return (
            !(!e.alias || !e.alias.some((e) => e === t.word)) ||
            t.word === e.text ||
            t.word === e.normal
          )
        }
        if (void 0 !== t.tag) return !0 === e.tags.has(t.tag)
        if (void 0 !== t.method)
          return 'function' == typeof kt[t.method] && !0 === kt[t.method](e)
        if (void 0 !== t.pre) return e.pre && e.pre.includes(t.pre)
        if (void 0 !== t.post) return e.post && e.post.includes(t.post)
        if (void 0 !== t.regex) {
          let n = e.normal
          return t.use && (n = e[t.use]), t.regex.test(n)
        }
        return void 0 !== t.chunk
          ? e.chunk === t.chunk
          : void 0 !== t.switch
          ? e.switch === t.switch
          : void 0 !== t.machine
          ? e.normal === t.machine ||
            e.machine === t.machine ||
            e.root === t.machine
          : void 0 !== t.sense
          ? e.sense === t.sense
          : void 0 !== t.fastOr
          ? t.fastOr.has(e.implicit) ||
            t.fastOr.has(e.normal) ||
            t.fastOr.has(e.text) ||
            t.fastOr.has(e.machine)
          : void 0 !== t.choices &&
            ('and' === t.operator
              ? t.choices.every((t) => Pt(e, t, n, r))
              : t.choices.some((t) => Pt(e, t, n, r)))
      })(e, t, n, r)
      return !0 === t.negative ? !a : a
    }
    var At = Pt
    const jt = function (e, t) {
        if (
          !0 === e.end &&
          !0 === e.greedy &&
          t.start_i + t.t < t.phrase_length - 1
        ) {
          let n = Object.assign({}, e, { end: !1 })
          if (!0 === At(t.terms[t.t], n, t.start_i + t.t, t.phrase_length))
            return !0
        }
        return !1
      },
      xt = function (e, t) {
        return (
          e.groups[e.inGroup] ||
            (e.groups[e.inGroup] = { start: t, length: 0 }),
          e.groups[e.inGroup]
        )
      }
    var Et = function (e) {
      let { regs: t } = e,
        n = t[e.r],
        r = (function (e, t) {
          let n = e.t
          if (!t) return e.terms.length
          for (; n < e.terms.length; n += 1)
            if (!0 === At(e.terms[n], t, e.start_i + n, e.phrase_length))
              return n
          return null
        })(e, t[e.r + 1])
      return null === r || 0 === r || (void 0 !== n.min && r - e.t < n.min)
        ? null
        : void 0 !== n.max && r - e.t > n.max
        ? ((e.t = e.t + n.max), !0)
        : (!0 === e.hasGroup && (xt(e, e.t).length = r - e.t), (e.t = r), !0)
    }
    const Nt = function (e, t = 0) {
      let n = e.regs[e.r],
        r = !1
      for (let o = 0; o < n.choices.length; o += 1) {
        let i = n.choices[o]
        if (((a = i), '[object Array]' !== Object.prototype.toString.call(a)))
          return !1
        if (
          ((r = i.every((n, r) => {
            let a = 0,
              o = e.t + r + t + a
            if (void 0 === e.terms[o]) return !1
            let i = At(e.terms[o], n, o + e.start_i, e.phrase_length)
            if (!0 === i && !0 === n.greedy)
              for (let t = 1; t < e.terms.length; t += 1) {
                let r = e.terms[o + t]
                if (r) {
                  if (!0 !== At(r, n, e.start_i + t, e.phrase_length)) break
                  a += 1
                }
              }
            return (t += a), i
          })),
          r)
        ) {
          t += i.length
          break
        }
      }
      var a
      return r && !0 === n.greedy ? Nt(e, t) : t
    }
    var It = function (e) {
        const { regs: t } = e
        let n = t[e.r],
          r = Nt(e)
        if (r) {
          if (!0 === n.negative) return null
          if ((!0 === e.hasGroup && (xt(e, e.t).length += r), !0 === n.end)) {
            let t = e.phrase_length
            if (e.t + e.start_i + r !== t) return null
          }
          return (e.t += r), !0
        }
        return !!n.optional || null
      },
      Tt = function (e) {
        const { regs: t } = e
        let n = t[e.r],
          r = (function (e) {
            let t = 0
            return (
              !0 ===
                e.regs[e.r].choices.every((n) => {
                  let r = n.every((t, n) => {
                    let r = e.t + n
                    return (
                      void 0 !== e.terms[r] &&
                      At(e.terms[r], t, r, e.phrase_length)
                    )
                  })
                  return !0 === r && n.length > t && (t = n.length), r
                }) && t
            )
          })(e)
        if (r) {
          if (!0 === n.negative) return null
          if ((!0 === e.hasGroup && (xt(e, e.t).length += r), !0 === n.end)) {
            let t = e.phrase_length - 1
            if (e.t + e.start_i !== t) return null
          }
          return (e.t += r), !0
        }
        return !!n.optional || null
      },
      Gt = function (e) {
        const { regs: t } = e
        let n = t[e.r],
          r = Object.assign({}, n)
        return (
          (r.negative = !1),
          !0 !== At(e.terms[e.t], r, e.start_i + e.t, e.phrase_length) || null
        )
      },
      Dt = function (e) {
        const { regs: t } = e
        let n = t[e.r],
          r = e.terms[e.t],
          a = At(r, t[e.r + 1], e.start_i + e.t, e.phrase_length)
        if (n.negative || a) {
          let n = e.terms[e.t + 1]
          ;(n && At(n, t[e.r + 1], e.start_i + e.t, e.phrase_length)) ||
            (e.r += 1)
        }
      },
      Ct = function (e) {
        const { regs: t, phrase_length: n } = e
        let r = t[e.r]
        return (
          (e.t = (function (e, t) {
            let n = Object.assign({}, e.regs[e.r], { start: !1, end: !1 }),
              r = e.t
            for (; e.t < e.terms.length; e.t += 1) {
              if (t && At(e.terms[e.t], t, e.start_i + e.t, e.phrase_length))
                return e.t
              let a = e.t - r + 1
              if (void 0 !== n.max && a === n.max) return e.t
              if (!1 === At(e.terms[e.t], n, e.start_i + e.t, e.phrase_length))
                return void 0 !== n.min && a < n.min ? null : e.t
            }
            return e.t
          })(e, t[e.r + 1])),
          null === e.t || (r.min && r.min > e.t)
            ? null
            : !0 !== r.end || e.start_i + e.t === n || null
        )
      },
      Ot = function (e) {
        let t = e.terms[e.t],
          n = e.regs[e.r]
        if (t.implicit && e.terms[e.t + 1]) {
          if (!e.terms[e.t + 1].implicit) return
          n.word === t.normal && (e.t += 1),
            'hasContraction' === n.method && (e.t += 1)
        }
      },
      Vt = function (e) {
        const { regs: t } = e
        let n = t[e.r],
          r = e.terms[e.t],
          a = e.t
        return (
          !!(n.optional && t[e.r + 1] && n.negative) ||
          (n.optional && t[e.r + 1] && Dt(e),
          r.implicit && e.terms[e.t + 1] && Ot(e),
          (e.t += 1),
          !0 === n.end && e.t !== e.terms.length && !0 !== n.greedy
            ? null
            : !0 !== n.greedy || Ct(e)
            ? (!0 === e.hasGroup &&
                (function (e, t) {
                  let n = e.regs[e.r]
                  const r = xt(e, t)
                  e.t > 1 && n.greedy ? (r.length += e.t - t) : r.length++
                })(e, a),
              !0)
            : null)
        )
      },
      Bt = function (e, t, n, r) {
        if (0 === e.length || 0 === t.length) return null
        let a = {
          t: 0,
          terms: e,
          r: 0,
          regs: t,
          groups: {},
          start_i: n,
          phrase_length: r,
          inGroup: null,
        }
        for (; a.r < t.length; a.r += 1) {
          let e = t[a.r]
          if (
            ((a.hasGroup = Boolean(e.group)),
            !0 === a.hasGroup ? (a.inGroup = e.group) : (a.inGroup = null),
            !a.terms[a.t])
          ) {
            if (!1 === t.slice(a.r).some((e) => !e.optional)) break
            return null
          }
          if (!0 !== e.anything || !0 !== e.greedy) {
            if (void 0 === e.choices || 'or' !== e.operator) {
              if (void 0 === e.choices || 'and' !== e.operator) {
                if (!0 !== e.anything) {
                  if (!0 !== jt(e, a)) {
                    if (
                      !0 !==
                      At(a.terms[a.t], e, a.start_i + a.t, a.phrase_length)
                    ) {
                      if (e.negative && !Gt(a)) return null
                      if (!0 !== e.optional) return null
                    } else if (!Vt(a)) return null
                  } else if (!Vt(a)) return null
                } else if (!Vt(a)) return null
              } else if (!Tt(a)) return null
            } else if (!It(a)) return null
          } else if (!Et(a)) return null
        }
        let o = [null, n, a.t + n]
        if (o[1] === o[2]) return null
        let i = {}
        return (
          Object.keys(a.groups).forEach((e) => {
            let t = a.groups[e],
              r = n + t.start
            i[e] = [null, r, r + t.length]
          }),
          { pointer: o, groups: i }
        )
      },
      zt = function (e, t) {
        let n = [],
          r = {}
        return (
          0 === e.length ||
            ('number' == typeof t && (t = String(t)),
            t
              ? e.forEach((e) => {
                  e.groups[t] && n.push(e.groups[t])
                })
              : e.forEach((e) => {
                  n.push(e.pointer),
                    Object.keys(e.groups).forEach((t) => {
                      ;(r[t] = r[t] || []), r[t].push(e.groups[t])
                    })
                })),
          { ptrs: n, byGroup: r }
        )
      }
    const $t = function (e, t) {
        return (
          (e.pointer[0] = t),
          Object.keys(e.groups).forEach((n) => {
            e.groups[n][0] = t
          }),
          e
        )
      },
      Ft = function (e, t, n) {
        let r = Bt(e, t, 0, e.length)
        return r ? ((r = $t(r, n)), r) : null
      }
    var St = {
      api: We,
      methods: {
        one: {
          termMethods: kt,
          parseMatch: ct,
          match: function (e, t, n) {
            n = n || []
            let { regs: r, group: a, justOne: o } = t,
              i = []
            if (!r || 0 === r.length) return { ptrs: [], byGroup: {} }
            const s = r.filter(
              (e) => !0 !== e.optional && !0 !== e.negative
            ).length
            e: for (let t = 0; t < e.length; t += 1) {
              let a = e[t]
              if (!n[t] || !dt(r, n[t]))
                if (!0 !== r[0].start)
                  for (let e = 0; e < a.length; e += 1) {
                    let n = a.slice(e)
                    if (n.length < s) break
                    let l = Bt(n, r, e, a.length)
                    if (l) {
                      if (((l = $t(l, t)), i.push(l), !0 === o)) break e
                      let n = l.pointer[2]
                      Math.abs(n - 1) > e && (e = Math.abs(n - 1))
                    }
                  }
                else {
                  let e = Ft(a, r, t)
                  e && i.push(e)
                }
            }
            return (
              !0 === r[r.length - 1].end &&
                (i = i.filter((t) => {
                  let n = t.pointer[0]
                  return e[n].length === t.pointer[2]
                })),
              (i = zt(i, a)),
              i.ptrs.forEach((t) => {
                let [n, r, a] = t
                ;(t[3] = e[n][r].id), (t[4] = e[n][a - 1].id)
              }),
              i
            )
          },
        },
      },
      lib: {
        parseMatch: function (e, t) {
          const n = this.world()
          let r = n.methods.one.killUnicode
          return r && (e = r(e, n)), n.methods.one.parseMatch(e, t, n)
        },
      },
    }
    const Ht = /^\../,
      Mt = /^#./,
      Lt = function (e, t) {
        let n = {},
          r = {}
        return (
          Object.keys(t).forEach((a) => {
            let o = t[a],
              i = (function (e) {
                let t = '',
                  n = '</span>'
                return (
                  (e = e
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&apos;')),
                  Ht.test(e)
                    ? (t = `<span class="${e.replace(/^\./, '')}"`)
                    : Mt.test(e)
                    ? (t = `<span id="${e.replace(/^#/, '')}"`)
                    : ((t = '<' + e), (n = `</${e}>`)),
                  (t += '>'),
                  { start: t, end: n }
                )
              })(a)
            'string' == typeof o && (o = e.match(o)),
              o.docs.forEach((e) => {
                if (e.every((e) => e.implicit)) return
                let t = e[0].id
                ;(n[t] = n[t] || []), n[t].push(i.start)
                let a = e[e.length - 1].id
                ;(r[a] = r[a] || []), r[a].push(i.end)
              })
          }),
          { starts: n, ends: r }
        )
      }
    var Wt = {
      html: function (e) {
        let { starts: t, ends: n } = Lt(this, e),
          r = ''
        return (
          this.docs.forEach((e) => {
            for (let a = 0; a < e.length; a += 1) {
              let o = e[a]
              t.hasOwnProperty(o.id) && (r += t[o.id].join('')),
                (r += o.pre || '' + o.text || ''),
                n.hasOwnProperty(o.id) && (r += n[o.id].join('')),
                (r += o.post || '')
            }
          }),
          r
        )
      },
    }
    const Jt =
        /[,:;)\]*.?~!\u0022\uFF02\u201D\u2019\u00BB\u203A\u2032\u2033\u2034\u301E\u00B4—-]+$/,
      qt =
        /^[(['"*~\uFF02\u201C\u2018\u201F\u201B\u201E\u2E42\u201A\u00AB\u2039\u2035\u2036\u2037\u301D\u0060\u301F]+/,
      Kt = /[,:;)('"\u201D\]]/,
      Rt = /^[-–—]$/,
      Ut = / /,
      Qt = function (e, t, n = !0) {
        let r = ''
        return (
          e.forEach((e) => {
            let n = e.pre || '',
              a = e.post || ''
            'some' === t.punctuation &&
              ((n = n.replace(qt, '')),
              Rt.test(a) && (a = ' '),
              (a = a.replace(Kt, '')),
              (a = a.replace(/\?!+/, '?')),
              (a = a.replace(/!+/, '!')),
              (a = a.replace(/\?+/, '?')),
              (a = a.replace(/\.{2,}/, '')),
              e.tags.has('Abbreviation') && (a = a.replace(/\./, ''))),
              'some' === t.whitespace &&
                ((n = n.replace(/\s/, '')), (a = a.replace(/\s+/, ' '))),
              t.keepPunct ||
                ((n = n.replace(qt, '')),
                (a = '-' === a ? ' ' : a.replace(Jt, '')))
            let o = e[t.form || 'text'] || e.normal || ''
            'implicit' === t.form && (o = e.implicit || e.text),
              'root' === t.form &&
                e.implicit &&
                (o = e.root || e.implicit || e.normal),
              ('machine' !== t.form &&
                'implicit' !== t.form &&
                'root' !== t.form) ||
                !e.implicit ||
                (a && Ut.test(a)) ||
                (a += ' '),
              (r += n + o + a)
          }),
          !1 === n && (r = r.trim()),
          !0 === t.lowerCase && (r = r.toLowerCase()),
          r
        )
      },
      _t = {
        text: { form: 'text' },
        normal: {
          whitespace: 'some',
          punctuation: 'some',
          case: 'some',
          unicode: 'some',
          form: 'normal',
        },
        machine: {
          whitespace: 'some',
          punctuation: 'some',
          case: 'none',
          unicode: 'some',
          form: 'machine',
        },
        root: {
          whitespace: 'some',
          punctuation: 'some',
          case: 'some',
          unicode: 'some',
          form: 'root',
        },
        implicit: { form: 'implicit' },
      }
    ;(_t.clean = _t.normal), (_t.reduced = _t.root)
    var Zt = _t
    let Yt = [],
      Xt = 0
    for (; Xt < 64; ) Yt[Xt] = 0 | (4294967296 * Math.sin(++Xt % Math.PI))
    function en(e) {
      let t,
        n,
        r,
        a = [(t = 1732584193), (n = 4023233417), ~t, ~n],
        o = [],
        i = decodeURI(encodeURI(e)) + '',
        s = i.length
      for (e = (--s / 4 + 2) | 15, o[--e] = 8 * s; ~s; )
        o[s >> 2] |= i.charCodeAt(s) << (8 * s--)
      for (Xt = i = 0; Xt < e; Xt += 16) {
        for (
          s = a;
          i < 64;
          s = [
            (r = s[3]),
            t +
              (((r =
                s[0] +
                [
                  (t & n) | (~t & r),
                  (r & t) | (~r & n),
                  t ^ n ^ r,
                  n ^ (t | ~r),
                ][(s = i >> 4)] +
                Yt[i] +
                ~~o[Xt | (15 & [i, 5 * i + 1, 3 * i + 5, 7 * i][s])]) <<
                (s = [
                  7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21,
                ][4 * s + (i++ % 4)])) |
                (r >>> -s)),
            t,
            n,
          ]
        )
          (t = 0 | s[1]), (n = s[2])
        for (i = 4; i; ) a[--i] += s[i]
      }
      for (e = ''; i < 32; )
        e += ((a[i >> 3] >> (4 * (1 ^ i++))) & 15).toString(16)
      return e
    }
    const tn = { text: !0, terms: !0 }
    let nn = {
      case: 'none',
      unicode: 'some',
      form: 'machine',
      punctuation: 'some',
    }
    const rn = function (e, t) {
        return Object.assign({}, e, t)
      },
      an = {
        text: (e) => Qt(e, { keepPunct: !0 }, !1),
        normal: (e) => Qt(e, rn(Zt.normal, { keepPunct: !0 }), !1),
        implicit: (e) => Qt(e, rn(Zt.implicit, { keepPunct: !0 }), !1),
        machine: (e) => Qt(e, nn, !1),
        root: (e) => Qt(e, rn(nn, { form: 'root' }), !1),
        hash: (e) => en(Qt(e, { keepPunct: !0 }, !1)),
        offset: (e) => {
          let t = an.text(e).length
          return {
            index: e[0].offset.index,
            start: e[0].offset.start,
            length: t,
          }
        },
        terms: (e) =>
          e.map((e) => {
            let t = Object.assign({}, e)
            return (t.tags = Array.from(e.tags)), t
          }),
        confidence: (e, t, n) => t.eq(n).confidence(),
        syllables: (e, t, n) => t.eq(n).syllables(),
        sentence: (e, t, n) => t.eq(n).fullSentence().text(),
        dirty: (e) => e.some((e) => !0 === e.dirty),
      }
    ;(an.sentences = an.sentence),
      (an.clean = an.normal),
      (an.reduced = an.root)
    const on = {
      json: function (e) {
        let t =
          ((n = this),
          'string' == typeof (r = (r = e) || {}) && (r = {}),
          (r = Object.assign({}, tn, r)).offset && n.compute('offset'),
          n.docs.map((e, t) => {
            let a = {}
            return (
              Object.keys(r).forEach((o) => {
                r[o] && an[o] && (a[o] = an[o](e, n, t))
              }),
              a
            )
          }))
        var n, r
        return 'number' == typeof e ? t[e] : t
      },
    }
    on.data = on.json
    var sn = on,
      ln = function (e) {
        console.log('%c -=-=- ', 'background-color:#6699cc;'),
          e.forEach((e) => {
            console.groupCollapsed(e.text())
            let t = e.docs[0].map((e) => {
              let t = e.text || '-'
              return (
                e.implicit && (t = '[' + e.implicit + ']'),
                { text: t, tags: '[' + Array.from(e.tags).join(', ') + ']' }
              )
            })
            console.table(t, ['text', 'tags']), console.groupEnd()
          })
      }
    const un = '[0m'
    var cn = {
        green: (e) => '[32m' + e + un,
        red: (e) => '[31m' + e + un,
        blue: (e) => '[34m' + e + un,
        magenta: (e) => '[35m' + e + un,
        cyan: (e) => '[36m' + e + un,
        yellow: (e) => '[33m' + e + un,
        black: (e) => '[30m' + e + un,
        dim: (e) => '[2m' + e + un,
        i: (e) => '[3m' + e + un,
      },
      hn = function (e) {
        let { docs: t, model: n } = e
        0 === t.length && console.log(cn.blue('\n     ──────')),
          t.forEach((e) => {
            console.log(cn.blue('\n  ┌─────────')),
              e.forEach((e) => {
                let t = [...(e.tags || [])],
                  r = e.text || '-'
                e.sense && (r = '{' + e.sense + '}'),
                  e.implicit && (r = '[' + e.implicit + ']'),
                  (r = cn.yellow(r))
                let a = "'" + r + "'"
                a = a.padEnd(18)
                let o =
                  cn.blue('  │ ') +
                  cn.i(a) +
                  '  - ' +
                  (function (e, t) {
                    return (
                      t.one.tagSet &&
                        (e = e.map((e) => {
                          if (!t.one.tagSet.hasOwnProperty(e)) return e
                          const n = t.one.tagSet[e].color || 'blue'
                          return cn[n](e)
                        })),
                      e.join(', ')
                    )
                  })(t, n)
                console.log(o)
              })
          })
      },
      dn = function (e) {
        let { docs: t } = e
        console.log(''),
          t.forEach((e) => {
            let t = []
            e.forEach((e) => {
              'Noun' === e.chunk
                ? t.push(cn.blue(e.implicit || e.normal))
                : 'Verb' === e.chunk
                ? t.push(cn.green(e.implicit || e.normal))
                : 'Adjective' === e.chunk
                ? t.push(cn.yellow(e.implicit || e.normal))
                : 'Pivot' === e.chunk
                ? t.push(cn.red(e.implicit || e.normal))
                : t.push(e.implicit || e.normal)
            }),
              console.log(t.join(' '), '\n')
          })
      },
      pn = function (e) {
        if (!e.found) return
        let t = {}
        e.fullPointer.forEach((e) => {
          ;(t[e[0]] = t[e[0]] || []), t[e[0]].push(e)
        }),
          Object.keys(t).forEach((n) => {
            let r = e.update([[Number(n)]]).text()
            e
              .update(t[n])
              .json({ offset: !0 })
              .forEach((e, t) => {
                r = (function (e, t, n) {
                  let r = ((e, t, n) => {
                    let r = 9 * n,
                      a = t.start + r,
                      o = a + t.length
                    return [
                      e.substring(0, a),
                      e.substring(a, o),
                      e.substring(o, e.length),
                    ]
                  })(e, t, n)
                  return `${r[0]}${cn.blue(r[1])}${r[2]}`
                })(r, e.offset, t)
              }),
              console.log(r)
          })
      }
    const mn = function (e) {
      let t = e.pre || '',
        n = e.post || ''
      return t + e.text + n
    }
    var gn = function (e, t) {
        let n = (function (e, t) {
            let n = {}
            return (
              Object.keys(t).forEach((r) => {
                e.match(r).fullPointer.forEach((e) => {
                  n[e[3]] = { fn: t[r], end: e[2] }
                })
              }),
              n
            )
          })(e, t),
          r = ''
        return (
          e.docs.forEach((t, a) => {
            for (let o = 0; o < t.length; o += 1) {
              let i = t[o]
              if (n.hasOwnProperty(i.id)) {
                let { fn: s, end: l } = n[i.id],
                  u = e.update([[a, o, l]])
                ;(r += s(u)), (o = l - 1), (r += t[o].post || '')
              } else r += mn(i)
            }
          }),
          r
        )
      },
      fn = {
        debug: function (e = {}) {
          let t = this
          if ('string' == typeof e) {
            let t = {}
            ;(t[e] = !0), (e = t)
          }
          return 'undefined' != typeof window && window.document
            ? (ln(t), t)
            : (!1 !== e.tags && (hn(t), console.log('\n')),
              !0 === e.chunks && (dn(t), console.log('\n')),
              !0 === e.highlight && (pn(t), console.log('\n')),
              t)
        },
        out: function (e) {
          if (
            ((t = e), '[object Object]' === Object.prototype.toString.call(t))
          )
            return gn(this, e)
          var t
          if ('text' === e) return this.text()
          if ('normal' === e) return this.text('normal')
          if ('machine' === e || 'reduced' === e) return this.text('machine')
          if ('hash' === e || 'md5' === e) return en(this.text())
          if ('json' === e) return this.json()
          if ('offset' === e || 'offsets' === e)
            return this.compute('offset'), this.json({ offset: !0 })
          if ('array' === e)
            return this.docs
              .map((e) =>
                e.reduce((e, t) => e + t.pre + t.text + t.post, '').trim()
              )
              .filter((e) => e)
          if ('freq' === e || 'frequency' === e || 'topk' === e)
            return (function (e) {
              let t = {}
              return (
                e.forEach((e) => {
                  ;(t[e] = t[e] || 0), (t[e] += 1)
                }),
                Object.keys(t)
                  .map((e) => ({ normal: e, count: t[e] }))
                  .sort((e, t) => (e.count > t.count ? -1 : 0))
              )
            })(this.json({ normal: !0 }).map((e) => e.normal))
          if ('terms' === e) {
            let e = []
            return (
              this.docs.forEach((t) => {
                let n = t.terms.map((e) => e.text)
                ;(n = n.filter((e) => e)), (e = e.concat(n))
              }),
              e
            )
          }
          return 'tags' === e
            ? this.docs.map((e) =>
                e.reduce(
                  (e, t) => (
                    (e[t.implicit || t.normal] = Array.from(t.tags)), e
                  ),
                  {}
                )
              )
            : 'debug' === e
            ? this.debug()
            : this.text()
        },
      },
      bn = {
        text: function (e) {
          let t = { keepSpace: !0, keepPunct: !0 }
          var n
          if (
            (e && 'string' == typeof e && Zt.hasOwnProperty(e)
              ? (t = Object.assign({}, Zt[e]))
              : e &&
                ((n = e),
                '[object Object]' === Object.prototype.toString.call(n)) &&
                (t = Object.assign({}, e, t)),
            this.pointer)
          ) {
            t.keepSpace = !1
            let e = this.pointer[0]
            e && e[1] ? (t.keepPunct = !1) : (t.keepPunct = !0)
          } else t.keepPunct = !0
          return (function (e, t) {
            let n = ''
            if (!e || !e[0] || !e[0][0]) return n
            for (let r = 0; r < e.length; r += 1) n += Qt(e[r], t, !0)
            if ((t.keepSpace || (n = n.trim()), !1 === t.keepPunct)) {
              e[0][0].tags.has('Emoticon') || (n = n.replace(qt, ''))
              let t = e[e.length - 1]
              t[t.length - 1].tags.has('Emoticon') || (n = n.replace(Jt, ''))
            }
            return !0 === t.cleanWhitespace && (n = n.trim()), n
          })(this.docs, t)
        },
      }
    const vn = Object.assign({}, fn, bn, sn, Wt)
    var yn = {
      api: function (e) {
        Object.assign(e.prototype, vn)
      },
      methods: { one: { hash: en } },
    }
    const wn = function (e, t) {
        if (e[0] !== t[0]) return !1
        let [, n, r] = e,
          [, a, o] = t
        return (n <= a && r > a) || (a <= n && o > n)
      },
      kn = function (e) {
        let t = {}
        return (
          e.forEach((e) => {
            ;(t[e[0]] = t[e[0]] || []), t[e[0]].push(e)
          }),
          t
        )
      }
    var Pn = function (e, t) {
        let n = kn(t),
          r = []
        return (
          e.forEach((e) => {
            let [t] = e,
              a = n[t] || []
            if (
              ((a = a.filter((t) =>
                (function (e, t) {
                  return e[1] <= t[1] && t[2] <= e[2]
                })(e, t)
              )),
              0 === a.length)
            )
              return void r.push({ passthrough: e })
            a = a.sort((e, t) => e[1] - t[1])
            let o = e
            a.forEach((e, t) => {
              let n = (function (e, t) {
                let [n, r] = e,
                  a = t[1],
                  o = t[2],
                  i = {}
                if (r < a) {
                  let t = a < e[2] ? a : e[2]
                  i.before = [n, r, t]
                }
                return (i.match = t), e[2] > o && (i.after = [n, o, e[2]]), i
              })(o, e)
              a[t + 1]
                ? (r.push({ before: n.before, match: n.match }),
                  n.after && (o = n.after))
                : r.push(n)
            })
          }),
          r
        )
      },
      An = {
        one: {
          termList: function (e) {
            let t = []
            for (let n = 0; n < e.length; n += 1)
              for (let r = 0; r < e[n].length; r += 1) t.push(e[n][r])
            return t
          },
          getDoc: function (e, t) {
            let n = []
            return (
              e.forEach((r, a) => {
                if (!r) return
                let [o, i, s, l, u] = r,
                  c = t[o] || []
                if (
                  (void 0 === i && (i = 0),
                  void 0 === s && (s = c.length),
                  !l || (c[i] && c[i].id === l))
                )
                  c = c.slice(i, s)
                else {
                  let n = (function (e, t, n) {
                    for (let r = 0; r < 4; r += 1) {
                      if (t[n - r]) {
                        let a = t[n - r].findIndex((t) => t.id === e)
                        if (-1 !== a) return [n - r, a]
                      }
                      if (t[n + r]) {
                        let a = t[n + r].findIndex((t) => t.id === e)
                        if (-1 !== a) return [n + r, a]
                      }
                    }
                    return null
                  })(l, t, o)
                  if (null !== n) {
                    let r = s - i
                    c = t[n[0]].slice(n[1], n[1] + r)
                    let o = c[0] ? c[0].id : null
                    e[a] = [n[0], n[1], n[1] + r, o]
                  }
                }
                0 !== c.length &&
                  i !== s &&
                  (u &&
                    c[c.length - 1].id !== u &&
                    (c = (function (e, t) {
                      let [n, r, , , a] = e,
                        o = t[n],
                        i = o.findIndex((e) => e.id === a)
                      return (
                        -1 === i
                          ? ((e[2] = t[n].length),
                            (e[4] = o.length ? o[o.length - 1].id : null))
                          : (e[2] = i),
                        t[n].slice(r, e[2] + 1)
                      )
                    })(r, t)),
                  n.push(c))
              }),
              (n = n.filter((e) => e.length > 0)),
              n
            )
          },
          pointer: { indexN: kn, splitAll: Pn },
        },
      },
      jn = function (e, t) {
        let n = e.concat(t),
          r = kn(n),
          a = []
        return (
          n.forEach((e) => {
            let [t] = e
            if (1 === r[t].length) return void a.push(e)
            let n = r[t].filter((t) => wn(e, t))
            n.push(e)
            let o = (function (e) {
              let t = e[0][1],
                n = e[0][2]
              return (
                e.forEach((e) => {
                  e[1] < t && (t = e[1]), e[2] > n && (n = e[2])
                }),
                [e[0][0], t, n]
              )
            })(n)
            a.push(o)
          }),
          (a = (function (e) {
            let t = {}
            for (let n = 0; n < e.length; n += 1) t[e[n].join(',')] = e[n]
            return Object.values(t)
          })(a)),
          a
        )
      },
      xn = function (e, t) {
        let n = []
        return (
          Pn(e, t).forEach((e) => {
            e.passthrough && n.push(e.passthrough),
              e.before && n.push(e.before),
              e.after && n.push(e.after)
          }),
          n
        )
      },
      En = function (e, t) {
        let n = kn(t),
          r = []
        return (
          e.forEach((e) => {
            let t = n[e[0]] || []
            ;(t = t.filter((t) => wn(e, t))),
              0 !== t.length &&
                t.forEach((t) => {
                  let n = (function (e, t) {
                    let n = e[1] < t[1] ? t[1] : e[1],
                      r = e[2] > t[2] ? t[2] : e[2]
                    return n < r ? [e[0], n, r] : null
                  })(e, t)
                  n && r.push(n)
                })
          }),
          r
        )
      }
    const Nn = (e, t) => {
        return 'string' == typeof e ||
          ((n = e), '[object Array]' === Object.prototype.toString.call(n))
          ? t.match(e)
          : e || t.none()
        var n
      },
      In = function (e, t) {
        return e.map((e) => {
          let [n, r] = e
          return t[n] && t[n][r] && (e[3] = t[n][r].id), e
        })
      },
      Tn = {
        union: function (e) {
          e = Nn(e, this)
          let t = jn(this.fullPointer, e.fullPointer)
          return (t = In(t, this.document)), this.toView(t)
        },
      }
    ;(Tn.and = Tn.union),
      (Tn.intersection = function (e) {
        e = Nn(e, this)
        let t = En(this.fullPointer, e.fullPointer)
        return (t = In(t, this.document)), this.toView(t)
      }),
      (Tn.not = function (e) {
        e = Nn(e, this)
        let t = xn(this.fullPointer, e.fullPointer)
        return (t = In(t, this.document)), this.toView(t)
      }),
      (Tn.difference = Tn.not),
      (Tn.complement = function () {
        let e = this.all(),
          t = xn(e.fullPointer, this.fullPointer)
        return (t = In(t, this.document)), this.toView(t)
      }),
      (Tn.settle = function () {
        let e = this.fullPointer
        return (
          e.forEach((t) => {
            e = jn(e, [t])
          }),
          (e = In(e, this.document)),
          this.update(e)
        )
      })
    var Gn = {
      methods: An,
      api: function (e) {
        Object.assign(e.prototype, Tn)
      },
    }
    const Dn = function (e) {
      return !0 === e.optional || !0 === e.negative
        ? null
        : e.tag
        ? '#' + e.tag
        : e.word
        ? e.word
        : e.switch
        ? `%${e.switch}%`
        : null
    }
    var Cn = function (e, t) {
        const n = t.methods.one.parseMatch
        return (
          e.forEach((e) => {
            ;(e.regs = n(e.match, {}, t)),
              'string' == typeof e.ifNo && (e.ifNo = [e.ifNo]),
              (e.needs = (function (e) {
                let t = []
                return (
                  e.forEach((e) => {
                    t.push(Dn(e)),
                      'and' === e.operator &&
                        e.choices &&
                        e.choices.forEach((e) => {
                          e.forEach((e) => {
                            t.push(Dn(e))
                          })
                        })
                  }),
                  t.filter((e) => e)
                )
              })(e.regs))
            let { wants: r, count: a } = (function (e) {
              let t = [],
                n = 0
              return (
                e.forEach((e) => {
                  'or' !== e.operator ||
                    e.optional ||
                    e.negative ||
                    (e.fastOr &&
                      Array.from(e.fastOr).forEach((e) => {
                        t.push(e)
                      }),
                    e.choices &&
                      e.choices.forEach((e) => {
                        e.forEach((e) => {
                          let n = Dn(e)
                          n && t.push(n)
                        })
                      }),
                    (n += 1))
                }),
                { wants: t, count: n }
              )
            })(e.regs)
            ;(e.wants = r),
              (e.minWant = a),
              (e.minWords = e.regs.filter((e) => !e.optional).length)
          }),
          e
        )
      },
      On = function (e, t) {
        return e.map((n, r) => {
          let a = []
          Object.keys(t).forEach((n) => {
            e[r].has(n) && (a = a.concat(t[n]))
          })
          let o = {}
          return (
            (a = a.filter((e) => !o[e.match] && ((o[e.match] = !0), !0))), a
          )
        })
      },
      Vn = function (e, t) {
        return e.map((e, n) => {
          let r = t[n]
          return (e = (e = (e = e.filter((e) =>
            e.needs.every((e) => r.has(e))
          )).filter(
            (e) => void 0 === e.ifNo || !0 !== e.ifNo.some((e) => t[n].has(e))
          )).filter(
            (e) =>
              0 === e.wants.length ||
              e.wants.filter((e) => r.has(e)).length >= e.minWant
          ))
        })
      },
      Bn = function (e, t, n, r) {
        let a = []
        for (let o = 0; o < e.length; o += 1)
          for (let i = 0; i < e[o].length; i += 1) {
            let s = e[o][i],
              l = n.one.match([t[o]], s)
            if (
              l.ptrs.length > 0 &&
              (l.ptrs.forEach((e) => {
                e[0] = o
                let t = Object.assign({}, s, { pointer: e })
                void 0 !== s.unTag && (t.unTag = s.unTag), a.push(t)
              }),
              !0 === r.matchOne)
            )
              return [a[0]]
          }
        return a
      },
      zn = function (e, t, n) {
        let r = n.one.tagSet
        if (!r.hasOwnProperty(t)) return !0
        let a = r[t].not || []
        for (let t = 0; t < e.length; t += 1) {
          let n = e[t]
          for (let e = 0; e < a.length; e += 1)
            if (!0 === n.tags.has(a[e])) return !1
        }
        return !0
      },
      $n = {
        lib: {
          buildNet: function (e) {
            let t = this.methods().one.buildNet(e, this.world())
            return (t.isNet = !0), t
          },
        },
        api: function (e) {
          e.prototype.sweep = function (e, t = {}) {
            const { world: n, docs: r } = this,
              { methods: a } = n
            let o = a.one.bulkMatch(r, e, this.methods, t)
            !1 !== t.tagger && a.one.bulkTagger(o, r, this.world),
              (o = o.map((e) => {
                let t = e.pointer,
                  n = r[t[0]][t[1]],
                  a = t[2] - t[1]
                return (
                  n.index && (e.pointer = [n.index[0], n.index[1], t[1] + a]), e
                )
              }))
            let i = o.map((e) => e.pointer)
            return (
              (o = o.map(
                (e) => (
                  (e.view = this.update([e.pointer])),
                  delete e.regs,
                  delete e.needs,
                  delete e.pointer,
                  delete e._expanded,
                  e
                )
              )),
              { view: this.update(i), found: o }
            )
          }
        },
        methods: {
          one: {
            buildNet: function (e, t) {
              e = Cn(e, t)
              let n = {}
              e.forEach((e) => {
                e.needs.forEach((t) => {
                  ;(n[t] = n[t] || []), n[t].push(e)
                }),
                  e.wants.forEach((t) => {
                    ;(n[t] = n[t] || []), n[t].push(e)
                  })
              }),
                Object.keys(n).forEach((e) => {
                  let t = {}
                  n[e] = n[e].filter(
                    (e) => !t[e.match] && ((t[e.match] = !0), !0)
                  )
                })
              let r = e.filter(
                (e) => 0 === e.needs.length && 0 === e.wants.length
              )
              return { hooks: n, always: r }
            },
            bulkMatch: function (e, t, n, r = {}) {
              let a = n.one.cacheDoc(e),
                o = On(a, t.hooks)
              return (
                (o = Vn(o, a)),
                t.always.length > 0 && (o = o.map((e) => e.concat(t.always))),
                (o = (function (e, t) {
                  return e.map((e, n) => {
                    let r = t[n].length
                    return e.filter((e) => r >= e.minWords)
                  })
                })(o, e)),
                Bn(o, e, n, r)
              )
            },
            bulkTagger: function (e, t, n) {
              const { model: r, methods: a } = n,
                { getDoc: o, setTag: i, unTag: s } = a.one
              return 0 === e.length
                ? e
                : (('undefined' != typeof process && process.env
                    ? process.env
                    : self.env || {}
                  ).DEBUG_TAGS &&
                    console.log(`\n\n  [32m→ ${e.length} post-tagger:[0m`),
                  e.map((e) => {
                    if (!e.tag && !e.chunk) return
                    let a = e.reason || e.match,
                      l = o([e.pointer], t)[0]
                    if (!0 === e.safe) {
                      if (!1 === zn(l, e.tag, r)) return
                      if ('-' === l[l.length - 1].post) return
                    }
                    void 0 !== e.tag &&
                      (i(l, e.tag, n, e.safe, `[post] '${a}'`),
                      1 === l.length &&
                        'Noun' === e.tag &&
                        l[0].text &&
                        null !== l[0].text.match(/..s$/) &&
                        i(l, 'Plural', n, e.safe, 'quick-plural')),
                      void 0 !== e.unTag && s(l, e.unTag, n, e.safe, a),
                      e.chunk && l.forEach((t) => (t.chunk = e.chunk))
                  }))
            },
          },
        },
      }
    const Fn = / /,
      Sn = function (e, t) {
        'Noun' === t && (e.chunk = t), 'Verb' === t && (e.chunk = t)
      },
      Hn = function (e, t, n, r) {
        if (!0 === e.tags.has(t)) return null
        if ('.' === t) return null
        let a = n[t]
        if (a) {
          if (a.not && a.not.length > 0)
            for (let t = 0; t < a.not.length; t += 1) {
              if (!0 === r && e.tags.has(a.not[t])) return null
              e.tags.delete(a.not[t])
            }
          if (a.parents && a.parents.length > 0)
            for (let t = 0; t < a.parents.length; t += 1)
              e.tags.add(a.parents[t]), Sn(e, a.parents[t])
        }
        return e.tags.add(t), (e.dirty = !0), Sn(e, t), !0
      },
      Mn = function (e, t, n = {}, r, a) {
        const o = n.model.one.tagSet || {}
        if (!t) return
        const i =
          'undefined' != typeof process && process.env
            ? process.env
            : self.env || {}
        var s
        if (
          (i &&
            i.DEBUG_TAGS &&
            ((e, t, n = '') => {
              let r = e.map((e) => e.text || '[' + e.implicit + ']').join(' ')
              var a
              'string' != typeof t &&
                t.length > 2 &&
                (t = t.slice(0, 2).join(', #') + ' +'),
                (t = 'string' != typeof t ? t.join(', #') : t),
                console.log(
                  ` ${((a = r), '[33m[3m' + a + '[0m').padEnd(24)} [32m→[0m #${t.padEnd(
                    22
                  )}  ${((e) => '[3m' + e + '[0m')(n)}`
                )
            })(e, t, a),
          1 !=
            ((s = t), '[object Array]' === Object.prototype.toString.call(s)))
        )
          if (((t = t.trim()), Fn.test(t)))
            !(function (e, t, n, r) {
              let a = t.split(Fn)
              e.forEach((e, t) => {
                let o = a[t]
                o && ((o = o.replace(/^#/, '')), Hn(e, o, n, r))
              })
            })(e, t, o, r)
          else {
            t = t.replace(/^#/, '')
            for (let n = 0; n < e.length; n += 1) Hn(e[n], t, o, r)
          }
        else t.forEach((t) => Mn(e, t, n, r))
      }
    var Ln = Mn,
      Wn = function (e, t, n) {
        t = t.trim().replace(/^#/, '')
        for (let r = 0; r < e.length; r += 1) {
          let a = e[r]
          if ('*' === t) {
            a.tags.clear()
            continue
          }
          let o = n[t]
          if (o && o.children.length > 0)
            for (let e = 0; e < o.children.length; e += 1)
              a.tags.delete(o.children[e])
          a.tags.delete(t)
        }
      }
    const Jn = function (e) {
        return (
          (e.children = e.children || []),
          (e._cache = e._cache || {}),
          (e.props = e.props || {}),
          (e._cache.parents = e._cache.parents || []),
          (e._cache.children = e._cache.children || []),
          e
        )
      },
      qn = /^ *(#|\/\/)/,
      Kn = function (e) {
        let t = e.trim().split(/->/),
          n = []
        t.forEach((e) => {
          n = n.concat(
            (function (e) {
              if (!(e = e.trim())) return null
              if (/^\[/.test(e) && /\]$/.test(e)) {
                let t = (e = (e = e.replace(/^\[/, '')).replace(
                  /\]$/,
                  ''
                )).split(/,/)
                return (
                  (t = t.map((e) => e.trim()).filter((e) => e)),
                  (t = t.map((e) => Jn({ id: e }))),
                  t
                )
              }
              return [Jn({ id: e })]
            })(e)
          )
        }),
          (n = n.filter((e) => e))
        let r = n[0]
        for (let e = 1; e < n.length; e += 1) r.children.push(n[e]), (r = n[e])
        return n[0]
      },
      Rn = (e, t) => {
        let n = [],
          r = [e]
        for (; r.length > 0; ) {
          let e = r.pop()
          n.push(e),
            e.children &&
              e.children.forEach((n) => {
                t && t(e, n), r.push(n)
              })
        }
        return n
      },
      Un = (e) => '[object Array]' === Object.prototype.toString.call(e),
      Qn = (e) => (e = e || '').trim(),
      _n = function (e = []) {
        return 'string' == typeof e
          ? (function (e) {
              let t = e.split(/\r?\n/),
                n = []
              t.forEach((e) => {
                if (!e.trim() || qn.test(e)) return
                let t = ((e) => {
                  const t = /^( {2}|\t)/
                  let n = 0
                  for (; t.test(e); ) (e = e.replace(t, '')), (n += 1)
                  return n
                })(e)
                n.push({ indent: t, node: Kn(e) })
              })
              let r = (function (e) {
                let t = { children: [] }
                return (
                  e.forEach((n, r) => {
                    0 === n.indent
                      ? (t.children = t.children.concat(n.node))
                      : e[r - 1] &&
                        (function (e, t) {
                          let n = e[t].indent
                          for (; t >= 0; t -= 1)
                            if (e[t].indent < n) return e[t]
                          return e[0]
                        })(e, r).node.children.push(n.node)
                  }),
                  t
                )
              })(n)
              return (r = Jn(r)), r
            })(e)
          : Un(e)
          ? (function (e) {
              let t = {}
              e.forEach((e) => {
                t[e.id] = e
              })
              let n = Jn({})
              return (
                e.forEach((e) => {
                  if ((e = Jn(e)).parent)
                    if (t.hasOwnProperty(e.parent)) {
                      let n = t[e.parent]
                      delete e.parent, n.children.push(e)
                    } else console.warn(`[Grad] - missing node '${e.parent}'`)
                  else n.children.push(e)
                }),
                n
              )
            })(e)
          : (Rn((t = e)).forEach(Jn), t)
        var t
      },
      Zn = function (e, t) {
        let n = '-> '
        t && (n = ((e) => '[2m' + e + '[0m')('→ '))
        let r = ''
        return (
          Rn(e).forEach((e, a) => {
            let o = e.id || ''
            if ((t && (o = ((e) => '[31m' + e + '[0m')(o)), 0 === a && !e.id)) return
            let i = e._cache.parents.length
            r += '    '.repeat(i) + n + o + '\n'
          }),
          r
        )
      },
      Yn = function (e) {
        let t = Rn(e)
        t.forEach((e) => {
          delete (e = Object.assign({}, e)).children
        })
        let n = t[0]
        return n && !n.id && 0 === Object.keys(n.props).length && t.shift(), t
      },
      Xn = { text: Zn, txt: Zn, array: Yn, flat: Yn },
      er = function (e, t) {
        return 'nested' === t || 'json' === t
          ? e
          : 'debug' === t
          ? (console.log(Zn(e, !0)), null)
          : Xn.hasOwnProperty(t)
          ? Xn[t](e)
          : e
      },
      tr = (e) => {
        Rn(e, (e, t) => {
          e.id &&
            ((e._cache.parents = e._cache.parents || []),
            (t._cache.parents = e._cache.parents.concat([e.id])))
        })
      },
      nr = /\//
    class g$1 {
      constructor(e = {}) {
        Object.defineProperty(this, 'json', {
          enumerable: !1,
          value: e,
          writable: !0,
        })
      }
      get children() {
        return this.json.children
      }
      get id() {
        return this.json.id
      }
      get found() {
        return this.json.id || this.json.children.length > 0
      }
      props(e = {}) {
        let t = this.json.props || {}
        return (
          'string' == typeof e && (t[e] = !0),
          (this.json.props = Object.assign(t, e)),
          this
        )
      }
      get(e) {
        if (((e = Qn(e)), !nr.test(e))) {
          let t = this.json.children.find((t) => t.id === e)
          return new g$1(t)
        }
        let t =
          ((e, t) => {
            let n = ((e) =>
              'string' != typeof e
                ? e
                : (e = e.replace(/^\//, '')).split(/\//))((t = t || ''))
            for (let t = 0; t < n.length; t += 1) {
              let r = e.children.find((e) => e.id === n[t])
              if (!r) return null
              e = r
            }
            return e
          })(this.json, e) || Jn({})
        return new g$1(t)
      }
      add(e, t = {}) {
        if (Un(e)) return e.forEach((e) => this.add(Qn(e), t)), this
        e = Qn(e)
        let n = Jn({ id: e, props: t })
        return this.json.children.push(n), new g$1(n)
      }
      remove(e) {
        return (
          (e = Qn(e)),
          (this.json.children = this.json.children.filter((t) => t.id !== e)),
          this
        )
      }
      nodes() {
        return Rn(this.json).map(
          (e) => (delete (e = Object.assign({}, e)).children, e)
        )
      }
      cache() {
        return (
          ((e) => {
            let t = Rn(e, (e, t) => {
                e.id &&
                  ((e._cache.parents = e._cache.parents || []),
                  (e._cache.children = e._cache.children || []),
                  (t._cache.parents = e._cache.parents.concat([e.id])))
              }),
              n = {}
            t.forEach((e) => {
              e.id && (n[e.id] = e)
            }),
              t.forEach((e) => {
                e._cache.parents.forEach((t) => {
                  n.hasOwnProperty(t) && n[t]._cache.children.push(e.id)
                })
              }),
              (e._cache.children = Object.keys(n))
          })(this.json),
          this
        )
      }
      list() {
        return Rn(this.json)
      }
      fillDown() {
        var e
        return (
          (e = this.json),
          Rn(e, (e, t) => {
            t.props = ((e, t) => (
              Object.keys(t).forEach((n) => {
                if (t[n] instanceof Set) {
                  let r = e[n] || new Set()
                  e[n] = new Set([...r, ...t[n]])
                } else if (
                  ((e) => e && 'object' == typeof e && !Array.isArray(e))(t[n])
                ) {
                  let r = e[n] || {}
                  e[n] = Object.assign({}, t[n], r)
                } else
                  Un(t[n])
                    ? (e[n] = t[n].concat(e[n] || []))
                    : void 0 === e[n] && (e[n] = t[n])
              }),
              e
            ))(t.props, e.props)
          }),
          this
        )
      }
      depth() {
        tr(this.json)
        let e = Rn(this.json),
          t = e.length > 1 ? 1 : 0
        return (
          e.forEach((e) => {
            if (0 === e._cache.parents.length) return
            let n = e._cache.parents.length + 1
            n > t && (t = n)
          }),
          t
        )
      }
      out(e) {
        return tr(this.json), er(this.json, e)
      }
      debug() {
        return tr(this.json), er(this.json, 'debug'), this
      }
    }
    const rr = function (e) {
      let t = _n(e)
      return new g$1(t)
    }
    rr.prototype.plugin = function (e) {
      e(this)
    }
    var ar = {
      Noun: 'blue',
      Verb: 'green',
      Negative: 'green',
      Date: 'red',
      Value: 'red',
      Adjective: 'magenta',
      Preposition: 'cyan',
      Conjunction: 'cyan',
      Determiner: 'cyan',
      Adverb: 'cyan',
    }
    const or = function (e) {
      if (ar.hasOwnProperty(e.id)) return ar[e.id]
      if (ar.hasOwnProperty(e.is)) return ar[e.is]
      let t = e._cache.parents.find((e) => ar[e])
      return ar[t]
    }
    var ir = function (e) {
      const t = {}
      return (
        e.forEach((e) => {
          let { not: n, also: r, is: a, novel: o } = e.props,
            i = e._cache.parents
          r && (i = i.concat(r)),
            (t[e.id] = {
              is: a,
              not: n,
              novel: o,
              also: r,
              parents: i,
              children: e._cache.children,
              color: or(e),
            })
        }),
        Object.keys(t).forEach((e) => {
          let n = new Set(t[e].not)
          t[e].not.forEach((e) => {
            t[e] && t[e].children.forEach((e) => n.add(e))
          }),
            (t[e].not = Array.from(n))
        }),
        t
      )
    }
    const sr = function (e) {
      return e ? ('string' == typeof e ? [e] : e) : []
    }
    var lr = function (e, t) {
        return (
          (e = (function (e, t) {
            return (
              Object.keys(e).forEach((n) => {
                e[n].isA && (e[n].is = e[n].isA),
                  e[n].notA && (e[n].not = e[n].notA),
                  e[n].is &&
                    'string' == typeof e[n].is &&
                    (t.hasOwnProperty(e[n].is) ||
                      e.hasOwnProperty(e[n].is) ||
                      (e[e[n].is] = {})),
                  e[n].not &&
                    'string' == typeof e[n].not &&
                    !e.hasOwnProperty(e[n].not) &&
                    (t.hasOwnProperty(e[n].not) ||
                      e.hasOwnProperty(e[n].not) ||
                      (e[e[n].not] = {}))
              }),
              e
            )
          })(e, t)),
          Object.keys(e).forEach((t) => {
            ;(e[t].children = sr(e[t].children)), (e[t].not = sr(e[t].not))
          }),
          Object.keys(e).forEach((t) => {
            ;(e[t].not || []).forEach((n) => {
              e[n] && e[n].not && e[n].not.push(t)
            })
          }),
          e
        )
      },
      ur = {
        one: {
          setTag: Ln,
          unTag: Wn,
          addTags: function (e, t) {
            Object.keys(t).length > 0 &&
              (e = (function (e) {
                return (
                  Object.keys(e).forEach((t) => {
                    ;(e[t] = Object.assign({}, e[t])), (e[t].novel = !0)
                  }),
                  e
                )
              })(e)),
              (e = lr(e, t))
            const n = (function (e) {
              const t = Object.keys(e).map((t) => {
                let n = e[t]
                const r = {
                  not: new Set(n.not),
                  also: n.also,
                  is: n.is,
                  novel: n.novel,
                }
                return { id: t, parent: n.is, props: r, children: [] }
              })
              return rr(t).cache().fillDown().out('array')
            })(Object.assign({}, t, e))
            return ir(n)
          },
        },
      }
    const cr = function (e) {
      return '[object Array]' === Object.prototype.toString.call(e)
    }
    var hr = {
        tag: function (e, t = '', n) {
          if (!this.found || !e) return this
          let r = this.termList()
          if (0 === r.length) return this
          const { methods: a, verbose: o, world: i } = this
          return (
            !0 === o && console.log(' +  ', e, t || ''),
            cr(e)
              ? e.forEach((e) => a.one.setTag(r, e, i, n, t))
              : a.one.setTag(r, e, i, n, t),
            this.uncache(),
            this
          )
        },
        tagSafe: function (e, t = '') {
          return this.tag(e, t, !0)
        },
        unTag: function (e, t) {
          if (!this.found || !e) return this
          let n = this.termList()
          if (0 === n.length) return this
          const { methods: r, verbose: a, model: o } = this
          !0 === a && console.log(' -  ', e, t || '')
          let i = o.one.tagSet
          return (
            cr(e)
              ? e.forEach((e) => r.one.unTag(n, e, i))
              : r.one.unTag(n, e, i),
            this.uncache(),
            this
          )
        },
        canBe: function (e) {
          let t = this.model.one.tagSet
          if (!t.hasOwnProperty(e)) return this
          let n = t[e].not || [],
            r = []
          this.document.forEach((e, t) => {
            e.forEach((e, a) => {
              n.find((t) => e.tags.has(t)) && r.push([t, a, a + 1])
            })
          })
          let a = this.update(r)
          return this.difference(a)
        },
      },
      dr = function (e) {
        Object.assign(e.prototype, hr)
      },
      pr = {
        addTags: function (e) {
          const { model: t, methods: n } = this.world(),
            r = t.one.tagSet
          let a = (0, n.one.addTags)(e, r)
          return (t.one.tagSet = a), this
        },
      }
    const mr = new Set(['Auxiliary', 'Possessive'])
    var gr = {
      model: { one: { tagSet: {} } },
      compute: {
        tagRank: function (e) {
          const { document: t, world: n } = e,
            r = n.model.one.tagSet
          t.forEach((e) => {
            e.forEach((e) => {
              let t = Array.from(e.tags)
              e.tagRank = (function (e, t) {
                return e.sort((e, n) => {
                  if (mr.has(e) || !t.hasOwnProperty(n)) return 1
                  if (mr.has(n) || !t.hasOwnProperty(e)) return -1
                  let r = t[e].children || [],
                    a = r.length
                  return (r = t[n].children || []), a - r.length
                })
              })(t, r)
            })
          })
        },
      },
      methods: ur,
      api: dr,
      lib: pr,
    }
    const fr = /(\S.+?[.!?\u203D\u2E18\u203C\u2047-\u2049])(?=\s|$)/g,
      br = /((?:\r?\n|\r)+)/ //!TODO: speedup this regex
    var vr = function (e) {
      let t = [],
        n = e.split(br)
      for (let e = 0; e < n.length; e++) {
        let r = n[e].split(fr)
        for (let e = 0; e < r.length; e++) t.push(r[e])
      }
      return t
    }
    const yr = /[ .][A-Z]\.? *$/i,
      wr = /(?:\u2026|\.{2,}) *$/,
      kr = /\p{L}/u
    var Pr = function (e, t) {
      if (!1 === kr.test(e)) return !1
      if (!0 === yr.test(e)) return !1
      if (!0 === wr.test(e)) return !1
      let n = e
          .replace(/[.!?\u203D\u2E18\u203C\u2047-\u2049] *$/, '')
          .split(' '),
        r = n[n.length - 1].toLowerCase()
      return !0 !== t.hasOwnProperty(r)
    }
    const Ar = /\S/,
      jr = /^\s+/,
      xr = /[a-z0-9\u00C0-\u00FF\u00a9\u00ae\u2000-\u3300\ud000-\udfff]/i
    var Er = function (e, t) {
      let n = t.one.abbreviations || new Set()
      e = e || ''
      let r = [],
        a = []
      if (!(e = String(e)) || 'string' != typeof e || !1 === Ar.test(e))
        return r
      e = e.replace(' ', ' ')
      let o = vr(e)
      for (let e = 0; e < o.length; e++) {
        let t = o[e]
        if (void 0 !== t && '' !== t) {
          if (!1 === Ar.test(t) || !1 === xr.test(t)) {
            if (a[a.length - 1]) {
              a[a.length - 1] += t
              continue
            }
            if (o[e + 1]) {
              o[e + 1] = t + o[e + 1]
              continue
            }
          }
          a.push(t)
        }
      }
      for (let e = 0; e < a.length; e++) {
        let t = a[e]
        a[e + 1] && !1 === Pr(t, n)
          ? (a[e + 1] = t + (a[e + 1] || ''))
          : t && t.length > 0 && (r.push(t), (a[e] = ''))
      }
      if (0 === r.length) return [e]
      for (let e = 1; e < r.length; e += 1) {
        let t = r[e].match(jr)
        null !== t && ((r[e - 1] += t[0]), (r[e] = r[e].replace(jr, '')))
      }
      return r
    }
    const Nr = function (e, t) {
        let n = e.split(/[-–—]/)
        if (n.length <= 1) return !1
        const { prefixes: r, suffixes: a } = t.one
        return (
          !r.hasOwnProperty(n[0]) &&
          ((n[1] = n[1].trim().replace(/[.?!]$/, '')),
          !a.hasOwnProperty(n[1]) &&
            (!0 ===
              /^([a-z\u00C0-\u00FF`"'/]+)[-–—]([a-z0-9\u00C0-\u00FF].*)/i.test(
                e
              ) ||
              !0 === /^([0-9]{1,4})[-–—]([a-z\u00C0-\u00FF`"'/-]+$)/i.test(e)))
        )
      },
      Ir = function (e) {
        let t = []
        const n = e.split(/[-–—]/)
        let r = '-',
          a = e.match(/[-–—]/)
        a && a[0] && (r = a)
        for (let e = 0; e < n.length; e++)
          e === n.length - 1 ? t.push(n[e]) : t.push(n[e] + r)
        return t
      }
    var Tr = function (e) {
      const t = /^[0-9]{1,4}(:[0-9][0-9])?([a-z]{1,2})? ?[-–—] ?$/,
        n = /^[0-9]{1,4}([a-z]{1,2})? ?$/
      for (let r = 0; r < e.length - 1; r += 1)
        e[r + 1] &&
          t.test(e[r]) &&
          n.test(e[r + 1]) &&
          ((e[r] = e[r] + e[r + 1]), (e[r + 1] = null))
      return e
    }
    const Gr = /\p{L} ?\/ ?\p{L}+$/u
    var Dr = function (e) {
      for (let t = 1; t < e.length - 1; t++)
        Gr.test(e[t]) &&
          ((e[t - 1] += e[t] + e[t + 1]), (e[t] = null), (e[t + 1] = null))
      return e
    }
    const Cr = /\S/,
      Or = /^[!?.]+$/,
      Vr = /(\S+)/
    let Br = [
      '.',
      '?',
      '!',
      ':',
      ';',
      '-',
      '–',
      '—',
      '--',
      '...',
      '(',
      ')',
      '[',
      ']',
      '"',
      "'",
      '`',
    ]
    Br = Br.reduce((e, t) => ((e[t] = !0), e), {})
    const zr =
        /^[ \n\t.[\](){}⟨⟩:,،、‒–—―…!‹›«»‐\-?‘’;/⁄·&*•^†‡°¡¿※№÷×ºª%‰+−=‱¶′″‴§~|‖¦©℗®℠™¤₳฿\u0022\uFF02\u0027\u201C\u201F\u201B\u201E\u2E42\u201A\u2035\u2036\u2037\u301D\u0060\u301F]+/,
      $r =
        /[ \n\t.'[\](){}⟨⟩:,،、‒–—―…!‹›«»‐\-?‘’;/⁄·&*@•^†‡°¡¿※#№÷×ºª‰+−=‱¶′″‴§~|‖¦©℗®℠™¤₳฿\u0022\uFF02\u201D\u00B4\u301E]+$/,
      Fr = /['’]/,
      Sr = /^[a-z]\.([a-z]\.)+/i,
      Hr = /^[-+.][0-9]/,
      Mr = /^'[0-9]{2}/
    var Lr = function (e) {
        let t = e,
          n = '',
          r = ''
        return (
          '' ===
            (e = (e = e.replace(
              zr,
              (t) => (
                (n = t),
                ('-' !== n && '+' !== n && '.' !== n) || !Hr.test(e)
                  ? "'" === n && Mr.test(e)
                    ? ((n = ''), t)
                    : ''
                  : ((n = ''), t)
              )
            )).replace(
              $r,
              (a) => (
                (r = a),
                Fr.test(a) && /[sn]['’]$/.test(t) && !1 === Fr.test(n)
                  ? ((r = r.replace(Fr, '')), "'")
                  : !0 === Sr.test(e)
                  ? ((r = r.replace(/\./, '')), '.')
                  : ''
              )
            )) &&
            ((t = t.replace(/ *$/, (e) => ((r = e || ''), ''))),
            (e = t),
            (n = '')),
          { str: e, pre: n, post: r }
        )
      },
      Wr = function (e) {
        let t = (e = (e = (e = e || '').toLowerCase()).trim())
        return (
          (e = (e = (e = e.replace(/[,;.!?]+$/, '')).replace(
            /\u2026/g,
            '...'
          )).replace(/\u2013/g, '-')),
          !1 === /^[:;]/.test(e) &&
            (e = (e = (e = e.replace(/\.{3,}$/g, '')).replace(
              /[",.!:;?)]+$/g,
              ''
            )).replace(/^['"(]+/g, '')),
          '' === (e = (e = e.replace(/[\u200B-\u200D\uFEFF]/g, '')).trim()) &&
            (e = t),
          (e = e.replace(/([0-9]),([0-9])/g, '$1$2'))
        )
      }
    const Jr = /([A-Z]\.)+[A-Z]?,?$/,
      qr = /^[A-Z]\.,?$/,
      Kr = /[A-Z]{2,}('s|,)?$/,
      Rr = /([a-z]\.)+[a-z]\.?$/
    var Ur = function (e) {
        return (
          (function (e) {
            return (
              !0 === Jr.test(e) ||
              !0 === Rr.test(e) ||
              !0 === qr.test(e) ||
              !0 === Kr.test(e)
            )
          })(e) && (e = e.replace(/\./g, '')),
          e
        )
      },
      Qr = function (e, t) {
        const n = t.methods.one.killUnicode
        let r = e.text || ''
        ;(r = Wr(r)), (r = n(r, t)), (r = Ur(r)), (e.normal = r)
      },
      _r = {
        one: {
          killUnicode: function (e, t) {
            const n = t.model.one.unicode || {}
            let r = (e = e || '').split('')
            return (
              r.forEach((e, t) => {
                n[e] && (r[t] = n[e])
              }),
              r.join('')
            )
          },
          tokenize: {
            splitSentences: Er,
            splitTerms: function (e, t) {
              let n = [],
                r = []
              if (
                ('number' == typeof (e = e || '') && (e = String(e)),
                (function (e) {
                  return '[object Array]' === Object.prototype.toString.call(e)
                })(e))
              )
                return e
              const a = e.split(Vr)
              for (let e = 0; e < a.length; e++)
                !0 !== Nr(a[e], t) ? r.push(a[e]) : (r = r.concat(Ir(a[e])))
              let o = ''
              for (let e = 0; e < r.length; e++) {
                let t = r[e]
                !0 === Cr.test(t) &&
                !1 === Br.hasOwnProperty(t) &&
                !1 === Or.test(t)
                  ? (n.length > 0
                      ? ((n[n.length - 1] += o), n.push(t))
                      : n.push(o + t),
                    (o = ''))
                  : (o += t)
              }
              return (
                o && (0 === n.length && (n[0] = ''), (n[n.length - 1] += o)),
                (n = Dr(n)),
                (n = Tr(n)),
                (n = n.filter((e) => e)),
                n
              )
            },
            splitWhitespace: (e) => {
              let { str: t, pre: n, post: r } = Lr(e)
              return { text: t, pre: n, post: r, tags: new Set() }
            },
            fromString: function (e, t) {
              const { methods: n, model: r } = t,
                {
                  splitSentences: a,
                  splitTerms: o,
                  splitWhitespace: i,
                } = n.one.tokenize
              return (e = a((e = e || ''), r).map((e) => {
                let n = o(e, r)
                return (
                  (n = n.map(i)),
                  n.forEach((e) => {
                    Qr(e, t)
                  }),
                  n
                )
              }))
            },
          },
        },
      },
      Zr = {
        '&': 'and',
        '@': 'at',
        '%': 'percent',
        plz: 'please',
        bein: 'being',
      }
    let Yr = {},
      Xr = {}
    ;[
      [
        [
          'approx',
          'apt',
          'bc',
          'cyn',
          'eg',
          'esp',
          'est',
          'etc',
          'ex',
          'exp',
          'prob',
          'pron',
          'gal',
          'min',
          'pseud',
          'fig',
          'jd',
          'lat',
          'lng',
          'vol',
          'fm',
          'def',
          'misc',
          'plz',
          'ea',
          'ps',
          'sec',
          'pt',
          'pref',
          'pl',
          'pp',
          'qt',
          'fr',
          'sq',
          'nee',
          'ss',
          'tel',
          'temp',
          'vet',
          'ver',
          'fem',
          'masc',
          'eng',
          'adj',
          'vb',
          'rb',
          'inf',
          'situ',
          'vivo',
          'vitro',
          'wr',
        ],
      ],
      [
        [
          'dl',
          'ml',
          'gal',
          'ft',
          'qt',
          'pt',
          'tbl',
          'tsp',
          'tbsp',
          'km',
          'dm',
          'cm',
          'mm',
          'mi',
          'td',
          'hr',
          'hrs',
          'kg',
          'hg',
          'dg',
          'cg',
          'mg',
          'µg',
          'lb',
          'oz',
          'sq ft',
          'hz',
          'mps',
          'mph',
          'kmph',
          'kb',
          'mb',
          'gb',
          'tb',
          'lx',
          'lm',
          'pa',
          'fl oz',
          'yb',
        ],
        'Unit',
      ],
      [
        [
          'ad',
          'al',
          'arc',
          'ba',
          'bl',
          'ca',
          'cca',
          'col',
          'corp',
          'ft',
          'fy',
          'ie',
          'lit',
          'ma',
          'md',
          'pd',
          'tce',
        ],
        'Noun',
      ],
      [
        [
          'adj',
          'adm',
          'adv',
          'asst',
          'atty',
          'bldg',
          'brig',
          'capt',
          'cmdr',
          'comdr',
          'cpl',
          'det',
          'dr',
          'esq',
          'gen',
          'gov',
          'hon',
          'jr',
          'llb',
          'lt',
          'maj',
          'messrs',
          'mister',
          'mlle',
          'mme',
          'mr',
          'mrs',
          'ms',
          'mstr',
          'phd',
          'prof',
          'pvt',
          'rep',
          'reps',
          'res',
          'rev',
          'sen',
          'sens',
          'sfc',
          'sgt',
          'sir',
          'sr',
          'supt',
          'surg',
        ],
        'Honorific',
      ],
      [
        [
          'jan',
          'feb',
          'mar',
          'apr',
          'jun',
          'jul',
          'aug',
          'sep',
          'sept',
          'oct',
          'nov',
          'dec',
        ],
        'Month',
      ],
      [['dept', 'univ', 'assn', 'bros', 'inc', 'ltd', 'co'], 'Organization'],
      [
        [
          'rd',
          'st',
          'dist',
          'mt',
          'ave',
          'blvd',
          'cl',
          'cres',
          'hwy',
          'ariz',
          'cal',
          'calif',
          'colo',
          'conn',
          'fla',
          'fl',
          'ga',
          'ida',
          'ia',
          'kan',
          'kans',
          'minn',
          'neb',
          'nebr',
          'okla',
          'penna',
          'penn',
          'pa',
          'dak',
          'tenn',
          'tex',
          'ut',
          'vt',
          'va',
          'wis',
          'wisc',
          'wy',
          'wyo',
          'usafa',
          'alta',
          'ont',
          'que',
          'sask',
        ],
        'Place',
      ],
    ].forEach((e) => {
      e[0].forEach((t) => {
        ;(Yr[t] = !0),
          (Xr[t] = 'Abbreviation'),
          void 0 !== e[1] && (Xr[t] = [Xr[t], e[1]])
      })
    })
    var ea = [
      'anti',
      'bi',
      'co',
      'contra',
      'de',
      'extra',
      'infra',
      'inter',
      'intra',
      'macro',
      'micro',
      'mis',
      'mono',
      'multi',
      'peri',
      'pre',
      'pro',
      'proto',
      'pseudo',
      're',
      'sub',
      'supra',
      'trans',
      'tri',
      'un',
      'out',
    ].reduce((e, t) => ((e[t] = !0), e), {})
    let ta = {
        '!': '¡',
        '?': '¿Ɂ',
        '"': '“”"❝❞',
        "'": '‘‛❛❜’',
        '-': '—–',
        a: 'ªÀÁÂÃÄÅàáâãäåĀāĂăĄąǍǎǞǟǠǡǺǻȀȁȂȃȦȧȺΆΑΔΛάαλАаѦѧӐӑӒӓƛæ',
        b: 'ßþƀƁƂƃƄƅɃΒβϐϦБВЪЬвъьѢѣҌҍ',
        c: '¢©ÇçĆćĈĉĊċČčƆƇƈȻȼͻͼϲϹϽϾСсєҀҁҪҫ',
        d: 'ÐĎďĐđƉƊȡƋƌ',
        e: 'ÈÉÊËèéêëĒēĔĕĖėĘęĚěƐȄȅȆȇȨȩɆɇΈΕΞΣέεξϵЀЁЕеѐёҼҽҾҿӖӗ',
        f: 'ƑƒϜϝӺӻҒғſ',
        g: 'ĜĝĞğĠġĢģƓǤǥǦǧǴǵ',
        h: 'ĤĥĦħƕǶȞȟΉΗЂЊЋНнђћҢңҤҥҺһӉӊ',
        I: 'ÌÍÎÏ',
        i: 'ìíîïĨĩĪīĬĭĮįİıƖƗȈȉȊȋΊΐΪίιϊІЇії',
        j: 'ĴĵǰȷɈɉϳЈј',
        k: 'ĶķĸƘƙǨǩΚκЌЖКжкќҚқҜҝҞҟҠҡ',
        l: 'ĹĺĻļĽľĿŀŁłƚƪǀǏǐȴȽΙӀӏ',
        m: 'ΜϺϻМмӍӎ',
        n: 'ÑñŃńŅņŇňŉŊŋƝƞǸǹȠȵΝΠήηϞЍИЙЛПийлпѝҊҋӅӆӢӣӤӥπ',
        o: 'ÒÓÔÕÖØðòóôõöøŌōŎŏŐőƟƠơǑǒǪǫǬǭǾǿȌȍȎȏȪȫȬȭȮȯȰȱΌΘΟθοσόϕϘϙϬϴОФоѲѳӦӧӨөӪӫ',
        p: 'ƤΡρϷϸϼРрҎҏÞ',
        q: 'Ɋɋ',
        r: 'ŔŕŖŗŘřƦȐȑȒȓɌɍЃГЯгяѓҐґ',
        s: 'ŚśŜŝŞşŠšƧƨȘșȿЅѕ',
        t: 'ŢţŤťŦŧƫƬƭƮȚțȶȾΓΤτϮТт',
        u: 'µÙÚÛÜùúûüŨũŪūŬŭŮůŰűŲųƯưƱƲǓǔǕǖǗǘǙǚǛǜȔȕȖȗɄΰμυϋύ',
        v: 'νѴѵѶѷ',
        w: 'ŴŵƜωώϖϢϣШЩшщѡѿ',
        x: '×ΧχϗϰХхҲҳӼӽӾӿ',
        y: 'ÝýÿŶŷŸƳƴȲȳɎɏΎΥΫγψϒϓϔЎУучўѰѱҮүҰұӮӯӰӱӲӳ',
        z: 'ŹźŻżŽžƵƶȤȥɀΖ',
      },
      na = {}
    Object.keys(ta).forEach(function (e) {
      ta[e].split('').forEach(function (t) {
        na[t] = e
      })
    })
    const ra = /\//,
      aa = /[a-z]\.[a-z]/i,
      oa = /[0-9]/
    var ia = function (e, t) {
      let n = e.normal || e.text
      const r = t.model.one.aliases
      if (
        (r.hasOwnProperty(n) && ((e.alias = e.alias || []), e.alias.push(r[n])),
        ra.test(n) && !aa.test(n) && !oa.test(n))
      ) {
        let t = n.split(ra)
        t.length <= 2 &&
          t.forEach((t) => {
            '' !== (t = t.trim()) &&
              ((e.alias = e.alias || []), e.alias.push(t))
          })
      }
      return e
    }
    const sa = /^\p{Letter}+-\p{Letter}+$/u
    var la = function (e) {
        let t = e.implicit || e.normal || e.text
        ;(t = t.replace(/['’]s$/, '')),
          (t = t.replace(/s['’]$/, 's')),
          (t = t.replace(/([aeiou][ktrp])in'$/, '$1ing')),
          sa.test(t) && (t = t.replace(/-/g, '')),
          (t = t.replace(/^[#@]/, '')),
          t !== e.normal && (e.machine = t)
      },
      ua = function (e) {
        let t = 0,
          n = 0,
          r = e.document
        for (let e = 0; e < r.length; e += 1)
          for (let a = 0; a < r[e].length; a += 1) {
            let o = r[e][a]
            ;(o.offset = {
              index: n,
              start: t + o.pre.length,
              length: o.text.length,
            }),
              (t += o.pre.length + o.text.length + o.post.length),
              (n += 1)
          }
      }
    const ca = function (e, t) {
      let n = e.docs
      for (let r = 0; r < n.length; r += 1)
        for (let a = 0; a < n[r].length; a += 1) t(n[r][a], e.world)
    }
    var ha = {
      compute: {
        alias: (e) => ca(e, ia),
        machine: (e) => ca(e, la),
        normal: (e) => ca(e, Qr),
        freq: function (e) {
          let t = e.docs,
            n = {}
          for (let e = 0; e < t.length; e += 1)
            for (let r = 0; r < t[e].length; r += 1) {
              let a = t[e][r],
                o = a.machine || a.normal
              ;(n[o] = n[o] || 0), (n[o] += 1)
            }
          for (let e = 0; e < t.length; e += 1)
            for (let r = 0; r < t[e].length; r += 1) {
              let a = t[e][r],
                o = a.machine || a.normal
              a.freq = n[o]
            }
        },
        offset: ua,
        index: function (e) {
          let t = e.document
          for (let e = 0; e < t.length; e += 1)
            for (let n = 0; n < t[e].length; n += 1) t[e][n].index = [e, n]
        },
        wordCount: function (e) {
          let t = 0,
            n = e.docs
          for (let e = 0; e < n.length; e += 1)
            for (let r = 0; r < n[e].length; r += 1)
              '' !== n[e][r].normal && ((t += 1), (n[e][r].wordCount = t))
        },
      },
      methods: _r,
      model: {
        one: {
          aliases: Zr,
          abbreviations: Yr,
          prefixes: ea,
          suffixes: {
            like: !0,
            ish: !0,
            less: !0,
            able: !0,
            elect: !0,
            type: !0,
            designate: !0,
          },
          lexicon: Xr,
          unicode: na,
        },
      },
      hooks: ['alias', 'machine', 'index', 'id'],
    }
    const da = function () {
      const e = this.docs
      if (0 === e.length) return this
      let t = e[e.length - 1] || [],
        n = t[t.length - 1]
      return (
        !0 === n.typeahead &&
          n.machine &&
          ((n.text = n.machine), (n.normal = n.machine)),
        this
      )
    }
    var pa = function (e, t, n) {
      let r = {},
        a = [],
        o = n.prefixes || {}
      return (
        e.forEach((e) => {
          let i = (e = e.toLowerCase().trim()).length
          t.max && i > t.max && (i = t.max)
          for (let s = t.min; s < i; s += 1) {
            let i = e.substring(0, s)
            ;(t.safe && n.model.one.lexicon.hasOwnProperty(i)) ||
              (!0 !== o.hasOwnProperty(i) && !0 !== r.hasOwnProperty(i)
                ? (r[i] = e)
                : a.push(i))
          }
        }),
        (r = Object.assign({}, o, r)),
        a.forEach((e) => {
          delete r[e]
        }),
        r
      )
    }
    const ma = { safe: !0, min: 3 }
    var ga = {
      model: { one: { typeahead: {} } },
      api: function (e) {
        e.prototype.autoFill = da
      },
      lib: {
        typeahead: function (e = [], t = {}) {
          let n = this.model()
          var r
          ;(t = Object.assign({}, ma, t)),
            (r = e),
            '[object Object]' === Object.prototype.toString.call(r) &&
              (Object.assign(n.one.lexicon, e), (e = Object.keys(e)))
          let a = pa(e, t, this.world())
          return (
            Object.keys(a).forEach((e) => {
              n.one.typeahead.hasOwnProperty(e)
                ? delete n.one.typeahead[e]
                : (n.one.typeahead[e] = a[e])
            }),
            this
          )
        },
      },
      compute: {
        typeahead: function (e) {
          const t = e.model.one.typeahead,
            n = e.docs
          if (0 === n.length || 0 === Object.keys(t).length) return
          let r = n[n.length - 1] || [],
            a = r[r.length - 1]
          if (!a.post && t.hasOwnProperty(a.normal)) {
            let n = t[a.normal]
            ;(a.implicit = n),
              (a.machine = n),
              (a.typeahead = !0),
              e.compute.preTagger &&
                e.last().unTag('*').compute(['lexicon', 'preTagger'])
          }
        },
      },
      hooks: ['typeahead'],
    }
    m.extend(R),
      m.extend(yn),
      m.extend(St),
      m.extend(Gn),
      m.extend(gr),
      m.plugin(be),
      m.extend(ha),
      m.plugin(f),
      m.extend(Te),
      m.extend(ga),
      m.extend(Pe),
      m.extend($n)
    var fa = {
        addendum: 'addenda',
        corpus: 'corpora',
        criterion: 'criteria',
        curriculum: 'curricula',
        genus: 'genera',
        memorandum: 'memoranda',
        opus: 'opera',
        ovum: 'ova',
        phenomenon: 'phenomena',
        referendum: 'referenda',
        alga: 'algae',
        alumna: 'alumnae',
        antenna: 'antennae',
        formula: 'formulae',
        larva: 'larvae',
        nebula: 'nebulae',
        vertebra: 'vertebrae',
        analysis: 'analyses',
        axis: 'axes',
        diagnosis: 'diagnoses',
        parenthesis: 'parentheses',
        prognosis: 'prognoses',
        synopsis: 'synopses',
        thesis: 'theses',
        neurosis: 'neuroses',
        appendix: 'appendices',
        index: 'indices',
        matrix: 'matrices',
        ox: 'oxen',
        sex: 'sexes',
        alumnus: 'alumni',
        bacillus: 'bacilli',
        cactus: 'cacti',
        fungus: 'fungi',
        hippopotamus: 'hippopotami',
        libretto: 'libretti',
        modulus: 'moduli',
        nucleus: 'nuclei',
        octopus: 'octopi',
        radius: 'radii',
        stimulus: 'stimuli',
        syllabus: 'syllabi',
        cookie: 'cookies',
        calorie: 'calories',
        auntie: 'aunties',
        movie: 'movies',
        pie: 'pies',
        rookie: 'rookies',
        tie: 'ties',
        zombie: 'zombies',
        leaf: 'leaves',
        loaf: 'loaves',
        thief: 'thieves',
        foot: 'feet',
        goose: 'geese',
        tooth: 'teeth',
        beau: 'beaux',
        chateau: 'chateaux',
        tableau: 'tableaux',
        bus: 'buses',
        gas: 'gases',
        circus: 'circuses',
        crisis: 'crises',
        virus: 'viruses',
        database: 'databases',
        excuse: 'excuses',
        abuse: 'abuses',
        avocado: 'avocados',
        barracks: 'barracks',
        child: 'children',
        clothes: 'clothes',
        echo: 'echoes',
        embargo: 'embargoes',
        epoch: 'epochs',
        deer: 'deer',
        halo: 'halos',
        man: 'men',
        woman: 'women',
        mosquito: 'mosquitoes',
        mouse: 'mice',
        person: 'people',
        quiz: 'quizzes',
        rodeo: 'rodeos',
        shoe: 'shoes',
        sombrero: 'sombreros',
        stomach: 'stomachs',
        tornado: 'tornados',
        tuxedo: 'tuxedos',
      },
      ba = {
        Comparative: 'true¦better',
        Superlative: 'true¦earlier',
        PresentTense: 'true¦sounds',
        Condition: 'true¦lest,unless',
        PastTense: 'true¦be2came,d1had,lied,mea0sa1taken,we0;nt;id;en,gan',
        Gerund: 'true¦accord0be0go0result0stain0;ing',
        Expression:
          "true¦a0Qb0Mco0Ld0He0Ffuck,g09hUjeez,lRmQnOoLpIshHtGuDvoi0Sw6y0;a4e3i1u0;ck,p;kYp0;ee,pee;ah,p,s;!a,h6y;ah5h2o1t0;af,f;rd up,w;e1o0;a,ops;e,w;oo;gh,h0;! 0h,m;huh,oh;sk,ut tut;eesh,hh,it;ff,h1l0ow,sst;ease,z;ew,ooey;h1i,o0uch,w,y;h,o,ps;!h;ah,o0;!pe;eh,mm;ah,m1ol0;!s;ao,fao;aBe9i7o2u0;h,mph,rra0zzB;h,y;ly1o0;r4y8;! 0;cow,moCsmok0;es;!p hip hoor0;ay;ck,e,ll0y;!o;ha1i,lleluj0;ah;!ha;ah,ee4o1r0;eat scott,r;l1od0sh; grief,bye;ly;! whiz;e0h,t cetera,ww;k,p;'oh,a0rat,uh;m0ng;mit,n0;!it;ngratulations,wabunga;a2oo1r0ye;avo,r;!ya;h,m; 1h0las,men,rgh;!a,em,oy;la",
        Negative: 'true¦n0;ever,o0;n,t',
        QuestionWord: "true¦how3wh0;at,e1ich,o0y;!m,se;n,re; come,'s",
        Reflexive:
          'true¦h4it5my5o1the0your2;ir1m1;ne3ur0;sel0;f,ves;er0im0;self',
        Plural: 'true¦ones,records',
        Value: 'true¦a few',
        Imperative: 'true¦come here',
        PhrasalVerb:
          'true¦0:81;1:7Q;2:8E;3:84;4:7J;5:8H;6:7P;7:7E;8:7C;9:86;A:7Z;B:89;C:87;D:80;E:6L;F:6D;a8Kb73c66d61e60f4Yg4Gh3Viron0j3Rk3Ml33m2Pn2No2Lp22quietEr1Ns0GtWuUvacuum 1wJyammerAzG;ero Dip HonG;e0k0;by,up;aNeIhHiGor7Vrit37;mp0n34pe0r8s8;eel Dip 8P;aIiGn2S;gh Grd0;in,up;n Dr G;d2in,o4D;it 6Hk8lk Hrm 0Ysh Gt79v5F;aw3d2o5up;aw3in,o84;rgeAsG;e 1herF;aVeThRiNoMrIuGypL;ckFrn G;d2in,o45up;aHiGot0y 2O;ckleEp 8A;ckEdG;e 0N;neEp 2Zs4Z;ck IdHe Gghte5Yme0p o0Ire0;aw3ba4d2in,up;e 6Hy 1;by,oC;ink Grow 6U;ba4ov6up;aGe 6Fll5G;m 1r 53;ckAke Hlk G;ov6shit,u5H;aGba4d2in,o3Pup;ba4ft6p5Mw3;a0Lc0Ke0Eh0Ai07l03m02n01o00pVquar4XtMuKwG;earIiG;ngHtch G;aw3ba4o7O; by;ck Git 1m 1ss0;in,o7Bup;aMe10iLoJrHuG;c36d2O;aigh22iG;ke 6Wn3L;p Grm24;by,in,oC;n31r 1tc44;c30mp0nd Gr7Fve9y 1;ba4d2up;ar2YeJiIlHrGurA;ingAuc8;a3Rit 5R;l17n 1;e69ll0;ber 1rt0und like;ap 56ow D;ash 5Woke0;eep HiGow 7;c1Lp 1;in,oG;ff,v6;de12gn HngGt 5Rz8; al5Mle0;in,o5up;aIoGu5A;ot Gut0w 6U;aw3ba4f3SoC;c2GdeFk5Pve9;e Kll1Gnd Jrv8tG; Gtl4W;d2f5Bin,o5upG;!on;aw3ba4d2in,o2Nup;o6Dto;al5Iout0rap5I;il9v8;aTeQiPoLuG;b 5Ble0n Gstl8;aIba4d2inHoGt3Lu0X;ut,v6;!to;c2HrBw3;ll Iot HuG;g33nd9;a2Hf3Ao5;arBin,o5;ng 5Ip9;aGel9inFnt0;c5Rd G;o3Bup;c1Tt0;aUeTiRlPoNrKsyc2RuG;ll It G;aGba4d2in,o1Zt3Rup;p3Ww3;ap3Vd2in,o5t3Pup;attleAess HiJoG;p 1;ah1Zon;iGp 5Wr4CurEwer 5W;nt0;ay4SuG;gFmp 7;ck Gg0leAn 7p4P;o1Oup;el 4ZncilF;c4Hir 2Xn0ss ItHy G;ba4oC; d2c2E;aw3ba4in,o1J;pGw4C;e4Bt D;arrowEerd0oG;d9teE;aQeNiMoIuG;ddl8lG;l 3W;c12nkeyIp 7uth9ve G;aGd2in,o5up;l41w3; wi3Y;ss0x 1;asur8lHss G;a1Oup;t 7;ke Hn 7rGs1Xx0;k 7ry9;do,o4Vup;aWeRiMoGuck0;aKc3Ug JoGse0;k Gse3S;aft6ba4d2forw2Sin4Iov6uG;nd6p;in,o0V;d 7;e 04ghtJnIsHvG;e 3E;ten 4Y;e 1k 1; 1e3J;ave It HvelG; o4H;d2go,in,o5up;in,oG;pen,ut;c8p 1sh GtchAugh9y26;in43o5;eHick9nock G;d2o4Aup;eGyF;l 2Yp G;aw3ba4d2fYin,o0Dto,up;aIoHuG;ic8mpF;ke3BtE;c3Kzz 1;aVeQiNoKuG;nHrrGsh 7;y 1;kerEt G;arBd2;lGneFrse34;d Ge 1;ba4d2fast,o04up;de Ht G;ba4on,up;aw3o5;aGlp0;d Il 2Gr Gt 1;fGof;rom;in,oWu1K;cJm 1nHve Gz2B;it,to;d Gg 2MkerJ;d2in,o5;k 1;aUeOive Mloss 27oIrHunG; f0O;in3Now 2H; Gof 26;aHb1Fit,oGrBt0Qu1A;ff,n,v6;bo5ft6hMw3;aw3ba4d2in,oGrise,up,w3;ff,n,ut;ar 7ek0t G;aHb19d2in,oGrBup;ff,n,ut,v6;cHhGl23rBt,w3;ead;ross;d aHnG;g 1;bo5;a0Ae03iUlQoMrIuG;ck Ge28;arBup;eHighten GownAy 1;aw3oC;eGshe1U; 1z8;lIol G;aGwi1N;bo5rB;d 7low 1;aHeGip0;sh0;g 7ke0mGrGttenE;e 2Y;gNlLnJrHsGzzle0;h 2W;e Gm 1;aw3ba4up;d0isG;h 1;e Gl 1G;aw3fLin,o5;ht ba4ure0;eLnHsG;s 1;cId G;fGoC;or;e D;dYl 1;cKll Grm0t13;ap07bId2in,oHtG;hrough;ff,ut,v6;a4ehi27;e G;d2oCup;a0Ldge0nd 0Py8;oJrG;aHess 7op G;aw3bWin,o1U;gAwA; 0Iubl0Y;a00hXleaWoJrGut 16;ackAeep Goss D;by,d2in,oGup;n,ut;me JoHuntG; o1W;k 7l G;d2oC;aMbLforJin,oItHuG;nd6;ogeth6;n,ut,v6;th,wG;ard;a4y;pGrBw3;art;n 7;eGipF;ck Der G;on,up;lNncel0rKsItch HveF; in;o1Eup;h Dt G;doubt,oC;ry HvG;e 02;aw3o19;l HmE; d2;aGba4d2o16up;rBw3;a0Me0El07oYrLuG;bblIcklZil05lk 7ndlZrGst VtHy 16zz9;n 0AsG;t D;e G;ov6;anReaPiHush G;oCup;ghLng G;aIba4d2fGin,o5up;orG;th;bo5lGrBw3;ong;teG;n 1;k G;d2in,o5up;ch0;arNg 7iLn8oJssIttlHunce Gx D;aw3ba4;e 7; arB;k Dt 1;e 1;l 7;d2up;d 1;aLeed0oGurt0;cIw G;aw3ba4d2o5up;ck;k G;in,oX;ck0nk0st9; oLaJef 1nd G;d2ov6up;er;up;r0t G;d2in,oQup;ff,nG;to;ck Mil0nIrgHsG;h D;ainAe D;g DkA; on;in,o5; o5;aw3d2oGup;ff,ut;ay;cPdLsk Iuction9; oC;ff;arBo5;ouG;nd;d G;d2oGup;ff,n;own;t G;o5up;ut',
        Verb: 'true¦born,cannot,gonna,has,keep tabs,m0;ake sure,sg',
        Demonym:
          'true¦0:15;1:12;a0Vb0Oc0Dd0Ce08f07g04h02iYjVkTlPmLnIomHpEqatari,rCs7t5u4v3welAz2;am0Gimbabwe0;enezuel0ietnam0I;gAkrai1;aiwTex0hai,rinida0Ju2;ni0Prkmen;a5cotti4e3ingapoOlovak,oma0Spaniard,udRw2y0W;ede,iss;negal0Cr09;sh;mo0uT;o5us0Jw2;and0;a2eru0Fhilippi0Nortugu07uerto r0S;kist3lesti1na2raguay0;ma1;ani;ami00i2orweP;caragu0geri2;an,en;a3ex0Lo2;ngo0Drocc0;cedo1la2;gasy,y07;a4eb9i2;b2thua1;e0Cy0;o,t01;azakh,eny0o2uwaiI;re0;a2orda1;ma0Ap2;anO;celandic,nd4r2sraeli,ta01vo05;a2iB;ni0qi;i0oneU;aiAin2ondur0unO;di;amEe2hanai0reek,uatemal0;or2rm0;gi0;ilipino,ren8;cuadoVgyp4mira3ngli2sto1thiopi0urope0;shm0;ti;ti0;aPominUut3;a9h6o4roat3ub0ze2;ch;!i0;lom2ngol5;bi0;a6i2;le0n2;ese;lifor1m2na3;bo2eroo1;di0;angladeshi,el6o4r3ul2;gaE;azi9it;li2s1;vi0;aru2gi0;si0;fAl7merBngol0r5si0us2;sie,tr2;a2i0;li0;genti2me1;ne;ba1ge2;ri0;ni0;gh0r2;ic0;an',
        Organization:
          "true¦0:4D;a3Gb2Yc2Ed26e22f1Xg1Ph1Ki1Hj1Fk1Dl18m0Wn0Jo0Gp09qu08r01sTtGuBv8w3xiaomi,y1;amaha,m13ou1w13;gov,tu2Z;a3e1orld trade organizati2S;lls fargo,st1;fie28inghou2I;l1rner br3I;gree37l street journ29m17;an halOeriz2Nisa,o1;dafo2Ol1;kswagMvo;b4kip,n2ps,s1;a tod2Yps;es3Ai1;lev33ted natio30;er,s; mobi2Qaco beQd bNeAgi frida9h3im horto2Ymz,o1witt31;shi3Xy1;ota,s r 00;e 1in lizzy;b3carpen37daily ma31guess w2holli0rolling st1Rs1w2;mashing pumpki2Tuprem0;ho;ea1lack eyed pe3Lyrds;ch bo1tl0;ys;l2n3Ds1xas instrumen1J;co,la m15;efoni0Cus;a7e4ieme2Lnp,o2pice gir5quare04ta1ubaru;rbucks,to2R;ny,undgard1;en;a2x pisto1;ls;g1Nrs;few2Ainsbury2QlesforYmsu22;.e.m.,adiohead,b6e3oyal 1yana30;b1dutch she4;ank;aders dige1Gd 1max,vl1R;bu1c1Zhot chili peppe2Nlobst2C;ll;c,s;ant30izno2I;a5bs,e3fiz28hilip morrCi2r1;emier2Audenti16;nk floyd,zza hut;psi2Btro1uge0A;br2Vchina,n2V;lant2Nn1yp12; 2ason20da2I;ld navy,pec,range juli2xf1;am;us;aAb9e6fl,h5i4o1sa,vid3wa;k2tre dame,vart1;is;ia;ke,ntendo,ss0L;l,s;c,st1Htflix,w1; 1sweek;kids on the block,york09;a,c;nd1Vs2t1;ional aca2Io,we0Q;a,cYd0O;aBcdonaldAe7i5lb,o3tv,y1;spa1;ce;b1Mnsanto,ody blu0t1;ley crue,or0O;crosoft,t1;as,subisM;dica2rcedes benz,talli1;ca;id,re;'s,s;c's milk,tt14z1Z;'ore08a3e1g,ittle caesa1K;novo,x1;is,mark; 1bour party;pres0Bz boy;atv,fc,kk,m1od1J;art;iffy lu0Moy divisi0Gpmorgan1sa;! cha07;bm,hop,n1tv;g,te1;l,rpol;asbro,ewlett pack1Ri3o1sbc,yundai;me dep1n1L;ot;tac1zbollah;hi;eneral 6hq,ithub,l5mb,o2reen d0Lu1;cci,ns n ros0;ldman sachs,o1;dye1g0E;ar;axo smith kli03encoV;electr0Km1;oto0W;a4bi,da,edex,i2leetwood mac,o1rito l0D;rd,xcX;at,nancial1restoY; tim0;cebook,nnie mae;b08sa,u3xxon1; m1m1;ob0H;!rosceptics;aiml0Be6isney,o4u1;nkin donu2po0Xran dur1;an;ts;j,w j1;on0;a,f lepp0Zll,peche mode,r spiegZstiny's chi1;ld;aIbc,hEiCloudflaBnn,o3r1;aigsli5eedence clearwater reviv1ossra06;al;ca c7inba6l4m1o0Bst06;ca2p1;aq;st;dplPg1;ate;se;ola;re;a,sco1tigroup;! systems;ev2i1;ck fil-a,na daily;r1y;on;dbury,pital o1rl's jr;ne;aEbc,eBf9l5mw,ni,o1p,rexiteeU;ei3mbardiIston 1;glo1pizza;be;ng;o2ue c1;roV;ckbuster video,omingda1;le; g1g1;oodriL;cht2e ge0rkshire hathaw1;ay;el;idu,nana republ3s1xt5y5;f,kin robbi1;ns;ic;bYcTdidSerosmith,iRlKmEnheuser-busDol,pple9r6s3utodesk,v2y1;er;is,on;hland1sociated F; o1;il;by4g2m1;co;os; compu2bee1;'s;te1;rs;ch;c,d,erican3t1;!r1;ak; ex1;pre1;ss; 5catel2ta1;ir;!-lu1;ce1;nt;jazeera,qae1;da;g,rbnb;as;/dc,a3er,tivision1;! blizz1;ard;demy of scienc0;es;ba",
        Possessive: 'true¦any2its,my,no4o0somet3their1yo0;ur0;!s;o1t0;hing;ne',
        'Noun|Verb':
          'true¦0:7T;1:6L;2:7P;3:80;4:7Z;5:83;6:6Y;7:7J;a7Jb6Uc5Td58e50f4Cg42h3Ui3Oj3Mk3Kl3Am31n2Xo2Tp1Zques7Lr1Bs05tRuPvKwAy9z8;ip,o6C;awn,e1Uie4S;aFeaEhCiAo8re7L;nd0r8;k,ry;mp,n8pe,re,sh,tne83;!d,g;e6Gi8;p,st6;r,th0;it,r8s4t2ve,x;ehou1ra82;aBiAo8;i8lunte0te,w;ce,d;be,ew,s6X;cuum,l38;p8sh0;da4gra4Y;aJeIhrHiGoFrBu9wi8y4M;n,st;n8rn;e,n61;aAe9i8u7;bu4ck,gg0m,p;at,nd;ck,de,in,nsf0p,v5X;ll,ne,r3Qss,t75u2;ck,e,me,p,re;e1Low,u7;ar,e,st;g,l8rg61s4;k,ly;a0Cc07e04hZiXkVlTmSnRou6BpNtDu9w8;ear,it2;b1Wit,m,pp9r8spe5;ge,pri1vey;l8o5A;e57y;aFeEiDoBr9u8y6;dy,ff,mb6;a6Be8i4E;am,ss,t2;cking,p,r8;e,m;ck,t2;m,p;ck,in,ke,ll,mp,nd,r8te,y;!e,t;aAeed,i9la4Jons6Lr8y;ay,e10ink6u3;n,r6Hte;n,rk;ee1Dow;e0Di6o41;eep,i8;ce,p,t;ateboa5Yi8;!p;de,gn8ze;!al;aBeAi9o8;ck,p,w;ft,p,v0;d,i31;pe,re;a9ed,n8rv14t;se,t1W;l,r2t;aBhedu6oAr8;at2e8;en,w;re,ut;le,n,r0H;crifi3il;aTeCiBoAu8;b,in,le,n,s8;h,t;a7ck,ll,ot;de,ng,p,s1A;as5DcMdo,el,fKgJje5lImGnFo0TpDque7sAturn,v8wa5B;e8i1H;al,r1;er5Io9t,u8;lt,me;l5Grt;air,ea8ly,o3X;l,t;dezvo24t;a8edy;ke,rk;ea1i3D;a4Zist0r4C;act5Dorm,u8;nd,se;a8o4Wru4P;ll;ck,i1ke,l46n8tT;ge,k;aYeVhTiQlLoHr9u8;mp,n2rcha1sh;ai1eDiCo8u3J;be,ceAdu3gr8je5mi1te7;am8e5D;!me;ed,ss;ce,de;s8y;er4Ts;iAl8ol,p,re,s2Qw0;i8l;ce,sh;nt,s4H;aAe9u8;g,n3U;ad;ce,n8y;!t;ck,l9n8pe,t,vot;!e;e,ot;a1o8;ne,tograph;ak,e9n,r8t;fu3Tm3W;!l;cka3Ii9n,rt8ss,t2u1;!y;nt,r;bAff0il,o9r8utli2R;d0ie4R;ze;je5;a3KeAo8;d,t8;e,i3;ed,gle5rd,t;aDeBiAo9u8;rd0;d2Snit43p,ve;lk,n2Wrr42x;asu10n3Nr8ss;ge,it;il,n9p,rk2Xs8t2;h,k;da4oeuv0W;aEeBiAo8ump;a8bby,ck,g,ok,ve;d,n;cen1ft,m37nCst;a9c0Bv8;el,y;ch,d,p,se;b9c8nd,t2un2;e,k;el,o23;e2Bi8no3B;ck,ll,ss;am,o15u8;d2Li3;mpCn9r35ss8;ue;cr17dex,flu9ha6k,se1Ttervi8voi3;ew;en3;a5le1O;aCeAi9o8u3R;ld,no1Rok,pe,r1st,u1;ghlight,ke,re,t;a8lp;d,t;nd9r8te;bo2Zm,ne3Gve7;!le;aGeek,lo3EoFrAu8;ar8e3Di0Ln;antee,d;aAi9o8umb6;om,u2A;nd,p;d8sp;e,ua4;of,ssip;in,me,ng,s,te,ze;aUeQiLlHoErAu8;el,n8zz;c2Ed;a9o8y;st,wn;c8me;tuN;c9g,ol,r8;ce,e1Mm;us;aAe0Iip,o8y;at,od,w8;!er;g,re,sh,vo0X;eBgAl9n8re,sh,t,x;an3i0D;e,m,t0;ht,uC;ld;a9e8n3;d,l;r,tu8;re;ce,il,ll,rm,vo20;cho,nEsCx8ye;cAerci1hib1Jp8tra5;eri8o0H;en3me2I;el,han14;ca8tima4;pe;count0d,gine0vy;aQeKiEoDr9u8ye;b,mp,pli23;aAe9i8;ft,nk,ve;am,ss;ft,in;cu03d0Uubt;p,sAv8;e,i8or3;de;char0Qli9p8;at2lay,u4;ke;al,ba4cBfeAl9ma0Vpos0Zsi8tail;gn,re;ay,ega4;at,ct;liVr8;ea1;ma0Hn3r8te;e,t;a05ent04hXlUoErAu8;be,r8t;e,l;aft,eAo9u8y;sh;p,ss,wd;d0Lep;de,in,lLmFnAok,py,re,st,u8v0;gh,n8p6;sTt;ceAdu5glomeBstru5t8veG;a5r8;a7ol;nt8rn;ra4;biCfoBmAp8;le8ou07romi1;me1B;a05e1Au4;rt;ne;lap1o8;r,ur;a9i8;ck,p;im,w;a9e8ip;at,ck,er;iBllenNmpi08n9r8se,uffe0E;ge,m,t;ge,n8;el;n,r;er,re;ke,ll,mp,p,r9sh,t2u1ve;se;d,e;aSePiOlLoHrBu8ypa0M;bb6ck6dg9ff0l8rn,st,zz;ly;et;anCeaBi9oad8;ca7;be,d8;ge;ch,k;ch,d;aAmb,ne,o9ss,tt6x,ycott;le;k,st,t;rd,st;a9e8itz,oN;nd;me;as,d,ke,te;a9nef8t;it;r,t;il,lan3nArga9s8;e,h;in;!d,g,k;cZdRffilQge,iPlt0nMppJrFssDttBuc9wa8;rd;ti8;on;a8empt;ck;i7ocK;st;ch9mo8;ur;!i8;ve;e9roa2;ch;al;ch8sw0;or;er;d,m,r;ia4;dCv8;an3o8;ca4;te;ce;i5re8;ss;ct;c8he,t;eAo8;rd,u8;nt;nt,ss',
        Actor:
          'true¦aJbGcFdCfAgardenIh9instructPjournalLlawyIm8nurse,opeOp5r3s1t0;echnCherapK;ailNcientJecretary,oldiGu0;pervKrgeon;e0oofE;ceptionGsearC;hotographClumbColi1r0sychologF;actitionBogrammB;cem6t5;echanic,inist9us4;airdress8ousekeep8;arm7ire0;fight6m2;eputy,iet0;ici0;an;arpent2lerk;ricklay1ut0;ch0;er;ccoun6d2ge7r0ssis6ttenda7;chitect,t0;ist;minist1v0;is1;rat0;or;ta0;nt',
        Honorific:
          'true¦aObrigadiNcGdFexcellency,fiAliCma9officNp5queen,r2s0taoiseach,vice4;e0ultJ;cond liArgeaB;abbi,e0;ar0verend; adK;astGr0;eside6i0ofessF;me ministFnce0;!ss;gistrate,r4yC;eld mar3rst l0;ady,i0;eutena0;nt;shB;oct6utchess;aptain,hance4o0;lonel,mmand5n0unci3;gress0stable;m0wom0;an;ll0;or;er;d0yatullah;mir0;al',
        Pronoun: "true¦'em,elle,h3i2me,she4th0us,we,you;e0ou;m,y;!l,t;e0im;!'s",
        Singular:
          'true¦0:58;1:4H;2:57;3:4U;4:4S;5:4N;6:4R;7:51;8:4I;a4Rb46c39d2We2Pf2Fg24h1Sin1Pjel3k1Nl1Km1Bn18o14p0Nqu0Mr0DsUtJuGvCw9;a9ha3Bom2B;f1i4Vt0Ey9;! arou4E;arn4FeAo9;cabu07l52;gKr9;di6t1J;nc34p2RrAs 9;do3Rs55;bani2in0; rex,aIeHhGiEoDrBuAv9;! show;m2In5rntJto16;agedy,ib9o44;e,u2O;p5rq3D;c,de,er,m9;etE;ere,i8;am,mp38;ct5le4x return;aQcOeNhMi2kKoJtEuBy9;ll9n26st4O;ab2O;bAnri19per bowl,r9;f1roga2;st3Ctot0;aCepBipe3Po1ArAudent9;! lo1J;ang1i8;fa1Emo1E;ff1t2Z;loi40meo15;elet12i9;er,ll,rm3K;ack,or47;ab0Tcurity gu2C;e4ho9;l2Yol;la31;av0VeChetor5iAo9;de4om;te,v9;erb0M;bCcBf9publ5r0Nspi2;er9orm1;e4r0;it0ord label;a2u40;estion mark,ot27;aMeKhJiHlFort0rAu9yram1B;ddi8ppy,rpo0I;eCie3Go9;bl3Ts9;pe6t9;a2itu2;diction,mi0Droga7ss relea0D;a9ebisci2;q26te,y1;cn5e9g;!r;armaci37otocoH;dest0ncil,r9t0;cen3Fsp3G;nAr2Qte9;!nt;el2Qop3;bj3CcApia2rde0thers,ve9wn1;n,rview;cu9e0E;pi1;aAit23ot9umb1;a24hi8;n28rra7;aFeEiDoAu9é0F;m0Rr0;mAnopo3pPrni8sq1Ot9u12;h1i34;!my;li0Vn08;d5nu,t0;mm0nd11te9yf3;ri0;aurea2iAu9;ddi2nch;ght bulb,p0C;ey9ittL;!no2;cAdices,itia7se6te4vert9;eb1L;en7ide4;aJeaFighDo9uman right,ygie10;le,meAsp1Jtb9;ed;! r9;un; scho12ri9;se;dAv9;en; start,pho9;ne;m,ndful,ze;aHeFirl1KlaQoErAu9;l3y;an9enadi1id;a16d9; slam,fa9mo9;th1;d,lf1;lat0Dntlem9;an;df3r9;l5n1D;aHeGiElDol3rAun9;er0;ee market,iAon9;ti1;e16ga2;ame,u2;nan9ref3;ci1;lla,t14;br5mi3n0Uth1;conoEffDgg,lecto0MnCs1Xth5venBxAyel9;id;ampTempl0Ite4;i8t;er1K;e6i1J;my;adKeGiDoAr9u0P;agonf3i1;cAg1Fi3or,ssi1wn9;si0M;to0BumenB;ale6gniAnn1s9vide0O;conte4incen7tri6;ta0A;aBc0fAni0te9;c7rre4;ault 05err0;th;!dy;aXeVhOiNlLoDr9;edit cBit5uc9;ib9;le;ard;efficFke,lDmmuniqNnBpi1rr0t11u9yo2;ri1s9;in;ne6s9;ervatoVuI;ic,lQum9;ni0L;ie4;er9ie4;gy,ic;ty,vil wL;aDeqCocoBr9;istmas car9ysanthemum;ol;la2;ue;ndeli1racter9;ist5;ili8llDr9;e0tifica2;hi1naFpErCshi1t9ucus;erpi9hedr0;ll9;ar;bohyd9ri1;ra2;it0;ry;aPeOiMlemLoHrDu9;ddhiYnBr9tterf3;glar9i0;!y;ny;eakBiAo9;!th1;de;faRthroC;dy,g,roBwl,y9;!frie9;nd;ugh;ish;cyc9oH;liK;an,l3;nki8r9;!ri1;er;ng;cTdNllLnIppeti2rray,sFtBu9;nt,to9;psy;hAt5;ic;ie9le2;st;ce4pe6;ct;nt;ecAoma3tiA;ly;do2;er9y;gy; hominDjAvan9;tage;ec7;ti9;ve;em;cru0eAqui9;tt0;ta2;te;al',
        Preposition:
          "true¦'o,-,aLbIcHdGexcept,fFinEmid,notwithstandiRoCpSqua,sBt7u4v2w0;/o,hereNith0;!in,oR;ersus,i0;a,s-a-vis;n1p0;!on;like,til;h0ill,owards;an,r0;ough0u;!oI;ans,ince,o that;',f0n1ut;!f;!to;or,rom;espite,own,u3;hez,irca;ar1e0oAy;sides,tween;ri6;',bo7cross,ft6lo5m3propos,round,s1t0;!op;! long 0;as;id0ong0;!st;ng;er;ut",
        SportsTeam:
          'true¦0:1A;1:1H;2:1G;a1Eb16c0Td0Kfc dallas,g0Ihouston 0Hindiana0Gjacksonville jagua0k0El0Bm01newToQpJqueens parkIreal salt lake,sAt5utah jazz,vancouver whitecaps,w3yW;ashington 3est ham0Rh10;natio1Oredski2wizar0W;ampa bay 6e5o3;ronto 3ttenham hotspur;blue ja0Mrapto0;nnessee tita2xasC;buccanee0ra0K;a7eattle 5heffield0Kporting kansas0Wt3;. louis 3oke0V;c1Frams;marine0s3;eah15ounG;cramento Rn 3;antonio spu0diego 3francisco gJjose earthquak1;char08paA; ran07;a8h5ittsburgh 4ortland t3;imbe0rail blaze0;pirat1steele0;il3oenix su2;adelphia 3li1;eagl1philNunE;dr1;akland 3klahoma city thunder,rlando magic;athle0Mrai3;de0; 3castle01;england 7orleans 6york 3;city fc,g4je0FknXme0Fred bul0Yy3;anke1;ian0D;pelica2sain0C;patrio0Brevolut3;ion;anchester Be9i3ontreal impact;ami 7lwaukee b6nnesota 3;t4u0Fvi3;kings;imberwolv1wi2;rewe0uc0K;dolphi2heat,marli2;mphis grizz3ts;li1;cXu08;a4eicesterVos angeles 3;clippe0dodDla9; galaxy,ke0;ansas city 3nE;chiefs,roya0E; pace0polis colU;astr06dynamo,rockeTtexa2;olden state warrio0reen bay pac3;ke0;.c.Aallas 7e3i05od5;nver 5troit 3;lio2pisto2ti3;ge0;broncZnuggeM;cowbo4maver3;ic00;ys; uQ;arCelKh8incinnati 6leveland 5ol3;orado r3umbus crew sc;api5ocki1;brow2cavalie0india2;bengaWre3;ds;arlotte horAicago 3;b4cubs,fire,wh3;iteB;ea0ulR;diff3olina panthe0; c3;ity;altimore 9lackburn rove0oston 5rooklyn 3uffalo bilN;ne3;ts;cel4red3; sox;tics;rs;oriol1rave2;rizona Ast8tlanta 3;brav1falco2h4u3;nited;aw9;ns;es;on villa,r3;os;c5di3;amondbac3;ks;ardi3;na3;ls',
        Uncountable:
          'true¦0:2S;1:1Z;2:27;a2Gb27c1Xd1Oe1Gf1Ag13h0Wi0Pj0Ok0Nl0Im08n06o05pZrUsIt9v7w3;a5i4oo3;d,l;ldlife,ne;rm8t2;ernacul1Ui3;neg1Tol0Otae;eAh9oothpas1Nr4un3yranny;a,gst1V;aff29ea18o4ue nor3;th;oZu3;ble3se1Ft;!shoot1X;ermod2Cund2;a,nnis;aCcene0JeBhAil9ki8o7p6t4u3weepstak1;g1Inshi12;ati02e3;am,el;ace24eci1;ap,cc2;n,ttl1;k,v2;eep,ingl1;na15ri1;d0Ofe1Wl3nd,t0C;m1Lt;a6e4ic3;e,ke0W;c3laxa0Tsearch;ogni0Srea0S;bi1in;aWe7hys0last1Lo5re3;amble,mis1s3ten1L;en1Ksu0D;l3rk;it0yC;a1Ptr07;bstetr0vercrowd17xyg10;a3ews;il polXtional securi1H;aAe8o5u3;m3s1B;ps;n3o1A;ey,o3;gamy;a3chan0rchandi17tallurgy;sl1t;chine3themat0; learn0Vry;aught2e6i5ogi4u3;ck,g0X;c,st0;ce,ghtn0Rngui1AteraSv2;ath2isuSss;ara09indergart0Inowled0U;azz,ewelD;ce,gnor8mp5n3;formaZter3;net,sta05;a3ort5;ti3;en0Z;an0Y;a6eIisto5o3;ckey,mework,ne3rserad7spitali0R;s0Qy;ry;ir,libYppiGs3;h3te;ish;ene6l5o4r3um,ymna0S;aDeed;lf,re;utZyce0D; 3t0;edit04po3;ol;aMicFlour,o5urni3;tu3;re;od,rgive3uri2wl;ne3;ss;conom0duca9lectr8n6quip7th0very4xper3;ti04;body,o3thU;ne;joy3tertain3;ment;ici02on0;tiR;e9i6o4raugh3ynas00;ts;pe,wnstai3;rs;abet1s3;honUrepu3;te;b3miQ;ut;aBelciAh7iv0l5o3urrency;al,ld w3nfusiGral,ttGusco9;ar;ass0oth1;es;aos,e4ick3;en;eHw8;us;d,rJ;a8eef,i6lood,read,u3;nt4tt2;er;ing;lliarEs3;on;g3ss;ga3;ge;cEdviDeroBirAm6ni5ppeal court,rithmet4spi3thlet0;rin;ic;se;en5n3;es3;ty;ds;craft;b0d3naut0;ynam0;ce;id,ou3;st0;ics',
        'Person|Noun':
          'true¦a07b01cYdRePfOgMhJjFkClBm9olive,p6r3s2trini00v0wang;an,enus,iol0;a,et;ky,on5umm03;ay,e1o0uby;b9d,se;ed,x;atQe0ol;aIn0;ny;a0eloTiles;x,ya;aBeo,iG;elv1i0;ng,tM;in;a2e1o0;lDy;an,w3;de,smi4y;a0iKol8;ll,z0;el;ail,e0;ne;aith,ern,lo;a0dDmir,ula,ve;rl;a4e3i1ol0;ly;ck,x0;ie;an,ja;i0wn;sy;h0liff,rystal;ari0in,ristian;ty;ak4e3i2r0;an0ook;dy;ll;nedict,rg;er;l0rt;fredo,ma',
        'Noun|Gerund':
          'true¦0:26;1:25;2:1W;3:1I;4:1Y;a24b1Nc1Bd15en13f0Xg0Vh0Si0Qjog1Zk0Ol0Km0Hn0Fo0Bp04ques07rVsFtAunder9volunt14w5yCzo2;a7ed1Ri3or6r5;ap1Nest1Bi1;ki0r1N;i1r2s1Ttc1T;st1Mta4;al4e8hin4i7ra5y1J;c4di0i2v5;el15;mi0p1G;a1Xs1;ai12cHeGhEin1OkatClYmo4nowBpeAt8u6w5;ea3im1T;f01r5;fi0vi0I;a1Kretc1Iu5;d1AfI;l0Wn1B;b6i0;eb5i0;oar18;ip14o5;rte2u1;a1r09t1;h6o3re5;a1Ge2;edu0Noo0N;aCe8i11o6u5;li0n2;o5wi0;fi0;a7c6hear1Cnde3por1struct5;r1Au3;or0Vyc0G;di0so2;p0Qti0;aAeacek9la8o6r5ublis0X;a0Peten0Rin1oces16;iso2si5;tio2;n2yi0;ee0K;cka0Tin1rt0K;f7pe6rgani5vula1;si0zi0;ni0ra1;fe3;e5ur0W;gotia1twor4;a6e5i2onito3;e1ssa0L;nufactu3rke1;a7ea6i5od0Jyi0;cen0Qf1s1;r2si0;n09ug0E;i5n0J;c4lS;ci0magi2n5ro2;nova1terac1;andPea1i6o5un1;l03wO;ki0ri0;athe3rie5ui01;vi0;ar0CenHi7l6or5ros1unZ;ecas1mat1;ir1ooX;l6n5;anDdi0;i0li0;di0gin5;ee3;a8eba1irec1o7r5umO;awi0es05i5;n4vi0;ub1wnloaO;n5ti0;ci0;aEelebra1hClAo7r5ur6;aw5osZ;li0;a6di0lo3mplai2n5o4pi0ve3;duc1sul1;cLti0;apCea3imHo5ubH;ni0tJ;a5ee3;n1t1;m8s1te3;ri0;aIeFitDlCoAr8u5;il8ll6r5;pi0;yi0;an5;di0;a1m5o4;bi0;esGoa1;c5i0;hi0;gin2lon5t1;gi0;ni0;bys6c4ki0;ki0;it1;c8dverti7gi0rg6ssu5;mi0;ui0;si0;coun1ti0;ti0;ng',
        Unit: 'true¦0:0X;a0Sb0Qc0Cd0Bex0Af07g04he02in0Ljoule0kVlSmInHoGpDquart0square 9t5volts,w4y2ze3°1µs;c,f,n;a0Dd0Jears old,o1;tt07;att0b;able3e2on1;!ne0;a1r03;spoY;c0Ad09f3i07kilo0Bm1ya06;e0Eil1;e0li09;eet0o05;ascals,e2i1ou0I;c0Fnt0;rcent,tV;hms,uS;an0CewtP;/s,e6i1m²,²,³;/h,cro4l1;e1li03;! pFs 1²;anFpE;g02s07;gMter1;! 2s1;! 1;per second;it2u1;men0x;er0re0;elvins,ilo2m1nM;/h,²;byUgSmeter1;! p2s1;! p1;er1; hour;ct1rtz0;aTogM;all2ig6ra1;in0m0;on0;a2emtMluid ou1tE;nce0;hrenheit,rad0;abyH;eciCmA;arat0eAm9oulomb0u1;bic 1p0;c5d4fo3i2meAya1;rd0;nch0;ot0;eci2;enti1;me4;²,³;lsius,nti1;g2li1me1;ter0;ram0;bl,y1;te0;c4tt1;os1;eco1;nd0;re0;!s',
        'Adj|Noun':
          'true¦0:0S;a0Rb0Mc0Cde0Be06f00gZhomel08iXjuWlVmPnOoNpMrJsBt7u4va2w1;atershed,elcome;gabo4nilla,ria1;b0Dnt;ndergr1pstairs;adua0Jou1;nd;a3e1oken,ri0;en,r1;min0ror0B;boo,n;e6istZo4qua3ta2u1;bordina0Cper6;b03ndard;re,t;cial05l1;e,ve0G;cret,n1ri0;ior;e1outiIubbish;ar,laUnt0p1;resentaTublican;atie0Aeriodic0otenti0rincip0;ffiYpposi01v0;agging,ovel;aRe4in3o1;biQdernUr1;al,t0;iature,or;di1tr04;an,um;attFiber0;stice,veniK;de0mpressionNn1;cumbeYdividu0noXstaY;enious,old;a4e2i1luid;ne;llow,m1;aDinH;t,vo1;riJuriJ;l3pRx1;c1ecu7pM;ess;d1iF;er;mographMriva3;hiDlassLo1rude;m4n2opera1;tive;cre9stitueHtemporary,vertab1;le;m2p1;anion,lex;er2un1;ist;ci0;lank,o4r1;i2u1;te;ef;ttom,urgeois;cadem6d3l2nim0rab;al;ert;oles1ult;ce1;nt;ic',
        ProperNoun:
          'true¦barbie,c4diego,e3f2kirby,m0nis,riel;ercedes,i0;ckey,ssy;inn,ranco;lmo,uro;atalina,hristi',
        Ordinal:
          'true¦eBf7nin5s3t0zeroE;enDhir1we0;lfCn7;d,t3;e0ixt8;cond,vent7;et0th;e6ie7;i2o0;r0urt3;tie4;ft1rst;ight0lev1;e0h,ie1;en0;th',
        Cardinal:
          'true¦bEeBf5mEnine7one,s4t0zero;en,h2rDw0;e0o;lve,n5;irt6ousands,ree;even2ix2;i3o0;r1ur0;!t2;ty;ft0ve;e2y;ight0lev1;!e0y;en;illions',
        Multiple: 'true¦b3hundred,m3qu2se1t0;housand,r2;pt1xt1;adr0int0;illion',
        City: 'true¦0:6Y;1:5Y;2:6D;3:5R;4:5O;a65b50c4Fd45e41f3Tg3Eh36i2Xj2Sk2Bl20m1In18o15p0Tq0Rr0Ks01tPuOvLwDxiBy9z5;a7h5i4Juri4L;a5e5ongsh0;ng3E;greb,nzib5D;ang2e5okoha3Punfu;katerin3Erev0;a5n0N;m5En;arsBeAi6roclBu5;h0xi,zh5M;c7n5;d5nipeg,terth4;hoek,s1I;hi5Wkl37;l60xford;aw;a6ern2i5ladivost5Jolgogr6F;en3lni6M;lenc4Vncouv3Rr3ughn;lan bat1Brumqi,trecht;aDbilisi,eCheBi9o8r7u5;l1Zn60r5;in,ku;ipoli,ondh5Z;kyo,m2Zron1OulouS;an5jua3l2Umisoa69ra3;j4Ushui; hag60ssaloni2I;gucigal26hr0l av1U;briz,i6llinn,mpe57ng5rtu,shk2S;i3Fsh0;an,chu1n0p2Fyu0;aEeDh8kopje,owe1Gt7u5;ra5zh4Y;ba0Ht;aten is56ockholm,rasbou65uttga2W;an8e6i5;jiazhua1llo1m5Vy0;f51n5;ya1zh4I;gh3Lt4R;att46o1Wv45;cramen16int ClBn5o paulo,ppo3Srajevo; 7aa,t5;a 5o domin3F;a3fe,m1M;antonBdie3Dfrancisco,j5ped3Osalvad0K;o5u0;se;em,z26;lou57peters25;aAe9i7o5;me,sar5t58;io;ga,o5yadh;! de janei3F;cife,ykjavik;b4Sip4lei2Inc2Pwalpindi;ingdao,u5;ez2i0P;aEeDhCiBo8r7u6yong5;ya1;eb56ya1;ag50etor3M;rt5zn0; 5la4Do;au prin0Melizabe25sa04;ls3Qrae58tts27;iladelph3Hnom pe1Boenix;r22tah tik3F;lerZnaji,r4Nt5;na,r33;ak45des0Km1Nr6s5ttawa;a3Wlo;an,d06;a7ew5ing2Govosibir1Kyc; 5cast37;del25orlea45taip15;g8iro4Un5pl2Xshv34v0;ch6ji1t5;es,o1;a1o1;a6o5p4;ya;no,sa0X;aFeCi9o6u5;mb2Bni27sc3Z;gadishu,nt6s5;c14ul;evideo,re30;ami,l6n15s5;kolc,sissauga;an,waukee;cca,d5lbour2Nmph40ndo1D;an,ell5i3;in,ín;cau,drAkass2Sl9n8r5shh47;aca6ib5rakesh,se2L;or;i1Sy;a4BchEdal0Zi44;mo;id;aCeiAi8o6u5vRy2;anLckn0Odhia3;n5s angel26;d2g bea1N;brev2Be3Jma5nz,sb2verpo28;!ss27;c5pzig;est17; p6g5ho2Xn0Dusan25;os;az,la34;aHharFiClaipeBo9rak0Eu7y5;iv,o5;to;ala lump4n5;mi1sh0;hi0Ilka2Ypavog4si5wlo2;ce;da;ev,n5rkuk;gst2sha5;sa;k5toum;iv;bIdu3llakuric0Rmpa3Dn6ohsiu1ra5un1Jwaguc0R;c0Qj;d5o,p4;ah1Uy;a7e6i5ohannesW;l1Wn0;dd34rusalem;ip4k5;ar2I;bad0mph1PnBrkutVs8taYz5̇zm7;m6tapala5;pa;ir;fah0l6tanb5;ul;am2Wi2H;che2d5;ianap2Ko20;aAe7o5yder2T; chi mi5ms,nolulu;nh;f6lsin5rakli2;ki;ei;ifa,lifax,mCn5rb1Dva3;g8nov01oi;aFdanEenDhCiPlasgBo9raz,u5;a5jr23;dal6ng5yaquil;zh1J;aja2Lupe;ld coa1Athen5;bu2P;ow;ent;e0Uoa;sk;lw7n5za;dhi5gt1E;nag0U;ay;aisal26es,o8r6ukuya5;ma;ankfu5esno;rt;rt5sh0; wor6ale5;za;th;d5indhov0Pl paso;in5mont2;bur5;gh;aBe8ha0Xisp4o7resd0Lu5;b5esseldorf,rb0shanbe;ai,l0I;ha,nggu0rtmu13;hradSl6nv5troit;er;hi;donghIe6k09l5masc1Wr es sala1IugavpiY;i0lU;gu,je2;aJebu,hAleve0Vo5raio02uriti1N;lo7n6penhag0Ar5;do1Lk;akKst0V;gUm5;bo;aBen8i6ongqi1ristchur5;ch;ang m7ca5ttago1;go;g6n5;ai;du,zho1;ng5ttogr12;ch8sha,zh07;i9lga8mayenJn6pe town,r5;acCdiff;ber17c5;un;ry;ro;aVeNhKirmingh0UoJr9u5;chareSdapeSenos air7r5s0tu0;g5sa;as;es;a9is6usse5;ls;ba6t5;ol;ne;sil8tisla7zzav5;il5;le;va;ia;goZst2;op6ubaneshw5;ar;al;iBl9ng8r5;g6l5n;in;en;aluru,hazi;fa5grade,o horizonte;st;ji1rut;ghd09kGnAot9r7s6yan n4;ur;el,r05;celo3ranquil07;na;ou;du1g6ja lu5;ka;alo6k5;ok;re;ng;ers5u;field;a02bZccYddis abaXgartaWhmedUizawl,lQmNnHqaXrEsBt7uck5;la5;nd;he7l5;an5;ta;ns;h5unci2;dod,gab5;at;li5;ngt2;on;a6chora5kaLtwerp;ge;h7p5;ol5;is;eim;aravati,m0s5;terd5;am; 6buquerq5eppo,giers,maty;ue;basrah al qadim5mawsil al jadid5;ah;ab5;ad;la;ba;ra;idj0u dha5;bi;an;lbo6rh5;us;rg',
        Region:
          'true¦0:2N;1:2T;2:2K;a2Qb2Dc1Zd1Ues1Tf1Rg1Lh1Hi1Cj18k13l10m0Pn07o05pZqWrTsKtFuCv9w5y3zacatec2U;akut0o0Du3;cat2k07;a4est 3isconsin,yomi1M;bengal,vi6;rwick2Bshington3;! dc;er4i3;rgin0;acruz,mont;dmurt0t3;ah,tar3; 2La0X;a5e4laxca1Rripu1Xu3;scaDva;langa1nnessee,x2F;bas0Vm3smNtar25;aulip2Dil nadu;a8i6o4taf11u3ylh1F;ffYrr04s1A;me1Cno1Quth 3;cVdU;ber0c3kkim,naloa;hu2ily;n4skatchew2xo3;ny; luis potosi,ta catari1;a3hode9;j3ngp07;asth2shahi;ingh25u3;e3intana roo;bec,en5reta0R;ara7e5rince edward3unjab; i3;sl0B;i,nnsylv3rnambu0B;an0;!na;axa0Ydisha,h3klaho20ntar3reg6ss0Bx0G;io;aJeDo5u3;evo le3nav0W;on;r3tt17va scot0;f8mandy,th3; 3ampton16;c5d4yo3;rk14;ako1N;aroli1;olk;bras1Mva0Cw3; 4foundland3;! and labrador;brunswick,hamp0Xjers4mexiSyork3;! state;ey;galOyarit;a9eghala0Mi5o3;nta1r3;dov0elos;ch5dlanCn4ss3zor11;issippi,ouri;as geraOneso18;ig2oac2;dhy12harasht0Gine,ni4r3ssachusetts;anhao,i el,ylF;p3toba;ur;anca0Ie3incoln0IouisH;e3iR;ds;a5e4h3omi;aka06ul1;ntucky,ra01;bardino,lmyk0ns0Qr3;achay,el0nata0X;alis5har3iangxi;kh3;and;co;daho,llino6n3owa;d4gush3;et0;ia1;is;a5ert4i3un2;dalFm0D;fordZ;mpYrya1waii;ansu,eorg0lou7oa,u3;an4erre3izhou,jarat;ro;ajuato,gdo3;ng;cesterS;lori3uji2;da;sex;ageTe6o4uran3;go;rs3;et;lawaLrbyK;aEeaDh8o3rimea ,umbr0;ahui6l5nnectic4rsi3ventry;ca;ut;i02orado;la;e4hattisgarh,i3uvash0;apQhuahua;chn4rke3;ss0;ya;ra;lFm3;bridge6peche;a8ihar,r7u3;ck3ryat0;ingham3;shi3;re;emen,itish columb0;h0ja cal7lk6s3v6;hkorto3que;st2;an;ar0;iforn0;ia;dygea,guascalientes,lAndhr8r4ss3;am;izo1kans4un3;achal 6;as;na;a 3;pradesh;a5ber4t3;ai;ta;ba4s3;ka;ma',
        Country:
          "true¦0:39;1:2M;a2Xb2Ec22d1Ye1Sf1Mg1Ch1Ai14j12k0Zl0Um0Gn05om3DpZqat1KrXsKtCu6v4wal3yemTz2;a25imbabwe;es,lis and futu2Y;a2enezue32ietnam;nuatu,tican city;.5gTkraiZnited 3ruXs2zbeE;a,sr;arab emirat0Kkingdom,states2;! of am2Y;k.,s.2; 28a.;a7haBimor-les0Bo6rinidad4u2;nis0rk2valu;ey,me2Ys and caic1U; and 2-2;toba1K;go,kel0Znga;iw2Wji2nz2S;ki2U;aCcotl1eBi8lov7o5pa2Cri lanka,u4w2yr0;az2ed9itzerl1;il1;d2Rriname;lomon1Wmal0uth 2;afr2JkLsud2P;ak0en0;erra leoEn2;gapo1Xt maart2;en;negKrb0ychellY;int 2moa,n marino,udi arab0;hele25luc0mart20;epublic of ir0Dom2Duss0w2;an26;a3eHhilippinTitcairn1Lo2uerto riM;l1rtugE;ki2Cl3nama,pua new0Ura2;gu6;au,esti2;ne;aAe8i6or2;folk1Hth3w2;ay; k2ern mariana1C;or0N;caragua,ger2ue;!ia;p2ther19w zeal1;al;mib0u2;ru;a6exi5icro0Ao2yanm05;ldova,n2roc4zamb9;a3gol0t2;enegro,serrat;co;c9dagasc00l6r4urit3yot2;te;an0i15;shall0Wtin2;ique;a3div2i,ta;es;wi,ys0;ao,ed01;a5e4i2uxembourg;b2echtenste11thu1F;er0ya;ban0Hsotho;os,tv0;azakh1Ee3iriba03o2uwait,yrgyz1E;rWsovo;eling0Jnya;a2erF;ma15p1B;c6nd5r3s2taly,vory coast;le of m19rael;a2el1;n,q;ia,oI;el1;aiSon2ungary;dur0Mg kong;aAermany,ha0Pibralt9re7u2;a5ern4inea2ya0O;!-biss2;au;sey;deloupe,m,tema0P;e2na0M;ce,nl1;ar;bTmb0;a6i5r2;ance,ench 2;guia0Dpoly2;nes0;ji,nl1;lklandTroeT;ast tim6cu5gypt,l salv5ngl1quatorial3ritr4st2thiop0;on0; guin2;ea;ad2;or;enmark,jibou4ominica3r con2;go;!n B;ti;aAentral african 9h7o4roat0u3yprQzech2; 8ia;ba,racao;c3lo2morPngo-brazzaville,okFsta r03te d'ivoiK;mb0;osD;i2ristmasF;le,na;republic;m2naTpe verde,yman9;bod0ero2;on;aFeChut00o8r4u2;lgar0r2;kina faso,ma,undi;azil,itish 2unei;virgin2; is2;lands;liv0nai4snia and herzegoviGtswaGuvet2; isl1;and;re;l2n7rmuF;ar2gium,ize;us;h3ngladesh,rbad2;os;am3ra2;in;as;fghaFlCmAn5r3ustr2zerbaijH;al0ia;genti2men0uba;na;dorra,g4t2;arct6igua and barbu2;da;o2uil2;la;er2;ica;b2ger0;an0;ia;ni2;st2;an",
        Place:
          'true¦aUbScOdNeMfLgHhGiEjfk,kClAm8new eng7ord,p5s4t2u1vostok,wake is7y0;akutCyz;laanbaatar,pO;ahiti,he 0;bronx,hamptons;akhalFfo,oho,under2yd;acifTek,h0itcairn;l,x;land;a0co,idHuc;gadRlibu,nhattR;a0gw,hr;s,x;osrae,rasnoyar0ul;sk;ax,cn,nd0st;ianKochina;arlem,kg,nd,ovd;ay village,re0;at 0enwich;brita0lakB;in;co,ra;urope,verglad8;en,fw,own2xb;dg,gk,h0lt;a1ina0uuk;town;morro,tham;cn,e0kk,rooklyn;l air,verly hills;frica,m7n2r3sia,tl1zor0;es;!ant2;adyr,tar0;ct0;ic0; oce0;an;ericas,s',
        WeekDay: 'true¦fri2mon2s1t0wednesd3;hurs1ues1;aturd1und1;!d0;ay0;!s',
        Month: 'true¦dec0february,july,nov0octo1sept0;em0;ber',
        Date: 'true¦ago,t0week end,yesterd2;mr2o0;d0morrow;ay;!w',
        Duration:
          'true¦century,dAh9m6q5se4w1y0;ear,r;eek1k0;!s;!e4;ason,c;tr,uarter;i0onth;lliseco0nute;nd;our,r;ay,ecade',
        FemaleName:
          'true¦0:IT;1:IX;2:I5;3:I6;4:IN;5:IA;6:JE;7:GR;8:JA;9:J6;A:HE;B:HO;C:IF;D:J3;E:IJ;F:H3;G:C5;H:HQ;aGJbFEcDKdCTeBJfB0gA9h9Pi9Cj8Bk7Bl5Vm45n3Jo3Fp33qu32r2As15t0Eu0Cv03wWxiUyPzI;aMeJineb,oIsof3;e3Qf3la,ra;h2iLlJna,ynI;ab,ep;da,ma;da,h2iIra;nab;aLeKi0FolB4uJvI;etAonDI;i0na;le0sen3;el,gm3Fn,rGBs8S;aoIme0nyi;m5XyAA;aNendDShiD9iI;dele9lKnI;if44niIo0;e,f43;a,helmi0lIma;a,ow;ka0nB;aNeKiIusa5;ck81ktoriBHlAole7viI;anGenIR;da,lA6rIs0;a,nIoniGX;a,iFJ;leInesGX;nI9rI;i1y;g9rIxGY;su5te;aZeVhSiOoMrJuIy2;i,la;acIRiIu0L;c3na,sI;hGta;nIr0H;iGya;aKffaEInIs6;a,gtiI;ng;!nFJra;aJeIomasi0;a,l9Mo87res1;l3ndolwethu;g9Do85rJssI;!a,ie;eIi,ri8;sa,za;bPlNmLnJrIs6tia0wa0;a60yn;iIya;a,ka,s6;arGe2iIm75ra;!ka;a,iI;a,t6;at6it6;a0Gcarlet3Te0ChYiUkye,neza0oStOuJyI;bI4lvi1;ha,mayI7ni7sJzI;an3KetAie,y;anIi8;!a,e,nI;aCe;aKeI;fIl5DphI;an4;cHSr5;b3fiA5m0MnIphi1;d2ia,ja,ya;er2lKmon1nJobh8NtI;a,i;dy;lEJv3;aNeJirIo0risF1y5;a,lDF;ba,e0i5lKrI;iIr6Gyl;!d8Ffa;ia,lDR;hd,iNki2nKrJu0w0yI;la,ma,na;i,le9on,ron;aJda,ia,nIon;a,on;!ya;k6mI;!aa;lKrJtaye7ZvI;da,inj;e0ife;en1i0ma;anA2bMd3Kh1PiBkLlKmJnd2rIs6vannaC;aCi0;ant6i2;lDGma,ome;ee0in8Qu2;in1ri0;a05e00hYiVoIuthDE;bTcSghRl8InQsKwJxI;anAWie,y;an,e0;aJeIie,lD; merBKann8ll1marD8t7;!lInn1;iIyn;e,nI;a,dG;da,i,na;ayy8D;hel63io;bDHer7yn;a,cJkImas,nGta,ya;ki,o;helHki;ea,iannG9oI;da,n1L;an0bKemGgi0iJnIta,y0;a88ee;han83na;a,eI;cE7kaC;bi0chJe,i0mo0nIquEHy0;di,ia;aEFelIiB;!e,le;een4ia0;aOeNhLipaluk,oKrIute67;iIudenCN;scil3LyamvaB;lly,rt3;ilome0oebe,ylI;is,lis;ggy,nelope,r5t2;ige,m0UnLo5rvaDDtJulI;a,etAin1;ricIt4T;a,e,ia;do2i07;ctav3dJfCWis6lIphCWumC0yunbileg;a,ga,iv3;eIvAB;l3tA;aXeViNoJurIy5;!ay,ul;a,eKor,rJuI;f,r;aCeEma;ll1mi;aOcMhariBLkLlaKna,sIta,vi;anIha;ur;!y;a,iDPki;hoHk9UolI;a,eDG;!mh;hir,lIna,risFsreE;!a,lBQ;asuMdLh3i6DnKomi8rgELtIzanin zah2;aIhal4;li1s6;cy,etA;e9iER;nngu30;a0Ackenz4e02iNoKrignayani,uriDAyI;a,rI;a,lOna,tH;bi0i2llBFnI;a,iI;ca,ka,qD0;a,cUkaTlOmi,nMrJtzi,yI;ar;aJiam,lI;anEK;!l,nB;dy,eIh,n4;nhHrva;aLdKiCMlI;iIy;cent,e;red;!gros;!e5;ae5hI;ae5el40;ag5FgOi,lLrI;edi79iJjem,on,yI;em,l;em,sF;an4iIliF;nIsCB;a,da;!an,han;b0DcAPd0Be,g09ha,i08ja,l06n04rMsoum60tLuJv82x9HyIz4;bell,ra,soB6;de,rI;a,eE;h8Eild1t4;a,cYgUiLjor4l7Sn4s6tKwa,yI;!aIbe6Wja9lAB;m,nBE;a,ha,in1;!aKbC8eJja,lDna,sIt64;!a,ol,sa;!l1H;! Kh,mJnI;!a,e,n1;!awit,i;aliAEcJeduarBfern5GjIlui5Y;o6Ful3;ecil3la2;arKeJie,oIr46ueriA;!t;!ry;et44i39;el4Wi77y;dIon,ue5;akran7y;ak,en,iIlo3Q;a,ka,nB;a,re,s4te;daIg4;!l3C;alDd4elIge,isD8on0;ei9in1yn;el,le;a0Oe0DiZoRuMyI;d3la,nI;!a,dJeBEnIsCI;!a,eBD;a,sCG;aCTcKel0QiFlJna,pIz;e,i7;a,u,wa;iIy;a0Te,ja,l2LnB;is,l1TrKttJuIvel4;el5is1;e,ie;aLeJi8na,rI;a86i8;lIn1t7;ei;!in1;aTbb9AdSepa,lNnKsJv3zI;!a,be5MetAz4;a,etA;!a,dI;a,sIy;ay,ey,i,y;a,iKja,lI;iIy;a9Ye;!aI;!nG;ia,ya;!nI;!a,ne;aQda,e0iOjZla,nNoLsKtIx4y5;iIt4;c3t3;e2NlCD;la,nIra;a,ie,o2;a,or1;a,gh,laI;!ni;!h,nI;a,d2e,n5Q;cPdon95iOkes6mi98na,rNtKurJvIxmi,y5;ern1in3;a,e55ie,yn;as6iJoI;nya,ya;fa,s6;a,isF;a,la;ey,ie,y;a05e00hYiPlAHoOrKyI;lIra;a,ee,ie;istIy6D;a,en,iJyI;!na;!e,n5A;nul,ri,urtnAX;aPerOlAWmKrIzzy;a,stI;en,in;!berlJmernI;aq;eIi,y;e,y;a,stE;!na,ra;aIei2ongordzol;dij1w5;el7OiLjsi,lKnJrI;a,i,ri;d2na,za;ey,i,lBAs4y;ra,s6;bi7cAGdiat7GeAZiSlRmQnyakuma1BrOss6JtLvi7yI;!e,lI;a,eI;e,i8J;a6DeJhIi4OlDri0y;ar6Ber6Bie,leErAZy;!lyn8Eri0;a,en,iIl5Soli0yn;!ma,nGsF;a5il1;ei8Ci,l4;a,tl6K;a09eZiWoOuI;anMdLliIst63;a8FeIsF;!n9tI;!a,te;e5Ji3Ky;a,i7;!anOcelDdNelHhan7PleMni,sJva0yI;a,ce;eIie;fIlDph5U;a,in1;en,n1;i8y;!a,e,n42;lIng;!i1ElI;!i1D;anOle0nLrKsI;i8AsI;!e,i89;i,ri;!a,elHif2CnI;a,etAiIy;!e,f2A;a,e8BiJnI;a,e8AiI;e,n1;cNda,mi,nJque4WsminGvie2y9zI;min8;a8eJiI;ce,e,n1s;!lIsFt0G;e,le;inJk4lDquelI;in1yn;da,ta;da,lSmQnPo0rOsJvaIzaro;!a0lu,na;aKiJlaIob81;!n9J;do2;belIdo2;!a,e,l39;a74en1i0ma;di2es,gr6Vji;a9elBogI;en1;a,e9iIo0se;a0na;aTePiKoIusFyacin2B;da,ll4rten23snI;a,i9M;lJmaI;ri;aJdIlaJ;a,egard;ry;ath1CiKlJnriet7rmi9sI;sa,t1B;en2Sga,mi;di;bi2Dil8ElOnNrKsJtIwa,yl8E;i5Pt4;n5Vti;iImo4Zri50;etI;!te;aCnaC;a,ey,l4;a04eYiTlRoPrLunKwI;enIyne1Q;!dolD;ay,el;acJetIiselB;a,chE;e,ieI;!la;ld1AogooI;sh;adys,enIor3yn2H;a,da,na;aLgi,lJna,ov85selIta;a,e,le;da,liI;an;!n0;mMnKorgJrI;ald3Oi,m3Btru87;etAi4T;a,eIna;s26vieve;ma;bJle,mIrnet,yH;al5Ki5;i5CrielI;a,l1;aVeSiRlorPoz3rI;anKeJiI;da,eB;da,ja;!cI;esJiIoi0O;n1s5Y;!ca;a,encI;e,ia;en,o0;lJn0rnI;anB;ec3ic3;jr,n7rLtIy8;emJiIma,ouma7;ha,ma,n;eh;ah,iBrah,za0;cr4Ld0Oe0Ni0Mk7l05mXn4WrUsOtNuMvI;aKelJiI;!e,ta;inGyn;!ngel2S;geni1ni43;h5Qta;mMperanLtI;eJhIrel5;er;l2Zr8;za;a,eralB;iIma,nest2Jyn;cIka,n;a,ka;a,eNiKmI;aIie,y;!li9;lIn1;ee,iIy;a,e,ja;lIrald;da,y;aXeViOlNma,no2oLsKvI;a,iI;na,ra;a,ie;iIuiI;se;a,en,ie,y;a0c3da,f,nNsKzaI;!betIve7;e,h;aIe,ka;!beI;th;!a,or;anor,nG;!a;!in1na;leEs6;vi;eJiIna,wi0;e,th;l,n;aZeNh3iMjeneLoI;lor5Qminiq4Gn3DrItt4;a,eEis,la,othIthy;ea,y;ba;an0AnaCon9ya;anRbQde,ePiNlKmetr3nIsir5H;a,iI;ce,se;a,iJla,orIphi9;es,is;a,l6A;dIrdI;re;!d59na;!b2ForaCraC;a,d2nI;!a,e;hl3i0l0HmOnMphn1rJvi1WyI;le,na;a,by,cJia,lI;a,en1;ey,ie;a,etAiI;!ca,el1Bka,z;arIia;is;a0Se0Oh05i03lVoKristJynI;di,th3;al,i0;lQnNrJurI;tn1E;aKd2MiIn2Mri9;!nI;a,e,n1;!l4;cepci57n4sI;tanIuelo;ce,za;eIleE;en,tA;aKeoJotI;il4Z;!pat2;ir8rKudI;etAiI;a,ne;a,e,iI;ce,s00;a2er2ndI;i,y;aSeOloe,rI;isKyI;stI;al;sy,tI;a1Qen,iIy;an1e,n1;deKlseJrI;!i8yl;a,y;li9;nNrI;isLlJmI;ai9;a,eIotA;n1tA;!sa;d2elHtI;al,elH;cJlI;esAi42;el3ilI;e,ia,y;itlZlYmilXndWrOsMtIy5;aKeKhIri0;erIleErDy;in1;ri0;a32sI;a31ie;a,iOlMmeKolJrI;ie,ol;!e,in1yn;lIn;!a,la;a,eIie,o7y;ne,y;na,sF;a0Hi0H;a,e,l1;is7l4;in,yn;a0Ie02iZlXoUrI;andi8eRiKoJyI;an0nn;nwDoke;an3CdgMg0XtI;n2WtI;!aJnI;ey,i,y;ny;etI;!t8;an0e,nI;da,na;bbi8glarJlo06nI;i7n4;ka;ancIossom,ythe;a,he;an18lja0nIsm3I;i7tI;ou;aVcky,linUni7rQssPtKulaCvI;!erlI;ey,y;hKsy,tI;e,iIy8;e,na;!anI;ie,y;!ie;nIt6yl;adJiI;ce;etAi9;ay,da;!triI;ce,z;rbKyaI;rmI;aa;a2o2ra;a2Sb2Md23g1Zi1Qj5l16m0Xn0Aoi,r05sVtUuQvPwa,yJzI;ra,u0;aLes6gKlJseI;!l;in;un;!nI;a,na;a,i2I;drKgus1RrJsteI;ja;el3;a,ey,i,y;aahua,he0;hJi2Gja,mi7s2DtrI;id;aNlJraqIt21;at;eJi8yI;!n;e,iIy;gh;!nI;ti;iKleJo6pi7;ta;en,n1tA;aIelH;!n1J;a01dje5eZgViTjRnKohito,toIya;inetAnI;el5ia;!aLeJiImK;e,ka;!mItA;ar4;!belJliFmV;sa;!le;a,eliI;ca;ka,sIta;a,sa;elIie;a,iI;a,ca,n1qI;ue;!tA;te;!bJmIstasiNya;ar3;el;aMberLeliKiIy;e,l3naI;!ta;a,ja;!ly;hHiJl3nB;da;a,ra;le;aXba,eQiNlLthKyI;a,c3sI;a,on,sa;ea;iIys0O;e,s0N;a,cJn1sIza;a,e,ha,on,sa;e,ia,ja;c3is6jaLksaLna,sKxI;aIia;!nd2;ia,saI;nd2;ra;ia;i0nJyI;ah,na;a,is,naCoud;la;c6da,leEmOnMsI;haClI;inIyZ;g,n;!h;a,o,slI;ey;ee;en;at6g4nJusI;ti0;es;ie;aXdiUelNrI;eKiI;anNenI;a,e,ne;an0;na;!aMeLiJyI;nn;a,n1;a,e;!ne;!iI;de;e,lDsI;on;yn;!lI;i9yn;ne;aLbJiIrM;!gaL;ey,i8y;!e;gaI;il;dLliyKradhJs6;ha;ya;ah;a,ya',
        FirstName:
          'true¦aLblair,cHdevGgabrieFhinaEjCk9l8m4nelly,quinn,re3s0;h0umit;ay,e0iloh;a,lby;g6ne;a1el0ina,org5;!okuh9;naia,r0;ion,lo;ashawn,uca;asCe1ir0rE;an;lsAnyat2rry;am0ess6ie,ude;ie,m5;ta;le;an,on;as2h0;arl0eyenne;ie;ey,sidy;lex2ndr1ubr0;ey;a,ea;is',
        LastName:
          'true¦0:9F;1:9V;2:9N;3:9X;4:9H;5:8K;6:9K;7:A0;8:9E;9:89;A:77;B:6F;C:6J;a9Ub8Mc7Kd6Xe6Sf6Eg5Vh58i54j4Pk45l3Nm2Sn2Fo27p1Oquispe,r18s0Ft05vVwOxNyGzD;aytsADhD;aDou,u;ng,o;aGeun80iDoshiA9un;!lD;diDmaz;rim,z;maDng;da,guc97mo6UsDzaA;aAhiA7;iao,u;aHeGiEoDright,u;jc8Sng;lDmm0nkl0sniewsA;liA1s3;b0iss,lt0;a5Sgn0lDtanabe;k0sh;aHeGiEoDukB;lk5roby5;dBllalDnogr2Zr10ss0val37;ba,obos;lasEsel7O;lGn dFrg8EsEzD;qu7;ily9Oqu7silj9O;en b35ijk,yk;enzue95verde;aLeix1KhHi2j6ka3IoGrFsui,uD;om4ZrD;c2n0un1;an,embl8TynisA;dor95lst31m4rr9th;at5Mi7MoD;mErD;are6Zlaci64;ps3s0Z;hirBkah8Dnaka;a01chXeUhQiNmKoItFuEvDzabo;en8Aobod34;ar7bot4lliv2zuA;aEein0oD;i67j3Lyan8V;l6rm0;kol5lovy5re6Qsa,to,uD;ng,sa;iDy5Z;rn5tD;!h;l5YmEnDrbu;at8gh;mo6Do6J;aFeDimizu;hu,vchD;en7Cuk;la,r17;gu8mDoh,pulve8Srra4R;jDyD;on5;evi6Filtz,miDneid0roed0ulz,warz;dEtD;!z;!t;ar41h6ito,lFnDr4saAto,v4;ch7d0AtDz;a4Oe,os;as,ihBm3Yo0Q;aOeNiKoGuEyD;a66oo,u;bio,iz,sD;so,u;bEc7Adrigue56g03j72mDosevelt,ssi,ta7Mux,w3Y;a4Be0O;ertsDins3;!on;bei0LcEes,vDzzo;as,e8;ci,hards3;ag2es,it0ut0y9;dFmEnDsmu7Yv5E;tan1;ir7os;ic,u;aSeLhJiGoErDut6;asad,if5Zochazk1V;lishc23pDrti62u54we66;e2Sov47;cEe09nD;as,to;as60hl0;aDillips;k,m,n5K;de39etIna,rGtD;ersErovDtersC;!a,ic;en,on;eDic,ry,ss3;i8ra,tz,z;ers;h70k,rk0tEvD;ic,l3S;el,t2N;bJconnor,g2BlGnei5PrEzD;demir,turk;ella3LtDwe5N;ega,iz;iDof6FsC;vDyn1E;ei8;aPri1;aLeJguy1iFoDune43ym2;rodahl,vDwak;ak3Tik5otn56;eEkolDlsCx3;ic,ov6W;ls1miD;!n1;ils3mD;co41ec;gy,kaEray2varD;ro;jiDmu8shiD;ma;aWcUeQiPoIuD;lGnFrDssoli5S;atDpTr67;i,ov4;oz,te4B;d0l0;h2lIo0GrEsDza0Y;er,s;aFeEiDoz5r3Dte4B;!n6E;au,i8no,t4M;!l9;i2Ql0;crac5Nhhail5kke3Pll0;hmeFij0j2ElEn2Wrci0ssiDyer18;!er;n0Io;dBti;cartDlaughl6;hy;dMe6Dgnu5Ei0jer34kLmJnci59rFtEyD;er,r;ei,ic,su1N;iEkBqu9roqu6tinD;ez,s;a54c,nD;!o;a52mD;ad5;e5Oin1;rig4Os1;aSeMiIoGuEyD;!nch;k4nDo;d,gu;mbarDpe2Rvr4;di;!nDu,yana1S;coln,dD;bDholm;erg;bed5TfeGhtFitn0kaEn6rDw2G;oy;!j;in1on1;bvDvD;re;iDmmy,rsCu,voie;ne,t11;aTennedy,h2iSlQnez47oJrGuEvar2woD;k,n;cerDmar58znets5;a,o2G;aDem0i30yeziu;sni3QvD;ch3V;bay4Frh0Jsk0TvaFwalDzl5;czDsA;yk;cFlD;!cDen3R;huk;!ev4ic,s;e6uiveD;rt;eff0l4mu8nnun1;hn,lloe,minsArEstra32to,ur,yDzl5;a,s0;j0GlsC;aMenLha2Qim0RoEuD;ng,r4;e2KhFnErge2Ku2OvD;anB;es,ss3;anEnsD;en,on,t3;nesDsC;en,s1;ki27s1;cGkob3RnsDrv06;en,sD;enDon;!s;ks3obs1;brahimBglesi3Ake4Ll0DnoZoneFshikEto,vanoD;u,v4A;awa;scu;aPeIitchcock,jaltal6oFrist46uD;!aDb0gh9ynh;m2ng;a24dz4fEjga2Tk,rDx3B;ak0Yvat;er,fm3B;iGmingw3NnErD;nand7re8;dDriks1;ers3;kkiEnD;on1;la,n1;dz4g1lvoLmJnsCqIrr0SsFuEyD;as36es;g1ng;anEhiD;mo0Q;i,ov08;ue;alaD;in1;rs1;aNeorgMheorghe,iKjonJoGrEuDw3;o,staf2Utierr7zm2;ayDg4iffitVub0;li1H;lub3Rme0JnEodD;e,m2;calv9zale0H;aj,i;l,mDordaL;en7;iev3A;gnJlGmaFnd2Mo,rDs2Muthi0;cDza;ia;ge;eaElD;agh0i,o;no;e,on;ab0erLiHjeldsted,lor9oFriedm2uD;cDent9ji3E;hs;ntaDrt6st0urni0;na;lipEsD;ch0;ovD;!ic;hatBnanFrD;arDei8;a,i;deS;ov4;dGinste6riksCsDva0D;cob2YpDtra2W;inoza,osiL;en,s3;er,is3wards;aUeMiKjurhuJoHrisco0ZuEvorakD;!oQ;arte,boEmitru,rDt2U;and,ic;is;g2he0Imingu7n2Ord1AtD;to;us;aDmitr29ssanayake;s,z; GbnaFlEmirDrvis1Lvi,w2;!ov4;gado,ic;th;bo0groot,jo04lEsilDvri9;va;a cruz,e3uD;ca;hl,mcevsAnEt2EviD;d5es,s;ieDku1S;ls1;ki;a06e01hOiobNlarkMoFrD;ivDuz;elli;h1lHntGoFrDs26x;byn,reD;a,ia;ke,p0;i,rer0N;em2liD;ns;!e;anu;aLeIiu,oGriDuJwe;stD;eDiaD;ns1;i,ng,uFwDy;!dhury;!n,onEuD;ng;!g;kEnDpm2tterjee,v7;!d,g;ma,raboD;rty;bGl08ng4rD;eghetEnD;a,y;ti;an,ota0L;cer9lder3mpbeIrFstDvadi07;iDro;llo;doEt0uDvalho;so;so,zo;ll;es;a08eWhTiRlNoGrFyD;rne,tyD;qi;ank5iem,ooks,yant;gdan5nFruya,su,uchEyHziD;c,n5;ard;darDik;enD;ko;ov;aEondD;al;nco,zD;ev4;ancRshwD;as;a01oDuiy2;umDwmD;ik;ckNethov1gu,ktLnJrD;gGisFnD;ascoDds1;ni;ha;er,mD;ann;gtDit7nett;ss3;asD;hi;er,ham;b4ch,ez,hMiley,kk0nHrDu0;bEnDua;es,i0;ieDosa;ri;dDik;a8yopadhyD;ay;ra;er;k,ng;ic;cosZdYguilXkhtXlSnJrGsl2yD;aEd6;in;la;aEsl2;an;ujo,ya;dFgelD;ovD;!a;ersGov,reD;aDjL;ss1;en;en,on,s3;on;eksejGiyGmeiFvD;ar7es;ez;da;ev;ar;ams;ta',
        MaleName:
          'true¦0:DO;1:CP;2:D7;3:AK;4:CL;5:C0;6:CG;7:D3;8:BT;9:AS;A:95;B:DB;C:D4;D:BN;aCAbB8cA8d99e8Jf83g7Gh6Ti6Dj5Fk53l4Fm37n2Uo2Op2Gqu2Er1Ms12t0Gu0Fv08wUxTyJzE;aEor0;cEh9Kkaria,n0C;hFkE;!aC8;ar5VeC7;aMoGuE;sEu2LvBK;if,uf;nGsFusE;ouf,sE;ef;aEg;s,tE;an,h0;hli,nB9ssY;avi3ho4;aNeLiGoEyaBO;jcie88lfgang,odrow,utE;!er;lEnst1;bGey,fredBlE;aB0iE;am,e,s;e98ur;i,nde9sE;!l8t1;lFyE;l1ne;lEt3;a9Yy;aHiEladimir,ojte7V;cFha0kt68nceErgA6va0;!nt;e3Xt66;lentEn9T;inE;!e;ghBFlyss5Anax,sm0;aXeShOiMoIrGuFyE;!l3ro6s1;n7r5A;avAIeEist0oy,um0;ntAAv5Xy;bGd8SmEny;!as,mEoharu;aCCie,y;iAy;mEt5;!my,othy;adGeoFia0KomE;!as;!do8H;!de5;dHrE;en99rE;an98eEy;ll,n97;!dy;dgh,ha,iEnn3req,tsu4S;cAQka;aUcotSeQhMiKoIpenc3tEur1Xylve97zym1;anGeEua86;f0phBDvEwa85;e60ie;!islaw,l8;lom1uE;leyma6ta;dElAm1yabonga;!dhart75n8;aGeE;lErm0;d1t1;h7Lne,qu11un,wn,y6;aEbasti0k2Cl4Qrg4Nth,ymoAF;m5n;!tE;!ie,y;lFmEnti2Gq59ul;!ke5KmDu4;ik,vato7P;aZeVhe9WiRoIuFyE;an,ou;b7EdFf5pe7LssE;!elBJ;ol3Gy;an,bLc63dJel,geIh0landBmHnGry,sFyE;!ce;coe,s;!aA2nD;an,eo;l46r;er79g3n8olfo,riE;go;bDeAR;cEl8;ar6Jc6IhFkEo;!ey,ie,y;a8Wie;gFid,ubCyEza;an1KnZ;g9TiE;na9Ps;ch6Rfa4lImHndGpha4sFul,wi2IyE;an,mo6V;h7Km5;alAXol2Vy;iADon;f,ph;ent2inE;cy,t1;aJeHhilGier6UrE;aka18eE;m,st1;!ip,lip;dA5rcy,tE;ar,e3Fr1Z;b4Idra74tr6KulE;!o19;ctav3Ei3liv3m9Zndrej,rIsFtEum7wC;is,to;aFc7k7m0vE;al5T;ma;i,vM;aMeKiGoEu39;aEel,j5l0ma0r3J;h,m;cFg4i47kE;!au,h7Hola;holAkEolA;!olA;al,d,il,ls1vE;il8K;hom,tE;e,hE;anEy;!a4i4;a00eXiNoIuFyE;l2Hr1;hamFr6LstaE;fa,p55;ed,mI;di0Xe,hamGis2DntFsEussa;es,he;e,y;ad,ed,mE;ad,ed;cJgu4hai,kHlGnFtchE;!e9;a7Vik;house,o0Ct1;ae5Pe9NolE;aj;ah,hE;aFeE;al,l;el,l;hFlv2rE;le,ri9v2;di,met;ay0hUjd,ks2BlSmadXnRrLs1tGuricFxE;imilianBwe9;e,io;eHhFiAtEus,yA;!eo,hew,ia;eEis;us,w;j,o;cIio,kHlGqu6Zsha9tEv2;iEy;!m,n;in,on;el,oQus;!el91oPus;iHu4;achEcolm,ik;ai,y;amFdi,eEmoud;sh;adEm5H;ou;aXeRiPlo3AoLuFyE;le,nd1;cHiGkEth3uk;aEe;!s;gi,s,z;as,iaE;no;g0nn7CrenGuEv82we9;!iE;e,s;!zo;am,oE;n4r;a7Vevi,la4BnIonHst3thaGvE;eEi;nte;bo;!a6Eel;!ny;mGnFrEur55wr55;ry,s;ce,d1;ar,o4Y;aMeIhal7GiFristEu4Ky6J;i0o54;er0p,rE;k,ollE;os;en0iGnErmit,v3U;!dr3XnEt1;e18y;r,th;cp3j5m5Sna6OrFsp7them,uE;ri;im,l;a01eViToHuE;an,lEst2;en,iE;an,en,o,us;aOeMhnLkubAnJrHsE;eFhEi7Vue;!ua;!ph;dEge;i,on;!aEny;h,s,th55;!ath54ie,nD;!l,sEy;ph;o,qu2;an,mE;!mD;d,ffHrEs5;a5YemFmai6oEry;me,ni0Y;i7Fy;!e5OrE;ey,y;cLdCkJmIrGsFvi3yE;dCs1;on,p3;ed,od,rEv4V;e5Bod;al,es4Mis1;a,e,oEub;b,v;ob,quE;es;aXbRchiQgOkeNlija,nuMonut,rKsGtEv0;ai,suE;ki;aFha0i6ZmaEsac;el,il;ac,iaE;h,s;a,vinEw2;!g;k,nngu5F;!r;nacEor;io;ka;ai,rahE;im;aQeKoJuEyd7;be2FgHmber4KsE;eyFsE;a2e2;in,n;h,o;m3ra36sse2wa40;aIctHitHnrFrE;be28m0;iEy;!q0Z;or;th;bMlLmza,nKo,rGsFyE;a47dC;an,s0;lGo4Nry,uEv8;hi44ki,tE;a,o;an,ey;k,s;!im;ib;aWeSiQlenPoMrIuE;ilFsE;!tavo;herme,lerE;mo;aGegEov3;!g,orE;io,y;dy,h5J;nzaFrE;an,d1;lo;!n;lbe4Xno,oE;rg37van4X;oGrE;aEry;ld,rdB;ffr8rge;brFlCrEv2;la14r3Hth,y;e33ielE;!i5;aSePiNlLorrest,rE;anFedEitz;!dDer11r11;cGkE;!ie,lE;in,yn;esLisE;!co,z2W;etch3oE;yd;d4lEonn;ip;deriFliEng,rnan05;pe,x;co;bi0di,hd;dYfrXit0lSmLnIo2rGsteb0th0uge6vEymCzra;an,eE;ns,re2X;gi,i0AnErol,v2w2;estBie;oFriqEzo;ue;ch;aJerIiFmE;aIe2Q;lErh0;!iE;o,s;s1y;nu4;be0Bd1iGliFm3t1viEwood;n,s;ot1Ss;!as,j4EsE;ha;a2en;!d2Vg7mHoFuFwE;a26in;arE;do;oWuW;a02eRiPoHrag0uGwFylE;an,l0;ay6ight;a6dl8nc0st2;minHnFri0ugEvydAy29;!lA;!a2HnEov0;e9ie,y;go,iFykA;as;cEk;!k;armuEll1on,rk;id;andNj0lbeMmetri5nKon,rIsGvFwExt3;ay6ey;en,in;hawn,moE;nd;ek,rE;ick;is,nE;is,y;rt;re;an,le,mLnKrGvE;e,iE;!d;en,iGne9rEyl;eEin,yl;l35n;n,o,us;!i4ny;iEon;an,en,on;a08e06hYiar0lOoJrHuFyrE;il,us;rtE;!is;aEistob0S;ig;dy,lHnFrE;ey,neli5y;or,rE;ad;by,e,in,l2t1;aIeGiEyK;fEnt;fo0Et1;meEt5;nt;rGuFyE;!t1;de;enE;ce;aIeGrisE;!toE;ph3;st3;er;d,rEs;b4leE;s,y;cEdric,s7;il;lHmer1rE;ey,lFro9y;ll;!os,t1;eb,v2;a07eZiVlaUoSrFuEyr1;ddy,rtL;aMeHiGuFyE;an,ce,on;ce,no;an,ce;nFtE;!t;dFtE;!on;an,on;dFndE;en,on;!foEl8y;rd;bby,rEyd;is;i6ke;bGlFshE;al;al,lD;ek;nIrEshoi;at,nFtE;!r1B;aEie;rdB;!iFjam2nD;ie,y;to;kaNlazs,nIrE;n8rEt;eEy;tt;ey;dEeF;ar,iE;le;ar16b0Ud0Qf0Ogust2hm0Li0Ija0Hl03mZnSputsiRrIsaHugust5veFyEziz;a0kh0;ry;us;hi;aLchKiJjun,maInGon,tEy0;hEu09;ur;av,oE;ld;an,ndB;!el,ki;ie;ta;aq;as,dIgelBtE;hony,oE;i6nE;!iBy;ne;er,reEy;!as,i,s,w;iGmaEos;nu4r;el;ne,r,t;an,beQdCeKfIi,lHonGphYt1vE;aOin;on;so,zo;an,en;onUrE;ed;c,jaHksandGssaHxE;!andE;er,ru;ar,er;ndE;ro;rtB;ni;dCm7;ar;en;ad,eE;d,t;in;onE;so;aFi,olfBri0vik;!o;mEn;!a;dIeHraFuE;!bakr,lfazl;hEm;am;!l;allJelGoulaye,ulE;!lErG;ah,o;! rE;ahm0;an;ah;av,on',
        Person:
          'true¦ashton kutchUbTcOdMeKgastPhIinez,jHkGleFmDnettLoCpAr5s4t2va1w0;arrDoode;lentino rossi,n go4;a0heresa may,iger woods,yra banks;tum,ylor;addam hussain,carlett johanssKlobodan milosevic;ay romano,e3o1ush limbau0;gh;d stewart,nald0;inho,o;ese witherspoFilly;a0ipJ;lmIris hiltD;prah winfrFra;essia0itt romnEubarek;en;bron james,e;anye west,endall,iefer sutherland,obe bryant;aime,effers7k rowling;a0itlBulk hogan;lle berry,rris5;ff0meril lagasse,zekiel;ie;a0enzel washingt2ick wolf;lt1nte;ar1lint0;on;dinal wols1son0;! palm2;ey;arack obama,rock;er',
        Adjective:
          'true¦0:98;1:84;2:81;3:8Z;4:8T;5:6H;6:85;7:89;8:8U;9:8G;A:5Z;a7Qb7Ac6Sd6Ae5Sf5Ag52h4Ri3Tjuni46k3Rl3Gm34n2Uo2Fp1Wquart66r1Ls0Rt0JuMvIwBye1J;ast56eFholeEiDoB;man5oBrthwhi6u0F;d7Lzy;despr8Is6H;!sa6;ather13eBll o5Lste2R;!k5;aDeCiBola5F;b98ce versa,gi2R;ng4Xrsa5D;ca0lu56;lt06nHpDrCsBttermo90;ef79u4;b6Age0; Db2BpCsBti37;ca6et,ide dO;er,i4N;f3Vto da3;aWbecom2cVdPeOfNiMknLmKpJrGsCtoFus1wB;a06iel4G;e73i2GoDpCuB;pervis1spect2;e0ok71;ld;eBu5;cognQgul0LlBsolv1;at1ent2;a9recedeY;arri1et;own;que,vers4;air,orese6S;mploy1nd2xpect1;eBue;cid1rB;!a6VcovAly2sDwB;aBei2L;tAy;iz1to45;heck1onvinc2;ppeal2ssum2tteCuthorB;iz1;nd1;i3Ira;aGeDhough5Cip 1QoCrB;anspa72i3;gethAle86rp9;ena6JmpCrB;r3Htia6T;e8o6R;leBst3S;nt1;a03c01eZhYiWkiVmug,nobb41oPpMqueam41tGuBymb73;bDi generis,pBr5;erBre1P;! dupAb,viX;du1sBurb53;eq76tanda7S;atu6DeFi0VrByl3V;aBin4G;ightBy; fBfB;or61;adfa7Kri6;arCeBirit1lend9ot on;c30e36;k5se; caGlub6mbAphisticFrEuCvB;erei5Miet;ndBth0Y;pro6I;d9ry;at1;ll1;g1YnB;ce5Bg6;am32eA;at1co1Jem5lf3CnBre7;so5Z;ath2holBient2M;ar5;cr1me,tisfac5Q;aJeEheumato9iCoB;bu70tt5Cy4;ghtBv4;-w2f58;bZcEdu6RlDnown1sBtard1;is3FoB;lu3na0;e1Duc3D;e0ondi3;b9ciB;al,st;aOeMicayu7laLopuli6QrCuB;bl5Ynjabi;eGiEoB;!b2SfCmi3EpBv4Zxi21;er,ort63;a7u66;maBor,sti7va3;!ry;ci63exist2mBpa9;a1QiB;er,um;c9id;ac29rBti3;fe69ma34ti34v5X;i29rCsB;s5St;allCtB;-ti05i4;el;bMffKkJld InGrFthAutEverB;!aCni0Gseas,t,wB;ei0Frou0F;ll;do0Xer;d2Wg1N; bBbBgo2li7;oa62;fashion1school;!ay; gua5ZbBli7;eat;eCsB;ce7er0Do0S;dia0se;aJeIiHoBuanc1;nDrthBt1W;!eB;rn;chaCdescri5Nprof2AsB;top;la0;ght5;arby,cessa4Eighbor5xt;k1usiat2;aIeHinGoCuB;d15ltip6;deDl14nBot,st;ochroBth5;me;rn,st;dblSi;nac2re;cDgenta,in,j04keshift,mmCnBscu4G;da3Xy;ali2Koth;ab3Aho;aKeHiEoCuB;mber2sh;ngBut1A;stand2term;ghtweiCteraB;l,te;ght;ft-w2gBssAth4;al,eBi0B;nda3R;ngu9ps1st;aput,ind5nB;ow2;gno4Yll03mVnDpso 26rB;a3releB;va0; QaPcoMdJe2BfIhibi3EiWnHoGsDtBvalu0V;a4LeB;n49rdep1V;a7igColBuboD;ub6ve0;nifica0;rdi42;a3er;eriCluenOreq3Y;eCiEoB;or;fini3p1Mtermi3X;mpCnside8rB;re49;le3;ccu8deq3Yppr38;fBsitu,vitro;ro0;mFpB;arDeCl0SoBropA;li3r0P;nd2rfe41;ti4;aCeBi0U;d30n3N;tu24;egCiB;c0Lte8;al,iB;tiB;ma3;aIelHiFoCumB;a7dr3J;me ma2DnCrrBs04ur5;if31;e3Ro2K;ghfalut1MspB;an2Y;lUpf1Y;lCnBrdZtI;dy;f,low1;aiHener2Tiga27lob4oGraDuB;ilBng ho;ty;cCtB;ef1Qis;ef1P;od;nf1N;aPeMinLlJoErB;aCeBoz1N;q2Qtf1K;gi6nt2I;olErB; keeps,eBge0GmAtu2Pwa39;go2i1DseeB;ab6;ish;ag38uB;e0oresce0;al,i3;dCmini7rB;ti6; up;bl1i0l2Imiliar,r Bux;oBreach2;ff;aPfficie0lNmKnIqu4re2Qthere4veHxB;a2Pem2SplEquisi3traDuB;be2XlB;ta0;!va1I;icB;it;n,ryday; Bti0P;rou3sui3;erCiB;ne0;ge0;dBe19;er5;gAsB;t,ygo2;er;aQeHiCoBrea16ue;mina0ne,rma0ubK;dact1Jfficult,m,sCverB;ge0se;creCeJjoi0pa8tB;a0in23;et,te; IadpHceGfiFgene8liDpCreli21spe8voB;id,ut;ende0;ca3ghB;tf0B;a0ni3;as1;an;facto;i5ngeroY;ly;arRePivil,oErCuB;nn2stoma0N;aBu0Jystal0Y;v03z1;erKgniza0loJmInDrCveB;rt;po8ru1N;cEduHgr13jDsCtraB;dic0Ary;eq11ta0;oi0ug4;a0Vi14;mensu8pass0Z;ni4ss4;ci0S;leba3rtaB;in;diac,efN;aNeGizarFliLoDrBuck nak1;and new,isk,oB;kMn1E;gBldface,na fiT;us;re;autifGhiFloEnCsByoF;iPt;eUiBt;gn;v1w;nd;ul;ckCnkru0YrrB;en;!wards; priori,b0Pc0Md0Ff09g07h06l00mp6ntiquXpRrLsleep,ttracti08uHvEwB;aCkB;wa0W;ke,re;ant garCeraB;ge;de;diDtB;heBoimmu7;ntW;toG;bitEchiv4roDtiB;fiB;ci4;ga0;raB;ry;pBt;aEetiz2rB;oprB;ia3;ing;re0;at1e;ed;le;cohEiIkaCl,oBterO;of;li7;ne;olB;ic;ead;ainZed,gressiB;ve;fCra9;id;ectClB;ue0;ioB;na3; FeDvB;erB;se;pt,qB;ua3;hoc,infinitB;um;cu8tu4u3;al;ra3;erMlKoIrFsCuB;nda0;e0olu3traB;ct;te;eaCuB;pt;st;aBve;rd;aBe;ze;ra0;nt',
        Determiner:
          'true¦aBboth,d9e6few,l4mu8neiDplenty,s3th2various,wh0;at0ich0;evC;at,e4is,ose;everal,ome;a,e0;!ast,s;a1i6l0very;!se;ch;e0u;!s;!n0;!o0y;th0;er',
        Adverb:
          'true¦a09b05d01eXfRhPinOjustNkinda,likewi00mLnIoDpBquite,r8s4t1up0very,well; to,wards5;h1iny bit,o0wiO;o,t6w05;en,us;eldom,o0uch;!me1rt0; of;hZtimes,w0B;a1e0;alT;ndomSthN;ar excellDer0oint blank; Nhaps;f3n0;ce0ly;! 0;ag04moY; courIten;ewKo0; longEt 0;onIwithstanding;aybe,eanwhiAore0;!ovB;! aboW;deed,steX;en0;ce;or2u0;lArther0;!moL; 0ev3;examp0good,suJ;le;n1v0;er; mas0ough;se;e0irect1; 1finite0;ly;juAtrop;ackw2y 0;far,n0;ow;ard; DbroCd nauseam,gBl6ny3part,s2t 0w4;be6l0mo6wor6;arge,ea5; soon,ide;mo1w0;ay;re;l 1mo0one,ready,so,ways;st;b1t0;hat;ut;ain;ad;lot,posteriori',
        Conjunction:
          'true¦aDb9cuz,how7in caCno6o5p4supposing,t1wh0yet;eth7ile;h0o;eref8o0;!uB;lus,rovided that;r,therwi6; matt1r;!ev0;er;e0ut;cau1f0;ore;se;lthou1nd,s 0;far as,if;gh',
        Currency:
          'true¦$,aud,bQcOdJeurIfHgbp,hkd,iGjpy,kElDp8r7s3usd,x2y1z0¢,£,¥,ден,лв,руб,฿,₡,₨,€,₭,﷼;lotyQł;en,uanP;af,of;h0t5;e0il5;k0q0;elK;oubleJp,upeeJ;e2ound st0;er0;lingG;n0soF;ceEnies;empi7i7;n,r0wanzaCyatC;!onaBw;ls,nr;ori7ranc9;!os;en3i2kk,o0;b0ll2;ra5;me4n0rham4;ar3;e0ny;nt1;aht,itcoin0;!s',
        'Adj|Present':
          'true¦a00bluZcRdMeKfHhollGidNlEmCnarrGoBp9qua8r7s4t2utt3w0;aIet,ound,ro0;ng,ug01;end0hin,op;er;e1l0mooth,our,pa8u8;i2ow;cu6daVlNpaJ;eplicaUigV;ck;aDr0;eseOime,ompt;bscu1pen,wn;atu0eLodeD;re;ay,eJi0;gNve;ow;i1r0;ee,inge;rm;l0mpty,xpress;abo4ic7;amp,e2i1oub0ry;le;ffu8r5;fu7libe0;raB;l4o0;mple9n2ol,rr1unterfe0;it;ect;juga6sum5;e1o0;se;an;nt;lig2pproxi0;ma0;te;ht',
        Comparable:
          'true¦0:3B;1:3Q;2:3F;3:2D;a3Ub3Cc30d2Qe2Jf27g1Vh1Li1Fj1Ek1Bl14m0Yn0To0Sp0Jqu0Hr08sJtEuDvBw5y4za0R;el11ou3A;a8e6hi1Hi4ry;ck0Dde,l4n1ry,se;d,y;a4i3T;k,ry;nti34ry;a4erda2ulgar;gue,in,st;g0pcomi31;a7en2Thi6i5ough,r4;anqu28en1ue;dy,g36me0ny,r03;ck,rs24;ll,me,rt,wd3I;aRcarQePhNiMkin0BlImGoEpDt7u5w4;eet,ift;b4dd0Vperfi1Wrre24;sta22t3;a8e7iff,r5u4;pUr1;a4ict,o2P;ig2Wn0N;a1ep,rn;le,rk;e1Oi2Wright0;ci1Vft,l4on,re;emn,id;a4el0;ll,rt;e6i4y;g2Nm4;!y;ek,nd2T;ck,l0mp3;a4iRort,rill,y;dy,l01rp;ve0Ixy;ce,y;d,fe,int0l1Ev0U;a9e7i6o4ude;mantic,o16sy,u4;gh,nd;ch,pe,tzy;a4d,mo0A;dy,l;gg5ndom,p4re,w;id;ed;ai2i4;ck,et;hoBi1ClAo9r6u4;ny,r4;e,p3;egna2ic5o4;fouSud;ey,k0;liXor;ain,easa2;ny;dd,i0ld,ranL;aive,e6i5o4;b3isy,rm0Vsy;ce,mb3;a4w;r,t;ad,e6ild,o5u4;nda0Yte;ist,o1;a5ek,l4;low;s0ty;a8ewd,i7o4ucky;f0Gn5o12u4ve0w0Wy0K;d,sy;e0g;ke0tt3ve0;me,r4te;ge;e5i4;nd;en;ol0ui1B;cy,ll,n4;secu7t4;e4ima5;llege2rmedia4;te;re;aBe8i7o6u4;ge,m4ng1E;b3id;me0t;gh,l0;a4fVsita2;dy,v4;en0y;nd15ppy,r4;d,sh;aEenDhBiAl9oofy,r4;a7e6is0o4ue12;o4ss;vy;at,en,y;nd,y;ad,ib,ooE;a2d1;a4o4;st0;t3uiS;u1y;aDeeb3i9lat,o7r6u4;ll,n4r0S;!ny;aDesh,iend0;a4rmEul;my;erce5nan4;ciB;! ;le;ir,ke,n08r,st,ul4;ty;a7erie,sse5v4xtre0G;il;nti4;al;r5s4;tern,y;ly,th0;aCe9i6ru5u4;ll,mb;nk;r5vi4;ne;e,ty;a4ep,nB;d4f,r;!ly;ppVrk;aDhAl8o6r5u4;dd0r0te;isp,uel;ar4ld,mmon,st0ward0zy;se;e4ou1;ar,vO;e4il0;ap,e4;sy;gey,lm,ri4;ng;aJiHlEoCr6u4;r0sy;ly;a8i5o4;ad,wn;g5llia2;nt;ht;sh,ve;ld,un4;cy;a5o4ue;nd,o1;ck,nd;g,tt4;er;d,ld,w1;dy;bsu7ng6we4;so4;me;ry;rd',
        Infinitive:
          'true¦0:8U;1:8H;2:9C;3:90;4:81;5:7O;6:98;7:83;8:9F;9:91;A:9G;B:8W;C:7V;D:7R;E:7L;F:88;a81b7Ec6Od5Ge4Ef44g40h3Wi3Cj39k36l2Xm2Qnou3Vo2Lp24qu23r19s08tWuRvPwG;aMeLiJrG;eHiG;ng,te;ak,st4;d5e7CthG;draw,er;a2d,ep;i2ke,nGrn;d0t;aGie;li9Bni8ry;nGplift;cov0dHear7IlGplug,tie,ve84;ea8o3K;erGo;go,sta9Dval93whelm;aPeNhKoJrG;aGemb4;ffi3Fmp4nsG;aCpi7;pp4ugh5;aHiHrGwaD;eat5i2;nk;aGll,m8Z;ch,se;ck4ilor,keGmp0r7M;! paD;a0Fc0Ee0Ch08i06l04m03n02o00pVquUtNuIwG;all70e2EiG;m,ng;bIccumb,ffHggeBmm90p2FrG;mouFvi2;er,i3;li7Zmer9siGveD;de,st;aKe7SiIrG;ang4eGi2;ng20w;fGnW;f5le;gg0rG;t4ve;a3Ri8;awn,eJiIlHoGri6A;il,of;ay,it;ll,t;ak,nd;lGot6Lw;icEve;eak,i0K;a8ugg4;aGiA;m,y;ft,nGt;g,k;aIi5EoHriGun;nk,v5Q;ot,rt5;ke,rp5tt0ve;eGll,nd,que7Iv0w;!k,m;aven9ul7W;dd5tis17y;att4eHip5oG;am,ut;a05b03c01d00fXgroup,heaWiVlTmSnRpPq30sLtJvG;amp,eHiGo2P;sEve;l,rt;i7rG;ie2ofE;eFiItGurfa3;aDo1VrG;a5TiCuctu7;de,gn,st;el,hra1lGreseF;a3e66;d0ew,o02;a5Oe2Vo2;a6eFiGoad,y;e2nq3Fve;mbur1nf2O;r1t;inHleCocus,re8uG;el,rbi8;an3e;aCu3;ei2k7Ela3IoGyc4;gni57nci4up,v0;oot,uG;ff;ct,d,liG;se,ze;a8en5Nit,o6;aUerSiRlumm0UoQrIuG;b3Jke,ni8rGt;poDs6S;eKoG;cId,fe33hibEnoHpo1sp0truAvG;e,iAo4R;un3;la34u7;a5Ec1NdHf0ocSsup0EvG;a5JeF;etermi41iC;a5Brt4T;er3npoiF;cei2fo3Bi8mea6plex,sGvaA;eve7iB;mp0n13rGtrol,ve,y;a5Pt5L;bser2cJpIutHverGwe;lap,s15tu65u1;gr4Mnu1Wpa3;era6i3Rpo1;cupy;aLe08iHoGultiply;leBu60;micInHsG;pla3s;ce,g4us;!k;im,ke,na9;aNeJiGo1u34;e,ke,ng0quGv5;eGi62;fy;aInG;d,gG;th5;rn,ve;ng20u19;eHnG;e3Low;ep;o43uG;gg4xtaG;po1;gno7mUnG;cSdQfPgeBhOitia6ju7q0YsMtIun5OvG;eGo0N;nt,st;erHimi5LoxiOrG;odu3uA;aCn,prGru5L;et;iBpi7tGu7;il,ruC;abEibE;eBo25u1;iGul9;ca6;i6luA;b57mer1pG;aDer44ly,oHrG;is5Io2;rt,se,veG;ri8;aIear,iGoiBuD;de,jaGnd0;ck;mp0ng,pp5ve;ath0et,i2le1PoIrG;aGow;b,pp4ze;!ve4O;ast5er3Ji54lOorJrHuG;lf3Rr3N;ee2ZolG;ic;b3CeIfeEgGs4A;eGi2;!t;clo1go,sGwa4G;had2X;ee,i2L;a0FdEl0Dm08nQquip,rPsOt3CvMxG;cKeDha4iJpHtG;ing0Pol;eGi7loEo1un9;ct,di6;st,t;luA;alua6oG;ke,l2;chew,pou1tab11;a1u4F;aWcTdRfQgOhan3joy,lNqMrLsuKtIvG;e0TisG;a9i4K;er,i3rG;a2Jen2XuB;e,re;i2Vol;ui7;ar9iB;a9eGra2ulf;nd0;or3;ang0oGu7;r1w;lo1ou0ArHuG;mb0;oa2Ly3Y;b4ct;bHer9pG;hasi1Xow0;a0Sody,rG;a3oiG;d0l;ap1eCuG;ci3Ode;rGt;ma0Mn;a0Me01iIo,rGwind4;aw,ed9oG;p,wn;agno1e,ff0g,mi29sJvG;eGul9;rGst;ge,t;ab4bTcNlod9mant4pLru3GsKtG;iGoDu2W;lHngG;ui8;!l;ol2uaA;eGla3o1ro2;n1r1;a17e2WlJoHuG;ss;uGv0;ra9;aGo1;im;a37ur1;af5bXcRduCep5fPliOmLnJpIra1Uta1OvG;eGol2;lop;aDiCoD;oGy;te,un3;eHoG;li8;an;mEv0;a3i03oGraud,y;rm;ei2iKoIrG;ee,yG;!pt;de,mGup4;missi2Tpo1;de,ma6ph0;aHrief,uG;g,nk;rk;mp5rk5uF;a03ea1h01i00lZoHrGurta18;a2ea6ipp4;ales3eWhabEinciAllVmTnGrroA;cQdNfLju7no6qu0sJtIvG;eGin3;ne,r9;a0Iin24ribu6;er2iGoli26pi7titu6ult;d0st;iGroFu1;de,gu7rm;eHoG;ne;mn,n1;eGluA;al,i2;buBe,men3pG;e6ly;eCiAuA;r3xiB;ean1iQ;rcumveFte;eGoo1;ri8w;ncGre5t0ulk;el;aZeTiSlPoNrJuG;iHrGy;st,y;ld;aIeHiGoad5;ng;astfeKed;ke;il,l11mbaGrrNth0;rd;aHeGow;ed;ze;de,nd;!come,gKha2liJnd,queaIstHtGwild0;ray;ow;th;e2tt4;in;bysEckfi7ff4tG;he;it;b13c0Rd0Iffix,gr0Hl0Dm09n03ppZrXsQttNuLvIwaG;it,k5;en;eDoG;id;rt;gGto06;meF;aHeBraC;ct;ch;pi7sHtoG;ni8;aIeGi03u7;mb4rt;le;il;re;g0Fi1ou1rG;an9i2;eaIly,oiFrG;ai1o2;nt;r,se;aKiOnHtG;icipa6;eHoGul;un3y;al;ly1;aHu1;se;lgaGze;ma6;iIlG;e9oGuA;t,w;gn;ee;aZjLmiIoHsoG;rb;pt,rn;niGt;st0;er;ouHuB;st;rn;cJhie2knowled9quiGtiva6;es3re;ce;ge;eMomIrHusG;e,tom;ue;moHpG;any,li8;da6;te;pt;andMet,iAoIsG;coIol2;ve;li8rt,uG;nd;sh;de;on',
        Modal:
          'true¦c5lets,m4ought3sh1w0;ill,o5;a0o4;ll,nt;! to,a;ight,ust;an,o0;uld',
        Participle:
          'true¦f4g3h2less6s1w0;ors5ritt5;e4h5;ast3e2;iv2one;l2r0;ight0;en;own',
        'Adj|Gerund':
          'true¦0:2C;1:2E;2:22;3:20;4:1X;5:24;a1Zb1Uc1Cd0Ze0Uf0Kg0Eh0Di07jud1Sl04m01oXpTrNsCt7up6veWw0Lyiel4;lif0sZ;aUe9hr7i3ouc22r6wis0;eZoub2us0yi1;ea0Ji6;l2vi1;l2mp0;atisf28creec1Xhoc0Bkyrocke0lo0ZoEpDt9u7we6;e0Yl2;pp1Gr6;gi1pri5roun4;a7ea1Zi6ri07un18;mula0r3;gge3r6;t2vi1;ark2ee4;a6ot1O;ki1ri1;aAe7ive0o6us1M;a3l2;defi0Zfres1Kig0ZlaCs0v6war4;ea2itali6ol0M;si1zi1;gi1ll1Smb2vi1;a1Rerple8ier19lun14r6un1F;e6o0X;ce4s5vai2;xi1;ffs8pKut7ver6wi1;arc1Blap0Dri4whel1H;goi1l1Lst0U;et0;eande3i7o0Bu6;mb2;s5tiga0;a7i6o08;fesa07mi0vi1;cHg0Rs0;mAn6rri08;c8s7te13vi6;go1Cti1;pi3ul0;orpo1Area5;po5;arrowi1ea2orrif17umilia0;lAr6;a0ipWo7uel6;i1li1;undbrea6wi1;ki1;a3ea0W;aEetc0Pit0lBo9r7ulf6;il2;ee0Vigh6ust0Z;te01;r6un4;ebo4th0E;a7o6;a0we3;mi1tte3;di1scina0;m9n7x6;ac0ci0is0plo4;ab2c6du3ga01sQ;han0oura00;barras5erZpowe3;aHeAi6;s6zz0K;appoin0gus0sen0t6;r6u0L;ac0es5;biliBcAfiKgra4m9pres5ser8v6;asAelo6;pi1;vi1;an4eaG;a0BliF;ta0;maMri1sYun0;aMhJlo5o6ripp2ut0;mCn6rrespon4;cerAf9spi3t6vinO;in7r6;as0ibu0ol2;ui1;lic0u5;ni1;fAm9p6;e7ro6;mi5;l2ti1;an4;or0;a6ea0il2;llen6rO;gi1;lMptiva0;e9in4lin4o7rui5u6;d4st2;i2oJri1un6;ci1;coH;bsoOcJgonHlarGmEppea2rCs6;pi3su3to6;n7un4;di1;is6;hi1;ri1;res0;li1;a9u5;si1;mi1;i6zi1;zi1;c6hi1;ele7ompan6;yi1;ra0;ti1;rbi1;ng',
        'Adj|Past':
          'true¦0:2T;1:2K;2:2N;3:23;a2Db28c1Qd1Ae14f0Zgift0h0Wi0Pj0Oknown,l0Lm0Gn0Eo0Bp04qua03rUsEtAu8v6w4;arp0ea4or6;kIth2N;a4e0V;ri0;ni4pd1s0;fi0t0;ar6hreatDr4wi2M;a4ou18;ck0in0pp0;get0ni1K;aHcaGeFhEimDm01oak0pBt7u4;bsid23gge2Hs4;pe4ta1O;ct0nd0;at0e6r4uV;ength4ip0;en0;am0reotyp0;eci4ik0ott0;al1Vfi0;pIul1;ar0ut;al0c1Fle2t1N;r0tt21;t4ut0;is3ur1;aBe4;c8duc0f19g7l1new0qu6s4;pe2t4;or0ri2;e1Yir0;ist1Tul1;eiv0o4;mme0Ard0v1R;lli0ti3;li3;arallel0l8o7r4ump0;e5o4;c0Ilo0Hnou1Ppos0te2;fe0Koc9pZ;i1Cli0P;a4e15;nn0;c5rgan17verlo4;ok0;cupi0;e4ot0;ed0gle2;a6e5ix0o4;di3t0E;as0Nlt0;n4rk0;ag0ufact0L;eft,i5o4;ad0st;cens0mit0st0;agg0us0K;mp9n4sol1;br0debt0f7t4volv0;e4ox0C;gr1n4re14;d0si3;e2oW;li0oMrov0;amm0We1o4;ok0r4;ri3;aNe7i6lavo06ocus0r4;a4i0;ct04g0Im0;niVx0;ar0;duc1n8quipp0stabliTx4;p4te6;a5e4;ct0rie0O;nd0;ha0MsW;aIeAi4;gni3miniMre2s4;a7c6grun01t4;o4rBurb0;rt0;iplPou05;bl0;cenTdMf8lay0pr7ra6t4velop0;a4ermM;il0;ng0;ess0;e5o4;rm0;rr0;mag0t0;alcul1eHharg0lGo9r6u4;lt4stomR;iv1;a5owd0u4;sh0;ck0mp0;d0lo9m6n4ok0vW;centr1s4troll0;idUolid1;b5pl4;ic1;in0;ur0;assi3os0;lebr1n6r4;ti3;fi0;tralB;a7i6o4urn0;il0r0t4und;tl0;as0;laJs0;bandon0cKdHffe2lEnCppAss8u4ward0;g5thor4;iz0;me4;nt0;o6u4;m0r0;li0re4;ci1;im1ticip1;at0;leg0t4;er0;ct0;ju5o7va4;nc0;st0;ce4knowledg0;pt0;ed',
        'Person|Verb':
          'true¦b1chu2drew,grant,ja2ma0ollie,pat,rob,sue,wade;ck,rk;ob,u0;ck',
        'Person|Place':
          'true¦a5darw6h3jordan,k2orlando,s0victo7;a0ydney;lvador,mara,ntiago;ent,obe;amil0ous0;ton;lexand1ust0;in;ria',
        'Person|Date': 'true¦a2j0sep;an0une;!uary;p0ugust,v0;ril',
      }
    const va = 36,
      ya = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      wa = ya.split('').reduce(function (e, t, n) {
        return (e[t] = n), e
      }, {})
    var ka = function (e) {
        if (void 0 !== wa[e]) return wa[e]
        let t = 0,
          n = 1,
          r = va,
          a = 1
        for (; n < e.length; t += r, n++, r *= va);
        for (let n = e.length - 1; n >= 0; n--, a *= va) {
          let r = e.charCodeAt(n) - 48
          r > 10 && (r -= 7), (t += r * a)
        }
        return t
      },
      Pa = function (e) {
        const t = new RegExp('([0-9A-Z]+):([0-9A-Z]+)')
        for (let n = 0; n < e.nodes.length; n++) {
          const r = t.exec(e.nodes[n])
          if (!r) {
            e.symCount = n
            break
          }
          e.syms[ka(r[1])] = ka(r[2])
        }
        e.nodes = e.nodes.slice(e.symCount, e.nodes.length)
      }
    const Aa = function (e, t, n) {
      const r = ka(t)
      return r < e.symCount ? e.syms[r] : n + r + 1 - e.symCount
    }
    var ja = function (e) {
        const t = { nodes: e.split(';'), syms: [], symCount: 0 }
        return (
          e.match(':') && Pa(t),
          (function (e) {
            const t = [],
              n = (r, a) => {
                let o = e.nodes[r]
                '!' === o[0] && (t.push(a), (o = o.slice(1)))
                const i = o.split(/([A-Z0-9,]+)/g)
                for (let o = 0; o < i.length; o += 2) {
                  const s = i[o],
                    l = i[o + 1]
                  if (!s) continue
                  const u = a + s
                  if (',' === l || void 0 === l) {
                    t.push(u)
                    continue
                  }
                  const c = Aa(e, l, r)
                  n(c, u)
                }
              }
            return n(0, ''), t
          })(t)
        )
      },
      xa = function (e) {
        if (!e) return {}
        const t = e.split('|').reduce((e, t) => {
            const n = t.split('¦')
            return (e[n[0]] = n[1]), e
          }, {}),
          n = {}
        return (
          Object.keys(t).forEach(function (e) {
            const r = ja(t[e])
            'true' === e && (e = !0)
            for (let t = 0; t < r.length; t++) {
              const a = r[t]
              !0 === n.hasOwnProperty(a)
                ? !1 === Array.isArray(n[a])
                  ? (n[a] = [n[a], e])
                  : n[a].push(e)
                : (n[a] = e)
            }
          }),
          n
        )
      },
      Ea = {
        a: [
          [/(antenn|formul|nebul|vertebr|vit)a$/i, '$1ae'],
          [/([ti])a$/i, '$1a'],
        ],
        e: [
          [/(kn|l|w)ife$/i, '$1ives'],
          [/(hive)$/i, '$1s'],
          [/([m|l])ouse$/i, '$1ice'],
          [/([m|l])ice$/i, '$1ice'],
        ],
        f: [
          [/^(dwar|handkerchie|hoo|scar|whar)f$/i, '$1ves'],
          [
            /^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)f$/i,
            '$1ves',
          ],
        ],
        i: [[/(octop|vir)i$/i, '$1i']],
        m: [[/([ti])um$/i, '$1a']],
        n: [[/^(oxen)$/i, '$1']],
        o: [[/(al|ad|at|er|et|ed)o$/i, '$1oes']],
        s: [
          [/(ax|test)is$/i, '$1es'],
          [/(alias|status)$/i, '$1es'],
          [/sis$/i, 'ses'],
          [/(bu)s$/i, '$1ses'],
          [/(sis)$/i, 'ses'],
          [/^(?!talis|.*hu)(.*)man$/i, '$1men'],
          [/(octop|vir|radi|nucle|fung|cact|stimul)us$/i, '$1i'],
        ],
        x: [
          [/(matr|vert|ind|cort)(ix|ex)$/i, '$1ices'],
          [/^(ox)$/i, '$1en'],
        ],
        y: [[/([^aeiouy]|qu)y$/i, '$1ies']],
        z: [[/(quiz)$/i, '$1zes']],
      }
    const Na = /([xsz]|ch|sh)$/
    var Ia = function (e = '', t) {
      let { irregularPlurals: n, uncountable: r } = t.two
      if (r.hasOwnProperty(e)) return e
      if (n.hasOwnProperty(e)) return n[e]
      let a = (function (e) {
        let t = e[e.length - 1]
        if (!0 === Ea.hasOwnProperty(t))
          for (let n = 0; n < Ea[t].length; n += 1) {
            let r = Ea[t][n][0]
            if (!0 === r.test(e)) return e.replace(r, Ea[t][n][1])
          }
        return null
      })(e)
      return null !== a ? a : Na.test(e) ? e + 'es' : e + 's'
    }
    const Ta = /\|/
    let Ga = {
        '20th century fox': 'Organization',
        '7 eleven': 'Organization',
        'motel 6': 'Organization',
        g8: 'Organization',
        vh1: 'Organization',
        'at&t': 'Organization',
        'black & decker': 'Organization',
        'h & m': 'Organization',
        'johnson & johnson': 'Organization',
        'procter & gamble': 'Organization',
        "ben & jerry's": 'Organization',
        '&': 'Conjunction',
        i: ['Pronoun', 'Singular'],
        he: ['Pronoun', 'Singular'],
        she: ['Pronoun', 'Singular'],
        it: ['Pronoun', 'Singular'],
        they: ['Pronoun', 'Plural'],
        we: ['Pronoun', 'Plural'],
        was: ['Copula', 'PastTense'],
        is: ['Copula', 'PresentTense'],
        are: ['Copula', 'PresentTense'],
        am: ['Copula', 'PresentTense'],
        were: ['Copula', 'PastTense'],
        her: ['Possessive', 'Pronoun'],
        his: ['Possessive', 'Pronoun'],
        hers: ['Possessive', 'Pronoun'],
        their: ['Possessive', 'Pronoun'],
        themselves: ['Possessive', 'Pronoun'],
        your: ['Possessive', 'Pronoun'],
        our: ['Possessive', 'Pronoun'],
        my: ['Possessive', 'Pronoun'],
        its: ['Possessive', 'Pronoun'],
        vs: ['Conjunction', 'Abbreviation'],
        if: ['Condition', 'Preposition'],
        closer: 'Comparative',
        closest: 'Superlative',
        much: 'Adverb',
        may: 'Modal',
        babysat: 'PastTense',
        blew: 'PastTense',
        drank: 'PastTense',
        drove: 'PastTense',
        forgave: 'PastTense',
        skiied: 'PastTense',
        spilt: 'PastTense',
        stung: 'PastTense',
        swam: 'PastTense',
        swung: 'PastTense',
        guaranteed: 'PastTense',
        shrunk: 'PastTense',
        no: ['Negative', 'Expression'],
      },
      Da = {}
    const Ca = { two: { irregularPlurals: fa, uncountable: {} } }
    Object.keys(ba).forEach((e) => {
      let t = xa(ba[e])
      Ta.test(e)
        ? Object.keys(t).forEach((t) => {
            if (((Da[t] = e), 'Noun|Verb' === e)) {
              let e = Ia(t, Ca)
              Da[e] = 'Plural|Verb'
            }
          })
        : Object.keys(t).forEach((t) => {
            Ga[t] = e
          })
    }),
      [
        ':(',
        ':)',
        ':P',
        ':p',
        ':O',
        ';(',
        ';)',
        ';P',
        ';p',
        ';O',
        ':3',
        ':|',
        ':/',
        ':\\',
        ':$',
        ':*',
        ':@',
        ':-(',
        ':-)',
        ':-P',
        ':-p',
        ':-O',
        ':-3',
        ':-|',
        ':-/',
        ':-\\',
        ':-$',
        ':-*',
        ':-@',
        ':^(',
        ':^)',
        ':^P',
        ':^p',
        ':^O',
        ':^3',
        ':^|',
        ':^/',
        ':^\\',
        ':^$',
        ':^*',
        ':^@',
        '):',
        '(:',
        '$:',
        '*:',
        ')-:',
        '(-:',
        '$-:',
        '*-:',
        ')^:',
        '(^:',
        '$^:',
        '*^:',
        '<3',
        '</3',
        '<\\3',
      ].forEach((e) => (Ga[e] = 'Emoticon')),
      delete Ga[''],
      delete Ga.null,
      delete Ga[' ']
    const Oa = 'Adjective'
    var Va = {
      beforeTags: { Determiner: Oa, Possessive: Oa },
      afterTags: { Adjective: Oa },
      beforeWords: {
        seem: Oa,
        seemed: Oa,
        seems: Oa,
        feel: Oa,
        feels: Oa,
        felt: Oa,
        appear: Oa,
        appears: Oa,
        appeared: Oa,
        also: Oa,
        over: Oa,
        under: Oa,
        too: Oa,
        it: Oa,
        but: Oa,
        still: Oa,
        really: Oa,
        quite: Oa,
        well: Oa,
        very: Oa,
        deeply: Oa,
        profoundly: Oa,
        extremely: Oa,
        so: Oa,
        badly: Oa,
        mostly: Oa,
        totally: Oa,
        awfully: Oa,
        rather: Oa,
        nothing: Oa,
        something: Oa,
        anything: Oa,
      },
      afterWords: { too: Oa, also: Oa, or: Oa },
    }
    const Ba = 'Gerund'
    var za = {
        beforeTags: { Adverb: Ba, Preposition: Ba, Conjunction: Ba },
        afterTags: {
          Adverb: Ba,
          Possessive: Ba,
          Person: Ba,
          Pronoun: Ba,
          Determiner: Ba,
          Copula: Ba,
          Preposition: Ba,
          Conjunction: Ba,
          Comparative: Ba,
        },
        beforeWords: {
          been: Ba,
          keep: Ba,
          continue: Ba,
          stop: Ba,
          am: Ba,
          be: Ba,
          me: Ba,
          began: Ba,
          start: Ba,
          starts: Ba,
          started: Ba,
          stops: Ba,
          stopped: Ba,
          help: Ba,
          helps: Ba,
          avoid: Ba,
          avoids: Ba,
          love: Ba,
          loves: Ba,
          loved: Ba,
          hate: Ba,
          hates: Ba,
          hated: Ba,
        },
        afterWords: {
          you: Ba,
          me: Ba,
          her: Ba,
          him: Ba,
          them: Ba,
          their: Ba,
          it: Ba,
          this: Ba,
          there: Ba,
          on: Ba,
          about: Ba,
          for: Ba,
        },
      },
      $a = {
        beforeTags: Object.assign({}, Va.beforeTags, za.beforeTags, {
          Imperative: 'Gerund',
          Infinitive: 'Adjective',
          PresentTense: 'Gerund',
          Plural: 'Gerund',
        }),
        afterTags: Object.assign({}, Va.afterTags, za.afterTags, {
          Singular: 'Adjective',
        }),
        beforeWords: Object.assign({}, Va.beforeWords, za.beforeWords, {
          is: 'Adjective',
          was: 'Adjective',
          suggest: 'Gerund',
          recommend: 'Gerund',
        }),
        afterWords: Object.assign({}, Va.afterWords, za.afterWords, {
          to: 'Gerund',
          not: 'Gerund',
          the: 'Gerund',
        }),
      }
    const Fa = 'Singular'
    var Sa = {
      beforeTags: {
        Determiner: Fa,
        Possessive: Fa,
        Acronym: Fa,
        Noun: Fa,
        Adjective: Fa,
        PresentTense: Fa,
        Gerund: Fa,
        PastTense: Fa,
        Infinitive: Fa,
        Date: Fa,
      },
      afterTags: {
        Value: Fa,
        Modal: Fa,
        Copula: Fa,
        PresentTense: Fa,
        PastTense: Fa,
        Demonym: Fa,
      },
      beforeWords: {
        the: Fa,
        with: Fa,
        without: Fa,
        of: Fa,
        for: Fa,
        any: Fa,
        all: Fa,
        on: Fa,
        cut: Fa,
        cuts: Fa,
        save: Fa,
        saved: Fa,
        saves: Fa,
        make: Fa,
        makes: Fa,
        made: Fa,
        minus: Fa,
        plus: Fa,
        than: Fa,
        another: Fa,
        versus: Fa,
        neither: Fa,
        favorite: Fa,
        best: Fa,
        daily: Fa,
        weekly: Fa,
        linear: Fa,
        binary: Fa,
        mobile: Fa,
        lexical: Fa,
        technical: Fa,
        computer: Fa,
        scientific: Fa,
        formal: Fa,
      },
      afterWords: {
        of: Fa,
        system: Fa,
        aid: Fa,
        method: Fa,
        utility: Fa,
        tool: Fa,
        reform: Fa,
        therapy: Fa,
        philosophy: Fa,
        room: Fa,
        authority: Fa,
        says: Fa,
        said: Fa,
        wants: Fa,
        wanted: Fa,
      },
    }
    const Ha = { beforeTags: { Determiner: void 0, Cardinal: 'Noun' } }
    var Ma = {
      beforeTags: Object.assign(
        {},
        Va.beforeTags,
        Sa.beforeTags,
        Ha.beforeTags
      ),
      afterTags: Object.assign({}, Va.afterTags, Sa.afterTags),
      beforeWords: Object.assign({}, Va.beforeWords, Sa.beforeWords, {
        are: 'Adjective',
        is: 'Adjective',
        was: 'Adjective',
        be: 'Adjective',
      }),
      afterWords: Object.assign({}, Va.afterWords, Sa.afterWords),
    }
    const La = {
        Adverb: 'PastTense',
        Pronoun: 'PastTense',
        ProperNoun: 'PastTense',
        Auxiliary: 'PastTense',
        Noun: 'PastTense',
      },
      Wa = {
        Possessive: 'PastTense',
        Pronoun: 'PastTense',
        Determiner: 'PastTense',
        Adverb: 'PastTense',
        Comparative: 'PastTense',
        Date: 'PastTense',
      },
      Ja = {
        be: 'PastTense',
        get: 'PastTense',
        had: 'PastTense',
        has: 'PastTense',
        have: 'PastTense',
        been: 'PastTense',
        it: 'PastTense',
        as: 'PastTense',
        for: 'Adjective',
      },
      qa = {
        by: 'PastTense',
        back: 'PastTense',
        out: 'PastTense',
        in: 'PastTense',
        up: 'PastTense',
        down: 'PastTense',
        for: 'PastTense',
        the: 'PastTense',
        with: 'PastTense',
        as: 'PastTense',
        on: 'PastTense',
      }
    var Ka = {
      beforeTags: Object.assign({}, Va.beforeTags, La),
      afterTags: Object.assign({}, Va.afterTags, Wa),
      beforeWords: Object.assign({}, Va.beforeWords, Ja),
      afterWords: Object.assign({}, Va.afterWords, qa),
    }
    const Ra = 'Infinitive'
    var Ua = {
      beforeTags: { Modal: Ra, Adverb: Ra, Negative: Ra, Plural: Ra },
      afterTags: {
        Determiner: Ra,
        Adverb: Ra,
        Possessive: Ra,
        Preposition: Ra,
      },
      beforeWords: {
        i: Ra,
        we: Ra,
        you: Ra,
        they: Ra,
        to: Ra,
        please: Ra,
        will: Ra,
        have: Ra,
        had: Ra,
        would: Ra,
        could: Ra,
        should: Ra,
        do: Ra,
        did: Ra,
        does: Ra,
        can: Ra,
        must: Ra,
        us: Ra,
        me: Ra,
        he: Ra,
        she: Ra,
        it: Ra,
        being: Ra,
      },
      afterWords: {
        the: Ra,
        me: Ra,
        you: Ra,
        him: Ra,
        her: Ra,
        them: Ra,
        it: Ra,
        a: Ra,
        an: Ra,
        up: Ra,
        down: Ra,
        by: Ra,
        out: Ra,
        off: Ra,
        under: Ra,
        when: Ra,
        all: Ra,
        to: Ra,
        because: Ra,
        although: Ra,
        before: Ra,
        how: Ra,
        otherwise: Ra,
        together: Ra,
        though: Ra,
        yet: Ra,
      },
    }
    const Qa = { afterTags: { Noun: 'Adjective', Conjunction: void 0 } }
    var _a = {
      beforeTags: Object.assign({}, Va.beforeTags, Ua.beforeTags, {
        Adverb: void 0,
        Negative: void 0,
      }),
      afterTags: Object.assign({}, Va.afterTags, Ua.afterTags, Qa.afterTags),
      beforeWords: Object.assign({}, Va.beforeWords, Ua.beforeWords, {
        have: void 0,
        had: void 0,
        not: void 0,
        went: 'Adjective',
        goes: 'Adjective',
        got: 'Adjective',
        be: 'Adjective',
      }),
      afterWords: Object.assign({}, Va.afterWords, Ua.afterWords, {
        to: void 0,
      }),
    }
    const Za = {
        Copula: 'Gerund',
        PastTense: 'Gerund',
        PresentTense: 'Gerund',
        Infinitive: 'Gerund',
      },
      Ya = {},
      Xa = {
        are: 'Gerund',
        were: 'Gerund',
        be: 'Gerund',
        no: 'Gerund',
        without: 'Gerund',
        you: 'Gerund',
        we: 'Gerund',
        they: 'Gerund',
        he: 'Gerund',
        she: 'Gerund',
        us: 'Gerund',
        them: 'Gerund',
      },
      eo = {
        the: 'Gerund',
        this: 'Gerund',
        that: 'Gerund',
        me: 'Gerund',
        us: 'Gerund',
        them: 'Gerund',
      }
    var to = {
        beforeTags: Object.assign({}, za.beforeTags, Sa.beforeTags, Za),
        afterTags: Object.assign({}, za.afterTags, Sa.afterTags, Ya),
        beforeWords: Object.assign({}, za.beforeWords, Sa.beforeWords, Xa),
        afterWords: Object.assign({}, za.afterWords, Sa.afterWords, eo),
      },
      no = {
        beforeTags: Object.assign({}, Ua.beforeTags, Sa.beforeTags, {
          Adjective: 'Singular',
        }),
        afterTags: Object.assign({}, Ua.afterTags, Sa.afterTags, {
          ProperNoun: 'Infinitive',
          Gerund: 'Infinitive',
          Adjective: 'Infinitive',
          Copula: 'Singular',
        }),
        beforeWords: Object.assign({}, Ua.beforeWords, Sa.beforeWords, {
          is: 'Singular',
          was: 'Singular',
          of: 'Singular',
        }),
        afterWords: Object.assign({}, Ua.afterWords, Sa.afterWords, {
          instead: 'Infinitive',
          about: 'Infinitive',
          to: null,
          by: null,
          in: null,
        }),
      }
    const ro = 'Person'
    var ao = {
      beforeTags: { Honorific: ro, Person: ro, Preposition: ro },
      afterTags: { Person: ro, ProperNoun: ro, Verb: ro },
      ownTags: { ProperNoun: ro },
      beforeWords: { hi: ro, hey: ro, yo: ro, dear: ro, hello: ro },
      afterWords: {
        said: ro,
        says: ro,
        told: ro,
        tells: ro,
        feels: ro,
        felt: ro,
        seems: ro,
        thinks: ro,
        thought: ro,
        spends: ro,
        spendt: ro,
        plays: ro,
        played: ro,
        sing: ro,
        sang: ro,
        learn: ro,
        learned: ro,
        wants: ro,
        wanted: ro,
      },
    }
    const oo = 'Month',
      io = {
        beforeTags: { Date: oo, Value: oo },
        afterTags: { Date: oo, Value: oo },
        beforeWords: {
          by: oo,
          in: oo,
          on: oo,
          during: oo,
          after: oo,
          before: oo,
          between: oo,
          until: oo,
          til: oo,
          sometime: oo,
          of: oo,
          this: oo,
          next: oo,
          last: oo,
          previous: oo,
          following: oo,
        },
        afterWords: { sometime: oo, in: oo, of: oo, until: oo, the: oo },
      }
    var so = {
      beforeTags: Object.assign({}, ao.beforeTags, io.beforeTags),
      afterTags: Object.assign({}, ao.afterTags, io.afterTags),
      beforeWords: Object.assign({}, ao.beforeWords, io.beforeWords),
      afterWords: Object.assign({}, ao.afterWords, io.afterWords),
    }
    const lo = { Place: 'Place' },
      uo = { Place: 'Place', Abbreviation: 'Place' },
      co = {
        in: 'Place',
        by: 'Place',
        near: 'Place',
        from: 'Place',
        to: 'Place',
      },
      ho = {
        in: 'Place',
        by: 'Place',
        near: 'Place',
        from: 'Place',
        to: 'Place',
        government: 'Place',
        council: 'Place',
        region: 'Place',
        city: 'Place',
      },
      po = {
        'Adj|Gerund': $a,
        'Adj|Noun': Ma,
        'Adj|Past': Ka,
        'Adj|Present': _a,
        'Noun|Verb': no,
        'Noun|Gerund': to,
        'Person|Noun': {
          beforeTags: Object.assign({}, Sa.beforeTags, ao.beforeTags),
          afterTags: Object.assign({}, Sa.afterTags, ao.afterTags),
          beforeWords: Object.assign({}, Sa.beforeWords, ao.beforeWords, {
            i: 'Infinitive',
            we: 'Infinitive',
          }),
          afterWords: Object.assign({}, Sa.afterWords, ao.afterWords),
        },
        'Person|Date': so,
        'Person|Verb': {
          beforeTags: Object.assign({}, ao.beforeTags, Ua.beforeTags),
          afterTags: Object.assign({}, ao.afterTags, Ua.afterTags),
          beforeWords: Object.assign({}, ao.beforeWords, Ua.beforeWords),
          afterWords: Object.assign({}, ao.afterWords, Ua.afterWords),
        },
        'Person|Place': {
          beforeTags: Object.assign({}, lo, ao.beforeTags),
          afterTags: Object.assign({}, uo, ao.afterTags),
          beforeWords: Object.assign({}, co, ao.beforeWords),
          afterWords: Object.assign({}, ho, ao.afterWords),
        },
      },
      mo = (e, t) => {
        let n = Object.keys(e).reduce(
          (t, n) => (
            (t[n] = 'Infinitive' === e[n] ? 'PresentTense' : 'Plural'), t
          ),
          {}
        )
        return Object.assign(n, t)
      }
    po['Plural|Verb'] = {
      beforeWords: mo(po['Noun|Verb'].beforeWords, {}),
      afterWords: mo(po['Noun|Verb'].afterWords, {
        his: 'PresentTense',
        her: 'PresentTense',
        its: 'PresentTense',
        in: null,
        to: null,
      }),
      beforeTags: mo(po['Noun|Verb'].beforeTags, {
        Conjunction: 'PresentTense',
        Noun: void 0,
        ProperNoun: 'PresentTense',
      }),
      afterTags: mo(po['Noun|Verb'].afterTags, {
        Gerund: 'Plural',
        Noun: 'PresentTense',
        Value: 'PresentTense',
      }),
    }
    var go = po
    const fo = 'Adjective',
      bo = 'Infinitive',
      vo = 'PresentTense',
      yo = 'Singular',
      wo = 'PastTense',
      ko = 'Adverb',
      Po = 'Plural',
      Ao = 'Actor',
      jo = 'Verb',
      xo = 'Noun',
      Eo = 'LastName',
      No = 'Modal',
      Io = 'Participle'
    var To = [
      null,
      null,
      { ea: yo, ia: xo, ic: fo, ly: ko, "'n": jo, "'t": jo },
      {
        oed: wo,
        ued: wo,
        xed: wo,
        ' so': ko,
        "'ll": No,
        "'re": 'Copula',
        azy: fo,
        eer: xo,
        end: jo,
        ped: wo,
        ffy: fo,
        ify: bo,
        ing: 'Gerund',
        ize: bo,
        ibe: bo,
        lar: fo,
        mum: fo,
        nes: vo,
        nny: fo,
        ous: fo,
        que: fo,
        rol: yo,
        sis: yo,
        ogy: yo,
        oid: yo,
        ian: yo,
        zes: vo,
        eld: wo,
        ken: Io,
        ven: Io,
        ten: Io,
        ect: bo,
        ict: bo,
        ign: bo,
        ful: fo,
        bal: fo,
      },
      {
        amed: wo,
        aped: wo,
        ched: wo,
        lked: wo,
        rked: wo,
        reed: wo,
        nded: wo,
        mned: fo,
        cted: wo,
        dged: wo,
        ield: yo,
        akis: Eo,
        cede: bo,
        chuk: Eo,
        czyk: Eo,
        ects: vo,
        ends: jo,
        enko: Eo,
        ette: yo,
        wner: yo,
        fies: vo,
        fore: ko,
        gate: bo,
        gone: fo,
        ices: Po,
        ints: Po,
        ruct: bo,
        ines: Po,
        ions: Po,
        less: fo,
        llen: fo,
        made: fo,
        nsen: Eo,
        oses: vo,
        ould: No,
        some: fo,
        sson: Eo,
        tion: yo,
        tage: xo,
        ique: yo,
        tive: fo,
        tors: xo,
        vice: yo,
        lier: yo,
        fier: yo,
        wned: wo,
        gent: yo,
        tist: yo,
        pist: yo,
        rist: yo,
        mist: yo,
        yist: yo,
        vist: yo,
        lite: yo,
        site: yo,
        rite: yo,
        mite: yo,
        bite: yo,
        mate: yo,
        date: yo,
        ndal: yo,
        vent: yo,
        uist: yo,
        gist: yo,
        note: yo,
        cide: yo,
        wide: fo,
        vide: bo,
        ract: bo,
        duce: bo,
        pose: bo,
        eive: bo,
        lyze: bo,
        lyse: bo,
        iant: fo,
        nary: fo,
      },
      {
        elist: yo,
        holic: yo,
        phite: yo,
        tized: wo,
        urned: wo,
        eased: wo,
        ances: Po,
        bound: fo,
        ettes: Po,
        fully: ko,
        ishes: vo,
        ities: Po,
        marek: Eo,
        nssen: Eo,
        ology: xo,
        osome: yo,
        tment: yo,
        ports: Po,
        rough: fo,
        tches: vo,
        tieth: 'Ordinal',
        tures: Po,
        wards: ko,
        where: ko,
        archy: xo,
        pathy: xo,
        opoly: xo,
        embly: xo,
        phate: xo,
        ndent: yo,
        scent: yo,
        onist: yo,
        anist: yo,
        alist: yo,
        olist: yo,
        icist: yo,
        ounce: bo,
        iable: fo,
        borne: fo,
        gnant: fo,
        inant: fo,
        igent: fo,
        atory: fo,
        rient: yo,
        dient: yo,
      },
      {
        auskas: Eo,
        parent: yo,
        cedent: yo,
        ionary: yo,
        cklist: yo,
        keeper: Ao,
        logist: Ao,
        teenth: 'Value',
      },
      { opoulos: Eo, borough: 'Place', sdottir: Eo },
    ]
    const Go = 'Adjective',
      Do = 'Noun',
      Co = 'Verb'
    var Oo = [
      null,
      null,
      {},
      { neo: Do, bio: Do, 'de-': Co, 're-': Co, 'un-': Co },
      {
        anti: Do,
        auto: Do,
        faux: Go,
        hexa: Do,
        kilo: Do,
        mono: Do,
        nano: Do,
        octa: Do,
        poly: Do,
        semi: Go,
        tele: Do,
        'pro-': Go,
        'mis-': Co,
        'dis-': Co,
        'pre-': Go,
      },
      {
        anglo: Do,
        centi: Do,
        ethno: Do,
        ferro: Do,
        grand: Do,
        hepta: Do,
        hydro: Do,
        intro: Do,
        macro: Do,
        micro: Do,
        milli: Do,
        nitro: Do,
        penta: Do,
        quasi: Go,
        radio: Do,
        tetra: Do,
        'omni-': Go,
        'post-': Go,
      },
      {
        pseudo: Go,
        'extra-': Go,
        'hyper-': Go,
        'inter-': Go,
        'intra-': Go,
        'deca-': Go,
      },
      { electro: Do },
    ]
    const Vo = 'Adjective',
      Bo = 'Infinitive',
      zo = 'PresentTense',
      $o = 'Singular',
      Fo = 'PastTense',
      So = 'Adverb',
      Ho = 'Expression',
      Mo = 'Actor',
      Lo = 'Verb',
      Wo = 'Noun',
      Jo = 'LastName'
    var qo = {
      a: [
        [/.[aeiou]na$/, Wo, 'tuna'],
        [/.[oau][wvl]ska$/, Jo],
        [/.[^aeiou]ica$/, $o, 'harmonica'],
        [/^([hyj]a+)+$/, Ho, 'haha'],
      ],
      c: [[/.[^aeiou]ic$/, Vo]],
      d: [
        [/[aeiou](pp|ll|ss|ff|gg|tt|rr|bb|nn|mm)ed$/, Fo, 'popped'],
        [/.[aeo]{2}[bdgmnprvz]ed$/, Fo, 'rammed'],
        [/.[aeiou][sg]hed$/, Fo, 'gushed'],
        [/.[aeiou]red$/, Fo, 'hired'],
        [/.[aeiou]r?ried$/, Fo, 'hurried'],
        [/[^aeiou]ard$/, $o, 'steward'],
        [/[aeiou][^aeiou]id$/, Vo, ''],
        [/.[vrl]id$/, Vo, 'livid'],
        [/..led$/, Fo, 'hurled'],
        [/.[iao]sed$/, Fo, ''],
        [/[aeiou]n?[cs]ed$/, Fo, ''],
        [/[aeiou][rl]?[mnf]ed$/, Fo, ''],
        [/[aeiou][ns]?c?ked$/, Fo, 'bunked'],
        [/[aeiou]gned$/, Fo],
        [/[aeiou][nl]?ged$/, Fo],
        [/.[tdbwxyz]ed$/, Fo],
        [/[^aeiou][aeiou][tvx]ed$/, Fo],
        [/.[cdflmnprstv]ied$/, Fo, 'emptied'],
      ],
      e: [
        [/.[lnr]ize$/, Bo, 'antagonize'],
        [/.[^aeiou]ise$/, Bo, 'antagonise'],
        [/.[aeiou]te$/, Bo, 'bite'],
        [/.[^aeiou][ai]ble$/, Vo, 'fixable'],
        [/.[^aeiou]eable$/, Vo, 'maleable'],
        [/.[ts]ive$/, Vo, 'festive'],
        [/[a-z]-like$/, Vo, 'woman-like'],
      ],
      h: [
        [/.[^aeiouf]ish$/, Vo, 'cornish'],
        [/.v[iy]ch$/, Jo, '..ovich'],
        [/^ug?h+$/, Ho, 'ughh'],
        [/^uh[ -]?oh$/, Ho, 'uhoh'],
        [/[a-z]-ish$/, Vo, 'cartoon-ish'],
      ],
      i: [[/.[oau][wvl]ski$/, Jo, 'polish-male']],
      k: [[/^(k){2}$/, Ho, 'kkkk']],
      l: [
        [/.[gl]ial$/, Vo, 'familial'],
        [/.[^aeiou]ful$/, Vo, 'fitful'],
        [/.[nrtumcd]al$/, Vo, 'natal'],
        [/.[^aeiou][ei]al$/, Vo, 'familial'],
      ],
      m: [
        [/.[^aeiou]ium$/, $o, 'magnesium'],
        [/[^aeiou]ism$/, $o, 'schism'],
        [/^[hu]m+$/, Ho, 'hmm'],
        [/^\d+ ?[ap]m$/, 'Date', '3am'],
      ],
      n: [
        [/.[lsrnpb]ian$/, Vo, 'republican'],
        [/[^aeiou]ician$/, Mo, 'musician'],
        [/[aeiou][ktrp]in'$/, 'Gerund', "cookin'"],
      ],
      o: [
        [/^no+$/, Ho, 'noooo'],
        [/^(yo)+$/, Ho, 'yoo'],
        [/^wo{2,}[pt]?$/, Ho, 'woop'],
      ],
      r: [
        [/.[bdfklmst]ler$/, 'Noun'],
        [/[aeiou][pns]er$/, $o],
        [/[^i]fer$/, Bo],
        [/.[^aeiou][ao]pher$/, Mo],
        [/.[lk]er$/, 'Noun'],
        [/.ier$/, 'Comparative'],
      ],
      t: [
        [/.[di]est$/, 'Superlative'],
        [/.[icldtgrv]ent$/, Vo],
        [/[aeiou].*ist$/, Vo],
        [/^[a-z]et$/, Lo],
      ],
      s: [
        [/.[^aeiou]ises$/, zo],
        [/.[rln]ates$/, zo],
        [/.[^z]ens$/, Lo],
        [/.[lstrn]us$/, $o],
        [/.[aeiou]sks$/, zo],
        [/.[aeiou]kes$/, zo],
        [/[aeiou][^aeiou]is$/, $o],
        [/[a-z]'s$/, Wo],
        [/^yes+$/, Ho],
      ],
      v: [[/.[^aeiou][ai][kln]ov$/, Jo]],
      y: [
        [/.[cts]hy$/, Vo],
        [/.[st]ty$/, Vo],
        [/.[tnl]ary$/, Vo],
        [/.[oe]ry$/, $o],
        [/[rdntkbhs]ly$/, So],
        [/.(gg|bb|zz)ly$/, Vo],
        [/...lly$/, So],
        [/.[gk]y$/, Vo],
        [/[bszmp]{2}y$/, Vo],
        [/.[ai]my$/, Vo],
        [/[ea]{2}zy$/, Vo],
        [/.[^aeiou]ity$/, $o],
      ],
    }
    const Ko = 'Verb',
      Ro = 'Noun'
    var Uo = {
        leftTags: [
          ['Adjective', Ro],
          ['Possessive', Ro],
          ['Determiner', Ro],
          ['Adverb', Ko],
          ['Pronoun', Ko],
          ['Value', Ro],
          ['Ordinal', Ro],
          ['Modal', Ko],
          ['Superlative', Ro],
          ['Demonym', Ro],
          ['Honorific', 'Person'],
        ],
        leftWords: [
          ['i', Ko],
          ['first', Ro],
          ['it', Ko],
          ['there', Ko],
          ['not', Ko],
          ['because', Ro],
          ['if', Ro],
          ['but', Ro],
          ['who', Ko],
          ['this', Ro],
          ['his', Ro],
          ['when', Ro],
          ['you', Ko],
          ['very', 'Adjective'],
          ['old', Ro],
          ['never', Ko],
          ['before', Ro],
          ['a', 'Singular'],
          ['the', Ro],
          ['been', Ko],
        ],
        rightTags: [
          ['Copula', Ro],
          ['PastTense', Ro],
          ['Conjunction', Ro],
          ['Modal', Ro],
        ],
        rightWords: [
          ['there', Ko],
          ['me', Ko],
          ['man', 'Adjective'],
          ['only', Ko],
          ['him', Ko],
          ['it', Ko],
          ['were', Ro],
          ['took', Ro],
          ['himself', Ko],
          ['went', Ro],
          ['who', Ro],
          ['jr', 'Person'],
        ],
      },
      Qo = {
        rules:
          'ig|2ger,ng|2er,hin|3ner,n|1er,ot|2ter,lat|3ter,t|1er,ray|3er,y|ier,ross|4er,im|2mer,m|1er,f|1er,b|1er,er|2,r|1er,p|1er,h|1er,w|1er,k|1er,l|1er,d|1er,e|1r',
        exceptions:
          'good|better,bad|worse,wet|3ter,lay|3er,neat|4ter,fat|3ter,mad|3der,sad|3der,wide|4r,late|4r,safe|4r,fine|4r,dire|4r,fake|4r,pale|4r,rare|4r,rude|4r,sore|4r',
        rev: 'arger|4,esser|5,igger|2,impler|5,reer|3,hinner|3,remier|6,urer|3,aucher|5,almer|3,raver|4,uter|3,iviner|5,erier|4,enuiner|6,rosser|4,uger|3,andomer|5,emoter|5,quarer|5,taler|4,iper|3,hiter|4,rther|5,rmer|2,ayer|2,immer|2,somer|4,amer|3,adder|2,nger|2,fer|1,tler|3,cer|2,ber|1,uer|2,bler|3,tter|1,rer|1,ser|2,per|1,her|1,wer|1,ker|1,ner|1,ler|1,ter|1,der|1,ier|y',
      },
      _o = {
        rules:
          'omoting|4e,haring|3e,ploring|4e,mbining|4e,nviting|4e,belling|3,ntoring|4e,uiding|3e,orging|3e,dhering|4e,alysing|4e,nciling|4e,mpeding|4e,uoting|3e,evoting|4e,nsating|4e,gnoring|4e,roding|3e,iaising|4e,esaling|4e,rowsing|4e,rfering|4e,kating|3e,robing|3e,tponing|4e,mmuting|4e,laning|3e,moking|3e,nfining|4e,nduring|4e,nciting|4e,busing|3e,eleting|4e,esiring|4e,rbating|4e,larging|4e,ploding|4e,haking|3e,hading|3e,biding|3e,udding|2,neating|4e,craping|4e,efuting|4e,thoring|4e,eusing|3e,agining|4e,rekking|3,suading|4e,ubating|4e,ronzing|4e,euvring|4e,bliging|4e,laking|3e,riming|3e,asising|4e,lunging|4e,cilling|3,pinging|4e,hoking|3e,creting|4e,ralling|3,miling|3e,wathing|4e,edoring|4e,odding|2,aloging|4e,rseding|4e,xcusing|4e,halling|3,ialling|3,inuting|4e,xciting|4e,chuting|4e,hrining|4e,eciting|4e,xuding|3e,isusing|4e,uizzing|3,ithing|3e,izzling|4e,haling|3e,dmiring|4e,rsaking|4e,parging|4e,ixating|4e,anuring|4e,iecing|3e,erusing|4e,eething|4e,entring|4e,goating|4e,langing|4e,stining|4e,lescing|4e,erlying|3ie,pleting|4e,ausing|3e,ciding|3e,enging|3e,casing|3e,cising|3e,esiding|4e,uning|2e,delling|3,storing|4e,tiring|3e,leging|3e,piling|3e,tising|3e,ecuting|4e,eduling|4e,uelling|3,liding|3e,uging|2e,celling|3,ubing|2e,laming|3e,ebating|4e,njuring|4e,scaping|4e,truding|4e,chising|4e,vading|3e,shaping|4e,iping|2e,naming|3e,ulging|3e,raking|3e,fling|2e,taping|3e,noting|3e,lading|3e,scaling|4e,riding|3e,rasing|3e,coping|3e,ruling|3e,wining|3e,viding|3e,quiring|4e,velling|3,alyzing|4e,laring|3e,coring|3e,ranging|4e,ousing|3e,puting|3e,vening|3e,idding|2,hining|3e,urging|3e,coding|3e,niting|3e,nelling|3,dising|3e,uising|3e,caring|3e,lapsing|4e,erging|3e,pating|3e,mining|3e,ibuting|4e,coming|3e,paring|3e,taking|3e,hasing|3e,vising|3e,ituting|4e,writing|4e,eezing|3e,piring|3e,luting|3e,voking|3e,iguring|4e,uming|2e,curing|3e,mising|3e,iking|2e,edding|2,luding|3e,suring|3e,rising|3e,ribing|3e,rading|3e,ceding|3e,nsing|2e,kling|2e,fusing|3e,azing|2e,cling|2e,nising|3e,ducing|3e,rcing|2e,gling|2e,easing|3e,uating|3e,lising|3e,lining|3e,mating|3e,mming|1,pling|2e,bbing|1,vating|3e,dling|2e,dating|3e,rsing|2e,dging|2e,tling|2e,turing|3e,icing|2e,acing|2e,gating|3e,gging|1,tating|3e,rring|1,nning|1,uing|1e,bling|2e,iating|3e,cating|3e,aging|2e,osing|2e,ncing|2e,nating|3e,pping|1,lating|3e,tting|1,rating|3e,ving|1e,izing|2e,ing|',
        exceptions:
          'being|is,using|2e,making|3e,creating|5e,changing|5e,owing|2e,raising|4e,competing|6e,defining|5e,counselling|7,hiring|3e,filing|3e,controlling|7,totalling|5,infringing|7e,citing|3e,dying|1ie,doping|3e,baking|3e,hoping|3e,refining|5e,exchanging|7e,charging|5e,stereotyping|9e,voting|3e,tying|1ie,discharging|8e,basing|3e,lying|1ie,expediting|7e,typing|3e,breathing|6e,framing|4e,boring|3e,dining|3e,firing|3e,hiding|3e,appraising|7e,tasting|4e,waning|3e,distilling|6,baling|3e,boning|3e,faring|3e,honing|3e,wasting|4e,phoning|4e,luring|3e,propelling|6,timing|3e,wading|3e,abating|4e,compelling|6,vying|1ie,fading|3e,biting|3e,zoning|3e,dispelling|6,pasting|4e,praising|5e,telephoning|8e,daring|3e,waking|3e,shoring|4e,gaming|3e,padding|3,rerouting|6e,fringing|5e,braising|5e,coking|3e,recreating|7e,sloping|4e,sunbathing|7e,overcharging|9e,everchanging|9e,patrolling|6,joking|3e,extolling|5,expelling|5,reappraising|9e,wadding|3,gaping|3e,poking|3e,persevering|8e,pining|3e,recordkeeping|10e,landfilling|7,liming|3e,interchanging|10e,toting|3e,roping|3e,wiring|3e,aching|3e,gassing|3,getting|3,travelling|6,putting|3,sitting|3,betting|3,mapping|3,tapping|3,letting|3,hitting|3,tanning|3,netting|3,popping|3,fitting|3,deterring|5,barring|3,banning|3,vetting|3,omitting|4,wetting|3,plotting|4,budding|3,clotting|4,hemming|3,slotting|4,singeing|5,reprogramming|9,jetting|3,kidding|3,befitting|5,podding|3,wedding|3,donning|3,warring|3,penning|3,gutting|3,cueing|3,refitting|5,petting|3,cramming|4,napping|3,tinning|3',
        rev: 'lan|3ning,egin|4ning,can|3ning,pan|3ning,hin|3ning,kin|3ning,win|3ning,un|2ning,pin|3ning,n|1ing,ounsel|6ling,otal|4ling,abel|4ling,evel|4ling,ancel|5ling,istil|5ling,xcel|4ling,tencil|6ling,piral|5ling,arshal|6ling,nitial|6ling,hrivel|6ling,xtol|4ling,andfil|6ling,trol|4ling,fuel|4ling,model|5ling,nnel|4ling,pel|3ling,l|1ing,ransfer|7ring,lur|3ring,tir|3ring,tar|3ring,pur|3ring,car|3ring,nfer|4ring,efer|4ring,cur|3ring,r|1ing,ermit|5ting,ransmit|7ting,ommit|5ting,nit|3ting,orget|5ting,abysit|6ting,dmit|4ting,hut|3ting,hat|3ting,utfit|5ting,but|3ting,egret|5ting,llot|4ting,mat|3ting,pot|3ting,lit|3ting,emit|4ting,submit|6ting,pit|3ting,rot|3ting,quit|4ting,cut|3ting,set|3ting,t|1ing,tem|3ming,wim|3ming,kim|3ming,um|2ming,rim|3ming,m|1ing,tep|3ping,wap|3ping,top|3ping,hop|3ping,cap|3ping,rop|3ping,rap|3ping,lap|3ping,ip|2ping,p|1ing,ye|2ing,oe|2ing,ie|ying,ee|2ing,e|ing,hed|3ding,hred|4ding,bed|3ding,bid|3ding,d|1ing,ki|2ing,rek|3king,k|1ing,isc|3ing,echarg|6ing,ng|2ing,g|1ging,uiz|3zing,z|1ing,mb|2ing,rb|2ing,b|1bing,o|1ing,x|1ing,f|1ing,s|1ing,w|1ing,y|1ing,h|1ing',
      },
      Zo = {
        rules:
          'roken|1ake,hosen|2ose,allen|3,rozen|1eeze,asten|4,engthen|5,essen|3,hrunken|2ink,lain|2y,poken|1eak,tolen|1eal,eaten|3,un|in,itten|2e,gotten|1et,ighten|4,idden|2e,worn|1ear,sen|2,aken|3,ven|2,wn|1,rought|1ing,uilt|3d,urst|4,ealt|3,reamt|4,urt|3,nelt|2el,eapt|3,eft|1ave,eant|3,hot|2ot,pat|1it,et|2,ut|2,it|2,ent|2d,ept|1ep,urned|3,reated|5,eard|3,eld|old,ead|3,lid|3e,old|ell,ped|2ed,pilled|4,ound|ind,ved|2,aid|1y,ug|ig,ung|ing,ade|1ke,hone|1ine,come|4,gone|2,nuck|1eak,unk|ink',
        exceptions:
          'been|2,bled|3ed,bought|1uy,fed|2ed,fled|3e,flown|2y,fought|1ight,had|2ve,hung|1ang,led|2ad,lit|2ght,met|2et,run|3,sat|1eat,seen|3,sought|1eek,woven|1eave,bet|3,brought|2ing,dealt|4,dived|4,heard|4,left|2ave,made|2ke,read|4,shaved|5,slain|3y',
        rev: 'uy|ought,ly|1own,ay|1id,rake|1oken,hoose|2sen,reate|5d,lee|2d,reeze|1ozen,aste|4n,rove|4n,hine|1one,lide|3,hrive|5d,come|4,ite|2ten,ide|2den,se|2n,ake|3n,ive|3n,uild|3t,old|eld,ind|ound,eed|1d,end|2t,urn|3ed,ean|3t,un|2,in|un,urst|4,right|5en,eight|5en,urt|3,eet|1t,hoot|2t,pit|1at,eat|3en,get|1otten,set|3,ut|2,it|2,ream|4t,ig|ug,ang|ung,ing|ung,all|3en,neel|2lt,ell|old,pill|4ed,teal|1olen,eap|3t,eep|1pt,ength|5en,ess|3en,hrink|2unken,neak|1uck,eek|ought,peak|1oken,ink|unk,wear|1orn,go|2ne,w|1n',
      },
      Yo = {
        rules:
          'as|1ve,tudies|3y,mbodies|4y,evies|2y,arties|3y,emedies|4y,mpties|3y,eadies|3y,obbies|3y,ullies|3y,nesties|4y,zzes|2,pies|1y,nies|1y,oes|1,xes|1,plies|2y,ries|1y,shes|2,sses|2,ches|2,fies|1y,s|',
        exceptions: 'are|is,focuses|5,relies|3y,flies|2y,gasses|3,has|2ve',
        rev: 'uy|2s,oy|2s,ey|2s,ay|2s,y|ies,adio|4s,aboo|4s,o|1es,tograph|7s,erth|4s,gh|2s,h|1es,as|2ses,s|1es,ic|2s,zz|2es,x|1es,f|1s,b|1s,g|1s,m|1s,w|1s,p|1s,k|1s,l|1s,d|1s,n|1s,r|1s,t|1s,e|1s',
      },
      Xo = {
        rules:
          'east|4,uthwest|7,ot|2test,it|2test,lat|3test,weet|4test,t|1est,ig|2gest,ng|2est,hin|3nest,n|1est,nner|4most,uter|4most,r|1est,rey|3est,ricey|3iest,y|iest,ross|4est,f|1est,b|1est,m|1est,p|1est,h|1est,w|1est,k|1est,l|1est,d|1est,e|1st',
        exceptions:
          'good|best,bad|worst,wet|3test,far|1urthest,gay|3est,neat|4test,shy|3est,fat|3test,late|4st,wide|4st,fine|4st,severe|6st,fake|4st,pale|4st,rare|4st,rude|4st,sore|4st,dire|4st',
        rev: 'east|4,argest|4,iggest|2,implest|5,afest|3,uthwest|7,hinnest|3,ncerest|5,urthest|ar,ravest|4,utest|3,eriest|4,rossest|4,dsomest|5,ugest|3,riciest|3ey,emotest|5,quarest|5,rangest|5,ipest|3,urest|3,cest|2,ermost|2,fest|1,best|1,amest|3,itest|3,ngest|2,uest|2,yest|1,tlest|3,mest|1,blest|3,sest|2,pest|1,hest|1,ttest|1,west|1,rest|1,kest|1,nest|1,lest|1,test|1,dest|1,iest|y',
      }
    const ei = /^.([0-9]+)/
    var ti = function (e, t, n) {
      if (t.exceptions.hasOwnProperty(e))
        return (
          n && console.log('exception, ', e, t.exceptions[e]),
          (function (e, t) {
            let n = t.exceptions[e],
              r = n.match(ei)
            if (null === r) return t.exceptions[e]
            let a = Number(r[1]) || 0
            return e.substr(0, a) + n.replace(ei, '')
          })(e, t)
        )
      let r = t.rules
      t.reversed && (r = t.rev),
        (r = (function (e, t = {}) {
          let n = t[e[e.length - 1]] || []
          return t[''] && (n = n.concat(t[''])), n
        })(e, r))
      for (let t = 0; t < r.length; t += 1) {
        let a = r[t][0]
        if (e.endsWith(a)) {
          n && console.log('rule, ', r[t])
          let o = new RegExp(a + '$')
          return e.replace(o, r[t][1])
        }
      }
      return n && console.log(' x - ' + e), e
    }
    const ni = function (e) {
        let t = {}
        return (
          e.forEach((e) => {
            let n = e[0] || '',
              r = n[n.length - 1] || ''
            ;(t[r] = t[r] || []), t[r].push(e)
          }),
          t
        )
      },
      ri = /^([0-9]+)/,
      ai = function (e) {
        const t = /\|/
        return e.split(/,/).map((e) => {
          let n = e.split(t)
          return (function (e = '', t = '') {
            let n = (t = String(t)).match(ri)
            if (null === n) return [e, t]
            let r = Number(n[1]) || 0,
              a = e.substring(0, r)
            return [e, a + t.replace(ri, '')]
          })(n[0], n[1])
        })
      }
    var oi = function (e = {}) {
        return (
          ((e = Object.assign({}, e)).rules = ai(e.rules)),
          (e.rules = ni(e.rules)),
          e.rev && ((e.rev = ai(e.rev)), (e.rev = ni(e.rev))),
          (e.exceptions = ai(e.exceptions)),
          (e.exceptions = e.exceptions.reduce(
            (e, t) => ((e[t[0]] = t[1]), e),
            {}
          )),
          e
        )
      },
      ii = function (e) {
        let { rules: t, exceptions: n, rev: r } = e
        var a
        return (
          (a = n),
          (n = Object.entries(a).reduce((e, t) => ((e[t[1]] = t[0]), e), {})),
          { reversed: !Boolean(e.reversed), rules: t, exceptions: n, rev: r }
        )
      }
    const si = oi({
        rules:
          'een|1,egan|2in,on|in,pun|1in,hun|3ned,wn|1,ave|ive,poke|1eak,hose|2ose,roke|1eak,roze|1eeze,ode|ide,orbade|3id,hone|1ine,tole|1eal,ollide|6d,rose|1ise,woke|1ake,wrote|2ite,made|2ke,came|1ome,ove|ive,ore|ear,elped|3,elcomed|6,hared|4,nvited|5,eclared|6,eard|3,avelled|4,ombined|6,uided|4,etired|5,choed|3,ncelled|4,epeated|5,moked|4,entred|5,dhered|5,esired|5,ompeted|6,erseded|6,ramed|4,qualled|4,iloted|4,stponed|6,uelled|3,opelled|4,gnored|5,xtruded|6,caled|4,ndured|5,lamed|4,quared|5,mpeded|5,rouped|4,efeated|5,robed|4,lid|3e,magined|6,nselled|4,uthored|6,ebuted|4,shrined|6,tialled|4,erfered|6,eaped|3,yped|3,laked|4,tirred|3,ooted|3,leated|4,ncited|5,oubted|4,mpelled|4,nnulled|4,pined|4,ircled|5,ecited|5,reathed|6,nvaded|5,onfided|6,pedited|6,alcined|6,ycotted|5,dmired|5,xcreted|6,ubed|3,taked|4,onfined|6,heated|4,rimed|4,amelled|4,achined|6,litzed|4,xcited|5,xpelled|4,xtolled|4,ouled|3,imicked|4,ivalled|4,eeped|3,naked|4,tyled|4,iased|3,nhaled|5,oeuvred|6,grammed|6,kied|2,miled|4,pited|4,lodded|3,eterred|4,hoked|4,kidded|3,rod|3ded,pleted|5,cided|4,plored|5,stored|5,longed|4,filed|4,rbed|2,suaded|5,ciled|4,edded|2,tined|4,phoned|5,fled|3,nited|4,iped|3,hauled|4,treated|5,nnelled|4,basted|5,njured|5,twined|5,uzzed|3,did|1o,vided|4,old|ell,pared|4,mbed|2,stood|2and,pired|4,held|1old,vened|4,cored|4,read|4,piled|4,aped|3,gled|3,named|4,arred|2,oated|3,kled|3,ooled|3,uned|3,figured|6,bid|3,ound|ind,oped|2,ibed|3,quired|5,uled|3,oded|3,mmed|1,ceded|4,cured|4,sided|4,voked|4,rled|2,outed|3,mined|4,urred|2,ighted|4,umed|3,sured|4,iked|3,pled|3,fed|1,bbed|1,eled|2,luded|4,aid|1y,ferred|3,tled|3,dled|3,raded|4,oted|3,eed|2,aled|2,lined|4,mped|2,fted|2,lted|2,gged|1,eted|2,xed|1,bled|3,pted|2,tured|4,uted|3,nned|1,ued|2,iled|2,yed|1,rted|2,pped|1,tted|1,wed|1,lled|2,ited|2,med|1,sted|2,ssed|2,ged|2,ved|2,nted|2,ked|1,cted|2,ced|2,ied|y,hed|1,sed|2,ded|1,zed|2,ned|1,red|1,ated|3,ell|all,ulfil|5led,rought|1ing,hought|1ink,eft|1ave,eant|3,ealt|3,eat|3,hot|2ot,urt|3,eapt|3,elt|1el,went|go,built|4d,at|it,got|1et,ut|2,it|2,et|2,ent|2d,ept|1ep,st|2,truck|2ike,nuck|1eak,tunk|1ink,ank|ink,ook|ake,lew|1y,utgrow|4ew,drew|2aw,saw|1ee,ew|ow,ug|ig,ang|ing,ung|ing,nderlay|5ie,dezvous|7,wam|1im,lam|3med,nearth|6s',
        exceptions:
          'was|is,were|are,had|2ve,led|2ad,met|2et,cited|4,focused|5,sought|1eek,lost|3e,defined|6,died|3,hired|4,bought|1uy,ran|1un,controlled|7,taught|1each,hoped|4,shed|4,refined|6,caught|2tch,owed|3,fought|1ight,fired|4,fed|2ed,pied|3,fared|4,tied|3,fled|3e,cared|4,ate|eat,dyed|3,lit|2ght,winged|4,bred|3ed,pent|3,wired|4,persevered|9,baked|4,dined|4,fined|4,shored|5,hid|3e,padded|3,waned|4,wove|1eave,lied|3,wasted|5,sloped|5,joked|4,ached|4,baled|4,bit|3e,bled|3ed,boned|4,caned|4,dispelled|6,egged|3,hung|1ang,patrolled|6,tasted|5,faked|4,bored|4,eyed|3,gamed|4,gassed|3,pored|4,timed|4,toned|4,zoned|4,poked|4,dared|4,been|2,said|2y,found|1ind,took|1ake,came|1ome,gave|1ive,fell|1all,brought|2ing,rose|1ise,grew|2ow,put|3,sent|3d,spent|4d,spoke|2eak,left|2ave,won|1in,told|1ell,meant|4,heard|4,got|1et,arose|2ise,read|4,let|3,hit|3,cost|4,dealt|4,laid|2y,drove|2ive,sat|1it,cast|4,beat|4,flew|2y,lent|3d,sang|1ing,banned|3,jarred|3,wound|1ind,omitted|4,quit|4,rang|1ing,fit|3,rent|3d,bet|3,sank|1ink,reaped|4,manned|3,rode|1ide,rebutted|5,bound|1ind,barred|3,recast|6,netted|3,tanned|3,plotted|4,tore|1ear,spun|2in,pitted|3,shone|2ine,donned|3,dove|1ive,spat|2it,bent|3d,blown|4,leapt|4,seeped|4,sewn|3,twinned|4,wrung|2ing,deterred|5',
        rev: 'egin|2an,lan|3ned,nderpin|7ned,kin|3ned,tun|3ned,hin|3ned,pan|3ned,can|3ned,n|1ed,ecome|2ame,hoose|2se,trike|2uck,lee|2d,trive|2ove,vercome|4ame,lide|3,reeze|1oze,hake|1ook,nderlie|5ay,istake|3ook,etake|2ook,wake|1oke,write|2ote,make|2de,rtake|2ook,see|1aw,e|1d,elp|3ed,roup|4ed,oop|3ed,velop|5ed,eep|1pt,mp|2ed,p|1ped,hink|1ought,eek|ought,reak|1oke,neak|1uck,tink|1unk,rink|1ank,k|1ed,ommit|5ted,ermit|5ted,oadcast|7,dmit|4ted,hoot|2t,plit|4,hut|3,llot|4ted,nit|3ted,orget|3ot,egret|5ted,hrust|5,ormat|5ted,hat|3ted,lat|3ted,urt|3,cquit|5ted,urst|4,ransmit|7ted,emit|4ted,pot|3ted,cut|3,submit|6ted,set|3,t|1ed,now|1ew,trew|4n,utgrew|4ow,draw|2ew,throw|3ew,w|1ed,uy|ought,ey|2ed,pay|2id,oy|2ed,ay|2ed,y|ied,ravel|5led,ancel|5led,qual|4led,uel|3led,ounsel|6led,nitial|6led,nnul|4led,namel|5led,xtol|4led,ival|4led,teal|1ole,eel|1lt,trol|4led,sell|1old,nnel|4led,pel|3led,l|1ed,ransfer|7red,pur|3red,lur|3red,tir|3red,par|3red,nfer|4red,wear|1ore,bear|1ore,efer|4red,cur|3red,r|1ed,pread|5,hed|3,rind|1ound,mbed|4ded,reed|2d,hred|4ded,eread|5,orbid|3ade,leed|2d,lod|3ded,kid|3ded,ollided|6,lammed|3,hunned|3,rodded|3,lfilled|4,build|4t,stand|2ood,hold|1eld,bid|3,d|1ed,cho|3ed,go|went,do|1id,tem|3med,um|2med,rim|3med,kim|3med,wim|1am,m|1ed,lug|3ged,ig|ug,pring|2ang,gg|2ed,ang|ung,long|4ed,og|2ged,ling|1ung,ag|2ged,ub|2bed,ib|2bed,ob|2bed,rb|2ed,ab|2bed,mb|2ed,imic|4ked,dezvous|7,nearths|6,s|1ed,ki|2ed,z|1ed,f|1ed,x|1ed,h|1ed',
      }),
      li = oi(Yo),
      ui = oi(_o),
      ci = oi(Zo),
      hi = ii(si),
      di = ii(li),
      pi = ii(ui),
      mi = ii(ci),
      gi = oi(Qo),
      fi = oi(Xo)
    var bi = {
        fromPast: si,
        fromPresent: li,
        fromGerund: ui,
        fromParticiple: ci,
        toPast: hi,
        toPresent: di,
        toGerund: pi,
        toParticiple: mi,
        toComparative: gi,
        toSuperlative: fi,
        fromComparative: ii(gi),
        fromSuperlative: ii(fi),
      },
      vi = [
        'academy',
        'administration',
        'agence',
        'agences',
        'agencies',
        'agency',
        'airlines',
        'airways',
        'army',
        'assoc',
        'associates',
        'association',
        'assurance',
        'authority',
        'autorite',
        'aviation',
        'bank',
        'banque',
        'board',
        'boys',
        'brands',
        'brewery',
        'brotherhood',
        'brothers',
        'bureau',
        'cafe',
        'co',
        'caisse',
        'capital',
        'care',
        'cathedral',
        'center',
        'centre',
        'chemicals',
        'choir',
        'chronicle',
        'church',
        'circus',
        'clinic',
        'clinique',
        'club',
        'co',
        'coalition',
        'coffee',
        'collective',
        'college',
        'commission',
        'committee',
        'communications',
        'community',
        'company',
        'comprehensive',
        'computers',
        'confederation',
        'conference',
        'conseil',
        'consulting',
        'containers',
        'corporation',
        'corps',
        'corp',
        'council',
        'crew',
        'data',
        'departement',
        'department',
        'departments',
        'design',
        'development',
        'directorate',
        'division',
        'drilling',
        'education',
        'eglise',
        'electric',
        'electricity',
        'energy',
        'ensemble',
        'enterprise',
        'enterprises',
        'entertainment',
        'estate',
        'etat',
        'faculty',
        'federation',
        'financial',
        'fm',
        'foundation',
        'fund',
        'gas',
        'gazette',
        'girls',
        'government',
        'group',
        'guild',
        'herald',
        'holdings',
        'hospital',
        'hotel',
        'hotels',
        'inc',
        'industries',
        'institut',
        'institute',
        'institutes',
        'insurance',
        'international',
        'interstate',
        'investment',
        'investments',
        'investors',
        'journal',
        'laboratory',
        'labs',
        'llc',
        'ltd',
        'limited',
        'machines',
        'magazine',
        'management',
        'marine',
        'marketing',
        'markets',
        'media',
        'memorial',
        'ministere',
        'ministry',
        'military',
        'mobile',
        'motor',
        'motors',
        'musee',
        'museum',
        'news',
        'observatory',
        'office',
        'oil',
        'optical',
        'orchestra',
        'organization',
        'partners',
        'partnership',
        'petrol',
        'petroleum',
        'pharmacare',
        'pharmaceutical',
        'pharmaceuticals',
        'pizza',
        'plc',
        'police',
        'polytechnic',
        'post',
        'power',
        'press',
        'productions',
        'quartet',
        'radio',
        'reserve',
        'resources',
        'restaurant',
        'restaurants',
        'savings',
        'school',
        'securities',
        'service',
        'services',
        'societe',
        'society',
        'sons',
        'subcommittee',
        'syndicat',
        'systems',
        'telecommunications',
        'telegraph',
        'television',
        'times',
        'tribunal',
        'tv',
        'union',
        'university',
        'utilities',
        'workers',
      ].reduce((e, t) => ((e[t] = !0), e), {}),
      yi = [
        [/([^v])ies$/i, '$1y'],
        [/(ise)s$/i, '$1'],
        [/(kn|[^o]l|w)ives$/i, '$1ife'],
        [
          /^((?:ca|e|ha|(?:our|them|your)?se|she|wo)l|lea|loa|shea|thie)ves$/i,
          '$1f',
        ],
        [/^(dwar|handkerchie|hoo|scar|whar)ves$/i, '$1f'],
        [/(antenn|formul|nebul|vertebr|vit)ae$/i, '$1a'],
        [/(octop|vir|radi|nucle|fung|cact|stimul)(i)$/i, '$1us'],
        [/(buffal|tomat|tornad)(oes)$/i, '$1o'],
        [/(ause)s$/i, '$1'],
        [/(ease)s$/i, '$1'],
        [/(ious)es$/i, '$1'],
        [/(ouse)s$/i, '$1'],
        [/(ose)s$/i, '$1'],
        [/(..[aeiu]s)es$/i, '$1'],
        [/(vert|ind|cort)(ices)$/i, '$1ex'],
        [/(matr|append)(ices)$/i, '$1ix'],
        [/([xo]|ch|ss|sh)es$/i, '$1'],
        [/men$/i, 'man'],
        [/(n)ews$/i, '$1ews'],
        [/([ti])a$/i, '$1um'],
        [/([^aeiouy]|qu)ies$/i, '$1y'],
        [/(s)eries$/i, '$1eries'],
        [/(m)ovies$/i, '$1ovie'],
        [/(cris|ax|test)es$/i, '$1is'],
        [/(alias|status)es$/i, '$1'],
        [/(ss)$/i, '$1'],
        [/(ic)s$/i, '$1'],
        [/s$/i, ''],
      ],
      wi = function (e, t) {
        const { irregularPlurals: n } = t.two
        let r =
          ((a = n), Object.keys(a).reduce((e, t) => ((e[a[t]] = t), e), {}))
        var a
        if (r.hasOwnProperty(e)) return r[e]
        for (let t = 0; t < yi.length; t++)
          if (!0 === yi[t][0].test(e))
            return (e = e.replace(yi[t][0], yi[t][1]))
        return e
      }
    let ki = {
      Gerund: ['ing'],
      Actor: ['erer'],
      Infinitive: [
        'ate',
        'ize',
        'tion',
        'rify',
        'then',
        'ress',
        'ify',
        'age',
        'nce',
        'ect',
        'ise',
        'ine',
        'ish',
        'ace',
        'ash',
        'ure',
        'tch',
        'end',
        'ack',
        'and',
        'ute',
        'ade',
        'ock',
        'ite',
        'ase',
        'ose',
        'use',
        'ive',
        'int',
        'nge',
        'lay',
        'est',
        'ain',
        'ant',
        'ent',
        'eed',
        'er',
        'le',
        'unk',
        'ung',
        'upt',
        'en',
      ],
      PastTense: ['ept', 'ed', 'lt', 'nt', 'ew', 'ld'],
      PresentTense: [
        'rks',
        'cks',
        'nks',
        'ngs',
        'mps',
        'tes',
        'zes',
        'ers',
        'les',
        'acks',
        'ends',
        'ands',
        'ocks',
        'lays',
        'eads',
        'lls',
        'els',
        'ils',
        'ows',
        'nds',
        'ays',
        'ams',
        'ars',
        'ops',
        'ffs',
        'als',
        'urs',
        'lds',
        'ews',
        'ips',
        'es',
        'ts',
        'ns',
      ],
      Participle: ['ken', 'wn'],
    }
    ki = Object.keys(ki).reduce(
      (e, t) => (ki[t].forEach((n) => (e[n] = t)), e),
      {}
    )
    var Pi = ki,
      Ai = function (e) {
        let t = e.substring(e.length - 3)
        if (!0 === Pi.hasOwnProperty(t)) return Pi[t]
        let n = e.substring(e.length - 2)
        return !0 === Pi.hasOwnProperty(n)
          ? Pi[n]
          : 's' === e.substring(e.length - 1)
          ? 'PresentTense'
          : null
      }
    const ji = {
      are: 'be',
      were: 'be',
      been: 'be',
      is: 'be',
      am: 'be',
      was: 'be',
      be: 'be',
      being: 'be',
    }
    var xi = function (e, t, n) {
        const {
          fromPast: r,
          fromPresent: a,
          fromGerund: o,
          fromParticiple: i,
        } = t.two.models
        let {
            prefix: s,
            verb: l,
            particle: u,
          } = (function (e, t) {
            let n = '',
              r = {}
            t.one && t.one.prefixes && (r = t.one.prefixes)
            let [a, o] = e.split(/ /)
            return (
              o && !0 === r[a] && ((n = a), (a = o), (o = '')),
              { prefix: n, verb: a, particle: o }
            )
          })(e, t),
          c = ''
        if ((n || (n = Ai(e)), ji.hasOwnProperty(e))) c = ji[e]
        else if ('Participle' === n) c = ti(l, i)
        else if ('PastTense' === n) c = ti(l, r)
        else if ('PresentTense' === n) c = ti(l, a)
        else {
          if ('Gerund' !== n) return e
          c = ti(l, o)
        }
        return u && (c += ' ' + u), s && (c = s + ' ' + c), c
      },
      Ei = function (e, t) {
        const {
          toPast: n,
          toPresent: r,
          toGerund: a,
          toParticiple: o,
        } = t.two.models
        if ('be' === e)
          return {
            Infinitive: e,
            Gerund: 'being',
            PastTense: 'was',
            PresentTense: 'is',
          }
        let [i, s] = ((e) => (/ /.test(e) ? e.split(/ /) : [e, '']))(e),
          l = {
            Infinitive: e,
            PastTense: ti(i, n),
            PresentTense: ti(i, r),
            Gerund: ti(i, a),
            FutureTense: 'will ' + e,
          },
          u = ti(i, o)
        return (
          u !== e && u !== l.PastTense && (l.Participle = u),
          s &&
            Object.keys(l).forEach((e) => {
              l[e] += ' ' + s
            }),
          l
        )
      },
      Ni = function (e = '', t = []) {
        const n = e.length
        for (let r = n <= 6 ? n - 1 : 6; r >= 1; r -= 1) {
          let a = e.substring(n - r, e.length)
          if (!0 === t[a.length].hasOwnProperty(a))
            return e.slice(0, n - r) + t[a.length][a]
        }
        return null
      }
    const Ii = 'ically',
      Ti = new Set([
        'analyt' + Ii,
        'chem' + Ii,
        'class' + Ii,
        'clin' + Ii,
        'crit' + Ii,
        'ecolog' + Ii,
        'electr' + Ii,
        'empir' + Ii,
        'frant' + Ii,
        'grammat' + Ii,
        'ident' + Ii,
        'ideolog' + Ii,
        'log' + Ii,
        'mag' + Ii,
        'mathemat' + Ii,
        'mechan' + Ii,
        'med' + Ii,
        'method' + Ii,
        'method' + Ii,
        'mus' + Ii,
        'phys' + Ii,
        'phys' + Ii,
        'polit' + Ii,
        'pract' + Ii,
        'rad' + Ii,
        'satir' + Ii,
        'statist' + Ii,
        'techn' + Ii,
        'technolog' + Ii,
        'theoret' + Ii,
        'typ' + Ii,
        'vert' + Ii,
        'whims' + Ii,
      ]),
      Gi = [
        null,
        {},
        { ly: '' },
        { ily: 'y', bly: 'ble', ply: 'ple' },
        { ally: 'al', rply: 'rp' },
        {
          ually: 'ual',
          ially: 'ial',
          cally: 'cal',
          eally: 'eal',
          rally: 'ral',
          nally: 'nal',
          mally: 'mal',
          eeply: 'eep',
          eaply: 'eap',
        },
        { ically: 'ic' },
      ],
      Di = new Set([
        'early',
        'only',
        'hourly',
        'daily',
        'weekly',
        'monthly',
        'yearly',
        'mostly',
        'duly',
        'unduly',
        'especially',
        'undoubtedly',
        'conversely',
        'namely',
        'exceedingly',
        'presumably',
        'accordingly',
        'overly',
        'best',
        'latter',
        'little',
        'long',
        'low',
      ]),
      Ci = {
        wholly: 'whole',
        fully: 'full',
        truly: 'true',
        gently: 'gentle',
        singly: 'single',
        customarily: 'customary',
        idly: 'idle',
        publically: 'public',
        quickly: 'fast',
        well: 'good',
      }
    var Oi = function (e) {
      return e.endsWith('ly')
        ? Ti.has(e)
          ? e.replace(/ically/, 'ical')
          : Di.has(e)
          ? null
          : Ci.hasOwnProperty(e)
          ? Ci[e]
          : Ni(e, Gi) || e
        : null
    }
    const Vi = [
        null,
        { y: 'ily' },
        { ly: 'ly', ic: 'ically' },
        {
          ial: 'ially',
          ual: 'ually',
          tle: 'tly',
          ble: 'bly',
          ple: 'ply',
          ary: 'arily',
        },
        {},
        {},
        {},
      ],
      Bi = {
        cool: 'cooly',
        whole: 'wholly',
        full: 'fully',
        good: 'well',
        idle: 'idly',
        public: 'publicly',
        single: 'singly',
        special: 'especially',
      }
    var zi = function (e) {
      if (Bi.hasOwnProperty(e)) return Bi[e]
      let t = Ni(e, Vi)
      return t || e + 'ly'
    }
    const $i = [
        null,
        { y: 'iness' },
        { le: 'ility', al: 'ality', ay: 'ayness' },
        {
          ial: 'y',
          ing: 'ment',
          ess: 'essness',
          ous: 'ousness',
          ive: 'ivity',
          ect: 'ection',
        },
        {
          ting: 'ting',
          ring: 'ring',
          cial: 'ciality',
          nate: 'nation',
          rate: 'ration',
          bing: 'bingness',
          atic: 'acy',
          sing: 'se',
          iful: 'y',
          ible: 'ibility',
        },
        { erate: 'eration' },
        { ionate: 'ion' },
      ],
      Fi = {
        clean: 'cleanliness',
        naive: 'naivety',
        dramatic: 'drama',
        ironic: 'irony',
        deep: 'depth',
        automatic: 'automation',
        simple: 'simplicity',
        boring: 'boredom',
        free: 'freedom',
        wise: 'wisdom',
        fortunate: 'fortune',
        gentle: 'gentleness',
        quiet: 'quiet',
        expensive: 'expense',
        offensive: 'offence',
      },
      Si = new Set(['terrible', 'annoying']),
      Hi = function (e, t) {
        const n = t.two.models.toSuperlative
        return ti(e, n)
      },
      Mi = function (e, t) {
        const n = t.two.models.toComparative
        return ti(e, n)
      }
    var Li = {
        Singular: (e, t, n, r) => {
          let a = r.one.lexicon,
            o = n.two.transform.nounToPlural(e, r)
          a[o] || (t[o] = t[o] || 'Plural')
        },
        Comparable: (e, t, n, r) => {
          let a = r.one.lexicon,
            o = n.two.transform.adjToSuperlative(e, r)
          a[o] || (t[o] = t[o] || 'Superlative')
          let i = n.two.transform.adjToComparative(e, r)
          a[i] || (t[i] = t[i] || 'Comparative'), (t[e] = 'Adjective')
        },
        Demonym: (e, t, n, r) => {
          let a = n.two.transform.nounToPlural(e, r)
          t[a] = t[a] || ['Demonym', 'Plural']
        },
        Infinitive: (e, t, n, r) => {
          let a = r.one.lexicon,
            o = n.two.transform.verbConjugate(e, r)
          Object.entries(o).forEach((e) => {
            a[e[1]] || t[e[1]] || (t[e[1]] = e[0])
          })
        },
        PhrasalVerb: (e, t, n, r) => {
          let a = r.one.lexicon
          t[e] = ['PhrasalVerb', 'Infinitive']
          let o = r.one._multiCache,
            [i, s] = e.split(' ')
          a[i] || (t[i] = t[i] || 'Infinitive')
          let l = n.two.transform.verbConjugate(i, r)
          Object.entries(l).forEach((e) => {
            if ('Actor' === e[0] || '' === e[1]) return
            t[e[1]] || a[e[1]] || (t[e[1]] = e[0]), (o[e[1]] = !0)
            let n = e[1] + ' ' + s
            t[n] = t[n] || [e[0], 'PhrasalVerb']
          })
        },
        Multiple: (e, t) => {
          ;(t[e] = ['Multiple', 'Cardinal']),
            (t[e + 'th'] = ['Multiple', 'Ordinal']),
            (t[e + 'ths'] = ['Multiple', 'Fraction'])
        },
        Cardinal: (e, t) => {
          t[e] = ['TextValue', 'Cardinal']
        },
        Ordinal: (e, t) => {
          ;(t[e] = ['TextValue', 'Ordinal']),
            (t[e + 's'] = ['TextValue', 'Fraction'])
        },
      },
      Wi = {
        two: {
          quickSplit: function (e) {
            const t = /[,:;]/
            let n = []
            return (
              e.forEach((e) => {
                let r = 0
                e.forEach((a, o) => {
                  t.test(a.post) &&
                    (function (e, t) {
                      const n = /^[0-9]+$/
                      let r = e[t]
                      if (!r) return !1
                      const a = new Set(['may', 'april', 'august', 'jan'])
                      if ('like' === r.normal || a.has(r.normal)) return !1
                      if (r.tags.has('Place') || r.tags.has('Date')) return !1
                      if (
                        e[t - 1] &&
                        (e[t - 1].tags.has('Date') || a.has(e[t - 1].normal))
                      )
                        return !1
                      let o = r.normal
                      return (
                        (1 !== o.length && 2 !== o.length && 4 !== o.length) ||
                        !n.test(o)
                      )
                    })(e, o + 1) &&
                    (n.push(e.slice(r, o + 1)), (r = o + 1))
                }),
                  r < e.length && n.push(e.slice(r, e.length))
              }),
              n
            )
          },
          expandLexicon: function (e, t) {
            const { methods: n, model: r } = t
            let a = {},
              o = {}
            return (
              Object.keys(e).forEach((t) => {
                let i = e[t],
                  s = (t = t.toLowerCase().trim()).split(/ /)
                s.length > 1 && (o[s[0]] = !0),
                  !0 === Li.hasOwnProperty(i) && Li[i](t, a, n, r),
                  (a[t] = a[t] || i)
              }),
              delete a[''],
              delete a.null,
              delete a[' '],
              { lex: a, _multi: o }
            )
          },
          transform: {
            nounToPlural: Ia,
            nounToSingular: wi,
            verbToInfinitive: xi,
            getTense: Ai,
            verbConjugate: Ei,
            adjToSuperlative: Hi,
            adjToComparative: Mi,
            adjFromSuperlative: function (e, t) {
              const n = t.two.models.fromSuperlative
              return ti(e, n)
            },
            adjFromComparative: function (e, t) {
              const n = t.two.models.fromComparative
              return ti(e, n)
            },
            advToAdjective: Oi,
            adjToAdverb: zi,
            adjToNoun: function (e) {
              if (Fi.hasOwnProperty(e)) return Fi[e]
              if (Si.has(e)) return null
              let t = Ni(e, $i)
              return t || e + 'ness'
            },
          },
        },
      },
      Ji = function (e) {
        const { irregularPlurals: t } = e.two,
          { lexicon: n } = e.one
        return (
          Object.entries(t).forEach((e) => {
            ;(n[e[0]] = n[e[0]] || 'Singular'), (n[e[1]] = n[e[1]] || 'Plural')
          }),
          e
        )
      }
    const qi = function (e, t, n) {
      return Object.entries(e.exceptions).reduce(
        (e, r) => (t && (e[r[0]] = t), (e[r[1]] = n), e),
        {}
      )
    }
    var Ki = function (e) {
      let { lexicon: t } = e.one
      const {
        toPast: n,
        toPresent: r,
        toGerund: a,
        toSuperlative: o,
        toComparative: i,
      } = e.two.models
      let s = {},
        l = {}
      return (
        (l = qi(n, 'Infinitive', 'PastTense')),
        Object.assign(s, l),
        (l = qi(r, 'Infinitive', 'Verb')),
        Object.assign(s, l),
        (l = qi(a, 'Infinitive', 'Gerund')),
        Object.assign(s, l),
        (l = qi(o, 'Adjective', 'Superlative')),
        Object.assign(s, l),
        (l = qi(i, 'Adjective', 'Comparative')),
        Object.assign(s, l),
        (e.one.lexicon = Object.assign(s, t)),
        e
      )
    }
    let Ri = { two: { models: bi } }
    const Ui = {
        'Adj|Gerund': 'Adjective',
        'Adj|Noun': 'Adjective',
        'Adj|Past': 'Adjective',
        'Adj|Present': 'Adjective',
        'Noun|Verb': 'Singular',
        'Noun|Gerund': 'Gerund',
        'Person|Noun': 'Noun',
        'Person|Date': 'Month',
        'Person|Verb': 'Person',
        'Person|Place': 'Person',
        'Plural|Verb': 'Plural',
      },
      Qi = function (e, t) {
        const n = { model: t, methods: Wi }
        let { lex: r, _multi: a } = Wi.two.expandLexicon(e, n)
        return (
          Object.assign(t.one.lexicon, r),
          Object.assign(t.one._multiCache, a),
          t
        )
      },
      _i = function (e, t, n) {
        let r = Ei(e, Ri)
        ;(t[r.PastTense] = t[r.PastTense] || 'PastTense'),
          (t[r.Gerund] = t[r.Gerund] || 'Gerund'),
          !0 === n && (t[r.PresentTense] = t[r.PresentTense] || 'PresentTense')
      },
      Zi = function (e, t) {
        let n = {}
        const r = t.one.lexicon
        return (
          Object.keys(e).forEach((a) => {
            const o = e[a]
            if (
              ((n[a] = Ui[o]),
              ('Noun|Verb' !== o && 'Person|Verb' !== o) || _i(a, r, !1),
              'Adj|Present' === o &&
                (_i(a, r, !0),
                (function (e, t, n) {
                  let r = Hi(e, n)
                  t[r] = t[r] || 'Superlative'
                  let a = Mi(e, n)
                  t[a] = t[a] || 'Comparative'
                })(a, r, t)),
              'Adj|Gerund' === o || 'Noun|Gerund' === o)
            ) {
              let e = xi(a, Ri, 'Gerund')
              r[e] || (n[e] = 'Infinitive')
            }
            if ('Adj|Past' === o) {
              let e = xi(a, Ri, 'PastTense')
              r[e] || (n[e] = 'Infinitive')
            }
          }),
          (t = Qi(n, t))
        )
      }
    let Yi = {
      one: { _multiCache: {}, lexicon: Ga },
      two: {
        irregularPlurals: fa,
        models: bi,
        suffixPatterns: To,
        prefixPatterns: Oo,
        endsWith: qo,
        neighbours: Uo,
        regexNormal: [
          [/^[\w.]+@[\w.]+\.[a-z]{2,3}$/, 'Email'],
          [/^(https?:\/\/|www\.)+\w+\.[a-z]{2,3}/, 'Url', 'http..'],
          [
            /^[a-z0-9./].+\.(com|net|gov|org|ly|edu|info|biz|dev|ru|jp|de|in|uk|br|io|ai)/,
            'Url',
            '.com',
          ],
          [/^[PMCE]ST$/, 'Timezone', 'EST'],
          [/^ma?c'.*/, 'LastName', "mc'neil"],
          [/^o'[drlkn].*/, 'LastName', "o'connor"],
          [/^ma?cd[aeiou]/, 'LastName', 'mcdonald'],
          [/^(lol)+[sz]$/, 'Expression', 'lol'],
          [/^wo{2,}a*h?$/, 'Expression', 'wooah'],
          [/^(hee?){2,}h?$/, 'Expression', 'hehe'],
          [/^(un|de|re)\\-[a-z\u00C0-\u00FF]{2}/, 'Verb', 'un-vite'],
          [/^(m|k|cm|km)\/(s|h|hr)$/, 'Unit', '5 k/m'],
          [/^(ug|ng|mg)\/(l|m3|ft3)$/, 'Unit', 'ug/L'],
        ],
        regexText: [
          [/^#[\p{Number}_]*\p{Letter}/u, 'HashTag'],
          [/^@\w{2,}$/, 'AtMention'],
          [/^([A-Z]\.){2}[A-Z]?/i, ['Acronym', 'Noun'], 'F.B.I'],
          [/.{3}[lkmnp]in['‘’‛‵′`´]$/, 'Gerund', "chillin'"],
          [/.{4}s['‘’‛‵′`´]$/, 'Possessive', "flanders'"],
          [
            /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u,
            'Emoji',
            'emoji-class',
          ],
        ],
        regexNumbers: [
          [/^@1?[0-9](am|pm)$/i, 'Time', '3pm'],
          [/^@1?[0-9]:[0-9]{2}(am|pm)?$/i, 'Time', '3:30pm'],
          [/^'[0-9]{2}$/, 'Year'],
          [/^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])$/, 'Time', '3:12:31'],
          [
            /^[012]?[0-9](:[0-5][0-9])?(:[0-5][0-9])? ?(am|pm)$/i,
            'Time',
            '1:12pm',
          ],
          [
            /^[012]?[0-9](:[0-5][0-9])(:[0-5][0-9])? ?(am|pm)?$/i,
            'Time',
            '1:12:31pm',
          ],
          [
            /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/i,
            'Date',
            'iso-date',
          ],
          [/^[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,4}$/, 'Date', 'iso-dash'],
          [/^[0-9]{1,4}\/[0-9]{1,2}\/[0-9]{1,4}$/, 'Date', 'iso-slash'],
          [/^[0-9]{1,4}\.[0-9]{1,2}\.[0-9]{1,4}$/, 'Date', 'iso-dot'],
          [/^[0-9]{1,4}-[a-z]{2,9}-[0-9]{1,4}$/i, 'Date', '12-dec-2019'],
          [/^utc ?[+-]?[0-9]+$/, 'Timezone', 'utc-9'],
          [/^(gmt|utc)[+-][0-9]{1,2}$/i, 'Timezone', 'gmt-3'],
          [/^[0-9]{3}-[0-9]{4}$/, 'PhoneNumber', '421-0029'],
          [
            /^(\+?[0-9][ -])?[0-9]{3}[ -]?[0-9]{3}-[0-9]{4}$/,
            'PhoneNumber',
            '1-800-',
          ],
          [
            /^[-+]?\p{Currency_Symbol}[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?([kmb]|bn)?\+?$/u,
            ['Money', 'Value'],
            '$5.30',
          ],
          [
            /^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\p{Currency_Symbol}\+?$/u,
            ['Money', 'Value'],
            '5.30£',
          ],
          [
            /^[-+]?[$£]?[0-9]([0-9,.])+(usd|eur|jpy|gbp|cad|aud|chf|cny|hkd|nzd|kr|rub)$/i,
            ['Money', 'Value'],
            '$400usd',
          ],
          [
            /^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?\+?$/,
            ['Cardinal', 'NumericValue'],
            '5,999',
          ],
          [
            /^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?(st|nd|rd|r?th)$/,
            ['Ordinal', 'NumericValue'],
            '53rd',
          ],
          [/^\.[0-9]+\+?$/, ['Cardinal', 'NumericValue'], '.73th'],
          [
            /^[-+]?[0-9]+(,[0-9]{3})*(\.[0-9]+)?%\+?$/,
            ['Percent', 'Cardinal', 'NumericValue'],
            '-4%',
          ],
          [/^\.[0-9]+%$/, ['Percent', 'Cardinal', 'NumericValue'], '.3%'],
          [
            /^[0-9]{1,4}\/[0-9]{1,4}(st|nd|rd|th)?s?$/,
            ['Fraction', 'NumericValue'],
            '2/3rds',
          ],
          [
            /^[0-9.]{1,3}[a-z]{0,2}[-–—][0-9]{1,3}[a-z]{0,2}$/,
            ['Value', 'NumberRange'],
            '3-4',
          ],
          [
            /^[0-9]{1,2}(:[0-9][0-9])?(am|pm)? ?[-–—] ?[0-9]{1,2}(:[0-9][0-9])?(am|pm)$/,
            ['Time', 'NumberRange'],
            '3-4pm',
          ],
          [/^[0-9.]+([a-z]{1,4})$/, 'Value', '9km'],
        ],
        switches: Da,
        clues: go,
        uncountable: {},
        orgWords: vi,
      },
    }
    Yi = (function (e) {
      return (
        (e = (function (e, t) {
          return (
            Object.keys(e).forEach((n) => {
              'Uncountable' === e[n] &&
                ((t.two.uncountable[n] = !0), (e[n] = 'Uncountable'))
            }),
            t
          )
        })((e = Qi(e.one.lexicon, e)).one.lexicon, e)),
        (e = Zi(e.two.switches, e)),
        (e = Ki(e)),
        (e = Ji(e))
      )
    })(Yi)
    var Xi = Yi
    const es = /^(under|over|mis|re|un|dis|semi)-?/
    var ts = function (e, t, n) {
        const r = n.two.switches
        let a = e[t]
        if (r.hasOwnProperty(a.normal)) a.switch = r[a.normal]
        else if (es.test(a.normal)) {
          let e = a.normal.replace(es, '')
          e.length > 3 && r.hasOwnProperty(e) && (a.switch = r[e])
        }
      },
      ns = function (e, t, n) {
        if (!t || 0 === t.length) return
        const r =
          'undefined' != typeof process && process.env
            ? process.env
            : self.env || {}
        r &&
          r.DEBUG_TAGS &&
          ((e, t, n = '') => {
            let r = e.text || '[' + e.implicit + ']'
            var a
            'string' != typeof t &&
              t.length > 2 &&
              (t = t.slice(0, 2).join(', #') + ' +'),
              (t = 'string' != typeof t ? t.join(', #') : t),
              console.log(
                ` ${((a = r), '[33m[3m' + a + '[0m').padEnd(24)} [32m→[0m #${t.padEnd(22)}  ${((
                  e
                ) => '[3m' + e + '[0m')(n)}`
              )
          })(e, t, n),
          (e.tags = e.tags || new Set()),
          'string' == typeof t ? e.tags.add(t) : t.forEach((t) => e.tags.add(t))
      }
    const rs = {
        e: [
          'mice',
          'louse',
          'antennae',
          'formulae',
          'nebulae',
          'vertebrae',
          'vitae',
        ],
        i: [
          'tia',
          'octopi',
          'viri',
          'radii',
          'nuclei',
          'fungi',
          'cacti',
          'stimuli',
        ],
        n: ['men'],
      },
      as = new Set(['formulas', 'koalas', 'israelis', 'menus']),
      os = [
        'bus',
        'mas',
        'was',
        'las',
        'ias',
        'xas',
        'vas',
        'cis',
        'lis',
        'nis',
        'ois',
        'ris',
        'sis',
        'tis',
        'xis',
        'aus',
        'cus',
        'eus',
        'fus',
        'gus',
        'ius',
        'lus',
        'nus',
        'ous',
        'pus',
        'rus',
        'sus',
        'tus',
        'xus',
        "'s",
        'ss',
      ]
    var is = function (e) {
      if (!e || e.length <= 3) return !1
      if (as.has(e)) return !0
      let t = e[e.length - 1]
      return rs.hasOwnProperty(t)
        ? rs[t].find((t) => e.endsWith(t))
        : 's' === t && !os.find((t) => e.endsWith(t))
    }
    const ss = [
      'Acronym',
      'Abbreviation',
      'ProperNoun',
      'Uncountable',
      'Possessive',
      'Pronoun',
      'Activity',
      'Honorific',
    ]
    var ls = function (e, t, n) {
      let r = e[t],
        a = Array.from(r.tags)
      for (let e = 0; e < a.length; e += 1)
        if (n.one.tagSet[a[e]]) {
          let t = n.one.tagSet[a[e]].parents
          ns(r, t, ' -inferred by #' + a[e])
        }
      !(function (e) {
        !e.tags.has('Noun') ||
          e.tags.has('Plural') ||
          e.tags.has('Singular') ||
          e.tags.has('Date') ||
          ss.find((t) => e.tags.has(t)) ||
          (is(e.normal)
            ? ns(e, 'Plural', '3-plural-guess')
            : ns(e, 'Singular', '3-singular-guess'))
      })(r),
        (function (e) {
          let t = e.tags
          if (t.has('Verb') && 1 === t.size) {
            let t = Ai(e.normal)
            t && ns(e, t, '3-verb-tense-guess')
          }
        })(r)
    }
    const us = /^\p{Lu}[\p{Ll}'’]/u,
      cs = /[0-9]/,
      hs = ['Date', 'Month', 'WeekDay', 'Unit'],
      ds = /^[IVXLCDM]{2,}$/,
      ps = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,
      ms = { li: !0, dc: !0, md: !0, dm: !0, ml: !0 }
    var gs = function (e, t, n) {
      let r = e[t]
      r.index = r.index || [0, 0]
      let a = r.index[1],
        o = r.text || ''
      return 0 !== a && !0 === us.test(o) && !1 === cs.test(o)
        ? hs.find((e) => r.tags.has(e))
          ? null
          : (ls(e, t, n),
            r.tags.has('Noun') || r.tags.clear(),
            ns(r, 'ProperNoun', '2-titlecase'),
            !0)
        : o.length >= 2 && ds.test(o) && ps.test(o) && !ms[r.normal]
        ? (ns(r, 'RomanNumeral', '2-xvii'), !0)
        : null
    }
    const fs = function (e = '', t = []) {
      const n = e.length
      let r = 7
      n <= r && (r = n - 1)
      for (let a = r; a > 1; a -= 1) {
        let r = e.substring(n - a, n)
        if (!0 === t[r.length].hasOwnProperty(r)) return t[r.length][r]
      }
      return null
    }
    var bs = function (e, t, n) {
      let r = e[t]
      if (0 === r.tags.size) {
        let e = fs(r.normal, n.two.suffixPatterns)
        if (null !== e) return ns(r, e, '2-suffix'), (r.confidence = 0.7), !0
        if (
          r.implicit &&
          ((e = fs(r.implicit, n.two.suffixPatterns)), null !== e)
        )
          return ns(r, e, '2-implicit-suffix'), (r.confidence = 0.7), !0
      }
      return null
    }
    const vs = /['‘’‛‵′`´]/,
      ys = function (e, t) {
        for (let n = 0; n < t.length; n += 1)
          if (!0 === t[n][0].test(e)) return t[n]
        return null
      }
    var ws = function (e, t, n, r) {
        const a = r.methods.one.setTag
        let {
            regexText: o,
            regexNormal: i,
            regexNumbers: s,
            endsWith: l,
          } = n.two,
          u = e[t],
          c = u.machine || u.normal,
          h = u.text
        vs.test(u.post) && !vs.test(u.pre) && (h += u.post.trim())
        let d = ys(h, o) || ys(c, i)
        return (
          !d && /[0-9]/.test(c) && (d = ys(c, s)),
          d ||
            0 !== u.tags.size ||
            (d = (function (e = '', t) {
              let n = e[e.length - 1]
              if (!0 === t.hasOwnProperty(n)) {
                let r = t[n] || []
                for (let t = 0; t < r.length; t += 1)
                  if (!0 === r[t][0].test(e)) return r[t]
              }
              return null
            })(c, l)),
          d
            ? (a([u], d[1], r, null, `2-regex-'${d[2] || d[0]}'`),
              (u.confidence = 0.6),
              !0)
            : null
        )
      },
      ks = function (e, t, n) {
        let r = e[t]
        if (0 === r.tags.size) {
          let e = (function (e = '', t = []) {
            const n = e.length
            let r = 7
            r > n - 3 && (r = n - 3)
            for (let n = r; n > 2; n -= 1) {
              let r = e.substring(0, n)
              if (!0 === t[r.length].hasOwnProperty(r)) return t[r.length][r]
            }
            return null
          })(r.normal, n.two.prefixPatterns)
          if (null !== e) return ns(r, e, '2-prefix'), (r.confidence = 0.5), !0
        }
        return null
      }
    const Ps = new Set([
        'in',
        'on',
        'by',
        'until',
        'for',
        'to',
        'during',
        'throughout',
        'through',
        'within',
        'before',
        'after',
        'of',
        'this',
        'next',
        'last',
        'circa',
        'around',
        'post',
        'pre',
        'budget',
        'classic',
        'plan',
        'may',
      ]),
      As = function (e) {
        if (!e) return !1
        let t = e.normal || e.implicit
        return (
          !!Ps.has(t) ||
          !!(
            e.tags.has('Date') ||
            e.tags.has('Month') ||
            e.tags.has('WeekDay') ||
            e.tags.has('Year')
          ) ||
          !!e.tags.has('ProperNoun')
        )
      },
      js = function (e) {
        return !(
          !e ||
          (!e.tags.has('Ordinal') &&
            !(e.tags.has('Cardinal') && e.normal.length < 3) &&
            'is' !== e.normal &&
            'was' !== e.normal)
        )
      },
      xs = function (e) {
        return (
          e &&
          (e.tags.has('Date') ||
            e.tags.has('Month') ||
            e.tags.has('WeekDay') ||
            e.tags.has('Year'))
        )
      }
    var Es = function (e, t) {
      const n = e[t]
      if (
        n.tags.has('NumericValue') &&
        n.tags.has('Cardinal') &&
        4 === n.normal.length
      ) {
        let r = Number(n.normal)
        if (r && !isNaN(r) && r > 1400 && r < 2100) {
          let a = e[t - 1],
            o = e[t + 1]
          if (As(a) || As(o)) return ns(n, 'Year', '2-tagYear')
          if (r >= 1920 && r < 2025) {
            if (js(a) || js(o)) return ns(n, 'Year', '2-tagYear-close')
            if (xs(e[t - 2]) || xs(e[t + 2]))
              return ns(n, 'Year', '2-tagYear-far')
            if (
              a &&
              (a.tags.has('Determiner') || a.tags.has('Possessive')) &&
              o &&
              o.tags.has('Noun') &&
              !o.tags.has('Plural')
            )
              return ns(n, 'Year', '2-tagYear-noun')
          }
        }
      }
      return null
    }
    const Ns = /^[A-Z]('s|,)?$/,
      Is = /^[A-Z-]+$/,
      Ts = /([A-Z]\.)+[A-Z]?,?$/,
      Gs = /[A-Z]{2,}('s|,)?$/,
      Ds = /([a-z]\.)+[a-z]\.?$/,
      Cs = { I: !0, A: !0 }
    var Os = function (e, t, n) {
      let r = e[t]
      return r.tags.has('RomanNumeral') || r.tags.has('Acronym')
        ? null
        : (function (e, t) {
            let n = e.text
            return !(
              !1 === Is.test(n) ||
              n.length > 5 ||
              Cs.hasOwnProperty(n) ||
              t.one.lexicon.hasOwnProperty(e.normal) ||
              (!0 !== Ts.test(n) &&
                !0 !== Ds.test(n) &&
                !0 !== Ns.test(n) &&
                !0 !== Gs.test(n))
            )
          })(r, n)
        ? (r.tags.clear(),
          ns(r, ['Acronym', 'Noun'], '3-no-period-acronym'),
          !0)
        : !Cs.hasOwnProperty(r.text) && Ns.test(r.text)
        ? (r.tags.clear(),
          ns(r, ['Acronym', 'Noun'], '3-one-letter-acronym'),
          !0)
        : r.tags.has('Organization') && r.text.length <= 3
        ? (ns(r, 'Acronym', '3-org-acronym'), !0)
        : r.tags.has('Organization') && Is.test(r.text) && r.text.length <= 6
        ? (ns(r, 'Acronym', '3-titlecase-acronym'), !0)
        : null
    }
    const Vs = function (e, t) {
        if (!e) return null
        let n = t.find((t) => e.normal === t[0])
        return n ? n[1] : null
      },
      Bs = function (e, t) {
        if (!e) return null
        let n = t.find((t) => e.tags.has(t[0]))
        return n ? n[1] : null
      }
    var zs = function (e, t, n) {
      const {
        leftTags: r,
        leftWords: a,
        rightWords: o,
        rightTags: i,
      } = n.two.neighbours
      let s = e[t]
      if (0 === s.tags.size) {
        let l = null
        if (
          ((l = l || Vs(e[t - 1], a)),
          (l = l || Vs(e[t + 1], o)),
          (l = l || Bs(e[t - 1], r)),
          (l = l || Bs(e[t + 1], i)),
          l)
        )
          return (
            ns(s, l, '3-[neighbour]'), ls(e, t, n), (e[t].confidence = 0.2), !0
          )
      }
      return null
    }
    const $s = function (e, t) {
      return (
        !!e &&
        !e.tags.has('FirstName') &&
        !e.tags.has('Place') &&
        (!!(
          e.tags.has('ProperNoun') ||
          e.tags.has('Organization') ||
          e.tags.has('Acronym')
        ) ||
          ((n = e.text),
          !!/^\p{Lu}[\p{Ll}'’]/u.test(n) &&
            (0 !== t || e.tags.has('Singular'))))
      )
      var n
    }
    var Fs = function (e, t, n) {
        const r = n.model.two.orgWords,
          a = n.methods.one.setTag
        let o = e[t]
        if (!0 === r[o.machine || o.normal] && $s(e[t - 1])) {
          a([e[t]], 'Organization', n, null, '3-[org-word]')
          for (let r = t; r >= 0 && $s(e[r], r); r -= 1)
            a([e[r]], 'Organization', n, null, '3-[org-word]')
        }
        return null
      },
      Ss = function (e, t, n) {
        0 === e[t].tags.size &&
          (ns(e[t], 'Noun', '3-[fallback]'),
          ls(e, t, n),
          (e[t].confidence = 0.1))
      }
    const Hs = (e, t) => (e[t].tags.has('ProperNoun') ? 'Noun' : null),
      Ms = (e, t, n) => (0 !== t || e[1] ? null : n)
    var Ls = {
      'Adj|Gerund': (e, t) => Hs(e, t),
      'Adj|Noun': (e, t) => Hs(e, t),
      'Adj|Past': (e, t) => Hs(e, t),
      'Adj|Present': (e, t) => Hs(e, t),
      'Noun|Gerund': (e, t) => Hs(e, t),
      'Noun|Verb': (e, t) => Hs(e, t) || Ms(e, t, 'Infinitive'),
      'Plural|Verb': (e, t) => Hs(e, t) || Ms(e, t, 'PresentTense'),
      'Person|Noun': (e, t) => Hs(e, t),
      'Person|Verb': (e, t) => 0 !== t && Hs(e, t),
    }
    const Ws =
        'undefined' != typeof process && process.env
          ? process.env
          : self.env || {},
      Js = /^(under|over|mis|re|un|dis|semi)-?/,
      qs = (e, t) => {
        if (!e || !t) return null
        let n = e.normal || e.implicit
        const r = t[n]
        return r && Ws.DEBUG_TAGS && console.log(`\n  [2m[3m     ↓ - '${n}' [0m`), r
      },
      Ks = (e, t = {}, n) => {
        if (!e || !t) return null
        let r = Array.from(e.tags)
          .sort((e, t) =>
            (n[e] ? n[e].parents.length : 0) > (n[t] ? n[t].parents.length : 0)
              ? -1
              : 1
          )
          .find((e) => t[e])
        return (
          r &&
            Ws.DEBUG_TAGS &&
            console.log(`  [2m[3m      ↓ - '${e.normal}' (#${r})  [0m`),
          (r = t[r]),
          r
        )
      },
      Rs = {
        tagSwitch: ts,
        checkSuffix: bs,
        checkRegex: ws,
        checkCase: gs,
        checkPrefix: ks,
        checkHyphen: function (e, t, n) {
          let r = e[t + 1]
          if (!r) return
          let { prefixes: a } = n.one,
            o = e[t]
          !0 === a[o.normal] &&
            (r.tags.has('Verb') &&
              (ns(o, 'Verb', '3-[prefix]'), ns(o, 'Prefix', '3-[prefix]')),
            r.tags.has('Adjective') &&
              (ns(o, 'Adjective', '3-[prefix]'), ns(o, 'Prefix', '3-[prefix]')))
        },
        checkYear: Es,
      },
      Us = {
        checkAcronym: Os,
        neighbours: zs,
        orgWords: Fs,
        nounFallback: Ss,
        variables: function (e, t, n) {
          const r = n.model,
            a = n.methods.one.setTag,
            { switches: o, clues: i } = r.two,
            s = e[t]
          let l = s.normal || s.implicit || ''
          if ((Js.test(l) && !o[l] && (l = l.replace(Js, '')), s.switch)) {
            let o = s.switch
            if (s.tags.has('Acronym') || s.tags.has('PhrasalVerb')) return
            let u = (function (e, t, n, r) {
              if (!n) return null
              const a = r.one.tagSet
              let o = qs(e[t + 1], n.afterWords)
              return (
                (o = o || qs(e[t - 1], n.beforeWords)),
                (o = o || Ks(e[t - 1], n.beforeTags, a)),
                (o = o || Ks(e[t + 1], n.afterTags, a)),
                o
              )
            })(e, t, i[o], r)
            Ls[o] && (u = Ls[o](e, t) || u),
              u
                ? a([s], u, n, null, `3-[variable] (${o})`)
                : Ws.DEBUG_TAGS && console.log(`\n -> X  - '${l}'  : (${o})  `)
          }
        },
      },
      Qs = function (e, t, n) {
        for (let r = 0; r < e.length; r += 1)
          Rs.tagSwitch(e, r, t),
            Rs.checkCase(e, r, t),
            Rs.checkSuffix(e, r, t),
            Rs.checkRegex(e, r, t, n),
            Rs.checkPrefix(e, r, t),
            Rs.checkYear(e, r, t)
      },
      _s = function (e, t, n) {
        for (let n = 0; n < e.length; n += 1) {
          let r = Us.checkAcronym(e, n, t)
          ls(e, n, t),
            (r = r || Us.neighbours(e, n, t)),
            (r = r || Us.nounFallback(e, n, t))
        }
        for (let r = 0; r < e.length; r += 1)
          Us.orgWords(e, r, n), Rs.checkHyphen(e, r, t), Us.variables(e, r, n)
      },
      Zs = {
        Possessive: (e) => {
          let t = e.machine || e.normal || e.text
          return (t = t.replace(/'s$/, '')), t
        },
        Plural: (e, t) => {
          let n = e.machine || e.normal || e.text
          return t.methods.two.transform.nounToSingular(n, t.model)
        },
        Copula: () => 'is',
        PastTense: (e, t) => {
          let n = e.machine || e.normal || e.text
          return t.methods.two.transform.verbToInfinitive(
            n,
            t.model,
            'PastTense'
          )
        },
        Gerund: (e, t) => {
          let n = e.machine || e.normal || e.text
          return t.methods.two.transform.verbToInfinitive(n, t.model, 'Gerund')
        },
        PresentTense: (e, t) => {
          let n = e.machine || e.normal || e.text
          return e.tags.has('Infinitive')
            ? n
            : t.methods.two.transform.verbToInfinitive(
                n,
                t.model,
                'PresentTense'
              )
        },
        Comparative: (e, t) => {
          let n = e.machine || e.normal || e.text
          return t.methods.two.transform.adjFromComparative(n, t.model)
        },
        Superlative: (e, t) => {
          let n = e.machine || e.normal || e.text
          return t.methods.two.transform.adjFromSuperlative(n, t.model)
        },
        Adverb: (e, t) =>
          (0, t.methods.two.transform.advToAdjective)(
            e.machine || e.normal || e.text
          ),
      },
      Ys = {
        Adverb: 'RB',
        Comparative: 'JJR',
        Superlative: 'JJS',
        Adjective: 'JJ',
        TO: 'Conjunction',
        Modal: 'MD',
        Auxiliary: 'MD',
        Gerund: 'VBG',
        PastTense: 'VBD',
        Participle: 'VBN',
        PresentTense: 'VBZ',
        Infinitive: 'VB',
        Particle: 'RP',
        Verb: 'VB',
        Pronoun: 'PRP',
        Cardinal: 'CD',
        Conjunction: 'CC',
        Determiner: 'DT',
        Preposition: 'IN',
        QuestionWord: 'WP',
        Expression: 'UH',
        Possessive: 'POS',
        ProperNoun: 'NNP',
        Person: 'NNP',
        Place: 'NNP',
        Organization: 'NNP',
        Singular: 'NNP',
        Plural: 'NNS',
        Noun: 'NN',
      }
    var Xs = {
      preTagger: function (e) {
        const { methods: t, model: n, world: r } = e
        let a = t.two.quickSplit(e.docs)
        for (let e = 0; e < a.length; e += 1) {
          let t = a[e]
          Qs(t, n, r), _s(t, n, r)
        }
        return e.compute('cache'), a
      },
      root: function (e) {
        const t = e.world,
          n = Object.keys(Zs)
        e.docs.forEach((e) => {
          for (let r = 0; r < e.length; r += 1) {
            const a = e[r]
            for (let e = 0; e < n.length; e += 1)
              if (a.tags.has(n[e])) {
                let r = (0, Zs[n[e]])(a, t)
                a.normal !== r && (a.root = r)
                break
              }
          }
        })
      },
      penn: function (e) {
        e.compute('tagRank'),
          e.docs.forEach((e) => {
            e.forEach((e) => {
              e.penn = (function (e) {
                if (e.tags.has('ProperNoun') && e.tags.has('Plural'))
                  return 'NNPS'
                if (e.tags.has('Possessive') && e.tags.has('Pronoun'))
                  return 'PRP$'
                if ('there' === e.normal) return 'EX'
                if ('to' === e.normal) return 'TO'
                let t = e.tagRank || []
                for (let e = 0; e < t.length; e += 1)
                  if (Ys.hasOwnProperty(t[e])) return Ys[t[e]]
                return null
              })(e)
            })
          })
      },
    }
    const el = ['Person', 'Place', 'Organization']
    var tl = {
        Noun: { not: ['Verb', 'Adjective', 'Adverb', 'Value', 'Determiner'] },
        Singular: { is: 'Noun', not: ['Plural', 'Uncountable'] },
        ProperNoun: { is: 'Noun' },
        Person: {
          is: 'Singular',
          also: ['ProperNoun'],
          not: ['Place', 'Organization', 'Date'],
        },
        FirstName: { is: 'Person' },
        MaleName: { is: 'FirstName', not: ['FemaleName', 'LastName'] },
        FemaleName: { is: 'FirstName', not: ['MaleName', 'LastName'] },
        LastName: { is: 'Person', not: ['FirstName'] },
        Honorific: { is: 'Noun', not: ['FirstName', 'LastName', 'Value'] },
        Place: { is: 'Singular', not: ['Person', 'Organization'] },
        Country: { is: 'Place', also: ['ProperNoun'], not: ['City'] },
        City: { is: 'Place', also: ['ProperNoun'], not: ['Country'] },
        Region: { is: 'Place', also: ['ProperNoun'] },
        Address: {},
        Organization: { is: 'ProperNoun', not: ['Person', 'Place'] },
        SportsTeam: { is: 'Organization' },
        School: { is: 'Organization' },
        Company: { is: 'Organization' },
        Plural: { is: 'Noun', not: ['Singular', 'Uncountable'] },
        Uncountable: { is: 'Noun' },
        Pronoun: { is: 'Noun', not: el },
        Actor: { is: 'Noun', not: el },
        Activity: { is: 'Noun', not: ['Person', 'Place'] },
        Unit: { is: 'Noun', not: el },
        Demonym: { is: 'Noun', also: ['ProperNoun'], not: el },
        Possessive: { is: 'Noun' },
        Reflexive: { is: 'Pronoun' },
      },
      nl = {
        Adjective: { not: ['Noun', 'Verb', 'Adverb', 'Value'] },
        Comparable: { is: 'Adjective' },
        Comparative: { is: 'Adjective' },
        Superlative: { is: 'Adjective', not: ['Comparative'] },
        NumberRange: {},
        Adverb: { not: ['Noun', 'Verb', 'Adjective', 'Value'] },
        Determiner: {
          not: [
            'Noun',
            'Verb',
            'Adjective',
            'Adverb',
            'QuestionWord',
            'Conjunction',
          ],
        },
        Conjunction: {
          not: ['Noun', 'Verb', 'Adjective', 'Adverb', 'Value', 'QuestionWord'],
        },
        Preposition: {
          not: [
            'Noun',
            'Verb',
            'Adjective',
            'Adverb',
            'QuestionWord',
            'Determiner',
          ],
        },
        QuestionWord: { not: ['Determiner'] },
        Currency: { is: 'Noun' },
        Expression: { not: ['Noun', 'Adjective', 'Verb', 'Adverb'] },
        Abbreviation: {},
        Url: {
          not: [
            'HashTag',
            'PhoneNumber',
            'Verb',
            'Adjective',
            'Value',
            'AtMention',
            'Email',
          ],
        },
        PhoneNumber: {
          not: ['HashTag', 'Verb', 'Adjective', 'Value', 'AtMention', 'Email'],
        },
        HashTag: {},
        AtMention: { is: 'Noun', not: ['HashTag', 'Email'] },
        Emoji: { not: ['HashTag', 'Verb', 'Adjective', 'Value', 'AtMention'] },
        Emoticon: {
          not: ['HashTag', 'Verb', 'Adjective', 'Value', 'AtMention'],
        },
        Email: { not: ['HashTag', 'Verb', 'Adjective', 'Value', 'AtMention'] },
        Acronym: { not: ['Plural', 'RomanNumeral'] },
        Negative: { not: ['Noun', 'Adjective', 'Value', 'Expression'] },
        Condition: { not: ['Verb', 'Adjective', 'Noun', 'Value'] },
      }
    let rl = Object.assign(
      {},
      tl,
      {
        Verb: { not: ['Noun', 'Adjective', 'Adverb', 'Value', 'Expression'] },
        PresentTense: { is: 'Verb', not: ['PastTense'] },
        Infinitive: { is: 'PresentTense', not: ['Gerund'] },
        Imperative: { is: 'Infinitive' },
        Gerund: { is: 'PresentTense', not: ['Copula'] },
        PastTense: { is: 'Verb', not: ['PresentTense', 'Gerund'] },
        Copula: { is: 'Verb' },
        Modal: { is: 'Verb', not: ['Infinitive'] },
        Participle: { is: 'PastTense' },
        Auxiliary: {
          is: 'Verb',
          not: ['PastTense', 'PresentTense', 'Gerund', 'Conjunction'],
        },
        PhrasalVerb: { is: 'Verb' },
        Particle: {
          is: 'PhrasalVerb',
          not: ['PastTense', 'PresentTense', 'Copula', 'Gerund'],
        },
      },
      {
        Value: { not: ['Verb', 'Adjective', 'Adverb'] },
        Ordinal: { is: 'Value', not: ['Cardinal'] },
        Cardinal: { is: 'Value', not: ['Ordinal'] },
        Fraction: { is: 'Value', not: ['Noun'] },
        Multiple: { is: 'TextValue' },
        RomanNumeral: { is: 'Cardinal', not: ['TextValue'] },
        TextValue: { is: 'Value', not: ['NumericValue'] },
        NumericValue: { is: 'Value', not: ['TextValue'] },
        Money: { is: 'Cardinal' },
        Percent: { is: 'Value' },
      },
      {
        Date: { not: ['Verb', 'Adverb', 'Adjective'] },
        Month: {
          is: 'Singular',
          also: ['Date'],
          not: ['Year', 'WeekDay', 'Time'],
        },
        WeekDay: { is: 'Noun', also: ['Date'] },
        Year: { is: 'Date', not: ['RomanNumeral'] },
        FinancialQuarter: { is: 'Date', not: 'Fraction' },
        Holiday: { is: 'Date', also: ['Noun'] },
        Season: { is: 'Date' },
        Timezone: { is: 'Noun', also: ['Date'], not: ['ProperNoun'] },
        Time: { is: 'Date', not: ['AtMention'] },
        Duration: { is: 'Date', also: ['Noun'] },
      },
      nl
    )
    var al = {
      compute: Xs,
      methods: Wi,
      model: Xi,
      tags: rl,
      hooks: ['preTagger'],
    }
    const ol = /[,)"';:\-–—.…]/,
      il = function (e, t) {
        if (!e.found) return
        let n = e.termList()
        for (let e = 0; e < n.length - 1; e++) {
          const t = n[e]
          if (ol.test(t.post)) return
        }
        ;(n[0].implicit = n[0].normal),
          (n[0].text += t),
          (n[0].normal += t),
          n.slice(1).forEach((e) => {
            ;(e.implicit = e.normal), (e.text = ''), (e.normal = '')
          })
        for (let e = 0; e < n.length - 1; e++)
          n[e].post = n[e].post.replace(/ /, '')
      }
    var sl = function () {
      let e = this.not('@hasContraction'),
        t = e.match('(we|they|you) are')
      return (
        il(t, "'re"),
        (t = e.match('(he|she|they|it|we|you) will')),
        il(t, "'ll"),
        (t = e.match('(he|she|they|it|we) is')),
        il(t, "'s"),
        (t = e.match('#Person is')),
        il(t, "'s"),
        (t = e.match('#Person would')),
        il(t, "'d"),
        (t = e.match(
          '(is|was|had|would|should|could|do|does|have|has|can) not'
        )),
        il(t, "n't"),
        (t = e.match('(i|we|they) have')),
        il(t, "'ve"),
        (t = e.match('(would|should|could) have')),
        il(t, "'ve"),
        (t = e.match('i am')),
        il(t, "'m"),
        (t = e.match('going to')),
        this
      )
    }
    const ll = /^\p{Lu}[\p{Ll}'’]/u
    var ul = function (e, t, n) {
      let [r, a] = t
      n &&
        0 !== n.length &&
        ((n = n.map(
          (e, t) => (
            (e.implicit = e.text),
            (e.machine = e.text),
            (e.pre = ''),
            (e.post = ''),
            (e.text = ''),
            (e.normal = ''),
            (e.index = [r, a + t]),
            e
          )
        ))[0] &&
          ((n[0].pre = e[r][a].pre),
          (n[n.length - 1].post = e[r][a].post),
          (n[0].text = e[r][a].text),
          (n[0].normal = e[r][a].normal)),
        e[r].splice(a, 1, ...n))
    }
    const cl = /'/
    var hl = function (e, t) {
      let n = e[t].normal.split(cl)[0]
      if (
        ((e, t) => e.slice(t + 1, t + 3).some((e) => e.tags.has('PastTense')))(
          e,
          t
        )
      )
        return [n, 'has']
      if ('let' === n) return [n, 'us']
      if ('there' === n) {
        let r = e[t + 1]
        if (r && r.tags.has('Plural')) return [n, 'are']
      }
      return [n, 'is']
    }
    const dl = /'/
    var pl = function (e, t) {
        let n = e[t].normal.split(dl)[0]
        return 'how' === n || 'what' === n
          ? [n, 'did']
          : !0 ===
            ((e, t) =>
              e.slice(t + 1, t + 3).some((e) => e.tags.has('PastTense')))(e, t)
          ? [n, 'had']
          : [n, 'would']
      },
      ml = function (e, t) {
        if ("ain't" === e[t].normal || 'aint' === e[t].normal) {
          let n = (function (e, t) {
            for (let n = t - 1; n >= 0; n -= 1)
              if (
                e[n].tags.has('Noun') ||
                e[n].tags.has('Pronoun') ||
                e[n].tags.has('Plural') ||
                e[n].tags.has('Singular')
              )
                return e[n]
            return null
          })(e, t)
          if (n) {
            if ('we' === n.normal || 'they' === n.normal) return ['are', 'not']
            if (n.tags && n.tags.has('Plural')) return ['are', 'not']
          }
          return ['is', 'not']
        }
        return [e[t].normal.replace(/n't/, ''), 'not']
      }
    const gl = { that: !0, there: !0, let: !0, here: !0, everywhere: !0 },
      fl = { in: !0, by: !0, for: !0 }
    var bl = (e, t) => {
      let n = e[t]
      if (gl.hasOwnProperty(n.machine || n.normal)) return !1
      if (n.tags.has('Possessive')) return !0
      if (n.tags.has('Pronoun') || n.tags.has('QuestionWord')) return !1
      let r = e[t + 1]
      if (!r) return !0
      if (r.tags.has('Verb'))
        return !!r.tags.has('Infinitive') || !!r.tags.has('PresentTense')
      if (r.tags.has('Noun')) {
        let e = r.machine || r.normal
        return !(
          'here' === e ||
          'there' === e ||
          'everywhere' === e ||
          r.tags.has('Possessive') ||
          (r.tags.has('ProperNoun') && !n.tags.has('ProperNoun'))
        )
      }
      if (e[t - 1] && !0 === fl[e[t - 1].normal]) return !0
      let a = e[t + 2]
      return (
        !(!a || !a.tags.has('Noun') || a.tags.has('Pronoun')) ||
        (r.tags.has('Adjective') || r.tags.has('Adverb') || r.tags.has('Verb'),
        !1)
      )
    }
    const vl = /'/,
      yl = function (e, t, n, r) {
        let a = t.update()
        a.document = [e]
        let o = n + r
        n > 0 && (n -= 1),
          e[o] && (o += 1),
          (a.ptrs = [[0, n, o]]),
          a.compute(['lexicon', 'preTagger']),
          (function (e) {
            e.forEach((e, t) => {
              e.index && (e.index[1] = t)
            })
          })(e)
      },
      wl = {
        d: (e, t) => pl(e, t),
        t: (e, t) => ml(e, t),
        s: (e, t, n) =>
          bl(e, t)
            ? n.methods.one.setTag([e[t]], 'Possessive', n, '2-contraction')
            : hl(e, t),
      },
      kl = function (e, t) {
        let n = t.fromText(e.join(' '))
        return n.compute('id'), n.docs[0]
      }
    var Pl = {
      compute: {
        contractionTwo: (e) => {
          let { world: t, document: n } = e
          n.forEach((r, a) => {
            for (let o = r.length - 1; o >= 0; o -= 1) {
              if (r[o].implicit) return
              let i = null
              !0 === vl.test(r[o].normal) && ([, i] = r[o].normal.split(vl))
              let s = null
              wl.hasOwnProperty(i) && (s = wl[i](r, o, t)),
                s &&
                  ((s = kl(s, e)), ul(n, [a, o], s), yl(n[a], e, o, s.length))
            }
          })
        },
      },
      api: function (e) {
        class Contractions extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = 'Contraction')
          }
          expand() {
            return (
              this.docs.forEach((e) => {
                let t = ll.test(e[0].text)
                e.forEach((t, n) => {
                  ;(t.text = t.implicit),
                    delete t.implicit,
                    n < e.length - 1 && '' === t.post && (t.post += ' '),
                    (t.dirty = !0)
                }),
                  t &&
                    (e[0].text = (function (e = '') {
                      return e.replace(/^ *[a-z\u00C0-\u00FF]/, (e) =>
                        e.toUpperCase()
                      )
                    })(e[0].text))
              }),
              this.compute('normal'),
              this
            )
          }
        }
        ;(e.prototype.contractions = function () {
          let e = this.match('@hasContraction+')
          return new Contractions(this.document, e.pointer)
        }),
          (e.prototype.contract = sl)
      },
      hooks: ['contractionTwo'],
    }
    const Al = '(misty|rusty|dusty|rich|randy|sandy|young|earnest|frank|brown)',
      jl = ['i', 'we', 'they']
    let xl = [].concat(
        [
          {
            match: '[(all|both)] #Determiner #Noun',
            group: 0,
            tag: 'Noun',
            reason: 'all-noun',
          },
          {
            match: '#Copula [(just|alone)]$',
            group: 0,
            tag: 'Adjective',
            reason: 'not-adverb',
          },
          {
            match: '#Singular is #Adverb? [#PastTense$]',
            group: 0,
            tag: 'Adjective',
            reason: 'is-filled',
          },
          {
            match: '[#PastTense] #Singular is',
            group: 0,
            tag: 'Adjective',
            reason: 'smoked-poutine',
          },
          {
            match: '[#PastTense] #Plural are',
            group: 0,
            tag: 'Adjective',
            reason: 'baked-onions',
          },
          {
            match: 'well [#PastTense]',
            group: 0,
            tag: 'Adjective',
            reason: 'well-made',
          },
          {
            match: '#Copula [fucked up?]',
            group: 0,
            tag: 'Adjective',
            reason: 'swears-adjective',
          },
          {
            match: '#Singular (seems|appears) #Adverb? [#PastTense$]',
            group: 0,
            tag: 'Adjective',
            reason: 'seems-filled',
          },
          {
            match: '#Copula #Adjective? [(out|in|through)]$',
            group: 0,
            tag: 'Adjective',
            reason: 'still-out',
          },
          {
            match: '^[#Adjective] (the|your) #Noun',
            group: 0,
            ifNo: ['all', 'even'],
            tag: 'Infinitive',
            reason: 'shut-the',
          },
          {
            match: 'the [said] #Noun',
            group: 0,
            tag: 'Adjective',
            reason: 'the-said-card',
          },
          {
            match: '#Noun (that|which|whose) [#PastTense] #Noun',
            ifNo: '#Copula',
            group: 0,
            tag: 'Adjective',
            reason: 'that-past-noun',
          },
          { match: 'too much', tag: 'Adverb Adjective', reason: 'bit-4' },
          {
            match: 'a bit much',
            tag: 'Determiner Adverb Adjective',
            reason: 'bit-3',
          },
        ],
        [
          {
            match: '#Adverb [#Adverb] (and|or|then)',
            group: 0,
            tag: 'Adjective',
            reason: 'kinda-sparkly-and',
          },
          {
            match:
              '[(dark|bright|flat|light|soft|pale|dead|dim|faux|little|wee|sheer|most|near|good|extra|all)] #Adjective',
            group: 0,
            tag: 'Adverb',
            reason: 'dark-green',
          },
        ],
        [
          {
            match: '(a|an) [#Gerund]',
            group: 0,
            tag: 'Adjective',
            reason: 'a|an',
          },
          {
            match: 'as [#Gerund] as',
            group: 0,
            tag: 'Adjective',
            reason: 'as-gerund-as',
          },
          {
            match: 'more [#Gerund] than',
            group: 0,
            tag: 'Adjective',
            reason: 'more-gerund-than',
          },
          {
            match: '(so|very|extremely) [#Gerund]',
            group: 0,
            tag: 'Adjective',
            reason: 'so-gerund',
          },
          {
            match: '(found|found) it #Adverb? [#Gerund]',
            group: 0,
            tag: 'Adjective',
            reason: 'found-it-gerund',
          },
          {
            match: 'a (little|bit|wee) bit? [#Gerund]',
            group: 0,
            tag: 'Adjective',
            reason: 'a-bit-gerund',
          },
        ],
        [
          {
            match: '#Determiner [#Adjective] #Copula',
            group: 0,
            tag: 'Noun',
            reason: 'the-adj-is',
          },
          {
            match: '#Adjective [#Adjective] #Copula',
            group: 0,
            tag: 'Noun',
            reason: 'adj-adj-is',
          },
          {
            match: '(his|its) [%Adj|Noun%]',
            group: 0,
            tag: 'Noun',
            reason: 'his-fine',
          },
          {
            match: '#Copula #Adverb? [all]',
            group: 0,
            tag: 'Noun',
            reason: 'is-all',
          },
          {
            match: '(have|had) [#Adjective] #Preposition .',
            group: 0,
            tag: 'Noun',
            reason: 'have-fun',
          },
          {
            match: '#Gerund (giant|capital|center|zone|application)',
            tag: 'Noun',
            reason: 'brewing-giant',
          },
          {
            match: '#Preposition (a|an) [#Adjective]$',
            group: 0,
            tag: 'Noun',
            reason: 'an-instant',
          },
        ],
        [
          {
            match: '[still] #Adjective',
            group: 0,
            tag: 'Adverb',
            reason: 'still-advb',
          },
          {
            match: '[still] #Verb',
            group: 0,
            tag: 'Adverb',
            reason: 'still-verb',
          },
          {
            match: '[so] #Adjective',
            group: 0,
            tag: 'Adverb',
            reason: 'so-adv',
          },
          {
            match: '[way] #Comparative',
            group: 0,
            tag: 'Adverb',
            reason: 'way-adj',
          },
          {
            match: '[way] #Adverb #Adjective',
            group: 0,
            tag: 'Adverb',
            reason: 'way-too-adj',
          },
          { match: '[all] #Verb', group: 0, tag: 'Adverb', reason: 'all-verb' },
          {
            match: '#Verb  [like]',
            group: 0,
            ifNo: ['#Modal', '#PhrasalVerb'],
            tag: 'Adverb',
            reason: 'verb-like',
          },
          {
            match: '(barely|hardly) even',
            tag: 'Adverb',
            reason: 'barely-even',
          },
          {
            match: '[even] #Verb',
            group: 0,
            tag: 'Adverb',
            reason: 'even-walk',
          },
          {
            match: '[even] (#Determiner|#Possessive)',
            group: 0,
            tag: '#Adverb',
            reason: 'even-the',
          },
          { match: 'even left', tag: '#Adverb #Verb', reason: 'even-left' },
          {
            match: '[way] #Adjective',
            group: 0,
            tag: '#Adverb',
            reason: 'way-over',
          },
          {
            match:
              '#PresentTense [(hard|quick|long|bright|slow|fast|backwards|forwards)]',
            ifNo: '#Copula',
            group: 0,
            tag: 'Adverb',
            reason: 'lazy-ly',
          },
          {
            match: '[much] #Adjective',
            group: 0,
            tag: 'Adverb',
            reason: 'bit-1',
          },
          {
            match: '#Copula [#Adverb]$',
            group: 0,
            tag: 'Adjective',
            reason: 'is-well',
          },
          {
            match: 'a [(little|bit|wee) bit?] #Adjective',
            group: 0,
            tag: 'Adverb',
            reason: 'a-bit-cold',
          },
          {
            match: '[(super|pretty)] #Adjective',
            group: 0,
            tag: 'Adverb',
            reason: 'super-strong',
          },
          {
            match: '(become|fall|grow) #Adverb? [#PastTense]',
            group: 0,
            tag: 'Adjective',
            reason: 'overly-weakened',
          },
          {
            match: '(a|an) #Adverb [#Participle] #Noun',
            group: 0,
            tag: 'Adjective',
            reason: 'completely-beaten',
          },
          {
            match: '#Determiner #Adverb? [close]',
            group: 0,
            tag: 'Adjective',
            reason: 'a-close',
          },
          {
            match: '#Gerund #Adverb? [close]',
            group: 0,
            tag: 'Adverb',
            reason: 'being-close',
          },
          {
            match: '(the|those|these|a|an) [#Participle] #Noun',
            group: 0,
            tag: 'Adjective',
            reason: 'blown-motor',
          },
          {
            match: '(#PresentTense|#PastTense) [back]',
            group: 0,
            tag: 'Adverb',
            reason: 'charge-back',
          },
        ],
        [
          {
            match: '[sun] the #Ordinal',
            tag: 'WeekDay',
            reason: 'sun-the-5th',
          },
          { match: '[sun] #Date', group: 0, tag: 'WeekDay', reason: 'sun-feb' },
          {
            match: '#Date (on|this|next|last|during)? [sun]',
            group: 0,
            tag: 'WeekDay',
            reason: '1pm-sun',
          },
          {
            match: '(in|by|before|during|on|until|after|of|within|all) [sat]',
            group: 0,
            tag: 'WeekDay',
            reason: 'sat',
          },
          {
            match: '(in|by|before|during|on|until|after|of|within|all) [wed]',
            group: 0,
            tag: 'WeekDay',
            reason: 'wed',
          },
          {
            match: '(in|by|before|during|on|until|after|of|within|all) [march]',
            group: 0,
            tag: 'Month',
            reason: 'march',
          },
          { match: '[sat] #Date', group: 0, tag: 'WeekDay', reason: 'sat-feb' },
          {
            match: '#Preposition [(march|may)]',
            group: 0,
            tag: 'Month',
            reason: 'in-month',
          },
          {
            match: '(this|next|last) [(march|may)]',
            tag: '#Date #Month',
            reason: 'this-month',
          },
          {
            match: '(march|may) the? #Value',
            tag: '#Month #Date #Date',
            reason: 'march-5th',
          },
          {
            match: '#Value of? (march|may)',
            tag: '#Date #Date #Month',
            reason: '5th-of-march',
          },
          {
            match: '[(march|may)] .? #Date',
            group: 0,
            tag: 'Month',
            reason: 'march-and-feb',
          },
          {
            match: '#Date .? [(march|may)]',
            group: 0,
            tag: 'Month',
            reason: 'feb-and-march',
          },
          {
            match: '#Adverb [(march|may)]',
            group: 0,
            tag: 'Verb',
            reason: 'quickly-march',
          },
          {
            match: '[(march|may)] #Adverb',
            group: 0,
            tag: 'Verb',
            reason: 'march-quickly',
          },
        ],
        [
          {
            match: '#Holiday (day|eve)',
            tag: 'Holiday',
            reason: 'holiday-day',
          },
          { match: '#Value of #Month', tag: 'Date', reason: 'value-of-month' },
          { match: '#Cardinal #Month', tag: 'Date', reason: 'cardinal-month' },
          {
            match: '#Month #Value to #Value',
            tag: 'Date',
            reason: 'value-to-value',
          },
          {
            match: '#Month the #Value',
            tag: 'Date',
            reason: 'month-the-value',
          },
          {
            match: '(#WeekDay|#Month) #Value',
            tag: 'Date',
            reason: 'date-value',
          },
          {
            match: '#Value (#WeekDay|#Month)',
            tag: 'Date',
            reason: 'value-date',
          },
          {
            match: '(#TextValue && #Date) #TextValue',
            tag: 'Date',
            reason: 'textvalue-date',
          },
          { match: '#Month #NumberRange', tag: 'Date', reason: 'aug 20-21' },
          {
            match: '#WeekDay #Month #Ordinal',
            tag: 'Date',
            reason: 'week mm-dd',
          },
          {
            match: '#Month #Ordinal #Cardinal',
            tag: 'Date',
            reason: 'mm-dd-yyy',
          },
          {
            match:
              '(#Place|#Demonmym|#Time) (standard|daylight|central|mountain)? time',
            tag: 'Timezone',
            reason: 'std-time',
          },
          {
            match:
              '(eastern|mountain|pacific|central|atlantic) (standard|daylight|summer)? time',
            tag: 'Timezone',
            reason: 'eastern-time',
          },
          {
            match: '#Time [(eastern|mountain|pacific|central|est|pst|gmt)]',
            group: 0,
            tag: 'Timezone',
            reason: '5pm-central',
          },
          {
            match: '(central|western|eastern) european time',
            tag: 'Timezone',
            reason: 'cet',
          },
        ],
        [
          { match: 'more #Noun', tag: 'Noun', reason: 'more-noun' },
          { match: '(right|rights) of .', tag: 'Noun', reason: 'right-of' },
          { match: 'a [bit]', group: 0, tag: 'Noun', reason: 'bit-2' },
          {
            match: 'some [#Verb] #Plural',
            group: 0,
            tag: 'Noun',
            reason: 'determiner6',
          },
          {
            match: '#Possessive #Ordinal [#PastTense]',
            group: 0,
            tag: 'Noun',
            reason: 'first-thought',
          },
          {
            match: '(the|this|those|these) #Adjective [%Verb|Noun%]',
            group: 0,
            tag: 'Noun',
            ifNo: '#Copula',
            reason: 'the-adj-verb',
          },
          {
            match: '(the|this|those|these) #Adverb #Adjective [#Verb]',
            group: 0,
            tag: 'Noun',
            reason: 'determiner4',
          },
          {
            match: 'the [#Verb] #Preposition .',
            group: 0,
            tag: 'Noun',
            reason: 'determiner1',
          },
          {
            match: '#Determiner [#Verb] of',
            group: 0,
            tag: 'Noun',
            reason: 'the-verb-of',
          },
          {
            match: '#Determiner #Noun of [#Verb]',
            group: 0,
            tag: 'Noun',
            ifNo: '#Gerund',
            reason: 'noun-of-noun',
          },
          {
            match: '#PastTense #Preposition [#PresentTense]',
            group: 0,
            ifNo: ['#Gerund'],
            tag: 'Noun',
            reason: 'ended-in-ruins',
          },
          {
            match: '#Conjunction [u]',
            group: 0,
            tag: 'Pronoun',
            reason: 'u-pronoun-2',
          },
          {
            match: '[u] #Verb',
            group: 0,
            tag: 'Pronoun',
            reason: 'u-pronoun-1',
          },
          {
            match:
              '#Determiner [(western|eastern|northern|southern|central)] #Noun',
            group: 0,
            tag: 'Noun',
            reason: 'western-line',
          },
          {
            match: '(#Singular && @hasHyphen) #PresentTense',
            tag: 'Noun',
            reason: 'hyphen-verb',
          },
          {
            match: 'is no [#Verb]',
            group: 0,
            tag: 'Noun',
            reason: 'is-no-verb',
          },
          { match: 'do [so]', group: 0, tag: 'Noun', reason: 'so-noun' },
          {
            match: '#Determiner [(shit|damn|hell)]',
            group: 0,
            tag: 'Noun',
            reason: 'swears-noun',
          },
          {
            match: 'to [(shit|hell)]',
            group: 0,
            tag: 'Noun',
            reason: 'to-swears',
          },
          {
            match: '(the|these) [#Singular] (were|are)',
            group: 0,
            tag: 'Plural',
            reason: 'singular-were',
          },
          {
            match: 'a #Noun+ or #Adverb+? [#Verb]',
            group: 0,
            tag: 'Noun',
            reason: 'noun-or-noun',
          },
          {
            match: '(the|those|these|a|an) #Adjective? [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'det-inf',
          },
          {
            match: '(the|those|these|a|an) #Adjective? [#PresentTense]',
            ifNo: ['#Gerund', '#Copula'],
            group: 0,
            tag: 'Noun',
            reason: 'det-pres',
          },
          { match: '#Noun #Actor', tag: 'Actor', reason: 'thing-doer' },
          { match: 'co #Singular', tag: 'Actor', reason: 'co-noun' },
          {
            match: '#Determiner [sun]',
            group: 0,
            tag: 'Singular',
            reason: 'the-sun',
          },
          {
            match: '#Verb (a|an) [#Value]',
            group: 0,
            tag: 'Singular',
            reason: 'did-a-value',
          },
          {
            match: 'the [(can|will|may)]',
            group: 0,
            tag: 'Singular',
            reason: 'the can',
          },
          {
            match: '#FirstName #Acronym? (#Possessive && #LastName)',
            tag: 'Possessive',
            reason: 'name-poss',
          },
          {
            match: '#Organization+ #Possessive',
            tag: 'Possessive',
            reason: 'org-possessive',
          },
          {
            match: '#Place+ #Possessive',
            tag: 'Possessive',
            reason: 'place-possessive',
          },
          {
            match: '#Value of a [second]',
            group: 0,
            unTag: 'Value',
            tag: 'Singular',
            reason: '10th-of-a-second',
          },
          {
            match: '#Value [seconds]',
            group: 0,
            unTag: 'Value',
            tag: 'Plural',
            reason: '10-seconds',
          },
          {
            match: 'in [#Infinitive]',
            group: 0,
            tag: 'Singular',
            reason: 'in-age',
          },
          {
            match: 'a [#Adjective] #Preposition',
            group: 0,
            tag: 'Noun',
            reason: 'a-minor-in',
          },
          {
            match: '#Determiner [#Singular] said',
            group: 0,
            tag: 'Actor',
            reason: 'the-actor-said',
          },
          {
            match:
              '#Determiner #Noun [(feel|sense|process|rush|side|bomb|bully|challenge|cover|crush|dump|exchange|flow|function|issue|lecture|limit|march|process)] !(#Preposition|to|#Adverb)?',
            group: 0,
            tag: 'Noun',
            reason: 'the-noun-sense',
          },
          {
            match: '[#PresentTense] (of|by|for) (a|an|the) #Noun #Copula',
            group: 0,
            tag: 'Plural',
            reason: 'photographs-of',
          },
          {
            match: '#Infinitive and [%Noun|Verb%]',
            group: 0,
            tag: 'Infinitive',
            reason: 'fight and win',
          },
          {
            match: '#Noun and [%Noun|Verb%]',
            group: 0,
            tag: 'Singular',
            ifNo: ['#ProperNoun'],
            reason: 'bride-and-groom',
          },
          {
            match: 'the #Cardinal [%Adj|Noun%]',
            group: 0,
            tag: 'Noun',
            reason: 'the-1992-classic',
          },
        ],
        [
          {
            match: '(this|that|the|a|an) [#Gerund #Infinitive]',
            group: 0,
            tag: 'Singular',
            reason: 'the-planning-process',
          },
          {
            match: '(that|the) [#Gerund #PresentTense]',
            group: 0,
            tag: 'Plural',
            reason: 'the-paving-stones',
          },
          {
            match: '#Determiner [#Gerund] #Noun',
            group: 0,
            tag: 'Adjective',
            reason: 'the-gerund-noun',
          },
          {
            match: '#Pronoun #Infinitive [#Gerund] #PresentTense',
            group: 0,
            tag: 'Noun',
            reason: 'tipping-sucks',
          },
          {
            match: '#Adjective [#Gerund]',
            group: 0,
            tag: 'Noun',
            reason: 'early-warning',
          },
          {
            match: '[#Gerund] #Adverb? not? #Copula',
            group: 0,
            tag: 'Activity',
            reason: 'gerund-copula',
          },
          {
            match: '[#Gerund] #Modal',
            group: 0,
            tag: 'Activity',
            reason: 'gerund-modal',
          },
        ],
        [
          {
            match: '#Infinitive (this|that|the) [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'do-this-dance',
          },
          {
            match: '#Gerund #Determiner [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'running-a-show',
          },
          {
            match: '#Determiner #Adverb [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'the-reason',
          },
          {
            match: '(the|this|a|an) [#Infinitive] #Adverb? #Verb',
            group: 0,
            tag: 'Noun',
            reason: 'determiner5',
          },
          {
            match: '#Determiner [#Infinitive] #Noun',
            group: 0,
            tag: 'Noun',
            reason: 'determiner7',
          },
          {
            match: '#Determiner #Adjective #Adjective? [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'a-nice-inf',
          },
          {
            match: '#Determiner #Demonym [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'mexican-train',
          },
          {
            match: '#Adjective #Noun+ [#Infinitive] #Copula',
            group: 0,
            tag: 'Noun',
            reason: 'career-move',
          },
          {
            match: 'at some [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'at-some-inf',
          },
          {
            match: '(go|goes|went) to [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'goes-to-verb',
          },
          {
            match:
              '(a|an) #Adjective? #Noun [#Infinitive] (#Preposition|#Noun)',
            group: 0,
            tag: 'Noun',
            reason: 'a-noun-inf',
          },
          {
            match: '(a|an) #Noun [#Infinitive]$',
            group: 0,
            tag: 'Noun',
            reason: 'a-noun-inf2',
          },
          {
            match: '#Copula [#Infinitive] #Noun',
            group: 0,
            tag: 'Noun',
            reason: 'is-pres-noun',
          },
          {
            match: '#Gerund #Adjective? for [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'running-for',
          },
          {
            match: '#Gerund #Adjective to [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'running-to',
          },
          {
            match: '(one|1) [#Infinitive]',
            group: 0,
            tag: 'Singular',
            reason: '1-trains',
          },
          {
            match: 'about [#Infinitive]',
            group: 0,
            tag: 'Singular',
            reason: 'about-love',
          },
          {
            match: 'on [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'on-stage',
          },
          {
            match: 'any [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'any-charge',
          },
          {
            match: 'no [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'no-doubt',
          },
          {
            match: 'number of [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'number-of-x',
          },
          {
            match: '(taught|teaches|learns|learned) [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'teaches-x',
          },
          {
            match: '(try|use|attempt|build|make) [#Verb]',
            ifNo: ['#Copula', '#PhrasalVerb'],
            group: 0,
            tag: 'Noun',
            reason: 'do-verb',
          },
          {
            match: '^[#Infinitive] (is|was)',
            group: 0,
            tag: 'Noun',
            reason: 'checkmate-is',
          },
          {
            match: '#Infinitive much [#Infinitive]',
            group: 0,
            tag: 'Noun',
            reason: 'get-much',
          },
          {
            match: '[cause] #Pronoun #Verb',
            group: 0,
            tag: 'Conjunction',
            reason: 'cause-cuz',
          },
          {
            match: 'the #Singular [#Infinitive] #Noun',
            group: 0,
            tag: 'Noun',
            reason: 'cardio-dance',
          },
          {
            match: '#Determiner #Modal [#Noun]',
            group: 0,
            tag: 'PresentTense',
            reason: 'should-smoke',
          },
          {
            match: '(this|that) [#Plural]',
            group: 0,
            tag: 'PresentTense',
            reason: 'this-verbs',
          },
          {
            match:
              '(let|make|made) (him|her|it|#Person|#Place|#Organization)+ [#Singular] (a|an|the|it)',
            group: 0,
            tag: 'Infinitive',
            reason: 'let-him-glue',
          },
          {
            match: '#Verb (all|every|each|most|some|no) [#PresentTense]',
            ifNo: '#Modal',
            group: 0,
            tag: 'Noun',
            reason: 'all-presentTense',
          },
          {
            match: '(had|have|#PastTense) #Adjective [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'adj-presentTense',
          },
          {
            match: '#Value #Adjective [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'one-big-reason',
          },
          {
            match: '#PastTense #Adjective+ [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'won-wide-support',
          },
          {
            match: '(many|few|several|couple) [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'many-poses',
          },
          {
            match: '#Adverb #Adjective [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'very-big-dream',
          },
          {
            match: '#Adjective #Adjective [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'adorable-little-store',
          },
          {
            match: '#Gerund #Adverb? #Comparative [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'higher-costs',
          },
          {
            match: '(#Noun && @hasComma) #Noun (and|or) [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'noun-list',
          },
          {
            match: '(many|any|some|several) [#PresentTense] for',
            group: 0,
            tag: 'Noun',
            reason: 'any-verbs-for',
          },
          {
            match: 'to #PresentTense #Noun [#PresentTense] #Preposition',
            group: 0,
            tag: 'Noun',
            reason: 'gas-exchange',
          },
          {
            match: '#PastTense (until|as|through|without) [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'waited-until-release',
          },
          {
            match: '#Gerund like #Adjective? [#PresentTense]',
            group: 0,
            tag: 'Plural',
            reason: 'like-hot-cakes',
          },
          {
            match: 'some #Adjective [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'some-reason',
          },
          {
            match: 'for some [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'for-some-reason',
          },
          {
            match: '(same|some|the|that|a) kind of [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'some-kind-of',
          },
          {
            match: '(same|some|the|that|a) type of [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'some-type-of',
          },
          {
            match: '#Gerund #Adjective #Preposition [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'doing-better-for-x',
          },
          {
            match: '(get|got|have|had) #Comparative [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'got-better-aim',
          },
          {
            match: 'whose [#PresentTense] #Copula',
            group: 0,
            tag: 'Noun',
            reason: 'whos-name-was',
          },
          {
            match: '#PhrasalVerb #PhrasalVerb #Preposition [#PresentTense]',
            group: 0,
            tag: 'Noun',
            reason: 'given-up-on-x',
          },
          {
            match: 'there (are|were) #Adjective? [#PresentTense]',
            group: 0,
            tag: 'Plural',
            reason: 'there-are',
          },
          {
            match: '#Value [#PresentTense]',
            group: 0,
            ifNo: ['one', '1', '#Copula', '#Infinitive'],
            tag: 'Plural',
            reason: '2-trains',
          },
          {
            match: '[#PresentTense] (are|were|was) #Adjective',
            group: 0,
            tag: 'Plural',
            reason: 'compromises-are-possible',
          },
          {
            match: '^[(hope|guess|thought|think)] #Pronoun #Verb',
            group: 0,
            tag: 'Infinitive',
            reason: 'suppose-i',
          },
          {
            match: '#PresentTense #Possessive [#PresentTense]',
            group: 0,
            tag: 'Plural',
            reason: 'pursue-its-dreams',
          },
          {
            match: '#Possessive #Adjective [#Verb]',
            group: 0,
            tag: 'Noun',
            reason: 'our-full-support',
          },
          {
            match: '(do|did|will) [#Singular] #Noun',
            group: 0,
            tag: 'PresentTense',
            reason: 'do-serve-fish',
          },
          {
            match: '[(tastes|smells)] #Adverb? #Adjective',
            group: 0,
            tag: 'PresentTense',
            reason: 'tastes-good',
          },
          {
            match: '^are #Pronoun [#Noun]',
            group: 0,
            ifNo: ['here', 'there'],
            tag: 'Verb',
            reason: 'are-you-x',
          },
          {
            match: '#Copula #Gerund [#PresentTense] !by?',
            group: 0,
            tag: 'Noun',
            ifNo: ['going'],
            reason: 'ignoring-commute',
          },
          {
            match:
              '#Determiner #Adjective? [(shed|thought|rose|bid|saw|spelt)]',
            group: 0,
            tag: 'Noun',
            reason: 'noun-past',
          },
        ],
        [
          {
            match: '#Money and #Money #Currency?',
            tag: 'Money',
            reason: 'money-and-money',
          },
          {
            match: '#Value #Currency [and] #Value (cents|ore|centavos|sens)',
            group: 0,
            tag: 'money',
            reason: 'and-5-cents',
          },
          {
            match: '#Value (mark|rand|won|rub|ore)',
            tag: '#Money #Currency',
            reason: '4 mark',
          },
        ],
        [
          {
            match: '[(half|quarter)] of? (a|an)',
            group: 0,
            tag: 'Fraction',
            reason: 'millionth',
          },
          {
            match: '#Adverb [half]',
            group: 0,
            tag: 'Fraction',
            reason: 'nearly-half',
          },
          {
            match: '[half] the',
            group: 0,
            tag: 'Fraction',
            reason: 'half-the',
          },
          {
            match: '#Cardinal and a half',
            tag: 'Fraction',
            reason: 'and-a-half',
          },
          {
            match: '#Value (halves|halfs|quarters)',
            tag: 'Fraction',
            reason: 'two-halves',
          },
          { match: 'a #Ordinal', tag: 'Fraction', reason: 'a-quarter' },
          {
            match: '[#Cardinal+] (#Fraction && /s$/)',
            tag: 'Fraction',
            reason: 'seven-fifths',
          },
          {
            match: '[#Cardinal+ #Ordinal] of .',
            group: 0,
            tag: 'Fraction',
            reason: 'ordinal-of',
          },
          {
            match: '[(#NumericValue && #Ordinal)] of .',
            group: 0,
            tag: 'Fraction',
            reason: 'num-ordinal-of',
          },
          {
            match: '(a|one) #Cardinal?+ #Ordinal',
            tag: 'Fraction',
            reason: 'a-ordinal',
          },
          {
            match: '#Cardinal+ out? of every? #Cardinal',
            tag: 'Fraction',
            reason: 'out-of',
          },
        ],
        [
          { match: '#Cardinal [second]', tag: 'Unit', reason: 'one-second' },
          {
            match:
              '!once? [(a|an)] (#Duration|hundred|thousand|million|billion|trillion)',
            group: 0,
            tag: 'Value',
            reason: 'a-is-one',
          },
          {
            match: '1 #Value #PhoneNumber',
            tag: 'PhoneNumber',
            reason: '1-800-Value',
          },
          {
            match: '#NumericValue #PhoneNumber',
            tag: 'PhoneNumber',
            reason: '(800) PhoneNumber',
          },
          {
            match: '#Demonym #Currency',
            tag: 'Currency',
            reason: 'demonym-currency',
          },
          {
            match: '#Value [(buck|bucks|grand)]',
            group: 0,
            tag: 'Currency',
            reason: 'value-bucks',
          },
          {
            match: '[#Value+] #Currency',
            group: 0,
            tag: 'Money',
            reason: '15 usd',
          },
          {
            match: '[second] #Noun',
            group: 0,
            tag: 'Ordinal',
            reason: 'second-noun',
          },
          {
            match: '#Value+ [#Currency]',
            group: 0,
            tag: 'Unit',
            reason: '5-yan',
          },
          {
            match: '#Value [(foot|feet)]',
            group: 0,
            tag: 'Unit',
            reason: 'foot-unit',
          },
          {
            match: '#Value [#Abbreviation]',
            group: 0,
            tag: 'Unit',
            reason: 'value-abbr',
          },
          { match: '#Value [k]', group: 0, tag: 'Unit', reason: 'value-k' },
          { match: '#Unit an hour', tag: 'Unit', reason: 'unit-an-hour' },
          {
            match: '(minus|negative) #Value',
            tag: 'Value',
            reason: 'minus-value',
          },
          {
            match: '#Value (point|decimal) #Value',
            tag: 'Value',
            reason: 'value-point-value',
          },
          {
            match: '#Determiner [(half|quarter)] #Ordinal',
            group: 0,
            tag: 'Value',
            reason: 'half-ordinal',
          },
          {
            match: '#Multiple+ and #Value',
            tag: 'Value',
            reason: 'magnitude-and-value',
          },
        ],
        [
          {
            match: '[(1st|2nd|first|second)] #Honorific',
            group: 0,
            tag: 'Honorific',
            reason: 'ordinal-honorific',
          },
          {
            match:
              '[(private|general|major|corporal|lord|lady|secretary|premier)] #Honorific? #Person',
            group: 0,
            tag: 'Honorific',
            reason: 'ambg-honorifics',
          },
          {
            match: '#Copula [(#Noun|#PresentTense)] #LastName',
            group: 0,
            tag: 'FirstName',
            reason: 'copula-noun-lastname',
          },
          {
            match: '(lady|queen|sister|king|pope|father) #ProperNoun',
            tag: 'Person',
            reason: 'lady-titlecase',
            safe: !0,
          },
          {
            match: '#FirstName [#Determiner #Noun] #LastName',
            group: 0,
            tag: 'Person',
            reason: 'first-noun-last',
          },
          {
            match:
              '#ProperNoun (b|c|d|e|f|g|h|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z) #ProperNoun',
            tag: 'Person',
            reason: 'titlecase-acronym-titlecase',
            safe: !0,
          },
          {
            match: '#Acronym #LastName',
            tag: 'Person',
            reason: 'acronym-lastname',
            safe: !0,
          },
          {
            match: '#Person (jr|sr|md)',
            tag: 'Person',
            reason: 'person-honorific',
          },
          {
            match: '#Honorific #Acronym',
            tag: 'Person',
            reason: 'Honorific-TitleCase',
          },
          {
            match: '#Person #Person the? #RomanNumeral',
            tag: 'Person',
            reason: 'roman-numeral',
          },
          {
            match: '#FirstName [/^[^aiurck]$/]',
            group: 0,
            tag: ['Acronym', 'Person'],
            reason: 'john-e',
          },
          {
            match: '#Noun van der? #Noun',
            tag: 'Person',
            reason: 'van der noun',
            safe: !0,
          },
          {
            match: '(king|queen|prince|saint|lady) of #Noun',
            tag: 'Person',
            reason: 'king-of-noun',
            safe: !0,
          },
          {
            match: '(prince|lady) #Place',
            tag: 'Person',
            reason: 'lady-place',
          },
          {
            match: '(king|queen|prince|saint) #ProperNoun',
            tag: 'Person',
            reason: 'saint-foo',
          },
          {
            match: 'al (#Person|#ProperNoun)',
            tag: 'Person',
            reason: 'al-borlen',
            safe: !0,
          },
          {
            match: '#FirstName de #Noun',
            tag: 'Person',
            reason: 'bill-de-noun',
          },
          {
            match: '#FirstName (bin|al) #Noun',
            tag: 'Person',
            reason: 'bill-al-noun',
          },
          {
            match: '#FirstName #Acronym #ProperNoun',
            tag: 'Person',
            reason: 'bill-acronym-title',
          },
          {
            match: '#FirstName #FirstName #ProperNoun',
            tag: 'Person',
            reason: 'bill-firstname-title',
          },
          {
            match: '#Honorific #FirstName? #ProperNoun',
            tag: 'Person',
            reason: 'dr-john-Title',
          },
          {
            match: '#FirstName the #Adjective',
            tag: 'Person',
            reason: 'name-the-great',
          },
          {
            match: '#ProperNoun (van|al|bin) #ProperNoun',
            tag: 'Person',
            reason: 'title-van-title',
            safe: !0,
          },
          {
            match: '#ProperNoun (de|du) la? #ProperNoun',
            tag: 'Person',
            reason: 'title-de-title',
          },
          {
            match: '#Singular #Acronym #LastName',
            tag: '#FirstName #Person .',
            reason: 'title-acro-noun',
            safe: !0,
          },
          {
            match: '[#ProperNoun] #Person',
            group: 0,
            tag: 'Person',
            reason: 'proper-person',
            safe: !0,
          },
          {
            match: '#Person [#ProperNoun #ProperNoun]',
            group: 0,
            tag: 'Person',
            ifNo: '#Possessive',
            reason: 'three-name-person',
            safe: !0,
          },
          {
            match: '#FirstName #Acronym? [#ProperNoun]',
            group: 0,
            tag: 'LastName',
            ifNo: '#Possessive',
            reason: 'firstname-titlecase',
          },
          {
            match: '#FirstName [#FirstName]',
            group: 0,
            tag: 'LastName',
            reason: 'firstname-firstname',
          },
          {
            match: '#FirstName #Acronym #Noun',
            tag: 'Person',
            reason: 'n-acro-noun',
            safe: !0,
          },
          {
            match: '#FirstName [(de|di|du|van|von)] #Person',
            group: 0,
            tag: 'LastName',
            reason: 'de-firstname',
          },
          {
            match: '#ProperNoun [#Honorific]',
            group: 0,
            tag: 'Person',
            reason: 'last-sr',
          },
          {
            match: '#Honorific #FirstName [#Singular]',
            group: 0,
            tag: 'LastName',
            ifNo: '#Possessive',
            reason: 'dr-john-foo',
            safe: !0,
          },
          {
            match:
              '[(his|her) (majesty|honour|worship|excellency|honorable)] #Person',
            group: 0,
            tag: ['Honorific', 'Person'],
            reason: 'his-excellency',
          },
          {
            match: '#Honorific #Person',
            tag: 'Person',
            reason: 'honorific-person',
          },
        ],
        [
          {
            match: '%Person|Date% #Acronym? #ProperNoun',
            tag: 'Person',
            reason: 'jan-thierson',
          },
          {
            match: '%Person|Noun% #Acronym? #ProperNoun',
            tag: 'Person',
            reason: 'switch-person',
            safe: !0,
          },
          {
            match: '%Person|Noun% #Organization',
            tag: 'Organization',
            reason: 'olive-garden',
          },
          {
            match: '%Person|Verb% #Acronym? #ProperNoun',
            tag: 'Person',
            reason: 'verb-propernoun',
          },
          {
            match:
              '[%Person|Verb%] (will|had|has|said|says|told|did|learned|wants|wanted)',
            group: 0,
            tag: 'Person',
            reason: 'person-said',
          },
          {
            match:
              '[%Person|Place%] (harbor|harbour|pier|town|city|place|dump|landfill)',
            group: 0,
            tag: 'Place',
            reason: 'sydney-harbour',
          },
          {
            match: '(west|east|north|south) [%Person|Place%]',
            group: 0,
            tag: 'Place',
            reason: 'east-sydney',
          },
          { match: Al + ' #Person', tag: 'Person', reason: 'randy-smith' },
          {
            match: Al + ' #Acronym? #ProperNoun',
            tag: 'Person',
            reason: 'rusty-smith',
          },
          {
            match: `#Adverb [${Al}]`,
            group: 0,
            tag: 'Adjective',
            reason: 'really-rich',
          },
          {
            match: '#Modal [%Person|Verb%]',
            group: 0,
            tag: 'Verb',
            reason: 'would-mark',
          },
          {
            match: '#Adverb [%Person|Verb%]',
            group: 0,
            tag: 'Verb',
            reason: 'really-mark',
          },
          {
            match: '[%Person|Verb%] (#Adverb|#Comparative)',
            group: 0,
            tag: 'Verb',
            reason: 'drew-closer',
          },
          {
            match: '%Person|Verb% #Person',
            tag: 'Person',
            reason: 'rob-smith',
          },
          {
            match: '%Person|Verb% #Acronym #ProperNoun',
            tag: 'Person',
            reason: 'rob-a-smith',
          },
          {
            match: '[will] #Verb',
            group: 0,
            tag: 'Modal',
            reason: 'will-verb',
          },
          {
            match: '(will && @isTitleCase) #ProperNoun',
            tag: 'Person',
            reason: 'will-name',
          },
        ],
        [
          {
            match: '#Copula (pretty|dead|full|well|sure) (#Adjective|#Noun)',
            tag: '#Copula #Adverb #Adjective',
            reason: 'sometimes-adverb',
          },
          {
            match: '(#Pronoun|#Person) (had|#Adverb)? [better] #PresentTense',
            group: 0,
            tag: 'Modal',
            reason: 'i-better',
          },
          {
            match: '(#Modal|i|they|we|do) not? [like]',
            group: 0,
            tag: 'PresentTense',
            reason: 'modal-like',
          },
          {
            match: '#Noun #Adverb? [left]',
            group: 0,
            tag: 'PastTense',
            reason: 'left-verb',
          },
          {
            match: 'will #Adverb? not? #Adverb? [be] #Gerund',
            group: 0,
            tag: 'Copula',
            reason: 'will-be-copula',
          },
          {
            match: 'will #Adverb? not? #Adverb? [be] #Adjective',
            group: 0,
            tag: 'Copula',
            reason: 'be-copula',
          },
          {
            match: '[march] (up|down|back|toward)',
            notIf: ['#Date'],
            group: 0,
            tag: 'Infinitive',
            reason: 'march-to',
          },
          {
            match: '#Modal [march]',
            group: 0,
            tag: 'Infinitive',
            reason: 'must-march',
          },
          { match: '[may] be', group: 0, tag: 'Verb', reason: 'may-be' },
          {
            match: '[(subject|subjects|subjected)] to',
            group: 0,
            tag: 'Verb',
            reason: 'subject to',
          },
          {
            match: '[home] to',
            group: 0,
            tag: 'PresentTense',
            reason: 'home to',
          },
          {
            match: '[open] #Determiner',
            group: 0,
            tag: 'Infinitive',
            reason: 'open-the',
          },
          {
            match: '(were|was) being [#PresentTense]',
            group: 0,
            tag: 'PastTense',
            reason: 'was-being',
          },
          {
            match: '(had|has|have) [been /en$/]',
            group: 0,
            tag: 'Auxiliary Participle',
            reason: 'had-been-broken',
          },
          {
            match: '(had|has|have) [been /ed$/]',
            group: 0,
            tag: 'Auxiliary PastTense',
            reason: 'had-been-smoked',
          },
          {
            match: '(had|has) #Adverb? [been] #Adverb? #PastTense',
            group: 0,
            tag: 'Auxiliary',
            reason: 'had-been-adj',
          },
          {
            match: '(had|has) to [#Noun] (#Determiner|#Possessive)',
            group: 0,
            tag: 'Infinitive',
            reason: 'had-to-noun',
          },
          {
            match: 'have [#PresentTense]',
            group: 0,
            tag: 'PastTense',
            ifNo: ['come', 'gotten'],
            reason: 'have-read',
          },
          {
            match: '(does|will|#Modal) that [work]',
            group: 0,
            tag: 'PastTense',
            reason: 'does-that-work',
          },
          {
            match: '[(sound|sounds)] #Adjective',
            group: 0,
            tag: 'PresentTense',
            reason: 'sounds-fun',
          },
          {
            match: '[(look|looks)] #Adjective',
            group: 0,
            tag: 'PresentTense',
            reason: 'looks-good',
          },
          {
            match: '[(need|needs)] to #Infinitive',
            group: 0,
            tag: 'PresentTense',
            reason: 'need-to-learn',
          },
          {
            match: '[(start|starts|stop|stops|begin|begins)] #Gerund',
            group: 0,
            tag: 'Verb',
            reason: 'starts-thinking',
          },
          {
            match: '(is|was|were) [(under|over) #PastTense]',
            group: 0,
            tag: 'Adverb Adjective',
            reason: 'was-under-cooked',
          },
          {
            match: '[shit] (#Determiner|#Possessive|them)',
            group: 0,
            tag: 'Verb',
            reason: 'swear1-verb',
          },
          {
            match: '[damn] (#Determiner|#Possessive|them)',
            group: 0,
            tag: 'Verb',
            reason: 'swear2-verb',
          },
          {
            match: '[fuck] (#Determiner|#Possessive|them)',
            group: 0,
            tag: 'Verb',
            reason: 'swear3-verb',
          },
          {
            match: '#Plural that %Noun|Verb%',
            tag: '. #Preposition #Infinitive',
            reason: 'jobs-that-work',
          },
          {
            match: '[works] for me',
            group: 0,
            tag: 'PresentTense',
            reason: 'works-for-me',
          },
        ],
        [
          {
            match: '(slowly|quickly) [#Adjective]',
            group: 0,
            tag: 'Verb',
            reason: 'slowly-adj',
          },
          {
            match: 'does (#Adverb|not)? [#Adjective]',
            group: 0,
            tag: 'PresentTense',
            reason: 'does-mean',
          },
          {
            match: '[(fine|okay|cool|ok)] by me',
            group: 0,
            tag: 'Adjective',
            reason: 'okay-by-me',
          },
          {
            match: 'i (#Adverb|do)? not? [mean]',
            group: 0,
            tag: 'PresentTense',
            reason: 'i-mean',
          },
          {
            match: 'will #Adjective',
            tag: 'Auxiliary Infinitive',
            reason: 'will-adj',
          },
          {
            match: '#Pronoun [#Adjective] #Determiner #Adjective? #Noun',
            group: 0,
            tag: 'Verb',
            reason: 'he-adj-the',
          },
          {
            match: '#Copula [%Adj|Present%] to #Verb',
            group: 0,
            tag: 'Verb',
            reason: 'adj-to',
          },
          {
            match: '#Adjective and [#Gerund] !#Preposition?',
            group: 0,
            tag: 'Adjective',
            reason: 'rude-and-x',
          },
          {
            match: '#Copula #Adverb? (over|under) [#PastTense]',
            group: 0,
            tag: 'Adjective',
            reason: 'over-cooked',
          },
          {
            match: '#Copula #Adjective+ (and|or) [#PastTense]$',
            group: 0,
            tag: 'Adjective',
            reason: 'bland-and-overcooked',
          },
          {
            match: 'got #Adverb? [#PastTense] of',
            group: 0,
            tag: 'Adjective',
            reason: 'got-tired-of',
          },
          {
            match:
              '(seem|seems|seemed|appear|appeared|appears|feel|feels|felt|sound|sounds|sounded) (#Adverb|#Adjective)? [#PastTense]',
            group: 0,
            tag: 'Adjective',
            reason: 'felt-loved',
          },
        ],
        [
          {
            match: 'will (#Adverb|not)+? [have] (#Adverb|not)+? #Verb',
            group: 0,
            tag: 'Auxiliary',
            reason: 'will-have-vb',
          },
          {
            match: '[#Copula] (#Adverb|not)+? (#Gerund|#PastTense)',
            group: 0,
            tag: 'Auxiliary',
            reason: 'copula-walking',
          },
          {
            match: '#Adverb+? [(#Modal|did)+] (#Adverb|not)+? #Verb',
            group: 0,
            tag: 'Auxiliary',
            reason: 'modal-verb',
          },
          {
            match:
              '#Modal (#Adverb|not)+? [have] (#Adverb|not)+? [had] (#Adverb|not)+? #Verb',
            group: 0,
            tag: 'Auxiliary',
            reason: 'would-have',
          },
          {
            match: '[(has|had)] (#Adverb|not)+? #PastTense',
            group: 0,
            tag: 'Auxiliary',
            reason: 'had-walked',
          },
          {
            match:
              '[(do|does|did|will|have|had|has|got)] (not|#Adverb)+? #Verb',
            group: 0,
            tag: 'Auxiliary',
            reason: 'have-had',
          },
          {
            match: '[about to] #Adverb? #Verb',
            group: 0,
            tag: ['Auxiliary', 'Verb'],
            reason: 'about-to',
          },
          {
            match: '#Modal (#Adverb|not)+? [be] (#Adverb|not)+? #Verb',
            group: 0,
            tag: 'Auxiliary',
            reason: 'would-be',
          },
          {
            match:
              '[(#Modal|had|has)] (#Adverb|not)+? [been] (#Adverb|not)+? #Verb',
            group: 0,
            tag: 'Auxiliary',
            reason: 'had-been',
          },
          {
            match: '[(be|being|been)] #Participle',
            group: 0,
            tag: 'Auxiliary',
            reason: 'being-driven',
          },
          {
            match: '[may] #Adverb? #Infinitive',
            group: 0,
            tag: 'Auxiliary',
            reason: 'may-want',
          },
          {
            match:
              '#Copula (#Adverb|not)+? [(be|being|been)] #Adverb+? #PastTense',
            group: 0,
            tag: 'Auxiliary',
            reason: 'being-walked',
          },
          {
            match: 'will [be] #PastTense',
            group: 0,
            tag: 'Auxiliary',
            reason: 'will-be-x',
          },
          {
            match: '[(be|been)] (#Adverb|not)+? #Gerund',
            group: 0,
            tag: 'Auxiliary',
            reason: 'been-walking',
          },
          {
            match: '[used to] #PresentTense',
            group: 0,
            tag: 'Auxiliary',
            reason: 'used-to-walk',
          },
          {
            match: '#Copula (#Adverb|not)+? [going to] #Adverb+? #PresentTense',
            group: 0,
            tag: 'Auxiliary',
            reason: 'going-to-walk',
          },
          {
            match: '#Imperative [(me|him|her)]',
            group: 0,
            tag: 'Reflexive',
            reason: 'tell-him',
          },
          {
            match: '(is|was) #Adverb? [no]',
            group: 0,
            tag: 'Negative',
            reason: 'is-no',
          },
        ],
        [
          {
            match: '(#Verb && @hasHyphen) up',
            tag: 'PhrasalVerb',
            reason: 'foo-up',
          },
          {
            match: '(#Verb && @hasHyphen) off',
            tag: 'PhrasalVerb',
            reason: 'foo-off',
          },
          {
            match: '(#Verb && @hasHyphen) over',
            tag: 'PhrasalVerb',
            reason: 'foo-over',
          },
          {
            match: '(#Verb && @hasHyphen) out',
            tag: 'PhrasalVerb',
            reason: 'foo-out',
          },
          {
            match: '[#Verb (in|out|up|down|off|back)] (on|in)',
            ifNo: ['#Copula'],
            tag: 'PhrasalVerb Particle',
            reason: 'walk-in-on',
          },
          {
            match: '#PhrasalVerb [#PhrasalVerb]',
            group: 0,
            tag: 'Particle',
            reason: 'phrasal-particle',
          },
          {
            match: '(lived|went|crept|go) [on] for',
            group: 0,
            tag: 'PhrasalVerb',
            reason: 'went-on',
          },
          {
            match: 'help [(stop|end|make|start)]',
            group: 0,
            tag: 'Infinitive',
            reason: 'help-stop',
          },
          {
            match: '[(stop|start|finish|help)] #Gerund',
            group: 0,
            tag: 'Infinitive',
            reason: 'start-listening',
          },
          {
            match:
              '#Verb (him|her|it|us|himself|herself|itself|everything|something) [(up|down)]',
            group: 0,
            tag: 'Adverb',
            reason: 'phrasal-pronoun-advb',
          },
        ],
        [
          {
            match: '^do not? [#Infinitive #Particle?]',
            notIf: jl,
            group: 0,
            tag: 'Imperative',
            reason: 'do-eat',
          },
          {
            match: '^please do? not? [#Infinitive #Particle?]',
            group: 0,
            tag: 'Imperative',
            reason: 'please-go',
          },
          {
            match: '^just do? not? [#Infinitive #Particle?]',
            group: 0,
            tag: 'Imperative',
            reason: 'just-go',
          },
          {
            match: '^[#Infinitive] it #Comparative',
            notIf: jl,
            group: 0,
            tag: 'Imperative',
            reason: 'do-it-better',
          },
          {
            match: '^[#Infinitive] it (please|now|again|plz)',
            notIf: jl,
            group: 0,
            tag: 'Imperative',
            reason: 'do-it-please',
          },
          {
            match: '^[#Infinitive] (#Adjective|#Adverb)$',
            group: 0,
            tag: 'Imperative',
            ifNo: ['so', 'such', 'rather', 'enough'],
            reason: 'go-quickly',
          },
          {
            match: '^[#Infinitive] (up|down|over) #Determiner',
            group: 0,
            tag: 'Imperative',
            reason: 'turn-down',
          },
          {
            match: '^[#Infinitive] (your|my|the|some|a|an)',
            group: 0,
            ifNo: 'like',
            tag: 'Imperative',
            reason: 'eat-my-shorts',
          },
          {
            match: '^[#Infinitive] (him|her|it|us|me)',
            group: 0,
            tag: 'Imperative',
            reason: 'tell-him',
          },
          {
            match: '^[#Infinitive] #Adjective #Noun$',
            group: 0,
            tag: 'Imperative',
            reason: 'avoid-loud-noises',
          },
          {
            match: '^(go|stop|wait|hurry) please?$',
            tag: 'Imperative',
            reason: 'go',
          },
          {
            match: '^(somebody|everybody) [#Infinitive]',
            group: 0,
            tag: 'Imperative',
            reason: 'somebody-call',
          },
          {
            match: '^let (us|me) [#Infinitive]',
            group: 0,
            tag: 'Imperative',
            reason: 'lets-leave',
          },
          {
            match: '^[(shut|close|open|start|stop|end|keep)] #Determiner #Noun',
            group: 0,
            tag: 'Imperative',
            reason: 'shut-the-door',
          },
          {
            match: '^[go] to .',
            group: 0,
            tag: 'Imperative',
            reason: 'go-to-toronto',
          },
          {
            match: '^#Modal you [#Infinitive]',
            group: 0,
            tag: 'Imperative',
            reason: 'would-you-',
          },
          {
            match: '^never [#Infinitive]',
            group: 0,
            tag: 'Imperative',
            reason: 'never-stop',
          },
          {
            match: '^stay (out|away|back)',
            tag: 'Imperative',
            reason: 'stay-away',
          },
          {
            match: '^[stay] #Adjective',
            tag: 'Imperative',
            reason: 'stay-cool',
          },
          {
            match: '^[keep it] #Adjective',
            group: 0,
            tag: 'Imperative',
            reason: 'keep-it-cool',
          },
          {
            match: '^do not [#Infinitive]',
            group: 0,
            tag: 'Imperative',
            reason: 'do-not-be',
          },
          {
            match: '[#Infinitive] (yourself|yourselves)',
            group: 0,
            tag: 'Imperative',
            reason: 'allow-yourself',
          },
        ],
        [
          {
            match: '(that|which) were [%Adj|Gerund%]',
            group: 0,
            tag: 'Gerund',
            reason: 'that-were-growing',
          },
        ],
        [
          { match: 'u r', tag: '#Pronoun #Copula', reason: 'u r' },
          {
            match: '#Noun [(who|whom)]',
            group: 0,
            tag: 'Determiner',
            reason: 'captain-who',
          },
          {
            match: '[had] #Noun+ #PastTense',
            group: 0,
            tag: 'Condition',
            reason: 'had-he',
          },
          {
            match: '[were] #Noun+ to #Infinitive',
            group: 0,
            tag: 'Condition',
            reason: 'were-he',
          },
          {
            match: 'holy (shit|fuck|hell)',
            tag: 'Expression',
            reason: 'swears-expression',
          },
          { match: '^(well|so|okay|now)', tag: 'Expression', reason: 'well-' },
          {
            match: 'some sort of',
            tag: 'Adjective Noun Conjunction',
            reason: 'some-sort-of',
          },
          {
            match: 'of some sort',
            tag: 'Conjunction Adjective Noun',
            reason: 'of-some-sort',
          },
          {
            match: '[such] (a|an|is)? #Noun',
            group: 0,
            tag: 'Determiner',
            reason: 'such-skill',
          },
          {
            match: '(say|says|said) [sorry]',
            group: 0,
            tag: 'Expression',
            reason: 'say-sorry',
          },
          {
            match:
              '#Verb [(out|for|through|about|around|in|down|up|on|off)] #Preposition',
            group: 0,
            ifNo: ['#Copula'],
            tag: 'Particle',
            reason: 'rush-out',
          },
          {
            match: '#Preposition [about]',
            group: 0,
            tag: 'Adjective',
            reason: 'at-about',
          },
          {
            match: '^[(dude|man|girl)] #Pronoun',
            group: 0,
            tag: 'Expression',
            reason: 'dude-i',
          },
        ],
        [
          {
            match: '#Noun (&|n) #Noun',
            tag: 'Organization',
            reason: 'Noun-&-Noun',
          },
          {
            match: '#Organization of the? #ProperNoun',
            tag: 'Organization',
            reason: 'org-of-place',
            safe: !0,
          },
          {
            match: '#Organization #Country',
            tag: 'Organization',
            reason: 'org-country',
          },
          {
            match: '#ProperNoun #Organization',
            tag: 'Organization',
            reason: 'titlecase-org',
          },
          {
            match: '#ProperNoun (ltd|co|inc|dept|assn|bros)',
            tag: 'Organization',
            reason: 'org-abbrv',
          },
          {
            match: 'the [#Acronym]',
            group: 0,
            tag: 'Organization',
            reason: 'the-acronym',
            safe: !0,
          },
          {
            match:
              '(world|global|international|national|#Demonym) #Organization',
            tag: 'Organization',
            reason: 'global-org',
          },
          {
            match: '#Noun+ (public|private) school',
            tag: 'School',
            reason: 'noun-public-school',
          },
        ],
        [
          {
            match:
              '(west|north|south|east|western|northern|southern|eastern)+ #Place',
            tag: 'Region',
            reason: 'west-norfolk',
          },
          {
            match:
              '#City [(al|ak|az|ar|ca|ct|dc|fl|ga|id|il|nv|nh|nj|ny|oh|pa|sc|tn|tx|ut|vt|pr)]',
            group: 0,
            tag: 'Region',
            reason: 'us-state',
          },
          {
            match: 'portland [or]',
            group: 0,
            tag: 'Region',
            reason: 'portland-or',
          },
          {
            match:
              '#ProperNoun+ (district|region|province|county|prefecture|municipality|territory|burough|reservation)',
            tag: 'Region',
            reason: 'foo-district',
          },
          {
            match:
              '(district|region|province|municipality|territory|burough|state) of #ProperNoun',
            tag: 'Region',
            reason: 'district-of-Foo',
          },
          {
            match: 'in [#ProperNoun] #Place',
            group: 0,
            tag: 'Place',
            reason: 'propernoun-place',
          },
          {
            match:
              '#Value #Noun (st|street|rd|road|crescent|cr|way|tr|terrace|avenue|ave)',
            tag: 'Address',
            reason: 'address-st',
          },
        ],
        [
          {
            match: '[so] #Noun',
            group: 0,
            tag: 'Conjunction',
            reason: 'so-conj',
          },
          {
            match:
              '[(who|what|where|why|how|when)] #Noun #Copula #Adverb? (#Verb|#Adjective)',
            group: 0,
            tag: 'Conjunction',
            reason: 'how-he-is-x',
          },
          {
            match: '#Copula [(who|what|where|why|how|when)] #Noun',
            group: 0,
            tag: 'Conjunction',
            reason: 'when-he',
          },
          {
            match: '#Verb [that] #Pronoun',
            group: 0,
            tag: 'Conjunction',
            reason: 'said-that-he',
          },
          {
            match: '#Noun [that] #Copula',
            group: 0,
            tag: 'Conjunction',
            reason: 'that-are',
          },
          {
            match: '#Noun [that] #Verb #Adjective',
            group: 0,
            tag: 'Conjunction',
            reason: 'that-seem',
          },
          {
            match: '#Noun #Copula not? [that] #Adjective',
            group: 0,
            tag: 'Adverb',
            reason: 'that-adj',
          },
          {
            match: '#Verb #Adverb? #Noun [(that|which)]',
            group: 0,
            tag: 'Preposition',
            reason: 'that-prep',
          },
          {
            match: '@hasComma [which] (#Pronoun|#Verb)',
            group: 0,
            tag: 'Preposition',
            reason: 'which-copula',
          },
          {
            match: '#Noun [like] #Noun',
            group: 0,
            tag: 'Preposition',
            reason: 'noun-like',
          },
          {
            match: '^[like] #Determiner',
            group: 0,
            tag: 'Preposition',
            reason: 'like-the',
          },
          {
            match: '#Adverb [like]',
            group: 0,
            tag: 'Verb',
            reason: 'really-like',
          },
          {
            match: '(not|nothing|never) [like]',
            group: 0,
            tag: 'Preposition',
            reason: 'nothing-like',
          },
          {
            match: '#Verb #Pronoun [like]',
            group: 0,
            tag: 'Preposition',
            reason: 'treat-them-like',
          },
          {
            match: '[#QuestionWord] (#Pronoun|#Determiner)',
            group: 0,
            tag: 'Preposition',
            reason: 'how-he',
          },
          {
            match: '[#QuestionWord] #Participle',
            group: 0,
            tag: 'Preposition',
            reason: 'when-stolen',
          },
          {
            match: '[how] (#Determiner|#Copula|#Modal|#PastTense)',
            group: 0,
            tag: 'QuestionWord',
            reason: 'how-is',
          },
          {
            match: '#Plural [(who|which|when)] .',
            group: 0,
            tag: 'Preposition',
            reason: 'people-who',
          },
        ]
      ),
      El = null
    var Nl = {
        api: function (e) {
          ;(e.prototype.confidence = function () {
            let e = 0,
              t = 0
            return (
              this.docs.forEach((n) => {
                n.forEach((n) => {
                  ;(t += 1), (e += n.confidence || 1)
                })
              }),
              0 === t ? 1 : ((e) => Math.round(100 * e) / 100)(e / t)
            )
          }),
            (e.prototype.tagger = function () {
              return this.compute(['preTagger', 'contractionTwo', 'postTagger'])
            })
        },
        compute: {
          postTagger: function (e) {
            const { world: t } = e,
              { model: n, methods: r } = t
            El = El || r.one.buildNet(n.two.matches, t)
            let a = r.two.quickSplit(e.document).map((e) => {
                let t = e[0]
                return [t.index[0], t.index[1], t.index[1] + e.length]
              }),
              o = e.update(a)
            return o.cache(), o.sweep(El), e.uncache(), e
          },
        },
        model: { two: { matches: xl } },
        hooks: ['postTagger'],
      },
      Il = function (e, t) {
        let n = t
        e.has('#Infinitive') ||
          (n = (function (e, t) {
            let n = (0, e.methods.two.transform.verbConjugate)(t, e.model)
            return e.has('#PastTense')
              ? n.PastTense
              : e.has('#PresentTense')
              ? n.PresentTense
              : e.has('#Gerund')
              ? n.Gerund
              : t
          })(e, t)),
          e.replaceWith(n)
      },
      Tl = function (e, t, n) {
        let r = this.match(`{${e}}`)
        return (
          n && (r = r.if(n)),
          r.has('#Verb')
            ? Il(r, t)
            : r.has('#Noun')
            ? (function (e, t) {
                let n = t
                e.has('#Plural') &&
                  (n = (0, e.methods.two.transform.nounToPlural)(t, e.model)),
                  e.replaceWith(n)
              })(r, t)
            : r.has('#Adverb')
            ? (function (e, t) {
                let n = (0, e.methods.two.transform.adjToAdverb)(t)
                n && e.replaceWith(n)
              })(r, t)
            : this
        )
      },
      Gl = {
        api: function (e) {
          e.prototype.swap = Tl
        },
      }
    m.plugin(al), m.plugin(Pl), m.plugin(Nl), m.plugin(Gl)
    var Dl = function (e) {
        let t = this.if('@hasComma')
            .ifNo('@hasComma @hasComma')
            .ifNo('@hasComma (and|or) .')
            .ifNo('(#City && @hasComma) #Country')
            .ifNo('(#WeekDay && @hasComma) #Date')
            .ifNo('(#Date+ && @hasComma) #Value')
            .ifNo('@hasComma (too|also)$')
            .match('@hasComma'),
          n = this.splitAfter(t),
          r = n
            .if('#Copula #Adjective #Conjunction (#Pronoun|#Determiner) #Verb')
            .match('#Conjunction')
        n = n.splitBefore(r)
        let a = n.if('if .{2,9} then .').match('then')
        ;(n = n.splitBefore(a)),
          (n = n.splitBefore('as well as .')),
          (n = n.splitBefore('such as .')),
          (n = n.splitBefore('in addition to .')),
          (n = n.splitAfter('@hasSemicolon')),
          (n = n.splitAfter('@hasDash'))
        let o = n.filter(
          (e) => e.wordCount() > 5 && e.match('#Verb+').length >= 2
        )
        if (o.found) {
          let e = o.splitAfter('#Noun .* #Verb .* #Noun+')
          n = n.splitOn(e.eq(0))
        }
        return 'number' == typeof e && (n = n.get(e)), n
      },
      Cl = function () {
        let e = [],
          t = null,
          n = null
        this.docs.forEach((r) => {
          r.forEach((r) => {
            r.chunk !== n &&
              (t && ((t[2] = r.index[1]), e.push(t)),
              (n = r.chunk),
              (t = [r.index[0], r.index[1]]))
          })
        }),
          t && e.push(t)
        let r = this.update(e)
        return (r = r.map((e) => (e.has('<Noun>') ? e.nouns() : e))), r
      }
    const Ol = { this: 'Noun', then: 'Pivot' }
    var Vl = function (e) {
        for (let t = 0; t < e.length; t += 1)
          for (let n = 0; n < e[t].length; n += 1) {
            let r = e[t][n]
            !0 !== Ol.hasOwnProperty(r.normal)
              ? r.tags.has('Verb')
                ? (r.chunk = 'Verb')
                : r.tags.has('Noun') ||
                  r.tags.has('Determiner') ||
                  r.tags.has('Value')
                ? (r.chunk = 'Noun')
                : r.tags.has('QuestionWord') && (r.chunk = 'Pivot')
              : (r.chunk = Ol[r.normal])
          }
      },
      Bl = function (e) {
        for (let t = 0; t < e.length; t += 1)
          for (let n = 0; n < e[t].length; n += 1) {
            let r = e[t][n]
            if (r.chunk) continue
            let a = e[t][n + 1],
              o = e[t][n - 1]
            if (r.tags.has('Adjective')) {
              if (o && o.tags.has('Copula')) {
                r.chunk = 'Adjective'
                continue
              }
              if (o && o.tags.has('Determiner')) {
                r.chunk = 'Noun'
                continue
              }
              if (a && a.tags.has('Noun')) {
                r.chunk = 'Noun'
                continue
              }
            } else if (r.tags.has('Adverb') || r.tags.has('Negative')) {
              if (o && o.tags.has('Adjective')) {
                r.chunk = 'Adjective'
                continue
              }
              if (o && o.tags.has('Verb')) {
                r.chunk = 'Verb'
                continue
              }
              if (a && a.tags.has('Adjective')) {
                r.chunk = 'Adjective'
                continue
              }
              if (a && a.tags.has('Verb')) {
                r.chunk = 'Verb'
                continue
              }
            }
          }
      }
    const zl = [
      { match: '[that] #Determiner #Noun', group: 0, chunk: 'Pivot' },
      { match: '#PastTense [that]', group: 0, chunk: 'Pivot' },
      { match: '#Copula #Adverb+? [#Adjective]', group: 0, chunk: 'Adjective' },
      { match: '#Adjective and #Adjective', chunk: 'Adjective' },
      { match: '#Adverb+ and #Adverb #Verb', chunk: 'Verb' },
      { match: '#Gerund #Adjective', chunk: 'Verb' },
      { match: '#Gerund to #Verb', chunk: 'Verb' },
      { match: '#Adverb #Negative', chunk: 'Verb' },
      { match: '(want|wants|wanted) to #Infinitive', chunk: 'Verb' },
      { match: '#Verb #Reflexive', chunk: 'Verb' },
      {
        match: '#PresentTense [#Pronoun] #Determiner',
        group: 0,
        chunk: 'Verb',
      },
      { match: '#Verb [to] #Adverb? #Infinitive', group: 0, chunk: 'Verb' },
      { match: '[#Preposition] #Gerund', group: 0, chunk: 'Verb' },
      { match: '#Noun of #Determiner? #Noun', chunk: 'Noun' },
      { match: '#Noun in #Determiner? #Noun', chunk: 'Noun' },
      { match: '#Singular and #Determiner? #Singular', chunk: 'Noun' },
    ]
    let $l = null
    var Fl = function (e, t, n) {
      const { methods: r } = n
      ;($l = $l || r.one.buildNet(zl, n)), e.sweep($l)
    }
    const Sl = function (e, t) {
      if (
        ('undefined' != typeof process && process.env
          ? process.env
          : self.env || {}
        ).DEBUG_CHUNKS
      ) {
        let n = (e.normal + "'").padEnd(8)
        console.log(`  | '${n}  →  [34m${t.padEnd(12)}[0m [2m -fallback- [0m`)
      }
      e.chunk = t
    }
    var Hl = function (e) {
        for (let t = 0; t < e.length; t += 1)
          for (let n = 0; n < e[t].length; n += 1) {
            let r = e[t][n]
            void 0 === r.chunk &&
              (r.tags.has('Conjunction') || r.tags.has('Preposition')
                ? Sl(r, 'Pivot')
                : r.tags.has('Adverb')
                ? Sl(r, 'Verb')
                : (r.chunk = 'Noun'))
          }
      },
      Ml = function (e) {
        let t = [],
          n = null
        e.forEach((e) => {
          for (let r = 0; r < e.length; r += 1) {
            let a = e[r]
            n && a.chunk === n
              ? t[t.length - 1].terms.push(a)
              : (t.push({ chunk: a.chunk, terms: [a] }), (n = a.chunk))
          }
        }),
          t.forEach((e) => {
            'Verb' === e.chunk &&
              (e.terms.find((e) => e.tags.has('Verb')) ||
                e.terms.forEach((e) => (e.chunk = null)))
          })
      },
      Ll = {
        compute: {
          chunks: function (e) {
            const { document: t, world: n } = e
            Vl(t), Bl(t), Fl(e, t, n), Hl(t), Ml(t)
          },
        },
        api: function (e) {
          ;(e.prototype.chunks = Cl), (e.prototype.clauses = Dl)
        },
        hooks: ['chunks'],
      }
    const Wl = /'s$/
    var Jl = function (e) {
      class Possessives extends e {
        constructor(e, t, n) {
          super(e, t, n), (this.viewType = 'Possessives')
        }
        strip() {
          return (
            this.docs.forEach((e) => {
              e.forEach((e) => {
                ;(e.text = e.text.replace(Wl, '')),
                  (e.normal = e.normal.replace(Wl, ''))
              })
            }),
            this
          )
        }
      }
      e.prototype.possessives = function (e) {
        let t = (function (e) {
          let t = e.match('#Possessive+')
          return (
            t.has('#Person') && (t = t.growLeft('#Person+')),
            t.has('#Place') && (t = t.growLeft('#Place+')),
            t.has('#Organization') && (t = t.growLeft('#Organization+')),
            t
          )
        })(this)
        return (
          (t = ((e, t) => ('number' == typeof t ? e.eq(t) : e))(t, e)),
          new Possessives(t.document, t.pointer)
        )
      }
    }
    const ql = /\(/,
      Kl = /\)/,
      Rl = function (e, t) {
        for (; t < e.length; t += 1)
          if (e[t].post && Kl.test(e[t].post)) return t
        return null
      }
    var Ul = function (e) {
      class Parentheses extends e {
        constructor(e, t, n) {
          super(e, t, n), (this.viewType = 'Possessives')
        }
        strip() {
          return (function (e) {
            return (
              e.docs.forEach((e) => {
                e[0].pre = e[0].pre.replace(ql, '')
                let t = e[e.length - 1]
                t.post = t.post.replace(Kl, '')
              }),
              e
            )
          })(this)
        }
      }
      e.prototype.parentheses = function (e) {
        let t = (function (e) {
          let t = []
          return (
            e.docs.forEach((e) => {
              for (let n = 0; n < e.length; n += 1) {
                let r = e[n]
                if (r.pre && ql.test(r.pre)) {
                  let r = Rl(e, n)
                  if (null !== r) {
                    let [a, o] = e[n].index
                    t.push([a, o, r + 1, e[n].id]), (n = r)
                  }
                }
              }
            }),
            e.update(t)
          )
        })(this)
        return (
          (t = ((e, t) => ('number' == typeof t ? e.eq(t) : e))(t, e)),
          new Parentheses(t.document, t.pointer)
        )
      }
    }
    const Ql = {
        '"': '"',
        '＂': '＂',
        "'": "'",
        '“': '”',
        '‘': '’',
        '‟': '”',
        '‛': '’',
        '„': '”',
        '⹂': '”',
        '‚': '’',
        '«': '»',
        '‹': '›',
        '‵': '′',
        '‶': '″',
        '‷': '‴',
        '〝': '〞',
        '`': '´',
        '〟': '〞',
      },
      _l = RegExp('(' + Object.keys(Ql).join('|') + ')'),
      Zl = RegExp('(' + Object.values(Ql).join('|') + ')'),
      Yl = function (e, t) {
        const n = e[t].pre.match(_l)[0] || ''
        if (!n || !Ql[n]) return null
        const r = Ql[n]
        for (; t < e.length; t += 1)
          if (e[t].post && e[t].post.match(r)) return t
        return null
      }
    var Xl = function (e) {
      class Quotations extends e {
        constructor(e, t, n) {
          super(e, t, n), (this.viewType = 'Possessives')
        }
        strip() {
          return (function (e) {
            e.docs.forEach((e) => {
              e[0].pre = e[0].pre.replace(_l, '')
              let t = e[e.length - 1]
              t.post = t.post.replace(Zl, '')
            })
          })(this)
        }
      }
      e.prototype.quotations = function (e) {
        let t = (function (e) {
          let t = []
          return (
            e.docs.forEach((e) => {
              for (let n = 0; n < e.length; n += 1) {
                let r = e[n]
                if (r.pre && _l.test(r.pre)) {
                  let r = Yl(e, n)
                  if (null !== r) {
                    let [a, o] = e[n].index
                    t.push([a, o, r + 1, e[n].id]), (n = r)
                  }
                }
              }
            }),
            e.update(t)
          )
        })(this)
        return (
          (t = ((e, t) => ('number' == typeof t ? e.eq(t) : e))(t, e)),
          new Quotations(t.document, t.pointer)
        )
      }
    }
    const eu = /\./g
    var tu = function (e) {
        class Acronyms extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = 'Acronyms')
          }
          strip() {
            return (
              this.docs.forEach((e) => {
                e.forEach((e) => {
                  ;(e.text = e.text.replace(eu, '')),
                    (e.normal = e.normal.replace(eu, ''))
                })
              }),
              this
            )
          }
          addPeriods() {
            return (
              this.docs.forEach((e) => {
                e.forEach((e) => {
                  ;(e.text = e.text.replace(eu, '')),
                    (e.normal = e.normal.replace(eu, '')),
                    (e.text = e.text.split('').join('.') + '.'),
                    (e.normal = e.normal.split('').join('.') + '.')
                })
              }),
              this
            )
          }
        }
        e.prototype.acronyms = function (e) {
          let t = this.match('#Acronym')
          return (
            (t = ((e, t) => ('number' == typeof t ? e.eq(t) : e))(t, e)),
            new Acronyms(t.document, t.pointer)
          )
        }
      },
      nu = function (e) {
        class Adverbs extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = 'Adverbs')
          }
          json(e = {}) {
            const t = this.methods.two.transform.advToAdjective
            return (
              (e.normal = !0),
              this.map((n) => {
                let r = n.toView().json(e)[0] || {}
                return (r.adverb = { adjective: t(r.normal) }), r
              }, [])
            )
          }
        }
        e.prototype.adverbs = function (e) {
          let t = this.match('#Adverb')
          return (
            (t = ((e, t) => ('number' == typeof t ? e.eq(t) : e))(t, e)),
            new Adverbs(t.document, t.pointer)
          )
        }
      }
    const ru = (e, t) => ('number' == typeof t ? e.eq(t) : e),
      au = function (e) {
        const { adjFromComparative: t, adjFromSuperlative: n } =
          e.methods.two.transform
        let r = e.text('normal')
        return e.has('#Comparative')
          ? t(r, e.model)
          : e.has('#Superlative')
          ? n(r, e.model)
          : r
      }
    var ou = function (e) {
      class Adjectives extends e {
        constructor(e, t, n) {
          super(e, t, n), (this.viewType = 'Adjectives')
        }
        json(e = {}) {
          const {
            adjToAdverb: t,
            adjToNoun: n,
            adjToSuperlative: r,
            adjToComparative: a,
          } = this.methods.two.transform
          return (
            (e.normal = !0),
            this.map((o) => {
              let i = o.toView().json(e)[0] || {},
                s = au(o)
              return (
                (i.adjective = {
                  adverb: t(s),
                  noun: n(s),
                  superlative: r(s, this.model),
                  comparative: a(s, this.model),
                }),
                i
              )
            }, [])
          )
        }
        adverbs() {
          return this.before('#Adverb+$').concat(this.after('^#Adverb+'))
        }
        toComparative(e) {
          const { adjToComparative: t } = this.methods.two.transform
          return ru(this, e).map((e) => {
            let n = au(e),
              r = t(n, this.model)
            return e.replaceWith(r)
          })
        }
        toSuperlative(e) {
          const { adjToSuperlative: t } = this.methods.two.transform
          return ru(this, e).map((e) => {
            let n = au(e),
              r = t(n, this.model)
            return e.replaceWith(r)
          })
        }
        toAdverb(e) {
          const { adjToAdverb: t } = this.methods.two.transform
          return ru(this, e).map((e) => {
            let n = au(e),
              r = t(n, this.model)
            return e.replaceWith(r)
          })
        }
        toNoun(e) {
          const { adjToNoun: t } = this.methods.two.transform
          return ru(this, e).map((e) => {
            let n = au(e),
              r = t(n, this.model)
            return e.replaceWith(r)
          })
        }
      }
      ;(e.prototype.adjectives = function (e) {
        let t = this.match('#Adjective')
        return (t = ru(t, e)), new Adjectives(t.document, t.pointer)
      }),
        (e.prototype.superlatives = function (e) {
          let t = this.match('#Superlative')
          return (t = ru(t, e)), new Adjectives(t.document, t.pointer)
        }),
        (e.prototype.comparatives = function (e) {
          let t = this.match('#Comparative')
          return (t = ru(t, e)), new Adjectives(t.document, t.pointer)
        })
    }
    const iu = function (e) {
        let t = this.splitAfter('@hasComma')
        return (
          (t = t.match('#PhoneNumber+')),
          (t = ((e, t) => ('number' == typeof t ? e.eq(t) : e))(t, e)),
          t
        )
      },
      su = [
        ['hyphenated', '@hasHyphen .'],
        ['hashTags', '#HashTag'],
        ['emails', '#Email'],
        ['emoji', '#Emoji'],
        ['emoticons', '#Emoticon'],
        ['atMentions', '#AtMention'],
        ['urls', '#Url'],
        ['pronouns', '#Pronoun'],
        ['conjunctions', '#Conjunction'],
        ['prepositions', '#Preposition'],
        ['abbreviations', '#Abbreviation'],
        ['honorifics', '#Honorific'],
      ]
    let lu = [
      ['emojis', 'emoji'],
      ['atmentions', 'atMentions'],
    ]
    var uu = function (e) {
        su.forEach((t) => {
          e.prototype[t[0]] = function (e) {
            let n = this.match(t[1])
            return 'number' == typeof e ? n.get(e) : n
          }
        }),
          (e.prototype.phoneNumbers = iu),
          lu.forEach((t) => {
            e.prototype[t[0]] = e.prototype[t[1]]
          })
      },
      cu = {
        api: function (e) {
          uu(e), Jl(e), Ul(e), Xl(e), ou(e), nu(e), tu(e)
        },
      }
    const hu = function (e, t) {
      e.docs.forEach((e) => {
        e.forEach(t)
      })
    }
    var du = {
      case: (e) => {
        hu(e, (e) => {
          e.text = e.text.toLowerCase()
        })
      },
      unicode: (e) => {
        const t = e.world,
          n = t.methods.one.killUnicode
        hu(e, (e) => (e.text = n(e.text, t)))
      },
      whitespace: (e) => {
        hu(e, (e) => {
          ;(e.post = e.post.replace(/\s+/g, ' ')),
            (e.post = e.post.replace(/\s([.,?!:;])/g, '$1')),
            (e.pre = e.pre.replace(/\s+/g, ''))
        })
      },
      punctuation: (e) => {
        hu(e, (e) => {
          ;(e.post = e.post.replace(/[–—-]/g, ' ')),
            (e.post = e.post.replace(/[,:;]/g, '')),
            (e.post = e.post.replace(/\.{2,}/g, '')),
            (e.post = e.post.replace(/\?{2,}/g, '?')),
            (e.post = e.post.replace(/!{2,}/g, '!')),
            (e.post = e.post.replace(/\?!+/g, '?'))
        })
        let t = e.docs,
          n = t[t.length - 1]
        if (n && n.length > 0) {
          let e = n[n.length - 1]
          e.post = e.post.replace(/ /g, '')
        }
      },
      contractions: (e) => {
        e.contractions().expand()
      },
      acronyms: (e) => {
        e.acronyms().strip()
      },
      parentheses: (e) => {
        e.parentheses().strip()
      },
      possessives: (e) => {
        e.possessives().strip()
      },
      quotations: (e) => {
        e.quotations().strip()
      },
      emoji: (e) => {
        e.emojis().remove()
      },
      honorifics: (e) => {
        e.match('#Honorific+ #Person').honorifics().remove()
      },
      adverbs: (e) => {
        e.adverbs().remove()
      },
      nouns: (e) => {
        e.nouns().toSingular()
      },
      verbs: (e) => {
        e.verbs().toInfinitive()
      },
      numbers: (e) => {
        e.numbers().toNumber()
      },
    }
    const pu = (e) => e.split('|').reduce((e, t) => ((e[t] = !0), e), {}),
      mu = 'unicode|punctuation|whitespace|acronyms',
      gu = '|case|contractions|parentheses|quotations|emoji|honorifics',
      fu = {
        light: pu(mu),
        medium: pu(mu + gu),
        heavy: pu(mu + gu + '|possessives|adverbs|nouns|verbs'),
      }
    var bu = {
        api: function (e) {
          e.prototype.normalize = function (e = 'light') {
            return (
              'string' == typeof e && (e = fu[e]),
              Object.keys(e).forEach((t) => {
                du.hasOwnProperty(t) && du[t](this, e[t])
              }),
              this
            )
          }
        },
      },
      vu = function (e) {
        let t = e.match('<Noun>'),
          n = t.match('@hasComma')
        return (
          (n = n.not('#Place')),
          n.found && (t = t.splitAfter(n)),
          (t = t.splitOn('#Expression')),
          (t = t.splitOn('(he|she|we|you|they)')),
          (t = t.splitOn('(#Noun|#Adjective) [#Pronoun]', 0)),
          (t = t.splitOn('[#Pronoun] (#Determiner|#Value)', 0)),
          (t = t.splitBefore('#Noun [(the|a|an)] #Adjective? #Noun', 0)),
          (t = t.splitOn('[(here|there)] #Noun', 0)),
          (t = t.splitOn('[#Noun] (here|there)', 0)),
          (t = t.if('#Noun')),
          t
        )
      }
    const yu = [
      'after',
      'although',
      'as if',
      'as long as',
      'as',
      'because',
      'before',
      'even if',
      'even though',
      'ever since',
      'if',
      'in order that',
      'provided that',
      'since',
      'so that',
      'than',
      'that',
      'though',
      'unless',
      'until',
      'what',
      'whatever',
      'when',
      'whenever',
      'where',
      'whereas',
      'wherever',
      'whether',
      'which',
      'whichever',
      'who',
      'whoever',
      'whom',
      'whomever',
      'whose',
    ]
    var wu = function (e) {
        if (e.before('#Preposition$').found) return !0
        if (!e.before().found) return !1
        for (let t = 0; t < yu.length; t += 1) if (e.has(yu[t])) return !0
        return !1
      },
      ku = function (e, t) {
        if (e.has('#Plural')) return !0
        if (e.has('#Noun and #Noun')) return !0
        if (e.has('(we|they)')) return !0
        if (
          !0 ===
          t.has(
            '(#Pronoun|#Place|#Value|#Person|#Uncountable|#Month|#WeekDay|#Holiday|#Possessive)'
          )
        )
          return !1
        if (e.has('#Singular')) return !1
        let n = t.text('normal')
        return n.length > 3 && n.endsWith('s') && !n.endsWith('ss')
      },
      Pu = function (e) {
        let t = (function (e) {
          let t = e.clone()
          return (
            (t = t.match('#Noun+')),
            (t = t.remove('(#Adjective|#Preposition|#Determiner|#Value)')),
            (t = t.not('#Possessive')),
            t.first()
          )
        })(e)
        return {
          determiner: e.match('#Determiner').eq(0),
          adjectives: e.match('#Adjective'),
          number: e.values(),
          isPlural: ku(e, t),
          isSubordinate: wu(e),
          root: t,
        }
      }
    const Au = (e) => e.text(),
      ju = (e) => e.json({ terms: !1, normal: !0 }).map((e) => e.normal),
      xu = function (e) {
        if (!e.found) return null
        let t = e.values(0)
        return t.found ? (t.parse()[0] || {}).num : null
      }
    var Eu = function (e) {
      let t = Pu(e)
      return {
        root: Au(t.root),
        number: xu(t.number),
        determiner: Au(t.determiner),
        adjectives: ju(t.adjectives),
        isPlural: t.isPlural,
        isSubordinate: t.isSubordinate,
      }
    }
    const Nu = { tags: !0 }
    var Iu = function (e, t) {
      if (!0 === t.isPlural) return e
      if (
        !(function (e) {
          let { root: t } = e
          return !t.has(
            '^(#Uncountable|#Possessive|#ProperNoun|#Place|#Pronoun)+$'
          )
        })(t)
      )
        return e
      const { methods: n, model: r } = e.world,
        { nounToPlural: a } = n.two.transform
      let o = a(t.root.text('normal'), r)
      return (
        e.match(t.root).replaceWith(o, Nu).tag('Plural', 'toPlural'),
        t.determiner.has('(a|an)') && e.replace(t.determiner, 'the', Nu),
        e
      )
    }
    const Tu = { tags: !0 }
    var Gu = function (e, t) {
      if (!1 === t.isPlural) return e
      const { methods: n, model: r } = e.world,
        { nounToSingular: a } = n.two.transform
      let o = a(t.root.text('normal'), r)
      return e.replace(t.root, o, Tu).tag('Singular', 'toPlural'), e
    }
    const Du = (e, t) => ('number' == typeof t ? e.eq(t) : e)
    var Cu = {
        api: function (e) {
          class Nouns extends e {
            constructor(e, t, n) {
              super(e, t, n), (this.viewType = 'Nouns')
            }
            parse(e) {
              return Du(this, e).map(Pu)
            }
            json(e = {}) {
              return this.map((t) => {
                let n = t.toView().json(e)[0] || {}
                return e && !0 !== e.noun && (n.noun = Eu(t)), n
              }, [])
            }
            isPlural(e) {
              let t = this.filter((e) => Pu(e).isPlural)
              return Du(t, e)
            }
            adjectives(e) {
              let t = this.update([])
              return (
                this.forEach((e) => {
                  let n = Pu(e).adjectives
                  n.found && (t = t.concat(n))
                }),
                Du(t, e)
              )
            }
            toPlural(e) {
              return Du(this, e).map((e) => Iu(e, Pu(e)))
            }
            toSingular(e) {
              return Du(this, e).map((e) => {
                let t = Pu(e)
                return Gu(e, t)
              })
            }
            update(e) {
              let t = new Nouns(this.document, e)
              return (t._cache = this._cache), t
            }
          }
          e.prototype.nouns = function (e) {
            let t = vu(this)
            return (t = Du(t, e)), new Nouns(this.document, t.pointer)
          }
        },
      },
      Ou = function (e, t) {
        let n = e.match('#Fraction+')
        return (
          (n = n.filter((e) => !e.lookBehind('#Value and$').found)),
          (n = n.notIf('#Value seconds')),
          'number' == typeof t && (n = n.eq(t)),
          n
        )
      },
      Vu = (e) => {
        const t = [
          { reg: /^(minus|negative)[\s-]/i, mult: -1 },
          { reg: /^(a\s)?half[\s-](of\s)?/i, mult: 0.5 },
        ]
        for (let n = 0; n < t.length; n++)
          if (!0 === t[n].reg.test(e))
            return { amount: t[n].mult, str: e.replace(t[n].reg, '') }
        return { amount: 1, str: e }
      },
      Bu = {
        ones: {
          zeroth: 0,
          first: 1,
          second: 2,
          third: 3,
          fourth: 4,
          fifth: 5,
          sixth: 6,
          seventh: 7,
          eighth: 8,
          ninth: 9,
          zero: 0,
          one: 1,
          two: 2,
          three: 3,
          four: 4,
          five: 5,
          six: 6,
          seven: 7,
          eight: 8,
          nine: 9,
        },
        teens: {
          tenth: 10,
          eleventh: 11,
          twelfth: 12,
          thirteenth: 13,
          fourteenth: 14,
          fifteenth: 15,
          sixteenth: 16,
          seventeenth: 17,
          eighteenth: 18,
          nineteenth: 19,
          ten: 10,
          eleven: 11,
          twelve: 12,
          thirteen: 13,
          fourteen: 14,
          fifteen: 15,
          sixteen: 16,
          seventeen: 17,
          eighteen: 18,
          nineteen: 19,
        },
        tens: {
          twentieth: 20,
          thirtieth: 30,
          fortieth: 40,
          fourtieth: 40,
          fiftieth: 50,
          sixtieth: 60,
          seventieth: 70,
          eightieth: 80,
          ninetieth: 90,
          twenty: 20,
          thirty: 30,
          forty: 40,
          fourty: 40,
          fifty: 50,
          sixty: 60,
          seventy: 70,
          eighty: 80,
          ninety: 90,
        },
        multiples: {
          hundredth: 100,
          thousandth: 1e3,
          millionth: 1e6,
          billionth: 1e9,
          trillionth: 1e12,
          quadrillionth: 1e15,
          quintillionth: 1e18,
          sextillionth: 1e21,
          septillionth: 1e24,
          hundred: 100,
          thousand: 1e3,
          million: 1e6,
          billion: 1e9,
          trillion: 1e12,
          quadrillion: 1e15,
          quintillion: 1e18,
          sextillion: 1e21,
          septillion: 1e24,
          grand: 1e3,
        },
      },
      zu = (e, t) => {
        if (Bu.ones.hasOwnProperty(e)) {
          if (t.ones || t.teens) return !1
        } else if (Bu.teens.hasOwnProperty(e)) {
          if (t.ones || t.teens || t.tens) return !1
        } else if (Bu.tens.hasOwnProperty(e) && (t.ones || t.teens || t.tens))
          return !1
        return !0
      },
      $u = function (e) {
        let t = '0.'
        for (let n = 0; n < e.length; n++) {
          let r = e[n]
          if (!0 === Bu.ones.hasOwnProperty(r)) t += Bu.ones[r]
          else if (!0 === Bu.teens.hasOwnProperty(r)) t += Bu.teens[r]
          else if (!0 === Bu.tens.hasOwnProperty(r)) t += Bu.tens[r]
          else {
            if (!0 !== /^[0-9]$/.test(r)) return 0
            t += r
          }
        }
        return parseFloat(t)
      },
      Fu = (e) =>
        (e = (e = (e = (e = (e = (e = (e = (e = e.replace(/1st$/, '1')).replace(
          /2nd$/,
          '2'
        )).replace(/3rd$/, '3')).replace(/([4567890])r?th$/, '$1')).replace(
          /^[$€¥£¢]/,
          ''
        )).replace(/[%$€¥£¢]$/, '')).replace(/,/g, '')).replace(
          /([0-9])([a-z\u00C0-\u00FF]{1,2})$/,
          '$1'
        ))
    const Su = /^([0-9,. ]+)\/([0-9,. ]+)$/,
      Hu = {
        'a few': 3,
        'a couple': 2,
        'a dozen': 12,
        'two dozen': 24,
        zero: 0,
      },
      Mu = (e) => Object.keys(e).reduce((t, n) => (t += e[n]), 0)
    var Lu = function (e) {
      if (!0 === Hu.hasOwnProperty(e)) return Hu[e]
      if ('a' === e || 'an' === e) return 1
      const t = Vu(e)
      let n = null,
        r = {},
        a = 0,
        o = !1
      const i = (e = t.str).split(/[ -]/)
      for (let e = 0; e < i.length; e++) {
        let s = i[e]
        if (((s = Fu(s)), !s || 'and' === s)) continue
        if ('-' === s || 'negative' === s) {
          o = !0
          continue
        }
        if (
          ('-' === s.charAt(0) && ((o = !0), (s = s.substring(1))),
          'point' === s)
        )
          return (
            (a += Mu(r)),
            (a += $u(i.slice(e + 1, i.length))),
            (a *= t.amount),
            a
          )
        const l = s.match(Su)
        if (l) {
          const e = parseFloat(l[1].replace(/[, ]/g, '')),
            t = parseFloat(l[2].replace(/[, ]/g, ''))
          t && (a += e / t || 0)
        } else {
          if (
            (Bu.tens.hasOwnProperty(s) &&
              r.ones &&
              1 === Object.keys(r).length &&
              ((a = 100 * r.ones), (r = {})),
            !1 === zu(s, r))
          )
            return null
          if (/^[0-9.]+$/.test(s)) r.ones = parseFloat(s)
          else if (!0 === Bu.ones.hasOwnProperty(s)) r.ones = Bu.ones[s]
          else if (!0 === Bu.teens.hasOwnProperty(s)) r.teens = Bu.teens[s]
          else if (!0 === Bu.tens.hasOwnProperty(s)) r.tens = Bu.tens[s]
          else if (!0 === Bu.multiples.hasOwnProperty(s)) {
            let t = Bu.multiples[s]
            if (t === n) return null
            if (100 === t && void 0 !== i[e + 1]) {
              const n = i[e + 1]
              Bu.multiples[n] && ((t *= Bu.multiples[n]), (e += 1))
            }
            null === n || t < n
              ? ((a += (Mu(r) || 1) * t), (n = t), (r = {}))
              : ((a += Mu(r)), (n = t), (a = (a || 1) * t), (r = {}))
          }
        }
      }
      return (
        (a += Mu(r)),
        (a *= t.amount),
        (a *= o ? -1 : 1),
        0 === a && 0 === Object.keys(r).length ? null : a
      )
    }
    const Wu = /s$/,
      Ju = function (e) {
        let t = e.text('reduced')
        return Lu(t)
      }
    let qu = { half: 2, halve: 2, quarter: 4 }
    var Ku = function (e) {
        let t =
          (function (e) {
            let t = e.text('reduced')
            return qu.hasOwnProperty(t)
              ? { numerator: 1, denominator: qu[t] }
              : null
          })((e = e.clone())) ||
          (function (e) {
            let t = e
              .text('reduced')
              .match(/^([-+]?[0-9]+)\/([-+]?[0-9]+)(st|nd|rd|th)?s?$/)
            return t && t[1] && t[0]
              ? { numerator: Number(t[1]), denominator: Number(t[2]) }
              : null
          })(e) ||
          (function (e) {
            let t = e.match('[<num>#Value+] out of every? [<den>#Value+]')
            if (!0 !== t.found) return null
            let { num: n, den: r } = t.groups()
            return n && r
              ? ((n = Ju(n)),
                (r = Ju(r)),
                n && r && 'number' == typeof n && 'number' == typeof r
                  ? { numerator: n, denominator: r }
                  : null)
              : null
          })(e) ||
          (function (e) {
            let t = e.match('[<num>(#Cardinal|a)+] [<den>#Fraction+]')
            if (!0 !== t.found) return null
            let { num: n, den: r } = t.groups()
            n = n.has('a') ? 1 : Ju(n)
            let a = r.text('reduced')
            return (
              Wu.test(a) && ((a = a.replace(Wu, '')), (r = r.replaceWith(a))),
              (r = qu.hasOwnProperty(a) ? qu[a] : Ju(r)),
              'number' == typeof n && 'number' == typeof r
                ? { numerator: n, denominator: r }
                : null
            )
          })(e) ||
          (function (e) {
            let t = e.match('^#Ordinal$')
            return !0 !== t.found
              ? null
              : e.lookAhead('^of .')
              ? { numerator: 1, denominator: Ju(t) }
              : null
          })(e) ||
          null
        return (
          null !== t &&
            t.numerator &&
            t.denominator &&
            ((t.decimal = t.numerator / t.denominator),
            (t.decimal = ((e) => {
              let t = Math.round(1e3 * e) / 1e3
              return 0 === t && 0 !== e ? e : t
            })(t.decimal))),
          t
        )
      },
      Ru = function (e) {
        if (e < 1e6) return String(e)
        let t
        return (
          (t = 'number' == typeof e ? e.toFixed(0) : e),
          -1 === t.indexOf('e+')
            ? t
            : t
                .replace('.', '')
                .split('e+')
                .reduce(function (e, t) {
                  return e + Array(t - e.length + 2).join(0)
                })
        )
      }
    const Uu = [
        ['ninety', 90],
        ['eighty', 80],
        ['seventy', 70],
        ['sixty', 60],
        ['fifty', 50],
        ['forty', 40],
        ['thirty', 30],
        ['twenty', 20],
      ],
      Qu = [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
      ],
      _u = [
        [1e24, 'septillion'],
        [1e20, 'hundred sextillion'],
        [1e21, 'sextillion'],
        [1e20, 'hundred quintillion'],
        [1e18, 'quintillion'],
        [1e17, 'hundred quadrillion'],
        [1e15, 'quadrillion'],
        [1e14, 'hundred trillion'],
        [1e12, 'trillion'],
        [1e11, 'hundred billion'],
        [1e9, 'billion'],
        [1e8, 'hundred million'],
        [1e6, 'million'],
        [1e5, 'hundred thousand'],
        [1e3, 'thousand'],
        [100, 'hundred'],
        [1, 'one'],
      ],
      Zu = function (e) {
        let t = []
        if (e > 100) return t
        for (let n = 0; n < Uu.length; n++)
          e >= Uu[n][1] && ((e -= Uu[n][1]), t.push(Uu[n][0]))
        return Qu[e] && t.push(Qu[e]), t
      }
    var Yu = function (e) {
        let t = e.num
        if (0 === t || '0' === t) return 'zero'
        t > 1e21 && (t = Ru(t))
        let n = []
        t < 0 && (n.push('minus'), (t = Math.abs(t)))
        let r = (function (e) {
          let t = e,
            n = []
          return (
            _u.forEach((r) => {
              if (e >= r[0]) {
                let e = Math.floor(t / r[0])
                ;(t -= e * r[0]), e && n.push({ unit: r[1], count: e })
              }
            }),
            n
          )
        })(t)
        for (let e = 0; e < r.length; e++) {
          let t = r[e].unit
          'one' === t && ((t = ''), n.length > 1 && n.push('and')),
            (n = n.concat(Zu(r[e].count))),
            n.push(t)
        }
        return (
          (n = n.concat(
            ((e) => {
              const t = [
                'zero',
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine',
              ]
              let n = [],
                r = Ru(e).match(/\.([0-9]+)/)
              if (!r || !r[0]) return n
              n.push('point')
              let a = r[0].split('')
              for (let e = 0; e < a.length; e++) n.push(t[a[e]])
              return n
            })(t)
          )),
          (n = n.filter((e) => e)),
          0 === n.length && (n[0] = ''),
          n.join(' ')
        )
      },
      Xu = function (e) {
        return e.numerator && e.denominator
          ? `${Yu({ num: e.numerator })} out of ${Yu({ num: e.denominator })}`
          : ''
      }
    const ec = {
      one: 'first',
      two: 'second',
      three: 'third',
      five: 'fifth',
      eight: 'eighth',
      nine: 'ninth',
      twelve: 'twelfth',
      twenty: 'twentieth',
      thirty: 'thirtieth',
      forty: 'fortieth',
      fourty: 'fourtieth',
      fifty: 'fiftieth',
      sixty: 'sixtieth',
      seventy: 'seventieth',
      eighty: 'eightieth',
      ninety: 'ninetieth',
    }
    var tc = (e) => {
        let t = Yu(e).split(' '),
          n = t[t.length - 1]
        return (
          ec.hasOwnProperty(n)
            ? (t[t.length - 1] = ec[n])
            : (t[t.length - 1] = n.replace(/y$/, 'i') + 'th'),
          t.join(' ')
        )
      },
      nc = function (e) {
        if (!e.numerator || !e.denominator) return ''
        let t = Yu({ num: e.numerator }),
          n = tc({ num: e.denominator })
        return (
          2 === e.denominator && (n = 'half'),
          t && n ? (1 !== e.numerator && (n += 's'), `${t} ${n}`) : ''
        )
      }
    const rc = (e, t) => ('number' == typeof t ? e.eq(t) : e)
    var ac = function (e) {
      class Fractions extends e {
        constructor(e, t, n) {
          super(e, t, n), (this.viewType = 'Fractions')
        }
        parse(e) {
          return rc(this, e).map(Ku)
        }
        get(e) {
          return rc(this, e).map(Ku)
        }
        json(e) {
          return rc(this, e).map((t) => {
            let n = t.toView().json(e)[0],
              r = Ku(t)
            return (n.fraction = r), n
          }, [])
        }
        toDecimal(e) {
          return (
            rc(this, e).forEach((e) => {
              let { decimal: t } = Ku(e)
              ;(e = e.replaceWith(String(t), !0)).tag('NumericValue'),
                e.unTag('Fraction')
            }),
            this
          )
        }
        toFraction(e) {
          return (
            rc(this, e).forEach((e) => {
              let t = Ku(e)
              if (
                t &&
                'number' == typeof t.numerator &&
                'number' == typeof t.denominator
              ) {
                let n = `${t.numerator}/${t.denominator}`
                this.replace(e, n)
              }
            }),
            this
          )
        }
        toOrdinal(e) {
          return (
            rc(this, e).forEach((e) => {
              let t = Ku(e),
                n = nc(t)
              e.after('^#Noun').found && (n += ' of'), e.replaceWith(n)
            }),
            this
          )
        }
        toCardinal(e) {
          return (
            rc(this, e).forEach((e) => {
              let t = Ku(e),
                n = Xu(t)
              e.replaceWith(n)
            }),
            this
          )
        }
        toPercentage(e) {
          return (
            rc(this, e).forEach((e) => {
              let { decimal: t } = Ku(e),
                n = 100 * t
              ;(n = Math.round(100 * n) / 100), e.replaceWith(n + '%')
            }),
            this
          )
        }
      }
      e.prototype.fractions = function (e) {
        let t = Ou(this)
        return (t = rc(t, e)), new Fractions(this.document, t.pointer)
      }
    }
    const oc = 'twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|fourty'
    var ic = function (e) {
        let t = e.match('#Value+')
        if (
          (t.has('#NumericValue #NumericValue') &&
            (t.has('#Value @hasComma #Value')
              ? t.splitAfter('@hasComma')
              : t.has('#NumericValue #Fraction')
              ? t.splitAfter('#NumericValue #Fraction')
              : (t = t.splitAfter('#NumericValue'))),
          t.has('#Value #Value #Value') &&
            !t.has('#Multiple') &&
            t.has('(' + oc + ') #Cardinal #Cardinal') &&
            (t = t.splitAfter('(' + oc + ') #Cardinal')),
          t.has('#Value #Value'))
        ) {
          t.has('#NumericValue #NumericValue') && (t = t.splitOn('#Year')),
            t.has(
              '(' +
                oc +
                ') (eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)'
            ) && (t = t.splitAfter('(' + oc + ')'))
          let e = t.match('#Cardinal #Cardinal')
          if (
            e.found &&
            !t.has('(point|decimal|#Fraction)') &&
            !e.has('#Cardinal (#Multiple|point|decimal)')
          ) {
            let n = t.has(
                `(one|two|three|four|five|six|seven|eight|nine) (${oc})`
              ),
              r = e.has('(' + oc + ') #Cardinal'),
              a = e.has('#Multiple #Value')
            n ||
              r ||
              a ||
              e.terms().forEach((e) => {
                t = t.splitOn(e)
              })
          }
          t.match('#Ordinal #Ordinal').match('#TextValue').found &&
            !t.has('#Multiple') &&
            (t.has('(' + oc + ') #Ordinal') || (t = t.splitAfter('#Ordinal'))),
            (t = t.splitBefore('#Ordinal [#Cardinal]', 0)),
            t.has('#TextValue #NumericValue') &&
              !t.has('(' + oc + '|#Multiple)') &&
              (t = t.splitBefore('#TextValue #NumericValue'))
        }
        return (
          (t = t.splitAfter('#NumberRange')), (t = t.splitBefore('#Year')), t
        )
      },
      sc = function (e) {
        if ('string' == typeof e) return { num: Lu(e) }
        let t = e.text('reduced'),
          n = /[0-9],[0-9]/.test(e.text('text'))
        if (1 === e.terms().length && !e.has('#Multiple')) {
          let r = (function (e, t) {
            let n = (e = e.replace(/,/g, '')).split(/([0-9.,]*)/),
              [r, a] = n,
              o = n.slice(2).join('')
            return '' !== a && t.length < 2
              ? ((a = Number(a || e)),
                'number' != typeof a && (a = null),
                (o = o || ''),
                ('st' !== o && 'nd' !== o && 'rd' !== o && 'th' !== o) ||
                  (o = ''),
                { prefix: r || '', num: a, suffix: o })
              : null
          })(t, e)
          if (null !== r) return (r.hasComma = n), r
        }
        let r = e.match('#Fraction{2,}$')
        r = !1 === r.found ? e.match('^#Fraction$') : r
        let a = null
        r.found &&
          (r.has('#Value and #Value #Fraction') &&
            (r = r.match('and #Value #Fraction')),
          (a = Ku(r)),
          (t = (e = (e = e.not(r)).not('and$')).text('reduced')))
        let o = 0
        return (
          t && (o = Lu(t) || 0),
          a && a.decimal && (o += a.decimal),
          {
            hasComma: n,
            prefix: '',
            num: o,
            suffix: '',
            isOrdinal: e.has('#Ordinal'),
            isText: e.has('#TextValue'),
            isFraction: e.has('#Fraction'),
            isMoney: e.has('#Money'),
          }
        )
      },
      lc = function (e) {
        let t = e.num
        if (!t && 0 !== t) return null
        let n = t % 100
        if (n > 10 && n < 20) return String(t) + 'th'
        const r = { 0: 'th', 1: 'st', 2: 'nd', 3: 'rd' }
        let a = Ru(t),
          o = a.slice(a.length - 1, a.length)
        return (a += r[o] ? r[o] : 'th'), a
      }
    const uc = {
        '¢': 'cents',
        $: 'dollars',
        '£': 'pounds',
        '¥': 'yen',
        '€': 'euros',
        '₡': 'colón',
        '฿': 'baht',
        '₭': 'kip',
        '₩': 'won',
        '₹': 'rupees',
        '₽': 'ruble',
        '₺': 'liras',
      },
      cc = {
        '%': 'percent',
        cm: 'centimetres',
        km: 'kilometres',
        ft: 'feet',
        '°': 'degrees',
      }
    var hc = function (e) {
        let t = { suffix: '', prefix: e.prefix }
        return (
          uc.hasOwnProperty(e.prefix) &&
            ((t.suffix += ' ' + uc[e.prefix]), (t.prefix = '')),
          cc.hasOwnProperty(e.suffix) && (t.suffix += ' ' + cc[e.suffix]),
          t.suffix && 1 === e.num && (t.suffix = t.suffix.replace(/s$/, '')),
          !t.suffix && e.suffix && (t.suffix += ' ' + e.suffix),
          t
        )
      },
      dc = function (e, t) {
        if ('TextOrdinal' === t) {
          let { prefix: t, suffix: n } = hc(e)
          return t + tc(e) + n
        }
        if ('Ordinal' === t) return e.prefix + lc(e) + e.suffix
        if ('TextCardinal' === t) {
          let { prefix: t, suffix: n } = hc(e)
          return t + Yu(e) + n
        }
        let n = e.num
        return (
          e.hasComma && (n = n.toLocaleString()),
          e.prefix + String(n) + e.suffix
        )
      }
    const pc = (e, t) => ('number' == typeof t ? e.eq(t) : e)
    var mc = function (e) {
        class Numbers extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = 'Numbers')
          }
          parse(e) {
            return pc(this, e).map(sc)
          }
          get(e) {
            return pc(this, e)
              .map(sc)
              .map((e) => e.num)
          }
          json(e) {
            return pc(this, e).map((t) => {
              let n = t.toView().json(e)[0],
                r = sc(t)
              return (
                (n.number = {
                  prefix: r.prefix,
                  num: r.num,
                  suffix: r.suffix,
                  hasComma: r.hasComma,
                }),
                n
              )
            }, [])
          }
          units() {
            return this.growRight('#Unit').match('#Unit$')
          }
          isOrdinal() {
            return this.if('#Ordinal')
          }
          isCardinal() {
            return this.if('#Cardinal')
          }
          toNumber() {
            return (
              this.if('#TextValue').forEach((e) => {
                let t = sc(e)
                if (null === t.num) return
                let n = e.has('#Ordinal') ? 'Ordinal' : 'Cardinal',
                  r = dc(t, n)
                e.replaceWith(r, { tags: !0 }), e.tag('NumericValue')
              }),
              this
            )
          }
          toLocaleString() {
            return (
              this.forEach((e) => {
                let t = sc(e)
                if (null === t.num) return
                let n = t.num.toLocaleString()
                if (e.has('#Ordinal')) {
                  let e = dc(t, 'Ordinal').match(/[a-z]+$/)
                  e && (n += e[0] || '')
                }
                e.replaceWith(n, { tags: !0 })
              }),
              this
            )
          }
          toText() {
            let e = this.map((e) => {
              if (e.has('#TextValue')) return e
              let t = sc(e)
              if (null === t.num) return e
              let n = e.has('#Ordinal') ? 'TextOrdinal' : 'TextCardinal',
                r = dc(t, n)
              return e.replaceWith(r, { tags: !0 }), e.tag('TextValue'), e
            })
            return new Numbers(e.document, e.pointer)
          }
          toCardinal() {
            let e = this.map((e) => {
              if (!e.has('#Ordinal')) return e
              let t = sc(e)
              if (null === t.num) return e
              let n = e.has('#TextValue') ? 'TextCardinal' : 'Cardinal',
                r = dc(t, n)
              return e.replaceWith(r, { tags: !0 }), e.tag('Cardinal'), e
            })
            return new Numbers(e.document, e.pointer)
          }
          toOrdinal() {
            let e = this.map((e) => {
              if (e.has('#Ordinal')) return e
              let t = sc(e)
              if (null === t.num) return e
              let n = e.has('#TextValue') ? 'TextOrdinal' : 'Ordinal',
                r = dc(t, n)
              return e.replaceWith(r, { tags: !0 }), e.tag('Ordinal'), e
            })
            return new Numbers(e.document, e.pointer)
          }
          isEqual(e) {
            return this.filter((t) => sc(t).num === e)
          }
          greaterThan(e) {
            return this.filter((t) => sc(t).num > e)
          }
          lessThan(e) {
            return this.filter((t) => sc(t).num < e)
          }
          between(e, t) {
            return this.filter((n) => {
              let r = sc(n).num
              return r > e && r < t
            })
          }
          set(e) {
            if (void 0 === e) return this
            'string' == typeof e && (e = sc(e).num)
            let t = this.map((t) => {
              let n = sc(t)
              if (((n.num = e), null === n.num)) return t
              let r = t.has('#Ordinal') ? 'Ordinal' : 'Cardinal'
              t.has('#TextValue') &&
                (r = t.has('#Ordinal') ? 'TextOrdinal' : 'TextCardinal')
              let a = dc(n, r)
              return (
                n.hasComma &&
                  'Cardinal' === r &&
                  (a = Number(a).toLocaleString()),
                (t = t.not('#Currency')).replaceWith(a, { tags: !0 }),
                t
              )
            })
            return new Numbers(t.document, t.pointer)
          }
          add(e) {
            if (!e) return this
            'string' == typeof e && (e = sc(e).num)
            let t = this.map((t) => {
              let n = sc(t)
              if (null === n.num) return t
              n.num += e
              let r = t.has('#Ordinal') ? 'Ordinal' : 'Cardinal'
              n.isText &&
                (r = t.has('#Ordinal') ? 'TextOrdinal' : 'TextCardinal')
              let a = dc(n, r)
              return t.replaceWith(a, { tags: !0 }), t
            })
            return new Numbers(t.document, t.pointer)
          }
          subtract(e, t) {
            return this.add(-1 * e, t)
          }
          increment(e) {
            return this.add(1, e)
          }
          decrement(e) {
            return this.add(-1, e)
          }
          update(e) {
            let t = new Numbers(this.document, e)
            return (t._cache = this._cache), t
          }
        }
        ;(Numbers.prototype.toNice = Numbers.prototype.toLocaleString),
          (Numbers.prototype.isBetween = Numbers.prototype.between),
          (Numbers.prototype.minus = Numbers.prototype.subtract),
          (Numbers.prototype.plus = Numbers.prototype.add),
          (Numbers.prototype.equals = Numbers.prototype.isEqual),
          (e.prototype.numbers = function (e) {
            let t = ic(this)
            return (t = pc(t, e)), new Numbers(this.document, t.pointer)
          }),
          (e.prototype.percentages = function (e) {
            let t = ic(this)
            return (
              (t = t.filter((e) => e.has('#Percent') || e.after('^percent'))),
              (t = pc(t, e)),
              new Numbers(this.document, t.pointer)
            )
          }),
          (e.prototype.money = function (e) {
            let t = ic(this)
            return (
              (t = t.filter((e) => e.has('#Money') || e.after('^#Currency'))),
              (t = pc(t, e)),
              new Numbers(this.document, t.pointer)
            )
          }),
          (e.prototype.values = e.prototype.numbers)
      },
      gc = {
        api: function (e) {
          ac(e), mc(e)
        },
      }
    const fc = { people: !0, emails: !0, phoneNumbers: !0, places: !0 },
      bc = function (e = {}) {
        return (
          !1 !== (e = Object.assign({}, fc, e)).people &&
            this.people().replaceWith('██████████'),
          !1 !== e.emails && this.emails().replaceWith('██████████'),
          !1 !== e.places && this.places().replaceWith('██████████'),
          !1 !== e.phoneNumbers && this.phoneNumbers().replaceWith('███████'),
          this
        )
      }
    var vc = {
        api: function (e) {
          e.prototype.redact = bc
        },
      },
      yc = function (e) {
        const t = /\?/,
          { document: n } = e
        return e.filter((e) => {
          let r = e.docs[0] || [],
            a = r[r.length - 1]
          return (
            !(!a || n[a.index[0]].length !== r.length) &&
            (!!t.test(a.post) ||
              (function (e) {
                let t = e.clauses()
                return !(
                  /\.\.$/.test(e.out('text')) ||
                  (e.has('^#QuestionWord') && e.has('@hasComma')) ||
                  (!e.has('or not$') &&
                    !e.has('^#QuestionWord') &&
                    !e.has(
                      '^(do|does|did|is|was|can|could|will|would|may) #Noun'
                    ) &&
                    !e.has('^(have|must) you') &&
                    !t.has(
                      '(do|does|is|was) #Noun+ #Adverb? (#Adjective|#Infinitive)$'
                    ))
                )
              })(e))
          )
        })
      },
      wc = function (e) {
        let t = e
        return 1 === t.length
          ? t
          : ((t = t.if('#Verb')),
            1 === t.length
              ? t
              : ((t = t.ifNo(
                  '(after|although|as|because|before|if|since|than|that|though|when|whenever|where|whereas|wherever|whether|while|why|unless|until|once)'
                )),
                (t = t.ifNo('^even (if|though)')),
                (t = t.ifNo('^so that')),
                (t = t.ifNo('^rather than')),
                (t = t.ifNo('^provided that')),
                1 === t.length
                  ? t
                  : ((t = t.ifNo(
                      '(that|which|whichever|who|whoever|whom|whose|whomever)'
                    )),
                    1 === t.length
                      ? t
                      : ((t = t.ifNo(
                          '(despite|during|before|through|throughout)'
                        )),
                        1 === t.length
                          ? t
                          : (0 === t.length && (t = e), t.eq(0))))))
      },
      kc = function (e) {
        let t = e.clauses(),
          n = wc(t).chunks(),
          r = e.none(),
          a = e.none(),
          o = e.none()
        return (
          n.forEach((e, t) => {
            0 !== t || e.has('<Verb>')
              ? a.found || !e.has('<Verb>')
                ? a.found && (o = o.concat(e))
                : (a = e)
              : (r = e)
          }),
          a.found && !r.found && (r = a.before('<Noun>+').first()),
          { subj: r, verb: a, pred: o }
        )
      },
      Pc = function (e) {
        let t = e.verbs(),
          n = t.eq(0)
        if (n.has('#PastTense')) return e
        if ((n.toPastTense(), t.length > 1)) {
          ;(t = t.slice(1)),
            (t = t.filter((e) => !e.lookBehind('to$').found)),
            (t = t.if('#PresentTense')),
            (t = t.notIf('#Gerund'))
          let n = e.match('to #Verb+ #Conjunction #Verb').terms()
          ;(t = t.not(n)), t.found && t.verbs().toPastTense()
        }
        return e
      },
      Ac = function (e) {
        let t = e.verbs()
        return (
          t.eq(0).toPresentTense(),
          t.length > 1 &&
            ((t = t.slice(1)),
            (t = t.filter((e) => !e.lookBehind('to$').found)),
            (t = t.notIf('#Gerund')),
            t.found && t.verbs().toPresentTense()),
          e
        )
      },
      jc = function (e) {
        let t = e.verbs()
        if (
          (t.eq(0).toFutureTense(),
          (t = (e = e.fullSentence()).verbs()),
          t.length > 1)
        ) {
          t = t.slice(1)
          let n = t.filter(
            (t) =>
              !(
                t.lookBehind('to$').found ||
                (!t.has('#Copula #Gerund') &&
                  (t.has('#Gerund') ||
                    (!t.has('#Copula') &&
                      t.has('#PresentTense') &&
                      e.has('(when|as|how)'))))
              )
          )
          n.found && n.toInfinitive()
        }
        return e
      },
      xc = function (e) {
        return e.verbs().toInfinitive(), e
      }
    const Ec = (e, t) => ('number' == typeof t ? e.eq(t) : e)
    var Nc = {
        api: function (e) {
          class Sentences extends e {
            constructor(e, t, n) {
              super(e, t, n), (this.viewType = 'Sentences')
            }
            json(e = {}) {
              return this.map((t) => {
                let n = t.toView().json(e)[0] || {},
                  { subj: r, verb: a, pred: o } = kc(t)
                return (
                  (n.sentence = {
                    subject: r.text('normal'),
                    verb: a.text('normal'),
                    predicate: o.text('normal'),
                  }),
                  n
                )
              }, [])
            }
            toPastTense(e) {
              return Ec(this, e).map((e) => (kc(e), Pc(e)))
            }
            toPresentTense(e) {
              return Ec(this, e).map((e) => (kc(e), Ac(e)))
            }
            toFutureTense(e) {
              return Ec(this, e).map((e) => (kc(e), (e = jc(e))))
            }
            toInfinitive(e) {
              return Ec(this, e).map((e) => (kc(e), xc(e)))
            }
            toNegative(e) {
              return Ec(this, e).map(
                (e) => (
                  kc(e),
                  (function (e) {
                    return e.verbs().first().toNegative().compute('chunks'), e
                  })(e)
                )
              )
            }
            toPositive(e) {
              return Ec(this, e).map(
                (e) => (
                  kc(e),
                  (function (e) {
                    return e.verbs().first().toPositive().compute('chunks'), e
                  })(e)
                )
              )
            }
            isQuestion(e) {
              return this.questions(e)
            }
            isExclamation(e) {
              let t = this.filter((e) => e.lastTerm().has('@hasExclamation'))
              return Ec(t, e)
            }
            isStatement(e) {
              let t = this.filter(
                (e) => !e.isExclamation().found && !e.isQuestion().found
              )
              return Ec(t, e)
            }
            update(e) {
              let t = new Sentences(this.document, e)
              return (t._cache = this._cache), t
            }
          }
          ;(Sentences.prototype.toPresent = Sentences.prototype.toPresentTense),
            (Sentences.prototype.toPast = Sentences.prototype.toPastTense),
            (Sentences.prototype.toFuture = Sentences.prototype.toFutureTense)
          const t = {
            sentences: function (e) {
              let t = this.map((e) => e.fullSentence())
              return (t = Ec(t, e)), new Sentences(this.document, t.pointer)
            },
            questions: function (e) {
              let t = yc(this)
              return Ec(t, e)
            },
          }
          Object.assign(e.prototype, t)
        },
      },
      Ic = function (e) {
        return e.match('#Honorific+? #Person+')
      },
      Tc = function (e) {
        let t = {}
        ;(t.firstName = e.match('#FirstName+')),
          (t.lastName = e.match('#LastName+')),
          (t.honorific = e.match('#Honorific+'))
        let n = t.lastName,
          r = t.firstName
        return (
          (r.found && n.found) ||
            r.found ||
            n.found ||
            !e.has('^#Honorific .$') ||
            (t.lastName = e.match('.$')),
          t
        )
      }
    const Gc = 'male',
      Dc = 'female',
      Cc = {
        mr: Gc,
        mrs: Dc,
        miss: Dc,
        madam: Dc,
        king: Gc,
        queen: Dc,
        duke: Gc,
        duchess: Dc,
        baron: Gc,
        baroness: Dc,
        count: Gc,
        countess: Dc,
        prince: Gc,
        princess: Dc,
        sire: Gc,
        dame: Dc,
        lady: Dc,
        ayatullah: Gc,
        congressman: Gc,
        congresswoman: Dc,
        'first lady': Dc,
        mx: null,
      }
    var Oc = function (e, t) {
      let { firstName: n, honorific: r } = e
      if (n.has('#FemaleName')) return Dc
      if (n.has('#MaleName')) return Gc
      if (r.found) {
        let e = r.text('normal')
        if (((e = e.replace(/\./g, '')), Cc.hasOwnProperty(e))) return Cc[e]
        if (/^her /.test(e)) return Dc
        if (/^his /.test(e)) return Gc
      }
      let a = t.after()
      if (!a.has('#Person') && a.has('#Pronoun')) {
        let e = a.match('#Pronoun')
        if (e.has('(they|their)')) return null
        let t = e.has('(he|his)'),
          n = e.has('(she|her|hers)')
        if (t && !n) return Gc
        if (n && !t) return Dc
      }
      return null
    }
    const Vc = (e, t) => ('number' == typeof t ? e.eq(t) : e)
    var Bc = function (e) {
        class People extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = 'People')
          }
          parse(e) {
            return Vc(this, e).map(Tc)
          }
          json(e) {
            return Vc(this, e).map((t) => {
              let n = t.toView().json(e)[0],
                r = Tc(t)
              return (
                (n.person = {
                  firstName: r.firstName.text('normal'),
                  lastName: r.lastName.text('normal'),
                  honorific: r.honorific.text('normal'),
                  presumed_gender: Oc(r, t),
                }),
                n
              )
            }, [])
          }
          update(e) {
            let t = new People(this.document, e)
            return (t._cache = this._cache), t
          }
        }
        e.prototype.people = function (e) {
          let t = Ic(this)
          return (t = Vc(t, e)), new People(this.document, t.pointer)
        }
      },
      zc = function (e) {
        let t = e.match('(#Place|#Address)+'),
          n = t.match('@hasComma')
        return (
          (n = n.filter(
            (e) =>
              !!e.has('(asia|africa|europe|america)$') ||
              !e.has('(#City|#Region|#ProperNoun)$') ||
              !e.after('^(#Country|#Region)').found
          )),
          (t = t.splitAfter(n)),
          t
        )
      },
      $c = function (e) {
        e.prototype.places = function (t) {
          let n = zc(this)
          return (
            (n = ((e, t) => ('number' == typeof t ? e.eq(t) : e))(n, t)),
            new e(this.document, n.pointer)
          )
        }
      },
      Fc = function (e) {
        e.prototype.organizations = function (e) {
          return ((e, t) => ('number' == typeof t ? e.eq(t) : e))(
            this.match('#Organization+'),
            e
          )
        }
      }
    const Sc = function (e) {
      let t = this.clauses(),
        n = t.people()
      return (
        (n = n.concat(t.places())),
        (n = n.concat(t.organizations())),
        (n = n.not('(someone|man|woman|mother|brother|sister|father)')),
        (n = n.sort('seq')),
        (n = ((e, t) => ('number' == typeof t ? e.eq(t) : e))(n, e)),
        n
      )
    }
    var Hc = function (e) {
        e.prototype.topics = Sc
      },
      Mc = {
        api: function (e) {
          Bc(e), $c(e), Fc(e), Hc(e)
        },
      },
      Lc = function (e) {
        let t = e.match('<Verb>')
        ;(t = t.splitAfter('@hasComma')),
          (t = t.splitAfter('[(do|did|am|was|is|will)] (is|was)', 0)),
          (t = t.splitBefore('(#Verb && !#Copula) [being] #Verb', 0)),
          (t = t.splitBefore('#Verb [to be] #Verb', 0)),
          (t = t.splitAfter('[help] #PresentTense', 0)),
          (t = t.splitBefore('(#PresentTense|#PastTense) [#Copula]$', 0)),
          (t = t.splitBefore('(#PresentTense|#PastTense) [will be]$', 0))
        let n = t.match('(#PresentTense|#PastTense) #Infinitive')
        return (
          n.found &&
            !n.has('^go') &&
            (t = t.splitBefore('(#PresentTense|#PastTense) [#Infinitive]', 0)),
          (t = t.not('#Reflexive$')),
          (t = t.if('#Verb')),
          t
        )
      },
      Wc = function (e) {
        let t = e
        return (
          e.wordCount() > 1 &&
            (t = e.not('(#Negative|#Auxiliary|#Modal|#Adverb|#Prefix)')),
          t.length > 1 && !t.has('#Phrasal #Particle') && (t = t.last()),
          (t = t.not('(want|wants|wanted) to')),
          t.found || (t = e.not('#Negative')),
          t
        )
      },
      Jc = function (e, t) {
        let n = { pre: e.none(), post: e.none() }
        if (!e.has('#Adverb')) return n
        let r = e.splitOn(t)
        return 3 === r.length
          ? { pre: r.eq(0).adverbs(), post: r.eq(2).adverbs() }
          : r.eq(0).isDoc(t)
          ? ((n.post = r.eq(1).adverbs()), n)
          : ((n.pre = r.eq(0).adverbs()), n)
      }
    const qc = function (e, t) {
        let n = e.splitBefore(t)
        if (n.length <= 1) return e.none()
        let r = n.eq(0)
        return (r = r.not('(#Adverb|#Negative|#Prefix)')), r
      },
      Kc = function (e) {
        return e.match('#Negative')
      },
      Rc = function (e) {
        let t = e.match('#Particle$')
        return { verb: e.not(t), particle: t }
      }
    var Uc = function (e) {
      let t = e.clone()
      t.contractions().expand()
      const n = Wc(t)
      return {
        root: n,
        prefix: t.match('#Prefix'),
        adverbs: Jc(t, n),
        auxiliary: qc(t, n),
        negative: Kc(t),
        phrasal: Rc(n),
      }
    }
    const Qc = { tense: 'PresentTense' },
      _c = { conditional: !0 },
      Zc = { tense: 'FutureTense' },
      Yc = { progressive: !0 },
      Xc = { tense: 'PastTense' },
      eh = { complete: !0, progressive: !1 },
      th = { passive: !0 },
      nh = function (e) {
        let t = {}
        return (
          e.forEach((e) => {
            Object.assign(t, e)
          }),
          t
        )
      },
      rh = {
        imperative: [['#Imperative', []]],
        'want-infinitive': [
          ['^(want|wants|wanted) to #Infinitive$', [Qc]],
          ['^wanted to #Infinitive$', [Xc]],
          ['^will want to #Infinitive$', [Zc]],
        ],
        'gerund-phrase': [
          ['^#PastTense #Gerund$', [Xc]],
          ['^#PresentTense #Gerund$', [Qc]],
          ['^#Infinitive #Gerund$', [Qc]],
          ['^will #Infinitive #Gerund$', [Zc]],
          ['^have #PastTense #Gerund$', [Xc]],
          ['^will have #PastTense #Gerund$', [Xc]],
        ],
        'simple-present': [
          ['^#PresentTense$', [Qc]],
          ['^#Infinitive$', [Qc]],
        ],
        'simple-past': [['^#PastTense$', [Xc]]],
        'simple-future': [['^will #Adverb? #Infinitive', [Zc]]],
        'present-progressive': [['^(is|are|am) #Gerund$', [Qc, Yc]]],
        'past-progressive': [['^(was|were) #Gerund$', [Xc, Yc]]],
        'future-progressive': [['^will be #Gerund$', [Zc, Yc]]],
        'present-perfect': [['^(has|have) #PastTense$', [Xc, eh]]],
        'past-perfect': [
          ['^had #PastTense$', [Xc, eh]],
          ['^had #PastTense to #Infinitive', [Xc, eh]],
        ],
        'future-perfect': [['^will have #PastTense$', [Zc, eh]]],
        'present-perfect-progressive': [
          ['^(has|have) been #Gerund$', [Xc, Yc]],
        ],
        'past-perfect-progressive': [['^had been #Gerund$', [Xc, Yc]]],
        'future-perfect-progressive': [['^will have been #Gerund$', [Zc, Yc]]],
        'passive-past': [
          ['(got|were|was) (#PastTense|#Participle)', [Xc, th]],
          ['^(was|were) being (#PastTense|#Participle)', [Xc, th]],
          ['^(had|have) been (#PastTense|#Participle)', [Xc, th]],
        ],
        'passive-present': [
          ['^(is|are|am) (#PastTense|#Participle)', [Qc, th]],
          ['^(is|are|am) being (#PastTense|#Participle)', [Qc, th]],
          ['^has been (#PastTense|#Participle)', [Qc, th]],
        ],
        'passive-future': [
          ['will have been (#PastTense|#Participle)', [Zc, th, _c]],
          ['will be being? (#PastTense|#Participle)', [Zc, th, _c]],
        ],
        'present-conditional': [['would be #PastTense', [Qc, _c]]],
        'past-conditional': [['would have been #PastTense', [Xc, _c]]],
        'auxiliary-future': [
          ['(is|are|am|was) going to (#Infinitive|#PresentTense)', [Zc]],
        ],
        'auxiliary-past': [
          ['^did #Infinitive$', [Xc, { plural: !1 }]],
          ['^used to #Infinitive$', [Xc, eh]],
        ],
        'auxiliary-present': [
          ['^(does|do) #Infinitive$', [Qc, eh, { plural: !0 }]],
        ],
        'modal-past': [['^(could|must|should|shall) have #PastTense$', [Xc]]],
        'modal-infinitive': [['^#Modal #Infinitive$', []]],
        infinitive: [['^#Infinitive$', []]],
      }
    let ah = []
    Object.keys(rh).map((e) => {
      rh[e].forEach((t) => {
        ah.push({ name: e, match: t[0], data: nh(t[1]) })
      })
    })
    var oh = ah,
      ih = function (e, t) {
        let n = {}
        e = (function (e, t) {
          return (
            (e = e.clone()),
            t.adverbs.post && t.adverbs.post.found && e.remove(t.adverbs.post),
            t.adverbs.pre && t.adverbs.pre.found && e.remove(t.adverbs.pre),
            e.has('#Negative') && (e = e.remove('#Negative')),
            e.has('#Prefix') && (e = e.remove('#Prefix')),
            t.root.has('#PhrasalVerb #Particle') && e.remove('#Particle$'),
            e.not('#Adverb')
          )
        })(e, t)
        for (let t = 0; t < oh.length; t += 1) {
          let r = oh[t]
          if (!0 === e.has(r.match)) {
            ;(n.form = r.name), Object.assign(n, r.data)
            break
          }
        }
        return (
          n.form || (e.has('^#Verb$') && (n.form = 'infinitive')),
          n.tense ||
            (n.tense = t.root.has('#PastTense') ? 'PastTense' : 'PresentTense'),
          (n.copula = t.root.has('#Copula')),
          n
        )
      }
    const sh = function (e) {
        return !(e.length <= 1) && (e.parse()[0] || {}).isSubordinate
      },
      lh = function (e, t) {
        return (
          !!t.has('(are|were|does)') ||
          !!e.has('(those|they|we)') ||
          (!(!e.found || !e.isPlural) && e.isPlural().found)
        )
      }
    var uh = function (e) {
      let t = (function (e) {
        let t = e.before()
        t = (function (e) {
          let t = e.clauses()
          return (
            (t = t.filter(
              (e, t) =>
                !(
                  e.has(
                    '^(if|unless|while|but|for|per|at|by|that|which|who|from)'
                  ) ||
                  (t > 0 && e.has('^#Verb . #Noun+$')) ||
                  (t > 0 && e.has('^#Adverb'))
                )
            )),
            0 === t.length ? e : t
          )
        })(t)
        let n = t.nouns(),
          r = n.last(),
          a = r.match('(i|he|she|we|you|they)')
        if (a.found) return a.nouns()
        let o = n.if('^(that|this|those)')
        return o.found ||
          (!1 === n.found && ((o = t.match('^(that|this|those)')), o.found))
          ? o
          : ((r = n.last()),
            sh(r) && (n.remove(r), (r = n.last())),
            sh(r) && (n.remove(r), (r = n.last())),
            r)
      })(e)
      return { subject: t, plural: lh(t, e) }
    }
    const ch = (e) => e,
      hh = (e, t) => {
        let n = uh(e),
          r = n.subject
        return !(!r.has('i') && !r.has('we')) || n.plural
      },
      dh = function (e, t) {
        if (e.has('were')) return 'are'
        let { subject: n, plural: r } = uh(e)
        return n.has('i') ? 'am' : n.has('we') || r ? 'are' : 'is'
      },
      ph = function (e, t) {
        let n = uh(e),
          r = n.subject
        return r.has('i') || r.has('we') || n.plural ? 'do' : 'does'
      },
      mh = function (e) {
        return e.has('#Infinitive')
          ? 'Infinitive'
          : e.has('#Participle')
          ? 'Participle'
          : e.has('#PastTense')
          ? 'PastTense'
          : e.has('#Gerund')
          ? 'Gerund'
          : e.has('#PresentTense')
          ? 'PresentTense'
          : void 0
      },
      gh = function (e, t) {
        const { verbToInfinitive: n } = e.methods.two.transform
        let r = t.root.text({ keepPunct: !1 })
        return (r = n(r, e.model, mh(e))), r && e.replace(t.root, r), e
      },
      fh = (e) =>
        e.has('will not')
          ? e.replace('will not', 'have not')
          : e.remove('will'),
      bh = function (e) {
        return e && e.isView
          ? e.json({ normal: !0, terms: !1, text: !1 }).map((e) => e.normal)
          : []
      },
      vh = function (e) {
        return e && e.isView ? e.text('normal') : ''
      },
      yh = function (e) {
        const { verbToInfinitive: t } = e.methods.two.transform
        return t(e.text('normal'), e.model, mh(e))
      }
    var wh = function (e) {
      let t = Uc(e)
      e = e.clone().toView()
      const n = ih(e, t)
      return {
        root: t.root.text(),
        preAdverbs: bh(t.adverbs.pre),
        postAdverbs: bh(t.adverbs.post),
        auxiliary: vh(t.auxiliary),
        negative: t.negative.found,
        prefix: vh(t.prefix),
        infinitive: yh(t.root),
        grammar: n,
      }
    }
    const kh = { tags: !0 }
    var Ph = function (e, t) {
      const { verbToInfinitive: n } = e.methods.two.transform,
        { root: r, auxiliary: a } = t
      let o = a.terms().harden(),
        i = r.text('normal')
      if (
        ((i = n(i, e.model, mh(r))),
        i && e.replace(r, i, kh).tag('Verb').firstTerm().tag('Infinitive'),
        o.found && e.remove(o),
        t.negative.found)
      ) {
        e.has('not') || e.prepend('not')
        let t = ph(e)
        e.prepend(t)
      }
      return (
        e
          .fullSentence()
          .compute(['lexicon', 'preTagger', 'postTagger', 'chunks']),
        e
      )
    }
    const Ah = { tags: !0 },
      jh = {
        noAux: (e, t) => (t.auxiliary.found && (e = e.remove(t.auxiliary)), e),
        simple: (e, t) => {
          const { verbConjugate: n, verbToInfinitive: r } =
              e.methods.two.transform,
            a = t.root
          if (a.has('#Modal')) return e
          let o = a.text({ keepPunct: !1 })
          return (
            (o = r(o, e.model, mh(a))),
            (o = n(o, e.model).PastTense),
            (o = 'been' === o ? 'was' : o),
            'was' === o &&
              (o = ((e, t) => {
                let { subject: n, plural: r } = uh(e)
                return r || n.has('we') ? 'were' : 'was'
              })(e)),
            o && e.replace(a, o, Ah),
            e
          )
        },
        both: function (e, t) {
          return t.negative.found
            ? (e.replace('will', 'did'), e)
            : ((e = jh.simple(e, t)), (e = jh.noAux(e, t)))
        },
        hasHad: (e) => (e.replace('has', 'had', Ah), e),
        hasParticiple: (e, t) => {
          const { verbConjugate: n, verbToInfinitive: r } =
              e.methods.two.transform,
            a = t.root
          let o = a.text('normal')
          return (o = r(o, e.model, mh(a))), n(o, e.model).Participle
        },
      },
      xh = {
        infinitive: jh.simple,
        'simple-present': jh.simple,
        'simple-past': ch,
        'simple-future': jh.both,
        'present-progressive': (e) => (
          e.replace('are', 'were', Ah), e.replace('(is|are|am)', 'was', Ah), e
        ),
        'past-progressive': ch,
        'future-progressive': (e, t) => (
          e.match(t.root).insertBefore('was'), e.remove('(will|be)'), e
        ),
        'present-perfect': jh.hasHad,
        'past-perfect': ch,
        'future-perfect': (e, t) => (
          e.match(t.root).insertBefore('had'),
          e.has('will') && (e = fh(e)),
          e.remove('have'),
          e
        ),
        'present-perfect-progressive': jh.hasHad,
        'past-perfect-progressive': ch,
        'future-perfect-progressive': (e) => (
          e.remove('will'), e.replace('have', 'had', Ah), e
        ),
        'passive-past': (e) => (e.replace('have', 'had', Ah), e),
        'passive-present': (e) => (e.replace('(is|are)', 'was', Ah), e),
        'passive-future': (e, t) => (
          t.auxiliary.has('will be') &&
            (e.match(t.root).insertBefore('had been'), e.remove('(will|be)')),
          t.auxiliary.has('will have been') &&
            (e.replace('have', 'had', Ah), e.remove('will')),
          e
        ),
        'present-conditional': (e) => (e.replace('be', 'have been'), e),
        'past-conditional': ch,
        'auxiliary-future': (e) => (e.replace('(is|are|am)', 'was', Ah), e),
        'auxiliary-past': ch,
        'auxiliary-present': (e) => (e.replace('(do|does)', 'did', Ah), e),
        'modal-infinitive': (e, t) => (
          e.has('can')
            ? e.replace('can', 'could', Ah)
            : (jh.simple(e, t),
              e.match('#Modal').insertAfter('have').tag('Auxiliary')),
          e
        ),
        'modal-past': ch,
        'want-infinitive': (e) => (
          e.replace('(want|wants)', 'wanted', Ah), e.remove('will'), e
        ),
        'gerund-phrase': (e, t) => (
          (t.root = t.root.not('#Gerund$')), jh.simple(e, t), fh(e), e
        ),
      }
    var Eh = function (e, t, n) {
      return xh.hasOwnProperty(n)
        ? ((e = xh[n](e, t))
            .fullSentence()
            .compute(['lexicon', 'preTagger', 'postTagger', 'chunks']),
          e)
        : e
    }
    const Nh = { tags: !0 },
      Ih = (e, t) => {
        const { verbConjugate: n, verbToInfinitive: r } =
            e.methods.two.transform,
          a = t.root
        let o = a.text('normal')
        return (
          (o = r(o, e.model, mh(a))),
          !1 === hh(e) && (o = n(o, e.model).PresentTense),
          a.has('#Copula') && (o = dh(e)),
          o && (e = e.replace(a, o, Nh)).not('#Particle').tag('PresentTense'),
          e
        )
      },
      Th = (e, t) => {
        const { verbConjugate: n, verbToInfinitive: r } =
            e.methods.two.transform,
          a = t.root
        let o = a.text('normal')
        return (
          (o = r(o, e.model, mh(a))),
          !1 === hh(e) && (o = n(o, e.model).Gerund),
          o && (e = e.replace(a, o, Nh)).not('#Particle').tag('Gerund'),
          e
        )
      },
      Gh = {
        infinitive: Ih,
        'simple-present': (e, t) => {
          const { verbConjugate: n } = e.methods.two.transform
          let { root: r } = t
          if (!r.has('#Infinitive')) return Ih(e, t)
          {
            let t = uh(e).subject
            if (hh(e) || t.has('i')) return e
            let a = r.text('normal'),
              o = n(a, e.model).PresentTense
            a !== o && e.replace(r, o, Nh)
          }
          return e
        },
        'simple-past': Ih,
        'simple-future': (e, t) => {
          const { root: n, auxiliary: r } = t
          if (r.has('will') && n.has('be')) {
            let t = dh(e)
            e.replace(n, t),
              (e = e.remove('will')).replace('not ' + t, t + ' not')
          } else Ih(e, t), (e = e.remove('will'))
          return e
        },
        'present-progressive': ch,
        'past-progressive': (e, t) => {
          let n = dh(e)
          return e.replace('(were|was)', n, Nh)
        },
        'future-progressive': (e) => (
          e.match('will').insertBefore('is'), e.remove('be'), e.remove('will')
        ),
        'present-perfect': (e, t) => (
          Ih(e, t), (e = e.remove('(have|had|has)'))
        ),
        'past-perfect': (e, t) => {
          let n = uh(e).subject
          return hh(e) || n.has('i')
            ? ((e = gh(e, t)).remove('had'), e)
            : (e.replace('had', 'has', Nh), e)
        },
        'future-perfect': (e) => (
          e.match('will').insertBefore('has'), e.remove('have').remove('will')
        ),
        'present-perfect-progressive': ch,
        'past-perfect-progressive': (e) => e.replace('had', 'has', Nh),
        'future-perfect-progressive': (e) => (
          e.match('will').insertBefore('has'), e.remove('have').remove('will')
        ),
        'passive-past': (e, t) => {
          let n = dh(e)
          return e.has('(had|have|has)') && e.has('been')
            ? (e.replace('(had|have|has)', n, Nh),
              e.replace('been', 'being'),
              e)
            : e.replace('(got|was|were)', n)
        },
        'passive-present': ch,
        'passive-future': (e) => (
          e.replace('will', 'is'), e.replace('be', 'being')
        ),
        'present-conditional': ch,
        'past-conditional': (e) => (e.replace('been', 'be'), e.remove('have')),
        'auxiliary-future': (e, t) => (Th(e, t), e.remove('(going|to)'), e),
        'auxiliary-past': (e, t) => {
          if (t.auxiliary.has('did')) {
            let n = ph(e)
            return e.replace(t.auxiliary, n), e
          }
          return Th(e, t), e.replace(t.auxiliary, 'is'), e
        },
        'auxiliary-present': ch,
        'modal-infinitive': ch,
        'modal-past': (e, t) => (
          ((e, t) => {
            const { verbToInfinitive: n } = e.methods.two.transform,
              r = t.root
            let a = t.root.text('normal')
            ;(a = n(a, e.model, mh(r))), a && (e = e.replace(t.root, a, Nh))
          })(e, t),
          e.remove('have')
        ),
        'gerund-phrase': (e, t) => (
          (t.root = t.root.not('#Gerund$')), Ih(e, t), e.remove('(will|have)')
        ),
        'want-infinitive': (e, t) => {
          let n = 'wants'
          return (
            hh(e) && (n = 'want'),
            e.replace('(want|wanted|wants)', n, Nh),
            e.remove('will'),
            e
          )
        },
      }
    var Dh = function (e, t, n) {
      return Gh.hasOwnProperty(n)
        ? ((e = Gh[n](e, t))
            .fullSentence()
            .compute(['lexicon', 'preTagger', 'postTagger', 'chunks']),
          e)
        : e
    }
    const Ch = { tags: !0 },
      Oh = (e, t) => {
        const { verbToInfinitive: n } = e.methods.two.transform,
          { root: r, auxiliary: a } = t
        if (r.has('#Modal')) return e
        let o = r.text('normal')
        return (
          (o = n(o, e.model, mh(r))),
          o && (e = e.replace(r, o, Ch)).not('#Particle').tag('Verb'),
          e.prepend('will').match('will').tag('Auxiliary'),
          e.remove(a),
          e
        )
      },
      Vh = (e, t) => {
        const { verbConjugate: n, verbToInfinitive: r } =
            e.methods.two.transform,
          { root: a, auxiliary: o } = t
        let i = a.text('normal')
        return (
          (i = r(i, e.model, mh(a))),
          i &&
            ((i = n(i, e.model).Gerund),
            e.replace(a, i, Ch),
            e.not('#Particle').tag('PresentTense')),
          e.remove(o),
          e.prepend('will be').match('will be').tag('Auxiliary'),
          e
        )
      },
      Bh = {
        infinitive: Oh,
        'simple-present': Oh,
        'simple-past': Oh,
        'simple-future': ch,
        'present-progressive': Vh,
        'past-progressive': Vh,
        'future-progressive': ch,
        'present-perfect': (e) => (
          e.match('(have|has)').replaceWith('will have'), e
        ),
        'past-perfect': (e) => e.replace('(had|has)', 'will have'),
        'future-perfect': ch,
        'present-perfect-progressive': (e) => e.replace('has', 'will have'),
        'past-perfect-progressive': (e) => e.replace('had', 'will have'),
        'future-perfect-progressive': ch,
        'passive-past': (e) =>
          e.has('got')
            ? e.replace('got', 'will get')
            : e.has('(was|were)')
            ? (e.replace('(was|were)', 'will be'), e.remove('being'))
            : e.has('(have|has|had) been')
            ? e.replace('(have|has|had) been', 'will be')
            : e,
        'passive-present': (e) => (
          e.replace('being', 'will be'), e.remove('(is|are|am)'), e
        ),
        'passive-future': ch,
        'present-conditional': (e) => e.replace('would', 'will'),
        'past-conditional': (e) => e.replace('would', 'will'),
        'auxiliary-future': ch,
        'auxiliary-past': (e) =>
          e.has('used') && e.has('to')
            ? (e.replace('used', 'will'), e.remove('to'))
            : (e.replace('did', 'will'), e),
        'auxiliary-present': (e) => e.replace('(do|does)', 'will'),
        'modal-infinitive': ch,
        'modal-past': ch,
        'gerund-phrase': (e, t) => (
          (t.root = t.root.not('#Gerund$')), Oh(e, t), e.remove('(had|have)')
        ),
        'want-infinitive': (e) => (
          e.replace('(want|wants|wanted)', 'will want'), e
        ),
      }
    var zh = function (e, t, n) {
      return e.has('will') || e.has('going to')
        ? e
        : Bh.hasOwnProperty(n)
        ? ((e = Bh[n](e, t))
            .fullSentence()
            .compute(['lexicon', 'preTagger', 'postTagger', 'chunks']),
          e)
        : e
    }
    const $h = { tags: !0 }
    var Fh = function (e, t) {
      const { verbToInfinitive: n, verbConjugate: r } = e.methods.two.transform,
        { root: a, auxiliary: o } = t
      if (e.has('#Gerund')) return e
      let i = a.text('normal')
      i = n(i, e.model, mh(a))
      let s = r(i, e.model).Gerund
      return (
        s && ((s = `${dh(e)} ${s}`), e.replace(a, s, $h)),
        o.found && e.remove(o),
        e.replace('not is', 'is not'),
        e.replace('not are', 'are not'),
        e.fullSentence().compute(['preTagger', 'postTagger', 'chunks']),
        e
      )
    }
    const Sh = { tags: !0 },
      Hh = function (e, t) {
        let n = ph(e)
        return e.prepend(n + ' not'), e
      },
      Mh = function (e) {
        let t = e.match('be')
        return t.found
          ? (t.prepend('not'), e)
          : ((t = e.match('(is|was|am|are|will|were)')),
            t.found ? (t.append('not'), e) : e)
      },
      Lh = (e) => e.has('(is|was|am|are|will|were|be)'),
      Wh = {
        'simple-present': (e, t) =>
          !0 === Lh(e) ? Mh(e) : ((e = gh(e, t)), (e = Hh(e))),
        'simple-past': (e, t) =>
          !0 === Lh(e) ? Mh(e) : ((e = gh(e, t)).prepend('did not'), e),
        imperative: (e) => (e.prepend('do not'), e),
        infinitive: (e, t) => (!0 === Lh(e) ? Mh(e) : Hh(e)),
        'passive-past': (e) => {
          if (e.has('got'))
            return e.replace('got', 'get', Sh), e.prepend('did not'), e
          let t = e.match('(was|were|had|have)')
          return t.found && t.append('not'), e
        },
        'auxiliary-past': (e) => {
          if (e.has('used')) return e.prepend('did not'), e
          let t = e.match('(did|does|do)')
          return t.found && t.append('not'), e
        },
        'want-infinitive': (e, t) =>
          (e = (e = Hh(e)).replace('wants', 'want', Sh)),
      }
    var Jh = function (e, t, n) {
      if (e.has('#Negative')) return e
      if (Wh.hasOwnProperty(n)) return (e = Wh[n](e, t))
      let r = e.matchOne('be')
      return r.found
        ? (r.prepend('not'), e)
        : !0 === Lh(e)
        ? Mh(e)
        : ((r = e.matchOne('(will|had|have|has|did|does|do|#Modal)')),
          r.found ? (r.append('not'), e) : e)
    }
    const qh = (e, t) => ('number' == typeof t ? e.eq(t) : e)
    var Kh = {
      api: function (e) {
        class Verbs extends e {
          constructor(e, t, n) {
            super(e, t, n), (this.viewType = 'Verbs')
          }
          parse(e) {
            return qh(this, e).map(Uc)
          }
          json(e, t) {
            return qh(this, t).map((t) => {
              let n = t.toView().json(e)[0] || {}
              return (n.verb = wh(t)), n
            }, [])
          }
          subjects(e) {
            return qh(this, e).map((e) => (Uc(e), uh(e).subject))
          }
          adverbs(e) {
            return qh(this, e).map((e) => e.match('#Adverb'))
          }
          isSingular(e) {
            return qh(this, e).filter((e) => !0 !== uh(e).plural)
          }
          isPlural(e) {
            return qh(this, e).filter((e) => !0 === uh(e).plural)
          }
          isImperative(e) {
            return qh(this, e).filter((e) => e.has('#Imperative'))
          }
          toInfinitive(e) {
            return qh(this, e).map((e) => {
              let t = Uc(e),
                n = ih(e, t)
              return Ph(e, t, n.form)
            })
          }
          toPresentTense(e) {
            return qh(this, e).map((e) => {
              let t = Uc(e),
                n = ih(e, t)
              return Dh(e, t, n.form)
            })
          }
          toPastTense(e) {
            return qh(this, e).map((e) => {
              let t = Uc(e),
                n = ih(e, t)
              return Eh(e, t, n.form)
            })
          }
          toFutureTense(e) {
            return qh(this, e).map((e) => {
              let t = Uc(e),
                n = ih(e, t)
              return zh(e, t, n.form)
            })
          }
          toGerund(e) {
            return qh(this, e).map((e) => {
              let t = Uc(e),
                n = ih(e, t)
              return Fh(e, t, n.form)
            })
          }
          conjugate(e) {
            return qh(this, e).map((e) => {
              let t = Uc(e),
                n = ih(e, t)
              return (
                'imperative' === n.form && (n.form = 'simple-present'),
                {
                  Infinitive: Ph(e.clone(), t, n.form).text('normal'),
                  PastTense: Eh(e.clone(), t, n.form).text('normal'),
                  PresentTense: Dh(e.clone(), t, n.form).text('normal'),
                  FutureTense: zh(e.clone(), t, n.form).text('normal'),
                }
              )
            }, [])
          }
          isNegative() {
            return this.if('#Negative')
          }
          isPositive() {
            return this.ifNo('#Negative')
          }
          toPositive() {
            let e = this.match('do not #Verb')
            return e.found && e.remove('do not'), this.remove('#Negative')
          }
          toNegative(e) {
            return qh(this, e).map((e) => {
              let t = Uc(e),
                n = ih(e, t)
              return Jh(e, t, n.form)
            })
          }
          update(e) {
            let t = new Verbs(this.document, e)
            return (t._cache = this._cache), t
          }
        }
        ;(Verbs.prototype.toPast = Verbs.prototype.toPastTense),
          (Verbs.prototype.toPresent = Verbs.prototype.toPresentTense),
          (Verbs.prototype.toFuture = Verbs.prototype.toFutureTense),
          (e.prototype.verbs = function (e) {
            let t = Lc(this)
            return (t = qh(t, e)), new Verbs(this.document, t.pointer)
          })
      },
    }
    return (
      m.plugin(Ll),
      m.plugin(cu),
      m.plugin(bu),
      m.plugin(Cu),
      m.plugin(gc),
      m.plugin(vc),
      m.plugin(Nc),
      m.plugin(Mc),
      m.plugin(Kh),
      m
    )
  }),
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define(t)
    : ((e = 'undefined' != typeof globalThis ? globalThis : e || self).nlp =
        t())

var nlp = t();
export {
  nlp
}