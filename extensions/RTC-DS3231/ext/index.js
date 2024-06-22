(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.unknown = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  !function (global) {
    "use strict";

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined;
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    var inModule = typeof module === "object";
    var runtime = global.regeneratorRuntime;

    if (runtime) {
      if (inModule) {
        module.exports = runtime;
      }

      return;
    }

    runtime = global.regeneratorRuntime = inModule ? module.exports || {} : {};

    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);
      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    runtime.wrap = wrap;

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";
    var ContinueSentinel = {};

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {}

    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    runtime.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    runtime.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;

        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    runtime.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function (unwrapped) {
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }

      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    runtime.AsyncIterator = AsyncIterator;

    runtime.async = function (innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
      return runtime.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted;
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined) {
        context.delegate = null;

        if (context.method === "throw") {
          if (delegate.iterator.return) {
            context.method = "return";
            context.arg = undefined;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        context[delegate.resultName] = info.value;
        context.next = delegate.nextLoc;

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined;
        }
      } else {
        return info;
      }

      context.delegate = null;
      return ContinueSentinel;
    }

    defineIteratorMethods(Gp);
    Gp[toStringTagSymbol] = "Generator";

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    runtime.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse();
      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      }

      return {
        next: doneResult
      };
    }

    runtime.values = values;

    function doneResult() {
      return {
        value: undefined,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        this.prev = 0;
        this.next = 0;
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined;
        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined;
            }
          }
        }
      },
      stop: function () {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            context.method = "next";
            context.arg = undefined;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function (record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        }

        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          this.arg = undefined;
        }

        return ContinueSentinel;
      }
    };
  }(function () {
    return this || typeof self === "object" && self;
  }() || Function("return this")());
  undefined;
  const disableBlocks = {
    debug: [],
    upload: []
  };
  const mustLoginBlocks = [];

  const triggerBlocksStatus = async (mode, app) => {};

  class ExtImpl {}

  const extTranslationMap = {
    "zh": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "en": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "de": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Starte",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "es": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "fr": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "id": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "ja": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "ja-jph": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "ko": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "pl": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "uk": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "zh-hant": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "nl": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "it": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "hr": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "ru": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "pt": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "fi": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "tr": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    },
    "tk": {
      "lepton_rtc_ds3231": "Lepton RTC DS3231",
      "extensionName": "Lepton RTC DS3231",
      "extensionDescription": "RTC DS3231 clock",
      "BLOCK_1712698492010": "🚀 Initialize",
      "BLOCK_1713188274574": "✍️ Set date to Year [year] Month [month]  Day [date] Hour [hour] Minute [minute] Second [second]",
      "BLOCK_1713174673422": "📖 Read date",
      "BLOCK_1713175967062_FIELD_0": "year",
      "BLOCK_1713175967062_FIELD_1": "month",
      "BLOCK_1713175967062_FIELD_2": "day",
      "BLOCK_1713175967062_FIELD_3": "hour",
      "BLOCK_1713175967062_FIELD_4": "minute",
      "BLOCK_1713175967062_FIELD_5": "second",
      "BLOCK_1713175967062_FIELD_6": "day of week",
      "BLOCK_1713175967062_FIELD_7": "seconds since 1970",
      "BLOCK_1713175967062": "Date item [field]  ",
      "cate_d7a41440": "💫 RTC"
    }
  };
  const codeSnippets = {
    arduinoc: {}
  };
  const extGenerators = [{
    lang: 'arduinoc',
    template: `// generated by mBlock5 for <your product>
// codes make you happy

//( include //)
#include <Arduino.h>
//( lib //)

//({
    this.$ALL_VARIABLES.length==0?'':this.$ALL_VARIABLES.map(v=>"float "+v+" = 0;").join('\\n')
}//)

//( declare //)


void _delay(float seconds) {
  long endTime = millis() + seconds * 1000;
  while(millis() < endTime) _loop();
}

//(
void setup() {
  //( setup //)
  //( code //)
}
//)

void _loop() {
  //( _loop //)
}

void loop() {
  _loop();
}`,
    splitor: {
      frame: {
        left: "//(",
        right: "//)"
      },
      expression: {
        left: "/*{",
        right: "}*/"
      }
    },
    reducers: [{
      name: 'include',
      reduce: codes => {
        let codes1 = [];

        for (let code of codes) {
          let codeStr = '';

          if (typeof code === 'string') {
            codeStr = code;
          } else if (typeof code === 'function') {
            codeStr = code();
          }

          if (codes1.indexOf(codeStr) === -1) {
            codes1.push(codeStr);
          }
        }

        if (codes1.length === 0) {
          return undefined;
        }

        return codes1.map(code => {
          return '#include ' + code;
        }).join('\n') + '\n';
      }
    }]
  }];
  const extSources = {
    arduino: [{
      filename: "src/Lepton-RTC-DS3231/DS3231.cpp",
      code: "/*\n\nThe MIT License\n\nCopyright (c) 2014-2023 Korneliusz Jarzębski\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n*/\n\n#if ARDUINO >= 100\n#include \"Arduino.h\"\n#else\n#include \"WProgram.h\"\n#endif\n\n#include <Wire.h>\n#include \"DS3231.h\"\n\nconst uint8_t daysArray [] PROGMEM = { 31,28,31,30,31,30,31,31,30,31,30,31 };\nconst uint8_t dowArray[] PROGMEM = { 0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4 };\n\nbool DS3231::begin(void)\n{\n    Wire.begin();\n\n    setBattery(true, false);\n\n    t.year = 2000;\n    t.month = 1;\n    t.day = 1;\n    t.hour = 0;\n    t.minute = 0;\n    t.second = 0;\n    t.dayOfWeek = 6;\n    t.unixtime = 946681200;\n\n    return true;\n}\n\nvoid DS3231::setDateTime(uint16_t year, uint8_t month, uint8_t day, uint8_t hour, uint8_t minute, uint8_t second)\n{\n    Wire.beginTransmission(DS3231_ADDRESS);\n\n    #if ARDUINO >= 100\n        Wire.write(DS3231_REG_TIME);\n    #else\n        Wire.send(DS3231_REG_TIME);\n    #endif\n\n    #if ARDUINO >= 100\n        Wire.write(dec2bcd(second));\n        Wire.write(dec2bcd(minute));\n        Wire.write(dec2bcd(hour));\n        Wire.write(dec2bcd(dow(year, month, day)));\n        Wire.write(dec2bcd(day));\n        Wire.write(dec2bcd(month));\n        Wire.write(dec2bcd(year-2000));\n    #else\n        Wire.send(dec2bcd(second));\n        Wire.send(dec2bcd(minute));\n        Wire.send(dec2bcd(hour));\n        Wire.send(dec2bcd(dow(year, month, day)));\n        Wire.send(dec2bcd(day));\n        Wire.send(dec2bcd(month));\n        Wire.send(dec2bcd(year-2000));\n    #endif\n\n    Wire.endTransmission();\n}\n\nvoid DS3231::setDateTime(uint32_t t)\n{\n    t -= 946681200;\n\n    uint16_t year;\n    uint8_t month;\n    uint8_t day;\n    uint8_t hour;\n    uint8_t minute;\n    uint8_t second;\n\n    second = t % 60;\n    t /= 60;\n\n    minute = t % 60;\n    t /= 60;\n\n    hour = t % 24;\n    uint16_t days = t / 24;\n    uint8_t leap;\n\n    for (year = 0; ; ++year)\n    {\n        leap = year % 4 == 0;\n        if (days < 365 + leap)\n        {\n            break;\n        }\n        days -= 365 + leap;\n    }\n\n    for (month = 1; ; ++month)\n    {\n        uint8_t daysPerMonth = pgm_read_byte(daysArray + month - 1);\n\n        if (leap && month == 2)\n        {\n            ++daysPerMonth;\n        }\n\n        if (days < daysPerMonth)\n        {\n            break;\n        }\n        days -= daysPerMonth;\n    }\n\n    day = days + 1;\n\n    setDateTime(year+2000, month, day, hour, minute, second);\n}\n\n\nRTCDateTime DS3231::loadDateTimeFromLong(uint32_t t)\n{\n    t -= 946681200;\n\n    uint16_t year;\n    uint8_t month;\n    uint8_t day;\n    uint8_t hour;\n    uint8_t minute;\n    uint8_t second;\n\n    second = t % 60;\n    t /= 60;\n\n    minute = t % 60;\n    t /= 60;\n\n    hour = t % 24;\n    uint16_t days = t / 24;\n    uint8_t leap;\n\n    for (year = 0; ; ++year)\n    {\n        leap = year % 4 == 0;\n        if (days < 365 + leap)\n        {\n            break;\n        }\n        days -= 365 + leap;\n    }\n\n    for (month = 1; ; ++month)\n    {\n        uint8_t daysPerMonth = pgm_read_byte(daysArray + month - 1);\n\n        if (leap && month == 2)\n        {\n            ++daysPerMonth;\n        }\n\n        if (days < daysPerMonth)\n        {\n            break;\n        }\n        days -= daysPerMonth;\n    }\n\n    day = days + 1;\n\n    RTCDateTime temp;\n    temp.year = year+2000;\n    temp.month = month;\n    temp.day = day;\n    temp.hour = hour;\n    temp.minute = minute;\n    temp.second = second;\n\n    return temp;\n}\n\nvoid DS3231::setDateTime(const char* date, const char* time)\n{\n    uint16_t year;\n    uint8_t month;\n    uint8_t day;\n    uint8_t hour;\n    uint8_t minute;\n    uint8_t second;\n\n    year = conv2d(date + 9);\n\n    switch (date[0])\n    {\n        case 'J': month = date[1] == 'a' ? 1 : month = date[2] == 'n' ? 6 : 7; break;\n        case 'F': month = 2; break;\n        case 'A': month = date[2] == 'r' ? 4 : 8; break;\n        case 'M': month = date[2] == 'r' ? 3 : 5; break;\n        case 'S': month = 9; break;\n        case 'O': month = 10; break;\n        case 'N': month = 11; break;\n        case 'D': month = 12; break;\n    }\n\n    day = conv2d(date + 4);\n    hour = conv2d(time);\n    minute = conv2d(time + 3);\n    second = conv2d(time + 6);\n\n    setDateTime(year+2000, month, day, hour, minute, second);\n}\n\nchar* DS3231::dateFormat(const char* dateFormat, RTCDateTime dt)\n{\n    static char buffer[255];\n\n    buffer[0] = 0;\n\n    char helper[11];\n\n    while (*dateFormat != '\\0')\n    {\n        switch (dateFormat[0])\n        {\n            // Day decoder\n            case 'd':\n                sprintf(helper, \"%02d\", dt.day); \n                strcat(buffer, (const char *)helper); \n                break;\n            case 'j':\n                sprintf(helper, \"%d\", dt.day);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'l':\n                strcat(buffer, (const char *)strDayOfWeek(dt.dayOfWeek));\n                break;\n            case 'D':\n                strncat(buffer, strDayOfWeek(dt.dayOfWeek), 3);\n                break;\n            case 'N':\n                sprintf(helper, \"%d\", dt.dayOfWeek);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'w':\n                sprintf(helper, \"%d\", (dt.dayOfWeek + 7) % 7);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'z':\n                sprintf(helper, \"%d\", dayInYear(dt.year, dt.month, dt.day));\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'S':\n                strcat(buffer, (const char *)strDaySufix(dt.day));\n                break;\n\n            // Month decoder\n            case 'm':\n                sprintf(helper, \"%02d\", dt.month);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'n':\n                sprintf(helper, \"%d\", dt.month);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'F':\n                strcat(buffer, (const char *)strMonth(dt.month));\n                break;\n            case 'M':\n                strncat(buffer, (const char *)strMonth(dt.month), 3);\n                break;\n            case 't':\n                sprintf(helper, \"%d\", daysInMonth(dt.year, dt.month));\n                strcat(buffer, (const char *)helper);\n                break;\n\n            // Year decoder\n            case 'Y':\n                sprintf(helper, \"%d\", dt.year); \n                strcat(buffer, (const char *)helper); \n                break;\n            case 'y': sprintf(helper, \"%02d\", dt.year-2000);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'L':\n                sprintf(helper, \"%d\", isLeapYear(dt.year)); \n                strcat(buffer, (const char *)helper); \n                break;\n\n            // Hour decoder\n            case 'H':\n                sprintf(helper, \"%02d\", dt.hour);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'G':\n                sprintf(helper, \"%d\", dt.hour);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'h':\n                sprintf(helper, \"%02d\", hour12(dt.hour));\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'g':\n                sprintf(helper, \"%d\", hour12(dt.hour));\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'A':\n                strcat(buffer, (const char *)strAmPm(dt.hour, true));\n                break;\n            case 'a':\n                strcat(buffer, (const char *)strAmPm(dt.hour, false));\n                break;\n\n            // Minute decoder\n            case 'i': \n                sprintf(helper, \"%02d\", dt.minute);\n                strcat(buffer, (const char *)helper);\n                break;\n\n            // Second decoder\n            case 's':\n                sprintf(helper, \"%02d\", dt.second); \n                strcat(buffer, (const char *)helper); \n                break;\n\n            // Misc decoder\n            case 'U': \n                sprintf(helper, \"%lu\", dt.unixtime);\n                strcat(buffer, (const char *)helper);\n                break;\n\n            default: \n                strncat(buffer, dateFormat, 1);\n                break;\n        }\n        dateFormat++;\n    }\n\n    return buffer;\n}\n\nchar* DS3231::dateFormat(const char* dateFormat, RTCAlarmTime dt)\n{\n    static char buffer[255];\n\n    buffer[0] = 0;\n\n    char helper[11];\n\n    while (*dateFormat != '\\0')\n    {\n        switch (dateFormat[0])\n        {\n            // Day decoder\n            case 'd':\n                sprintf(helper, \"%02d\", dt.day); \n                strcat(buffer, (const char *)helper); \n                break;\n            case 'j':\n                sprintf(helper, \"%d\", dt.day);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'l':\n                strcat(buffer, (const char *)strDayOfWeek(dt.day));\n                break;\n            case 'D':\n                strncat(buffer, strDayOfWeek(dt.day), 3);\n                break;\n            case 'N':\n                sprintf(helper, \"%d\", dt.day);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'w':\n                sprintf(helper, \"%d\", (dt.day + 7) % 7);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'S':\n                strcat(buffer, (const char *)strDaySufix(dt.day));\n                break;\n\n            // Hour decoder\n            case 'H':\n                sprintf(helper, \"%02d\", dt.hour);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'G':\n                sprintf(helper, \"%d\", dt.hour);\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'h':\n                sprintf(helper, \"%02d\", hour12(dt.hour));\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'g':\n                sprintf(helper, \"%d\", hour12(dt.hour));\n                strcat(buffer, (const char *)helper);\n                break;\n            case 'A':\n                strcat(buffer, (const char *)strAmPm(dt.hour, true));\n                break;\n            case 'a':\n                strcat(buffer, (const char *)strAmPm(dt.hour, false));\n                break;\n\n            // Minute decoder\n            case 'i': \n                sprintf(helper, \"%02d\", dt.minute);\n                strcat(buffer, (const char *)helper);\n                break;\n\n            // Second decoder\n            case 's':\n                sprintf(helper, \"%02d\", dt.second); \n                strcat(buffer, (const char *)helper); \n                break;\n\n            default: \n                strncat(buffer, dateFormat, 1);\n                break;\n        }\n        dateFormat++;\n    }\n\n    return buffer;\n}\n\nRTCDateTime DS3231::getDateTime(void)\n{\n    int values[7];\n\n    Wire.beginTransmission(DS3231_ADDRESS);\n    #if ARDUINO >= 100\n        Wire.write(DS3231_REG_TIME);\n    #else\n        Wire.send(DS3231_REG_TIME);\n    #endif\n    Wire.endTransmission();\n\n    Wire.requestFrom(DS3231_ADDRESS, 7);\n\n    for (int i = 6; i >= 0; i--)\n    {\n        #if ARDUINO >= 100\n            values[i] = bcd2dec(Wire.read());\n        #else\n            values[i] = bcd2dec(Wire.receive());\n        #endif\n    }\n\n    t.year = values[0] + 2000;\n    t.month = values[1];\n    t.day = values[2];\n    t.dayOfWeek = values[3];\n    t.hour = values[4];\n    t.minute = values[5];\n    t.second = values[6];\n    t.unixtime = unixtime();\n\n    return t;\n}\n\nuint8_t DS3231::isReady(void) \n{\n    return true;\n}\n\nvoid DS3231::enableOutput(bool enabled)\n{\n    uint8_t value;\n\n    value = readRegister8(DS3231_REG_CONTROL);\n\n    value &= 0b11111011;\n    value |= (!enabled << 2);\n\n    writeRegister8(DS3231_REG_CONTROL, value);\n}\n\nvoid DS3231::setBattery(bool timeBattery, bool squareBattery)\n{\n    uint8_t value;\n\n    value = readRegister8(DS3231_REG_CONTROL);\n\n    if (squareBattery)\n    {\n        value |= 0b01000000;\n    } else\n    {\n        value &= 0b10111111;\n    }\n\n    if (timeBattery)\n    {\n        value &= 0b01111011;\n    } else\n    {\n        value |= 0b10000000;\n    }\n\n    writeRegister8(DS3231_REG_CONTROL, value);\n}\n\nbool DS3231::isOutput(void)\n{\n    uint8_t value;\n\n    value = readRegister8(DS3231_REG_CONTROL);\n\n    value &= 0b00000100;\n    value >>= 2;\n\n    return !value;\n}\n\nvoid DS3231::setOutput(DS3231_sqw_t mode)\n{\n    uint8_t value;\n\n    value = readRegister8(DS3231_REG_CONTROL);\n\n    value &= 0b11100111;\n    value |= (mode << 3);\n\n    writeRegister8(DS3231_REG_CONTROL, value);\n}\n\nDS3231_sqw_t DS3231::getOutput(void)\n{\n    uint8_t value;\n\n    value = readRegister8(DS3231_REG_CONTROL);\n\n    value &= 0b00011000;\n    value >>= 3;\n\n    return (DS3231_sqw_t)value;\n}\n\nvoid DS3231::enable32kHz(bool enabled)\n{\n    uint8_t value;\n\n    value = readRegister8(DS3231_REG_STATUS);\n\n    value &= 0b11110111;\n    value |= (enabled << 3);\n\n    writeRegister8(DS3231_REG_STATUS, value);\n}\n\nbool DS3231::is32kHz(void)\n{\n    uint8_t value;\n\n    value = readRegister8(DS3231_REG_STATUS);\n\n    value &= 0b00001000;\n    value >>= 3;\n\n    return value;\n}\n\nvoid DS3231::forceConversion(void)\n{\n    uint8_t value;\n\n    value = readRegister8(DS3231_REG_CONTROL);\n\n    value |= 0b00100000;\n\n    writeRegister8(DS3231_REG_CONTROL, value);\n\n    do {} while ((readRegister8(DS3231_REG_CONTROL) & 0b00100000) != 0);\n}\n\nfloat DS3231::readTemperature(void)\n{\n    uint8_t msb, lsb;\n\n    Wire.beginTransmission(DS3231_ADDRESS);\n    #if ARDUINO >= 100\n        Wire.write(DS3231_REG_TEMPERATURE);\n    #else\n        Wire.send(DS3231_REG_TEMPERATURE);\n    #endif\n    Wire.endTransmission();\n\n    Wire.requestFrom(DS3231_ADDRESS, 2);\n\n    #if ARDUINO >= 100\n    msb = Wire.read();\n    lsb = Wire.read();\n    #else\n    msb = Wire.receive();\n    lsb = Wire.receive();\n    #endif\n\n    return ((((short)msb << 8) | (short)lsb) >> 6) / 4.0f;\n}\n\nRTCAlarmTime DS3231::getAlarm1(void)\n{\n    uint8_t values[4];\n    RTCAlarmTime a;\n\n    Wire.beginTransmission(DS3231_ADDRESS);\n    #if ARDUINO >= 100\n        Wire.write(DS3231_REG_ALARM_1);\n    #else\n        Wire.send(DS3231_REG_ALARM_1);\n    #endif\n    Wire.endTransmission();\n\n    Wire.requestFrom(DS3231_ADDRESS, 4);\n\n    for (int i = 3; i >= 0; i--)\n    {\n        #if ARDUINO >= 100\n            values[i] = bcd2dec(Wire.read() & 0b01111111);\n        #else\n            values[i] = bcd2dec(Wire.receive() & 0b01111111);\n        #endif\n    }\n\n    a.day = values[0];\n    a.hour = values[1];\n    a.minute = values[2];\n    a.second = values[3];\n\n    return a;\n}\n\nDS3231_alarm1_t DS3231::getAlarmType1(void)\n{\n    uint8_t values[4];\n    uint8_t mode = 0;\n\n    Wire.beginTransmission(DS3231_ADDRESS);\n    #if ARDUINO >= 100\n        Wire.write(DS3231_REG_ALARM_1);\n    #else\n        Wire.send(DS3231_REG_ALARM_1);\n    #endif\n    Wire.endTransmission();\n\n    Wire.requestFrom(DS3231_ADDRESS, 4);\n\n    for (int i = 3; i >= 0; i--)\n    {\n        #if ARDUINO >= 100\n            values[i] = bcd2dec(Wire.read());\n        #else\n            values[i] = bcd2dec(Wire.receive());\n        #endif\n    }\n\n    mode |= ((values[3] & 0b01000000) >> 6);\n    mode |= ((values[2] & 0b01000000) >> 5);\n    mode |= ((values[1] & 0b01000000) >> 4);\n    mode |= ((values[0] & 0b01000000) >> 3);\n    mode |= ((values[0] & 0b00100000) >> 1);\n\n    return (DS3231_alarm1_t)mode;\n}\n\nvoid DS3231::setAlarm1(uint8_t dydw, uint8_t hour, uint8_t minute, uint8_t second, DS3231_alarm1_t mode, bool armed)\n{\n    second = dec2bcd(second);\n    minute = dec2bcd(minute);\n    hour = dec2bcd(hour);\n    dydw = dec2bcd(dydw);\n\n    switch(mode)\n    {\n        case DS3231_EVERY_SECOND:\n            second |= 0b10000000;\n            minute |= 0b10000000;\n            hour |= 0b10000000;\n            dydw |= 0b10000000;\n            break;\n\n        case DS3231_MATCH_S:\n            second &= 0b01111111;\n            minute |= 0b10000000;\n            hour |= 0b10000000;\n            dydw |= 0b10000000;\n            break;\n\n        case DS3231_MATCH_M_S:\n            second &= 0b01111111;\n            minute &= 0b01111111;\n            hour |= 0b10000000;\n            dydw |= 0b10000000;\n            break;\n\n        case DS3231_MATCH_H_M_S:\n            second &= 0b01111111;\n            minute &= 0b01111111;\n            hour &= 0b01111111;\n            dydw |= 0b10000000;\n            break;\n\n        case DS3231_MATCH_DT_H_M_S:\n            second &= 0b01111111;\n            minute &= 0b01111111;\n            hour &= 0b01111111;\n            dydw &= 0b01111111;\n            break;\n\n        case DS3231_MATCH_DY_H_M_S:\n            second &= 0b01111111;\n            minute &= 0b01111111;\n            hour &= 0b01111111;\n            dydw &= 0b01111111;\n            dydw |= 0b01000000;\n            break;\n    }\n\n    Wire.beginTransmission(DS3231_ADDRESS);\n    #if ARDUINO >= 100\n        Wire.write(DS3231_REG_ALARM_1);\n        Wire.write(second);\n        Wire.write(minute);\n        Wire.write(hour);\n        Wire.write(dydw);\n    #else\n        Wire.send(DS3231_REG_ALARM_1);\n        Wire.send(second);\n        Wire.send(minute);\n        Wire.send(hour);\n        Wire.send(dydw);\n    #endif\n\n    Wire.endTransmission();\n\n    armAlarm1(armed);\n\n    clearAlarm1();\n}\n\nbool DS3231::isAlarm1(bool clear)\n{\n    uint8_t alarm;\n\n    alarm = readRegister8(DS3231_REG_STATUS);\n    alarm &= 0b00000001;\n\n    if (alarm && clear)\n    {\n        clearAlarm1();\n    }\n\n    return alarm;\n}\n\nvoid DS3231::armAlarm1(bool armed)\n{\n    uint8_t value;\n    value = readRegister8(DS3231_REG_CONTROL);\n\n    if (armed)\n    {\n        value |= 0b00000001;\n    } else\n    {\n        value &= 0b11111110;\n    }\n\n    writeRegister8(DS3231_REG_CONTROL, value);\n}\n\nbool DS3231::isArmed1(void)\n{\n    uint8_t value;\n    value = readRegister8(DS3231_REG_CONTROL);\n    value &= 0b00000001;\n    return value;\n}\n\nvoid DS3231::clearAlarm1(void)\n{\n    uint8_t value;\n\n    value = readRegister8(DS3231_REG_STATUS);\n    value &= 0b11111110;\n\n    writeRegister8(DS3231_REG_STATUS, value);\n}\n\nRTCAlarmTime DS3231::getAlarm2(void)\n{\n    uint8_t values[3];\n    RTCAlarmTime a;\n\n    Wire.beginTransmission(DS3231_ADDRESS);\n    #if ARDUINO >= 100\n        Wire.write(DS3231_REG_ALARM_2);\n    #else\n        Wire.send(DS3231_REG_ALARM_2);\n    #endif\n    Wire.endTransmission();\n\n    Wire.requestFrom(DS3231_ADDRESS, 3);\n\n    for (int i = 2; i >= 0; i--)\n    {\n        #if ARDUINO >= 100\n            values[i] = bcd2dec(Wire.read() & 0b01111111);\n        #else\n            values[i] = bcd2dec(Wire.receive() & 0b01111111);\n        #endif\n    }\n\n    a.day = values[0];\n    a.hour = values[1];\n    a.minute = values[2];\n    a.second = 0;\n\n    return a;\n}\n\nDS3231_alarm2_t DS3231::getAlarmType2(void)\n{\n    uint8_t values[3];\n    uint8_t mode = 0;\n\n    Wire.beginTransmission(DS3231_ADDRESS);\n    #if ARDUINO >= 100\n        Wire.write(DS3231_REG_ALARM_2);\n    #else\n        Wire.send(DS3231_REG_ALARM_2);\n    #endif\n    Wire.endTransmission();\n\n    Wire.requestFrom(DS3231_ADDRESS, 3);\n\n    for (int i = 2; i >= 0; i--)\n    {\n        #if ARDUINO >= 100\n            values[i] = bcd2dec(Wire.read());\n        #else\n            values[i] = bcd2dec(Wire.receive());\n        #endif\n    }\n\n    mode |= ((values[2] & 0b01000000) >> 5);\n    mode |= ((values[1] & 0b01000000) >> 4);\n    mode |= ((values[0] & 0b01000000) >> 3);\n    mode |= ((values[0] & 0b00100000) >> 1);\n\n    return (DS3231_alarm2_t)mode;\n}\n\nvoid DS3231::setAlarm2(uint8_t dydw, uint8_t hour, uint8_t minute, DS3231_alarm2_t mode, bool armed)\n{\n    minute = dec2bcd(minute);\n    hour = dec2bcd(hour);\n    dydw = dec2bcd(dydw);\n\n    switch(mode)\n    {\n        case DS3231_EVERY_MINUTE:\n            minute |= 0b10000000;\n            hour |= 0b10000000;\n            dydw |= 0b10000000;\n            break;\n\n        case DS3231_MATCH_M:\n            minute &= 0b01111111;\n            hour |= 0b10000000;\n            dydw |= 0b10000000;\n            break;\n\n        case DS3231_MATCH_H_M:\n            minute &= 0b01111111;\n            hour &= 0b01111111;\n            dydw |= 0b10000000;\n            break;\n\n        case DS3231_MATCH_DT_H_M:\n            minute &= 0b01111111;\n            hour &= 0b01111111;\n            dydw &= 0b01111111;\n            break;\n\n        case DS3231_MATCH_DY_H_M:\n            minute &= 0b01111111;\n            hour &= 0b01111111;\n            dydw &= 0b01111111;\n            dydw |= 0b01000000;\n            break;\n    }\n\n    Wire.beginTransmission(DS3231_ADDRESS);\n    #if ARDUINO >= 100\n        Wire.write(DS3231_REG_ALARM_2);\n        Wire.write(minute);\n        Wire.write(hour);\n        Wire.write(dydw);\n    #else\n        Wire.send(DS3231_REG_ALARM_2);\n        Wire.send(minute);\n        Wire.send(hour);\n        Wire.send(dydw);\n    #endif\n\n    Wire.endTransmission();\n\n    armAlarm2(armed);\n\n    clearAlarm2();\n}\n\nvoid DS3231::armAlarm2(bool armed)\n{\n    uint8_t value;\n    value = readRegister8(DS3231_REG_CONTROL);\n\n    if (armed)\n    {\n        value |= 0b00000010;\n    } else\n    {\n        value &= 0b11111101;\n    }\n\n    writeRegister8(DS3231_REG_CONTROL, value);\n}\n\nbool DS3231::isArmed2(void)\n{\n    uint8_t value;\n    value = readRegister8(DS3231_REG_CONTROL);\n    value &= 0b00000010;\n    value >>= 1;\n    return value;\n}\n\n\nvoid DS3231::clearAlarm2(void)\n{\n    uint8_t value;\n\n    value = readRegister8(DS3231_REG_STATUS);\n    value &= 0b11111101;\n\n    writeRegister8(DS3231_REG_STATUS, value);\n}\n\n\nbool DS3231::isAlarm2(bool clear)\n{\n    uint8_t alarm;\n\n    alarm = readRegister8(DS3231_REG_STATUS);\n    alarm &= 0b00000010;\n\n    if (alarm && clear)\n    {\n        clearAlarm2();\n    }\n\n    return alarm;\n}\n\nuint8_t DS3231::bcd2dec(uint8_t bcd)\n{\n    return ((bcd / 16) * 10) + (bcd % 16);\n}\n\nuint8_t DS3231::dec2bcd(uint8_t dec)\n{\n    return ((dec / 10) * 16) + (dec % 10);\n}\n\nchar *DS3231::strDayOfWeek(uint8_t dayOfWeek)\n{\n    switch (dayOfWeek) {\n        case 1:\n            return (char*) \"Monday\";\n            break;\n        case 2:\n            return (char*) \"Tuesday\";\n            break;\n        case 3:\n            return (char*) \"Wednesday\";\n            break;\n        case 4:\n            return (char*) \"Thursday\";\n            break;\n        case 5:\n            return (char*) \"Friday\";\n            break;\n        case 6:\n            return (char*) \"Saturday\";\n            break;\n        case 7:\n            return (char*) \"Sunday\";\n            break;\n        default:\n            return (char*) \"Unknown\";\n    }\n}\n\nchar *DS3231::strMonth(uint8_t month)\n{\n    switch (month) {\n        case 1:\n            return (char*) \"January\";\n            break;\n        case 2:\n            return (char*) \"February\";\n            break;\n        case 3:\n            return (char*) \"March\";\n            break;\n        case 4:\n            return (char*) \"April\";\n            break;\n        case 5:\n            return (char*) \"May\";\n            break;\n        case 6:\n            return (char*) \"June\";\n            break;\n        case 7:\n            return (char*) \"July\";\n            break;\n        case 8:\n            return (char*) \"August\";\n            break;\n        case 9:\n            return (char*) \"September\";\n            break;\n        case 10:\n            return (char*) \"October\";\n            break;\n        case 11:\n            return (char*) \"November\";\n            break;\n        case 12:\n            return (char*) \"December\";\n            break;\n        default:\n            return (char*) \"Unknown\";\n    }\n}\n\nchar *DS3231::strAmPm(uint8_t hour, bool uppercase)\n{\n    if (hour < 12)\n    {\n        if (uppercase)\n        {\n            return (char*) \"AM\";\n        } else\n        {\n            return (char*) \"am\";\n        }\n    } else\n    {\n        if (uppercase)\n        {\n            return (char*) \"PM\";\n        } else\n        {\n            return (char*) \"pm\";\n        }\n    }\n}\n\nchar *DS3231::strDaySufix(uint8_t day)\n{\n     if (day >= 11 && day <= 13)\n     {\n         return (char*) \"th\";\n     }\n\n     switch (day % 10)\n     {\n         case 1:\n             return (char*) \"st\";\n             break;\n         case 2:\n             return (char*) \"nd\";\n             break;\n         case 3:\n             return (char*) \"rd\";\n             break;\n         default:\n             return (char*) \"th\";\n         break;\n      }\n}\n\nuint8_t DS3231::hour12(uint8_t hour24)\n{\n    if (hour24 == 0)\n    {\n        return 12;\n    }\n\n    if (hour24 > 12)\n    {\n       return (hour24 - 12);\n    }\n\n    return hour24;\n}\n\nlong DS3231::time2long(uint16_t days, uint8_t hours, uint8_t minutes, uint8_t seconds)\n{\n    return ((days * 24L + hours) * 60 + minutes) * 60 + seconds;\n}\n\nuint16_t DS3231::dayInYear(uint16_t year, uint8_t month, uint8_t day)\n{\n    uint16_t fromDate;\n    uint16_t toDate;\n\n    fromDate = date2days(year, 1, 1);\n    toDate = date2days(year, month, day);\n\n    return (toDate - fromDate);\n}\n\nbool DS3231::isLeapYear(uint16_t year)\n{\n    return (year % 4 == 0);\n}\n\nuint8_t DS3231::daysInMonth(uint16_t year, uint8_t month)\n{\n    uint8_t days;\n\n    days = pgm_read_byte(daysArray + month - 1);\n\n    if ((month == 2) && isLeapYear(year))\n    {\n        ++days;\n    }\n\n    return days;\n}\n\nuint16_t DS3231::date2days(uint16_t year, uint8_t month, uint8_t day)\n{\n    year = year - 2000;\n\n    uint16_t days16 = day;\n\n    for (uint8_t i = 1; i < month; ++i)\n    {\n        days16 += pgm_read_byte(daysArray + i - 1);\n        if ((month == 1) && isLeapYear(year))\n        {\n            ++days16;\n        }\n    }\n\n    return days16 + 365 * year + (year + 3) / 4 - 1;\n}\n\nuint32_t DS3231::unixtime(void)\n{\n    uint32_t u;\n\n    u = time2long(date2days(t.year, t.month, t.day), t.hour, t.minute, t.second);\n    u += 946681200;\n\n    return u;\n}\n\nuint8_t DS3231::conv2d(const char* p)\n{\n    uint8_t v = 0;\n\n    if ('0' <= *p && *p <= '9')\n    {\n        v = *p - '0';\n    }\n\n    return 10 * v + *++p - '0';\n}\n\nuint8_t DS3231::dow(uint16_t y, uint8_t m, uint8_t d)\n{\n    uint8_t dow;\n\n    y -= m < 3;\n    dow = ((y + y/4 - y/100 + y/400 + pgm_read_byte(dowArray+(m-1)) + d) % 7);\n\n    if (dow == 0)\n    {\n        return 7;\n    }\n\n    return dow;\n}\n\nvoid DS3231::writeRegister8(uint8_t reg, uint8_t value)\n{\n    Wire.beginTransmission(DS3231_ADDRESS);\n    #if ARDUINO >= 100\n        Wire.write(reg);\n        Wire.write(value);\n    #else\n        Wire.send(reg);\n        Wire.send(value);\n    #endif\n    Wire.endTransmission();\n}\n\nuint8_t DS3231::readRegister8(uint8_t reg)\n{\n    uint8_t value;\n    Wire.beginTransmission(DS3231_ADDRESS);\n    #if ARDUINO >= 100\n        Wire.write(reg);\n    #else\n        Wire.send(reg);\n    #endif\n    Wire.endTransmission();\n\n    Wire.requestFrom(DS3231_ADDRESS, 1);\n\n    #if ARDUINO >= 100\n        value = Wire.read();\n    #else\n        value = Wire.receive();\n    #endif\n\n    return value;\n}\n"
    }, {
      filename: "src/Lepton-RTC-DS3231/DS3231.h",
      code: "/*\n\nThe MIT License\n\nCopyright (c) 2014-2023 Korneliusz Jarzębski\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n*/\n\n\n#ifndef DS3231_h\n#define DS3231_h\n\n#if ARDUINO >= 100\n#include \"Arduino.h\"\n#else\n#include \"WProgram.h\"\n#endif\n\n#define DS3231_ADDRESS              (0x68)\n\n#define DS3231_REG_TIME             (0x00)\n#define DS3231_REG_ALARM_1          (0x07)\n#define DS3231_REG_ALARM_2          (0x0B)\n#define DS3231_REG_CONTROL          (0x0E)\n#define DS3231_REG_STATUS           (0x0F)\n#define DS3231_REG_TEMPERATURE      (0x11)\n\n#ifndef RTCDATETIME_STRUCT_H\n#define RTCDATETIME_STRUCT_H\nstruct RTCDateTime\n{\n    uint16_t year;\n    uint8_t month;\n    uint8_t day;\n    uint8_t hour;\n    uint8_t minute;\n    uint8_t second;\n    uint8_t dayOfWeek;\n    uint32_t unixtime;\n};\n\nstruct RTCAlarmTime\n{\n    uint8_t day;\n    uint8_t hour;\n    uint8_t minute;\n    uint8_t second;\n};\n#endif\n\ntypedef enum\n{\n    DS3231_1HZ          = 0x00,\n    DS3231_4096HZ       = 0x01,\n    DS3231_8192HZ       = 0x02,\n    DS3231_32768HZ      = 0x03\n} DS3231_sqw_t;\n\ntypedef enum\n{\n    DS3231_EVERY_SECOND   = 0b00001111,\n    DS3231_MATCH_S        = 0b00001110,\n    DS3231_MATCH_M_S      = 0b00001100,\n    DS3231_MATCH_H_M_S    = 0b00001000,\n    DS3231_MATCH_DT_H_M_S = 0b00000000,\n    DS3231_MATCH_DY_H_M_S = 0b00010000\n} DS3231_alarm1_t;\n\ntypedef enum\n{\n    DS3231_EVERY_MINUTE   = 0b00001110,\n    DS3231_MATCH_M        = 0b00001100,\n    DS3231_MATCH_H_M      = 0b00001000,\n    DS3231_MATCH_DT_H_M   = 0b00000000,\n    DS3231_MATCH_DY_H_M   = 0b00010000\n} DS3231_alarm2_t;\n\nclass DS3231\n{\n    public:\n\n\tbool begin(void);\n\n\tvoid setDateTime(uint16_t year, uint8_t month, uint8_t day, uint8_t hour, uint8_t minute, uint8_t second);\n\tvoid setDateTime(uint32_t t);\n\tvoid setDateTime(const char* date, const char* time);\n\tRTCDateTime getDateTime(void);\n\tuint8_t isReady(void);\n\n\tDS3231_sqw_t getOutput(void);\n\tvoid setOutput(DS3231_sqw_t mode);\n\tvoid enableOutput(bool enabled);\n\tbool isOutput(void);\n\tvoid enable32kHz(bool enabled);\n\tbool is32kHz(void);\n\n\tvoid forceConversion(void);\n\tfloat readTemperature(void);\n\n\tvoid setAlarm1(uint8_t dydw, uint8_t hour, uint8_t minute, uint8_t second, DS3231_alarm1_t mode, bool armed = true);\n\tRTCAlarmTime getAlarm1(void);\n\tDS3231_alarm1_t getAlarmType1(void);\n\tbool isAlarm1(bool clear = true);\n\tvoid armAlarm1(bool armed);\n\tbool isArmed1(void);\n\tvoid clearAlarm1(void);\n\n\tvoid setAlarm2(uint8_t dydw, uint8_t hour, uint8_t minute, DS3231_alarm2_t mode, bool armed = true);\n\tRTCAlarmTime getAlarm2(void);\n\tDS3231_alarm2_t getAlarmType2(void);\n\tbool isAlarm2(bool clear = true);\n\tvoid armAlarm2(bool armed);\n\tbool isArmed2(void);\n\tvoid clearAlarm2(void);\n\n\tvoid setBattery(bool timeBattery, bool squareBattery);\n\n\tchar* dateFormat(const char* dateFormat, RTCDateTime dt);\n\tchar* dateFormat(const char* dateFormat, RTCAlarmTime dt);\n\n\tstatic RTCDateTime loadDateTimeFromLong(uint32_t t);\n\n    private:\n\tRTCDateTime t;\n\n\tchar *strDayOfWeek(uint8_t dayOfWeek);\n\tchar *strMonth(uint8_t month);\n\tchar *strAmPm(uint8_t hour, bool uppercase);\n\tchar *strDaySufix(uint8_t day);\n\n\tuint8_t hour12(uint8_t hour24);\n\tuint8_t bcd2dec(uint8_t bcd);\n\tuint8_t dec2bcd(uint8_t dec);\n\n\tlong time2long(uint16_t days, uint8_t hours, uint8_t minutes, uint8_t seconds);\n\tuint16_t date2days(uint16_t year, uint8_t month, uint8_t day);\n\tuint8_t daysInMonth(uint16_t year, uint8_t month);\n\tuint16_t dayInYear(uint16_t year, uint8_t month, uint8_t day);\n\tbool isLeapYear(uint16_t year);\n\tuint8_t dow(uint16_t y, uint8_t m, uint8_t d);\n\n\tuint32_t unixtime(void);\n\tuint8_t conv2d(const char* p);\n\n\tvoid writeRegister8(uint8_t reg, uint8_t value);\n\tuint8_t readRegister8(uint8_t reg);\n};\n\n#endif\n"
    }]
  };
  const extFacePanels = {};
  const ExtHandler = {
    onLoad: function onLoad(app, target) {
      const that = this;

      if (!that.__workerSetupInstance) {
        that.__workerSetupInstance = that.workerSetup({
          app
        }).then(() => {
          that.worker.remote.runExtension('onLoad', target.id);
        });
      }
    },
    onUnload: function onUnload(app) {
      this.__workerSetupInstance = null;
      this.worker.remote.runExtension('onUnload');
      this.worker.dispose();
    },
    onConnect: function onConnect(app, device) {
      this.worker.remote.runExtension('onConnect', device.id);
    },
    onDisconnect: function onDisconnect(app, device) {
      this.worker.remote.runExtension('onDisconnect', device.id);
    },
    onStopAll: function onStopAll(app, device) {
      this.worker.remote.runExtension('onStopAll', device.id);
    },
    beforeChangeUploadMode: function beforeChangeUploadMode(app, device) {
      return this.worker.remote.runExtension('beforeChangeUploadMode', device.id);
    },
    beforeChangeDebugMode: function beforeChangeDebugMode(app, device) {
      return this.worker.remote.runExtension('beforeChangeDebugMode', device.id);
    },
    afterChangeUploadMode: function afterChangeUploadMode(app, device) {
      this.worker.remote.runExtension('afterChangeUploadMode', device.id);
    },
    afterChangeDebugMode: function afterChangeDebugMode(app, device) {
      this.worker.remote.runExtension('afterChangeDebugMode', device.id);
    },
    onSelect: function onSelect(app, device) {
      if (!this.worker) {
        setTimeout(() => {
          this.onSelect(app, device);
        }, 200);
        return;
      }

      this.worker.remote.runExtension('onSelect', device.id);
    },
    onUnselect: function onUnselect(app, device) {
      this.worker.remote.runExtension('onUnselect', device.id);
    },
    beforeCodeUpload: function beforeCodeUpload(app, device) {
      this.worker.remote.runExtension('beforeCodeUpload', device.id);
    },
    afterCodeUpload: function afterCodeUpload(app, device) {
      this.worker.remote.runExtension('afterCodeUpload', device.id);
    },
    onRead: function onRead(app, device) {
      this.worker.remote.runExtension('onRead', device.id);
    },
    beforeFirmwareUpdate: function beforeFirmwareUpdate(app, device) {
      this.worker.remote.runExtension('beforeFirmwareUpdate', device.id);
    },
    afterFirmwareUpdate: function afterFirmwareUpdate(app, device) {
      this.worker.remote.runExtension('afterFirmwareUpdate', device.id);
    }
  };

  class ExtLeptonRtcDs3231 {
    constructor() {
      this.checkFirmwareInForce = typeof checkFirmwareInForce !== 'undefined' ? checkFirmwareInForce : false;
      const handlerProxyUrl = window.MbApi.getExtResPath('lepton_rtc_ds3231/handlerProxy.js', 'lepton_rtc_ds3231');
      const that = this;

      that.workerSetup = async function (exports) {
        that.worker = await window.__web_worker_rpc.create(handlerProxyUrl, exports).then(worker => {
          worker.CONFIG.TIMEOUT = 42000;
          worker.CONFIG.HEARTBEAT = 4200;

          worker.onFail = () => {
            that.worker = null;
            that.workerSetup(exports);
            const app = exports.app;

            if (app) {
              app.workspace.resetEvents();
            }
          };

          return worker;
        });
      };

      this.funcs = {
        'BLOCK_1712698492010': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1712698492010', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713188274574': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713188274574', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713174673422': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713174673422', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713175967062': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713175967062', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        }
      };
    }

    getInfo() {
      return {
        "id": "lepton_rtc_ds3231",
        "targets": [{
          "name": "arduino_uno",
          "options": {
            "upload": {
              "middlewares": [{
                "name": "arduino",
                "params": {
                  "sources": extSources.arduino
                }
              }]
            }
          }
        }],
        "codeTypes": ["arduinoc"],
        "version": "0.0.1",
        "platform": ["mblockpc", "mblockweb"],
        "categories": [{
          "name": "cate_d7a41440",
          "colors": ["#008080", "#007373", "#006666"],
          "menuIconURI": window.MbApi.getExtResPath('lepton_rtc_ds3231/imgs/c92a321d_clock-regular.svg', 'lepton_rtc_ds3231'),
          "blockIcon": {
            "type": "image",
            "width": 28,
            "height": 26,
            "src": window.MbApi.getExtResPath('lepton_rtc_ds3231/imgs/1b272a1f_clock-regular (2).svg', 'lepton_rtc_ds3231')
          },
          "blocks": [{
            "opcode": "BLOCK_1712698492010",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {},
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "sections": {
                  "include": ["\"src/Lepton-RTC-DS3231/DS3231.h\""],
                  "declare": `DS3231 lepton_clock;\nRTCDateTime lepton_dt;`,
                  "setup": `lepton_clock.begin();`
                }
              }
            },
            "handler": this.funcs.BLOCK_1712698492010
          }, {
            "opcode": "BLOCK_1713188274574",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "year": {
                "type": "number",
                "defaultValue": 2024
              },
              "month": {
                "type": "number",
                "defaultValue": 12
              },
              "date": {
                "type": "number",
                "defaultValue": 31
              },
              "hour": {
                "type": "number",
                "defaultValue": 23
              },
              "minute": {
                "type": "number",
                "defaultValue": 59
              },
              "second": {
                "type": "number",
                "defaultValue": 59
              }
            },
            "branchCount": 0,
            "platform": ["mblockweb", "mblockpc"],
            "codes": {
              "arduinoc": {
                "sections": {
                  "setup": `lepton_clock.setDateTime(/*{year}*/, /*{month}*/, /*{date}*/, /*{hour}*/, /*{minute}*/, /*{second}*/);`
                }
              }
            },
            "handler": this.funcs.BLOCK_1713188274574
          }, {
            "opcode": "BLOCK_1713174673422",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {},
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_dt = lepton_clock.getDateTime();`
              }
            },
            "handler": this.funcs.BLOCK_1713174673422
          }, {
            "opcode": "BLOCK_1713175967062",
            "blockType": "number",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "field": {
                "type": "fieldMenu",
                "defaultValue": "second",
                "menu": "BLOCK_1713175967062_FIELD"
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_dt./*{field}*/`
              }
            },
            "handler": this.funcs.BLOCK_1713175967062
          }],
          "menus": {
            "BLOCK_1713175967062_FIELD": [{
              "text": "BLOCK_1713175967062_FIELD_0",
              "value": "year"
            }, {
              "text": "BLOCK_1713175967062_FIELD_1",
              "value": "month"
            }, {
              "text": "BLOCK_1713175967062_FIELD_2",
              "value": "day"
            }, {
              "text": "BLOCK_1713175967062_FIELD_3",
              "value": "hour"
            }, {
              "text": "BLOCK_1713175967062_FIELD_4",
              "value": "minute"
            }, {
              "text": "BLOCK_1713175967062_FIELD_5",
              "value": "second"
            }, {
              "text": "BLOCK_1713175967062_FIELD_6",
              "value": "dayOfWeek"
            }, {
              "text": "BLOCK_1713175967062_FIELD_7",
              "value": "unixtime"
            }]
          }
        }],
        "generators": extGenerators,
        "translationMap": extTranslationMap,
        "snippets": codeSnippets,
        "generatorStartBlocks": [],
        "feature": ["worker"],
        "mustLoginBlocks": [],
        "disabledOffline": [],
        "disabledOnline": []
      };
    }

    getHandler() {
      if (typeof ExtHandler === 'object') {
        return ExtHandler;
      } else if (typeof ExtHandler === 'function') {
        return new ExtHandler();
      }
    }

  }

  var _default = ExtLeptonRtcDs3231;
  _exports.default = _default;
});