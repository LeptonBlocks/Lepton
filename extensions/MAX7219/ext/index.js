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
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "de": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "es": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "fr": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "id": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "ja": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "ja-jph": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "ko": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "pl": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "uk": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "zh-hant": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "nl": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "it": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "hr": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "ru": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "pt": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "fi": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "tr": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "tk": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
    },
    "en": {
      "lepton_max7219": "Lepton MAX7219",
      "extensionName": "Lepton MAX7219",
      "extensionDescription": "Controls one or multiple LED matrix displays.",
      "BLOCK_1719039285417": "Init #[num] DIN: [din]  CS: [cs] CLK: [clk] Panels (1-8): [panels] ",
      "BLOCK_1719040511271": "Draw #[num] Panel [panel]   [figure] ",
      "BLOCK_1719044216290": "Set brightness #[num] Panel [panel] value (0-15) [value] ",
      "BLOCK_1719043487366_POWERDOWN_0": "on",
      "BLOCK_1719043487366_POWERDOWN_1": "off",
      "BLOCK_1719043487366": "Turn #[num] Panel [panel]  [powerDown] ",
      "BLOCK_1719043877542_ON_0": "on",
      "BLOCK_1719043877542_ON_1": "off",
      "BLOCK_1719043877542": "Set LED #[num] Panel [panel] row (1-8) [row] column (1-8) [col] [on] ",
      "cate_e7a05eef": "💫 MAX7219"
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
      filename: "src/Lepton-MAX7219/LedControl.h",
      code: "/*\n *    LedControl.h - A library for controling Leds with a MAX7219/MAX7221\n *    Copyright (c) 2007 Eberhard Fahle\n * \n *    Permission is hereby granted, free of charge, to any person\n *    obtaining a copy of this software and associated documentation\n *    files (the \"Software\"), to deal in the Software without\n *    restriction, including without limitation the rights to use,\n *    copy, modify, merge, publish, distribute, sublicense, and/or sell\n *    copies of the Software, and to permit persons to whom the\n *    Software is furnished to do so, subject to the following\n *    conditions:\n * \n *    This permission notice shall be included in all copies or \n *    substantial portions of the Software.\n * \n *    THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,\n *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES\n *    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\n *    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT\n *    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\n *    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\n *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR\n *    OTHER DEALINGS IN THE SOFTWARE.\n */\n\n#ifndef LedControl_h\n#define LedControl_h\n\n#include <avr/pgmspace.h>\n\n#if (ARDUINO >= 100)\n#include <Arduino.h>\n#else\n#include <WProgram.h>\n#endif\n\n/*\n * Segments to be switched on for characters and digits on\n * 7-Segment Displays\n */\nconst static byte charTable [] PROGMEM  = {\n    B01111110,B00110000,B01101101,B01111001,B00110011,B01011011,B01011111,B01110000,\n    B01111111,B01111011,B01110111,B00011111,B00001101,B00111101,B01001111,B01000111,\n    B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,\n    B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,\n    B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,\n    B00000000,B00000000,B00000000,B00000000,B10000000,B00000001,B10000000,B00000000,\n    B01111110,B00110000,B01101101,B01111001,B00110011,B01011011,B01011111,B01110000,\n    B01111111,B01111011,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,\n    B00000000,B01110111,B00011111,B00001101,B00111101,B01001111,B01000111,B00000000,\n    B00110111,B00000000,B00000000,B00000000,B00001110,B00000000,B00000000,B00000000,\n    B01100111,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,\n    B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00001000,\n    B00000000,B01110111,B00011111,B00001101,B00111101,B01001111,B01000111,B00000000,\n    B00110111,B00000000,B00000000,B00000000,B00001110,B00000000,B00010101,B00011101,\n    B01100111,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,\n    B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000,B00000000\n};\n\nclass LedControl {\n    private :\n        /* The array for shifting the data to the devices */\n        byte spidata[16];\n        /* Send out a single command to the device */\n        void spiTransfer(int addr, byte opcode, byte data);\n\n        /* We keep track of the led-status for all 8 devices in this array */\n        byte status[64];\n        /* Data is shifted out of this pin*/\n        int SPI_MOSI;\n        /* The clock is signaled on this pin */\n        int SPI_CLK;\n        /* This one is driven LOW for chip selectzion */\n        int SPI_CS;\n        /* The maximum number of devices we use */\n        int maxDevices;\n\n    public:\n        /* \n         * Create a new controler \n         * Params :\n         * dataPin\t\tpin on the Arduino where data gets shifted out\n         * clockPin\t\tpin for the clock\n         * csPin\t\tpin for selecting the device \n         * numDevices\tmaximum number of devices that can be controled\n         */\n        LedControl(int dataPin, int clkPin, int csPin, int numDevices=1);\n\n        /*\n         * Gets the number of devices attached to this LedControl.\n         * Returns :\n         * int\tthe number of devices on this LedControl\n         */\n        int getDeviceCount();\n\n        /* \n         * Set the shutdown (power saving) mode for the device\n         * Params :\n         * addr\tThe address of the display to control\n         * status\tIf true the device goes into power-down mode. Set to false\n         *\t\tfor normal operation.\n         */\n        void shutdown(int addr, bool status);\n\n        /* \n         * Set the number of digits (or rows) to be displayed.\n         * See datasheet for sideeffects of the scanlimit on the brightness\n         * of the display.\n         * Params :\n         * addr\taddress of the display to control\n         * limit\tnumber of digits to be displayed (1..8)\n         */\n        void setScanLimit(int addr, int limit);\n\n        /* \n         * Set the brightness of the display.\n         * Params:\n         * addr\t\tthe address of the display to control\n         * intensity\tthe brightness of the display. (0..15)\n         */\n        void setIntensity(int addr, int intensity);\n\n        /* \n         * Switch all Leds on the display off. \n         * Params:\n         * addr\taddress of the display to control\n         */\n        void clearDisplay(int addr);\n\n        /* \n         * Set the status of a single Led.\n         * Params :\n         * addr\taddress of the display \n         * row\tthe row of the Led (0..7)\n         * col\tthe column of the Led (0..7)\n         * state\tIf true the led is switched on, \n         *\t\tif false it is switched off\n         */\n        void setLed(int addr, int row, int col, boolean state);\n\n        /* \n         * Set all 8 Led's in a row to a new state\n         * Params:\n         * addr\taddress of the display\n         * row\trow which is to be set (0..7)\n         * value\teach bit set to 1 will light up the\n         *\t\tcorresponding Led.\n         */\n        void setRow(int addr, int row, byte value);\n\n        /* \n         * Set all 8 Led's in a column to a new state\n         * Params:\n         * addr\taddress of the display\n         * col\tcolumn which is to be set (0..7)\n         * value\teach bit set to 1 will light up the\n         *\t\tcorresponding Led.\n         */\n        void setColumn(int addr, int col, byte value);\n\n        /* \n         * Display a hexadecimal digit on a 7-Segment Display\n         * Params:\n         * addr\taddress of the display\n         * digit\tthe position of the digit on the display (0..7)\n         * value\tthe value to be displayed. (0x00..0x0F)\n         * dp\tsets the decimal point.\n         */\n        void setDigit(int addr, int digit, byte value, boolean dp);\n\n        /* \n         * Display a character on a 7-Segment display.\n         * There are only a few characters that make sense here :\n         *\t'0','1','2','3','4','5','6','7','8','9','0',\n         *  'A','b','c','d','E','F','H','L','P',\n         *  '.','-','_',' ' \n         * Params:\n         * addr\taddress of the display\n         * digit\tthe position of the character on the display (0..7)\n         * value\tthe character to be displayed. \n         * dp\tsets the decimal point.\n         */\n        void setChar(int addr, int digit, char value, boolean dp);\n};\n\n#endif\t//LedControl.h\n\n\n\n"
    }, {
      filename: "src/Lepton-MAX7219/LedControl.cpp",
      code: "/*\n *    LedControl.cpp - A library for controling Leds with a MAX7219/MAX7221\n *    Copyright (c) 2007 Eberhard Fahle\n * \n *    Permission is hereby granted, free of charge, to any person\n *    obtaining a copy of this software and associated documentation\n *    files (the \"Software\"), to deal in the Software without\n *    restriction, including without limitation the rights to use,\n *    copy, modify, merge, publish, distribute, sublicense, and/or sell\n *    copies of the Software, and to permit persons to whom the\n *    Software is furnished to do so, subject to the following\n *    conditions:\n * \n *    This permission notice shall be included in all copies or \n *    substantial portions of the Software.\n * \n *    THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND,\n *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES\n *    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND\n *    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT\n *    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,\n *    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING\n *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR\n *    OTHER DEALINGS IN THE SOFTWARE.\n */\n\n\n#include \"LedControl.h\"\n\n//the opcodes for the MAX7221 and MAX7219\n#define OP_NOOP   0\n#define OP_DIGIT0 1\n#define OP_DIGIT1 2\n#define OP_DIGIT2 3\n#define OP_DIGIT3 4\n#define OP_DIGIT4 5\n#define OP_DIGIT5 6\n#define OP_DIGIT6 7\n#define OP_DIGIT7 8\n#define OP_DECODEMODE  9\n#define OP_INTENSITY   10\n#define OP_SCANLIMIT   11\n#define OP_SHUTDOWN    12\n#define OP_DISPLAYTEST 15\n\nLedControl::LedControl(int dataPin, int clkPin, int csPin, int numDevices) {\n    SPI_MOSI=dataPin;\n    SPI_CLK=clkPin;\n    SPI_CS=csPin;\n    if(numDevices<=0 || numDevices>8 )\n        numDevices=8;\n    maxDevices=numDevices;\n    pinMode(SPI_MOSI,OUTPUT);\n    pinMode(SPI_CLK,OUTPUT);\n    pinMode(SPI_CS,OUTPUT);\n    digitalWrite(SPI_CS,HIGH);\n    SPI_MOSI=dataPin;\n    for(int i=0;i<64;i++) \n        status[i]=0x00;\n    for(int i=0;i<maxDevices;i++) {\n        spiTransfer(i,OP_DISPLAYTEST,0);\n        //scanlimit is set to max on startup\n        setScanLimit(i,7);\n        //decode is done in source\n        spiTransfer(i,OP_DECODEMODE,0);\n        clearDisplay(i);\n        //we go into shutdown-mode on startup\n        shutdown(i,true);\n    }\n}\n\nint LedControl::getDeviceCount() {\n    return maxDevices;\n}\n\nvoid LedControl::shutdown(int addr, bool b) {\n    if(addr<0 || addr>=maxDevices)\n        return;\n    if(b)\n        spiTransfer(addr, OP_SHUTDOWN,0);\n    else\n        spiTransfer(addr, OP_SHUTDOWN,1);\n}\n\nvoid LedControl::setScanLimit(int addr, int limit) {\n    if(addr<0 || addr>=maxDevices)\n        return;\n    if(limit>=0 && limit<8)\n        spiTransfer(addr, OP_SCANLIMIT,limit);\n}\n\nvoid LedControl::setIntensity(int addr, int intensity) {\n    if(addr<0 || addr>=maxDevices)\n        return;\n    if(intensity>=0 && intensity<16)\t\n        spiTransfer(addr, OP_INTENSITY,intensity);\n}\n\nvoid LedControl::clearDisplay(int addr) {\n    int offset;\n\n    if(addr<0 || addr>=maxDevices)\n        return;\n    offset=addr*8;\n    for(int i=0;i<8;i++) {\n        status[offset+i]=0;\n        spiTransfer(addr, i+1,status[offset+i]);\n    }\n}\n\nvoid LedControl::setLed(int addr, int row, int column, boolean state) {\n    int offset;\n    byte val=0x00;\n\n    if(addr<0 || addr>=maxDevices)\n        return;\n    if(row<0 || row>7 || column<0 || column>7)\n        return;\n    offset=addr*8;\n    val=B10000000 >> column;\n    if(state)\n        status[offset+row]=status[offset+row]|val;\n    else {\n        val=~val;\n        status[offset+row]=status[offset+row]&val;\n    }\n    spiTransfer(addr, row+1,status[offset+row]);\n}\n\nvoid LedControl::setRow(int addr, int row, byte value) {\n    int offset;\n    if(addr<0 || addr>=maxDevices)\n        return;\n    if(row<0 || row>7)\n        return;\n    offset=addr*8;\n    status[offset+row]=value;\n    spiTransfer(addr, row+1,status[offset+row]);\n}\n\nvoid LedControl::setColumn(int addr, int col, byte value) {\n    byte val;\n\n    if(addr<0 || addr>=maxDevices)\n        return;\n    if(col<0 || col>7) \n        return;\n    for(int row=0;row<8;row++) {\n        val=value >> (7-row);\n        val=val & 0x01;\n        setLed(addr,row,col,val);\n    }\n}\n\nvoid LedControl::setDigit(int addr, int digit, byte value, boolean dp) {\n    int offset;\n    byte v;\n\n    if(addr<0 || addr>=maxDevices)\n        return;\n    if(digit<0 || digit>7 || value>15)\n        return;\n    offset=addr*8;\n    v=pgm_read_byte_near(charTable + value); \n    if(dp)\n        v|=B10000000;\n    status[offset+digit]=v;\n    spiTransfer(addr, digit+1,v);\n}\n\nvoid LedControl::setChar(int addr, int digit, char value, boolean dp) {\n    int offset;\n    byte index,v;\n\n    if(addr<0 || addr>=maxDevices)\n        return;\n    if(digit<0 || digit>7)\n        return;\n    offset=addr*8;\n    index=(byte)value;\n    if(index >127) {\n        //no defined beyond index 127, so we use the space char\n        index=32;\n    }\n    v=pgm_read_byte_near(charTable + index); \n    if(dp)\n        v|=B10000000;\n    status[offset+digit]=v;\n    spiTransfer(addr, digit+1,v);\n}\n\nvoid LedControl::spiTransfer(int addr, volatile byte opcode, volatile byte data) {\n    //Create an array with the data to shift out\n    int offset=addr*2;\n    int maxbytes=maxDevices*2;\n\n    for(int i=0;i<maxbytes;i++)\n        spidata[i]=(byte)0;\n    //put our device data into the array\n    spidata[offset+1]=opcode;\n    spidata[offset]=data;\n    //enable the line \n    digitalWrite(SPI_CS,LOW);\n    //Now shift out the data \n    for(int i=maxbytes;i>0;i--)\n        shiftOut(SPI_MOSI,SPI_CLK,MSBFIRST,spidata[i-1]);\n    //latch the data onto the display\n    digitalWrite(SPI_CS,HIGH);\n}    \n\n\n"
    }]
  };
  const extFacePanels = {
    "8233d424": {
      "guid": "8233d424",
      "name": "MAX7219 8x8",
      "actions": ["DRAW", "ERASE", "CLEAN", "SAVE"],
      "colorIndex": 1,
      "colors": ["#ffffff", "#ff0000"],
      "columns": 8,
      "defaultFaces": [],
      "enableAnimation": false,
      "interval": 6,
      "multiColor": false,
      "radius": 12,
      "rows": 8,
      "showNumber": true,
      "size": {
        "width": 32,
        "height": 32
      },
      "startNumber": 0,
      "type": "facePanel",
      "id": "1405",
      "sort": 999,
      "create_time": 1717558122,
      "modify_time": 1719040753,
      "uid": 2276715,
      "ftype": 0,
      "boxspacing": 0,
      "bgimg": "",
      "defaultValue": "0000000000000000000000000000000000000000000000000000000000000000"
    }
  };
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

  class ExtLeptonMax7219 {
    constructor() {
      this.checkFirmwareInForce = typeof checkFirmwareInForce !== 'undefined' ? checkFirmwareInForce : false;
      const handlerProxyUrl = window.MbApi.getExtResPath('lepton_max7219/handlerProxy.js', 'lepton_max7219');
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
        'BLOCK_1719039285417': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1719039285417', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1719040511271': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1719040511271', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1719044216290': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1719044216290', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1719043487366': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1719043487366', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1719043877542': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1719043877542', 'onRun', device.id, {
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
        "id": "lepton_max7219",
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
        "version": "0.0.0",
        "platform": ["mblockpc", "mblockweb"],
        "categories": [{
          "name": "cate_e7a05eef",
          "colors": ["#008080", "#007373", "#006666"],
          "menuIconURI": window.MbApi.getExtResPath('lepton_max7219/imgs/ace60972_category.svg', 'lepton_max7219'),
          "blockIcon": {
            "type": "image",
            "width": 28,
            "height": 26,
            "src": window.MbApi.getExtResPath('lepton_max7219/imgs/aa58670e_block.svg', 'lepton_max7219')
          },
          "blocks": [{
            "opcode": "BLOCK_1719039285417",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "num": {
                "type": "number",
                "defaultValue": 1
              },
              "din": {
                "type": "number",
                "defaultValue": 12
              },
              "cs": {
                "type": "number",
                "defaultValue": 11
              },
              "clk": {
                "type": "number",
                "defaultValue": 10
              },
              "panels": {
                "type": "number",
                "defaultValue": 1
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "sections": {
                  "include": ["\"src/Lepton-MAX7219/LedControl.h\""],
                  "declare": `LedControl lepton_ledcontrol/*{num}*/ = LedControl(/*{din}*/, /*{clk}*/, /*{cs}*/, /*{panels}*/);`,
                  "setup": `for(int lepton_i=0; lepton_i<lepton_ledcontrol/*{num}*/.getDeviceCount(); lepton_i++) {\n    /* Wake up device */\n    lepton_ledcontrol/*{num}*/.shutdown(lepton_i, false); \n    /* Set the brightness to a medium value */\n    lepton_ledcontrol/*{num}*/.setIntensity(lepton_i, 8);\n    /* and clear the display */\n    lepton_ledcontrol/*{num}*/.clearDisplay(lepton_i);\n} \n\nlepton_ledcontrol/*{num}*/.setRow(1,0,63);`
                }
              }
            },
            "handler": this.funcs.BLOCK_1719039285417
          }, {
            "opcode": "BLOCK_1719040511271",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "num": {
                "type": "number",
                "defaultValue": 1
              },
              "panel": {
                "type": "number",
                "defaultValue": 1
              },
              "figure": extFacePanels['8233d424']
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `for (int lepton_i = 0; lepton_i < 8; lepton_i++) {\n    char lepton_chunk[9];\n    strncpy(lepton_chunk, \"/*{figure}*/\" + lepton_i * 8, 8);\n    lepton_chunk[8] = '\\0';\n    lepton_ledcontrol/*{num}*/.setRow(/*{panel}*/-1, lepton_i, strtol(lepton_chunk, NULL, 2));\n}`
              }
            },
            "handler": this.funcs.BLOCK_1719040511271
          }, {
            "opcode": "BLOCK_1719044216290",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "num": {
                "type": "number",
                "defaultValue": 1
              },
              "panel": {
                "type": "number",
                "defaultValue": 1
              },
              "value": {
                "type": "number",
                "defaultValue": 1
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc"],
            "codes": {
              "arduinoc": {
                "code": `lepton_ledcontrol/*{num}*/.setIntensity(/*{panel}*/-1, /*{value}*/);`
              }
            },
            "handler": this.funcs.BLOCK_1719044216290
          }, {
            "opcode": "BLOCK_1719043487366",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "num": {
                "type": "number",
                "defaultValue": 1
              },
              "panel": {
                "type": "number",
                "defaultValue": 1
              },
              "powerDown": {
                "type": "fieldMenu",
                "defaultValue": "true",
                "menu": "BLOCK_1719043487366_POWERDOWN"
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_ledcontrol/*{num}*/.shutdown(/*{panel}*/-1, /*{powerDown}*/);`
              }
            },
            "handler": this.funcs.BLOCK_1719043487366
          }, {
            "opcode": "BLOCK_1719043877542",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "num": {
                "type": "number",
                "defaultValue": 1
              },
              "panel": {
                "type": "number",
                "defaultValue": 1
              },
              "row": {
                "type": "number",
                "defaultValue": 1
              },
              "col": {
                "type": "number",
                "defaultValue": 1
              },
              "on": {
                "type": "fieldMenu",
                "defaultValue": "true",
                "menu": "BLOCK_1719043877542_ON"
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_ledcontrol/*{num}*/.setLed(/*{panel}*/-1, /*{row}*/-1, /*{col}*/-1, /*{on}*/);`
              }
            },
            "handler": this.funcs.BLOCK_1719043877542
          }],
          "menus": {
            "BLOCK_1719043487366_POWERDOWN": [{
              "text": "BLOCK_1719043487366_POWERDOWN_0",
              "value": "false"
            }, {
              "text": "BLOCK_1719043487366_POWERDOWN_1",
              "value": "true"
            }],
            "BLOCK_1719043877542_ON": [{
              "text": "BLOCK_1719043877542_ON_0",
              "value": "true"
            }, {
              "text": "BLOCK_1719043877542_ON_1",
              "value": "false"
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

  var _default = ExtLeptonMax7219;
  _exports.default = _default;
});