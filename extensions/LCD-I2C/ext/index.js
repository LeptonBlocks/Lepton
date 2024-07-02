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
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "de": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "es": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "fr": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "id": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "ja": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "ja-jph": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "ko": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "pl": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "uk": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "zh-hant": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "nl": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "it": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "hr": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "ru": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "pt": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "fi": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "tr": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "tk": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
    },
    "en": {
      "lepton_lcd_i2c": "Lepton LCD I2C",
      "extensionName": "Lepton LCD I2C",
      "extensionDescription": "Controls an I2C LCD display.",
      "BLOCK_1713207948139_PORT_0": "0x20",
      "BLOCK_1713207948139_PORT_1": "0x27",
      "BLOCK_1713207948139_PORT_2": "0x30",
      "BLOCK_1713207948139_PORT_3": "0x38",
      "BLOCK_1713207948139_PORT_4": "0x3F",
      "BLOCK_1713207948139": "🚀 Initialize Address [port] Columns [columns] Rows [rows] ",
      "BLOCK_1713209371216_COMMAND_0": "clear screen and set cursor to (1, 1)",
      "BLOCK_1713209371216_COMMAND_1": "clear line from current position",
      "BLOCK_1713209371216_COMMAND_2": "backlight on",
      "BLOCK_1713209371216_COMMAND_3": "backlight off and display off",
      "BLOCK_1713209371216_COMMAND_4": "display on",
      "BLOCK_1713209371216_COMMAND_5": "display off",
      "BLOCK_1713209371216_COMMAND_6": "blink on",
      "BLOCK_1713209371216_COMMAND_7": "blink off",
      "BLOCK_1713209371216_COMMAND_8": "cursor on",
      "BLOCK_1713209371216_COMMAND_9": "cursor off",
      "BLOCK_1713209371216_COMMAND_10": "scroll display left",
      "BLOCK_1713209371216_COMMAND_11": "scroll display reft",
      "BLOCK_1713209371216_COMMAND_12": "autoscroll on",
      "BLOCK_1713209371216_COMMAND_13": "autoscroll off",
      "BLOCK_1713209371216_COMMAND_14": "write left to right",
      "BLOCK_1713209371216_COMMAND_15": "write right to left",
      "BLOCK_1713209371216": "✍️ Send command [command] ",
      "BLOCK_1713210277889": "✍️ Set cursor to row [row] column [column]",
      "BLOCK_1713210091134": "✍️ Print [string]",
      "BLOCK_1713210132755": "✍️ Print [string] centered on row [row] ",
      "BLOCK_1713210192368": "✍️ Print [string] aligned right on row [row] column [column] ",
      "BLOCK_1713210317522_DIRECTION_0": "right",
      "BLOCK_1713210317522_DIRECTION_1": "left",
      "BLOCK_1713210317522": "✍️ Move cursor [direction] by [n]",
      "BLOCK_1713208634623_CHAR_0": " α",
      "BLOCK_1713208634623_CHAR_1": "β",
      "BLOCK_1713208634623_CHAR_2": "ε",
      "BLOCK_1713208634623_CHAR_3": "μ",
      "BLOCK_1713208634623_CHAR_4": "ρ",
      "BLOCK_1713208634623_CHAR_5": "√",
      "BLOCK_1713208634623_CHAR_6": "ϴ",
      "BLOCK_1713208634623_CHAR_7": "∞",
      "BLOCK_1713208634623_CHAR_8": "Ω",
      "BLOCK_1713208634623_CHAR_9": "Σ",
      "BLOCK_1713208634623_CHAR_10": "π",
      "BLOCK_1713208634623_CHAR_11": "x̄ ",
      "BLOCK_1713208634623_CHAR_12": "°",
      "BLOCK_1713208634623_CHAR_13": "÷",
      "BLOCK_1713208634623": "✍️ Print special character [char] ",
      "BLOCK_1713210693769_N_0": "1",
      "BLOCK_1713210693769_N_1": "2",
      "BLOCK_1713210693769_N_2": "3",
      "BLOCK_1713210693769_N_3": "4",
      "BLOCK_1713210693769_N_4": "5",
      "BLOCK_1713210693769_N_5": "6",
      "BLOCK_1713210693769_N_6": "7",
      "BLOCK_1713210693769_N_7": "8",
      "BLOCK_1713210693769": "✍️ Define custom character [n] [panel] ",
      "BLOCK_1713211789499": "✍️ Print custom character [n] ",
      "cate_135a2adc": "💫 LCD I2C"
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
      filename: "I2C_LCD/I2C_LCD.h",
      code: "#pragma once\n//\n//    FILE: I2C_LCD.h\n//  AUTHOR: Rob.Tillaart\n// VERSION: 0.2.1\n//    DATE: 2023-12-16\n// PURPOSE: Arduino library for I2C_LCD\n//     URL: https://github.com/RobTillaart/I2C_LCD\n\n\n#define I2C_LCD_LIB_VERSION     (F(\"0.2.1\"))\n\n\n#include \"Arduino.h\"\n#include \"Wire.h\"\n\nconst uint8_t POSITIVE = 1;\nconst uint8_t NEGATIVE = 0;\n\n\nclass I2C_LCD : public Print\n{\npublic:\n  //  only one constructor\n  explicit  I2C_LCD(uint8_t address, TwoWire * wire = &Wire);\n\n  //  adjust pins\n  void      config(uint8_t address, uint8_t enable, uint8_t readWrite, uint8_t registerSelect,\n                   uint8_t data4, uint8_t data5, uint8_t data6, uint8_t data7,\n                   uint8_t backLight, uint8_t polarity);\n\n  //  only supports 5x8 char set for now.\n  //  blocks up to 100 milliseconds to give LCD time to boot\n  bool      begin(uint8_t cols = 20, uint8_t rows = 4);\n  bool      isConnected();\n\n\n  //  BACKLIGHT\n  void      setBacklightPin(uint8_t pin, uint8_t polarity);\n  void      setBacklight(bool on);\n  void      backlight()   { setBacklight(true);  };\n  void      noBacklight() { setBacklight(false); };\n\n\n  //  DISPLAY ON OFF\n  void      display();\n  void      noDisplay();\n  void      on()  { display(); };\n  void      off() { noDisplay(); };\n\n\n  //  POSITIONING & CURSOR\n  void      clear();      //  clears whole screen\n  void      clearEOL();   //  clears line from current pos.\n  void      home();\n  bool      setCursor(uint8_t col, uint8_t row);\n\n  void      noBlink();\n  void      blink();\n  void      noCursor();\n  void      cursor();\n\n  void      scrollDisplayLeft();\n  void      scrollDisplayRight();\n  void      moveCursorRight(uint8_t n = 1);\n  void      moveCursorLeft(uint8_t n = 1);\n\n  //  next 4 limited support\n  void      autoscroll();\n  void      noAutoscroll();\n  void      leftToRight();\n  void      rightToLeft();\n\n\n  //  8 definable characters\n  void      createChar(uint8_t index, uint8_t * charmap);\n  //  clean way to print them\n  inline size_t special(uint8_t index) { return write((uint8_t)index); };\n\n\n  //  PRINT INTERFACE ++\n  size_t    write(uint8_t c);\n  size_t    center(uint8_t row, const char * message);\n  size_t    right(uint8_t col, uint8_t row, const char * message);\n  size_t    repeat(uint8_t c, uint8_t times);\n\n\n  //  DEBUG  development\n  uint8_t   getColumn() { return _pos; };  //  works.\n  uint32_t  getWriteCount()  { return _count; };  // works\n\n\nprivate:\n\n  void      sendData(uint8_t value);\n  void      sendCommand(uint8_t value);\n  void      send(uint8_t value, bool dataFlag);\n  void      write4bits(uint8_t value);\n\n  uint8_t   _address = 0;\n  TwoWire * _wire = NULL;\n\n  uint8_t   _enable         = 4;\n  uint8_t   _readWrite      = 2;\n  uint8_t   _registerSelect = 1;\n\n  uint8_t   _dataPin[4]     = { 16, 32, 64, 128 };  //  == pin 4, 5, 6, 7\n  //  minor optimization only for pins = 4,5,6,7\n  bool      _pin4567 = true;\n\n\n  uint8_t   _backLightPin   = 8;\n  uint8_t   _backLightPol   = 1;\n  uint8_t   _backLight      = 1;\n\n  uint8_t   _cols = 20;\n  uint8_t   _rows = 4;\n\n  //  DISPLAYCONTROL bit always on, set in constructor.\n  uint8_t   _displayControl = 0;\n\n  //  overflow protection\n  uint8_t   _pos = 0;\n\n  uint32_t  _count = 0;\n};\n\n\n//  -- END OF FILE --\n\n"
    }, {
      filename: "I2C_LCD/I2C_LCD_special_chars.h",
      code: "#pragma once\n//\n//    FILE: I2C_LCD_special_chars.h\n//  AUTHOR: Rob.Tillaart\n// VERSION: see library.properties\n// PURPOSE: Arduino library for I2C_LCD\n//     URL: https://github.com/RobTillaart/I2C_LCD\n\n\n//  SPECIAL CHARS,\n//  will only work on displays with ROM CODE A00\n\n\nconst char LCD_ALPHA    = 0xE0;\nconst char LCD_BETA     = 0xE2;\nconst char LCD_EPSILON  = 0xE3;\nconst char LCD_MU       = 0xE4;\nconst char LCD_RHO      = 0xE5;\nconst char LCD_SQROOT   = 0xE7;\n\nconst char LCD_THETA    = 0xF2;\nconst char LCD_INFINITY = 0xF3;\nconst char LCD_OHM      = 0xF4;\nconst char LCD_SIGMA    = 0xF6;\nconst char LCD_PI       = 0xF7;\nconst char LCD_XAVG     = 0xF8;\n\nconst char LCD_DEGREE   = 0xDF;\nconst char LCD_DIVIDE   = 0xFD;\n\n\n\n//  -- END OF FILE --\n\n"
    }, {
      filename: "I2C_LCD/I2C_LCD.cpp",
      code: "//\n//    FILE: I2C_LCD.cpp\n//  AUTHOR: Rob.Tillaart\n// VERSION: 0.2.0\n//    DATE: 2023-12-16\n// PURPOSE: Arduino library for I2C_LCD\n//     URL: https://github.com/RobTillaart/I2C_LCD\n\n\n#include \"I2C_LCD.h\"\n\n//  40 us is a save value at any speed.\n//  20 us is a save value for I2C at 400K.\nconst uint8_t I2C_LCD_CHAR_DELAY = 0;\n\n\n///////////////////////////////////////////////////////\n//\n//  DO NOT CHANGE BELOW THIS LINE\n//\n//  keep defines compatible / recognizable\n//  the zero valued defines are not used.\n#define I2C_LCD_CLEARDISPLAY        0x01\n#define I2C_LCD_RETURNHOME          0x02\n#define I2C_LCD_ENTRYMODESET        0x04\n#define I2C_LCD_DISPLAYCONTROL      0x08\n#define I2C_LCD_CURSORSHIFT         0x10\n#define I2C_LCD_FUNCTIONSET         0x20\n#define I2C_LCD_SETCGRAMADDR        0x40\n#define I2C_LCD_SETDDRAMADDR        0x80\n\n#define I2C_LCD_ENTRYLEFT           0x02\n#define I2C_LCD_ENTRYSHIFTINCREMENT 0x01\n\n#define I2C_LCD_DISPLAYON           0x04\n#define I2C_LCD_CURSORON            0x02\n#define I2C_LCD_BLINKON             0x01\n\n#define I2C_LCD_DISPLAYMOVE         0x08\n#define I2C_LCD_MOVERIGHT           0x04\n\n#define I2C_LCD_8BITMODE            0x10\n#define I2C_LCD_2LINE               0x08\n#define I2C_LCD_5x10DOTS            0x04\n\n\nI2C_LCD::I2C_LCD(uint8_t address, TwoWire * wire)\n{\n  _address = address;\n  _wire = wire;\n  _displayControl = I2C_LCD_DISPLAYCONTROL;\n}\n\n\nvoid I2C_LCD::config (uint8_t address, uint8_t enable, uint8_t readWrite, uint8_t registerSelect,\n                      uint8_t data4, uint8_t data5, uint8_t data6, uint8_t data7,\n                      uint8_t backLight, uint8_t polarity)\n{\n  if (_address != address) return;  //  compatible?\n  _enable         = ( 1 << enable);\n  _readWrite      = ( 1 << readWrite);\n  _registerSelect = ( 1 << registerSelect);\n  _dataPin[0]     = ( 1 << data4);\n  _dataPin[1]     = ( 1 << data5);\n  _dataPin[2]     = ( 1 << data6);\n  _dataPin[3]     = ( 1 << data7);\n  _backLightPin   = ( 1 << backLight);\n  _backLightPol   = polarity;\n\n  _pin4567 = ((data4 == 4) && (data5 == 5) && (data6 == 6) && (data7 == 7));\n  //  if pins are 0,1,2,3 they are also in order \n  //  but the shift/mask in send() should be different\n  //  4,5,6,7 is most used afaik.\n}\n\n\nbool I2C_LCD::begin(uint8_t cols, uint8_t rows)\n{\n  //  no check for range, user responsibility, defaults are 20x4\n  _cols = cols;\n  _rows = rows;\n\n  if (isConnected() == false) return false;\n\n  //  ALL LINES LOW.\n  _wire->beginTransmission(_address);\n  _wire->write(0x00);\n  _wire->endTransmission();\n\n  //  Figure 24 for procedure on 4-bit initialization\n  //  wait for more than 15 ms\n  //  if other objects initialize earlier there will be less blocking time.\n  //  => assumes display is started at same time as MCU\n  while (millis() < 100) delay(1);\n\n  //  Force 4 bit mode, see datasheet.\n  //  times are taken longer for robustness.\n  //  note this is typically only called once.\n  write4bits(0x03);\n  delayMicroseconds(5000);  //  datasheet > 4.1 millis\n  write4bits(0x03);\n  delayMicroseconds(200);   //  datasheet > 100 usec\n  write4bits(0x03);\n  delayMicroseconds(200);   //  datasheet > 100 usec\n\n  //  command to set 4 bit interface\n  write4bits(0x02);\n  delayMicroseconds(200);\n\n  //  set \"two\" lines LCD - fixed for now.\n  sendCommand(I2C_LCD_FUNCTIONSET | I2C_LCD_2LINE);\n  //  default enable display\n  display();\n  clear();\n  return true;\n}\n\n\nbool I2C_LCD::isConnected()\n{\n  _wire->beginTransmission(_address);\n  return (_wire->endTransmission() == 0);\n}\n\n\n/////////////////////////////////////////////////\n//\n//  BACKLIGHT\n//\nvoid I2C_LCD::setBacklightPin(uint8_t pin, uint8_t polarity)\n{\n  _backLightPin = (1 << pin);\n  _backLightPol = polarity;\n}\n\n\nvoid I2C_LCD::setBacklight(bool on)\n{\n  _backLight = (on == _backLightPol);\n  if (_backLight) display();\n  else noDisplay();\n}\n\n\n/////////////////////////////////////////////////\n//\n//  DISPLAY\n//\nvoid I2C_LCD::display()\n{\n  _displayControl |= I2C_LCD_DISPLAYON;\n  sendCommand(_displayControl);\n}\n\n\nvoid I2C_LCD::noDisplay()\n{\n  _displayControl &= ~I2C_LCD_DISPLAYON;\n  sendCommand(_displayControl);\n}\n\n\n/////////////////////////////////////////////////\n//\n//  POSITIONING & CURSOR\n//\nvoid I2C_LCD::clear()\n{\n  sendCommand(I2C_LCD_CLEARDISPLAY);\n  _pos = 0;\n  delay(2);\n}\n\n\nvoid I2C_LCD::clearEOL()\n{\n  while(_pos  < _cols)\n  {\n    print(' ');\n  }\n}\n\n\nvoid I2C_LCD::home()\n{\n  sendCommand(I2C_LCD_RETURNHOME);\n  _pos = 0;\n  delayMicroseconds(1600);  //  datasheet states 1520.\n}\n\n\nbool I2C_LCD::setCursor(uint8_t col, uint8_t row)\n{\n  if ((col >= _cols) || (row >= _rows)) return false;\n\n  //  more efficient address / offset calculation (no lookup so far).\n  uint8_t offset = 0x00;\n  if (row & 0x01) offset += 0x40;\n  if (row & 0x02) offset += _cols;\n  offset += col;\n  _pos = col;\n\n  sendCommand(I2C_LCD_SETDDRAMADDR | offset );\n  return true;\n\n  //  ORIGINAL SETCURSOR CODE \n  //  all start position arrays start with 0x00 0x40\n  //  they have an offset of 0x14, 0x10 or 0x0A\n  //  so only 3 bytes are needed?\n  //  note that e.g. 16x2 only uses the first 2 offsets.\n  // uint8_t startPos[4]  = { 0x00, 0x40, 0x14, 0x54 };  //  most displays\n  // uint8_t start16x4[4] = { 0x00, 0x40, 0x10, 0x50 };  //  16x4 display\n  // uint8_t start10x4[4] = { 0x00, 0x40, 0x0A, 0x4A };  //  10x4 LOGO display\n\n  // //  if out of range exit!\n  // if ((col >= _cols) || (row >= _rows)) return false;\n\n  // _pos = col;\n  // if ((_rows == 4) && (_cols == 16))\n  // {\n    // sendCommand(I2C_LCD_SETDDRAMADDR | (start16x4[row] + col) );\n    // return true;\n  // }\n  // if ((_rows == 4) && (_cols == 10))\n  // {\n    // sendCommand(I2C_LCD_SETDDRAMADDR | (start10x4[row] + col) );\n    // return true;\n  // }\n  // sendCommand(I2C_LCD_SETDDRAMADDR | (startPos[row] + col) );\n  // return true;\n}\n\n\nvoid I2C_LCD::blink()\n{\n  _displayControl |= I2C_LCD_BLINKON;\n  sendCommand(_displayControl);\n}\n\n\nvoid I2C_LCD::noBlink()\n{\n  _displayControl &= ~I2C_LCD_BLINKON;\n  sendCommand(_displayControl);\n}\n\n\nvoid I2C_LCD::cursor()\n{\n  _displayControl |= I2C_LCD_CURSORON;\n  sendCommand(_displayControl);\n}\n\n\nvoid I2C_LCD::noCursor()\n{\n  _displayControl &= ~I2C_LCD_CURSORON;\n  sendCommand(_displayControl);\n}\n\n\nvoid I2C_LCD::scrollDisplayLeft(void)\n{\n  sendCommand(I2C_LCD_CURSORSHIFT | I2C_LCD_DISPLAYMOVE);\n}\n\n\nvoid I2C_LCD::scrollDisplayRight(void)\n{\n  sendCommand(I2C_LCD_CURSORSHIFT | I2C_LCD_DISPLAYMOVE | I2C_LCD_MOVERIGHT);\n}\n\n\nvoid I2C_LCD::moveCursorLeft(uint8_t n)\n{\n  while ((_pos > 0) && (n--))\n  {\n    sendCommand(I2C_LCD_CURSORSHIFT);\n    _pos--;\n  }\n}\n\n\nvoid I2C_LCD::moveCursorRight(uint8_t n)\n{\n  while ((_pos < _cols) && (n--))\n  {\n    sendCommand(I2C_LCD_CURSORSHIFT | I2C_LCD_MOVERIGHT);\n    _pos++;\n  }\n}\n\n\nvoid I2C_LCD::autoscroll(void)\n{\n  sendCommand(I2C_LCD_ENTRYMODESET | I2C_LCD_ENTRYSHIFTINCREMENT);\n}\n\n\nvoid I2C_LCD::noAutoscroll(void)\n{\n  sendCommand(I2C_LCD_ENTRYMODESET);\n}\n\n\nvoid I2C_LCD::leftToRight(void)\n{\n  sendCommand(I2C_LCD_ENTRYMODESET | I2C_LCD_ENTRYLEFT);\n}\n\n\nvoid I2C_LCD::rightToLeft(void)\n{\n  sendCommand(I2C_LCD_ENTRYMODESET);\n}\n\n\n/////////////////////////////////////////////////\n//\n//  CHARMAP\n//\nvoid I2C_LCD::createChar(uint8_t index, uint8_t * charmap)\n{\n  sendCommand(I2C_LCD_SETCGRAMADDR | ((index & 0x07) << 3));\n  uint8_t tmp = _pos;\n  for (uint8_t i = 0; i < 8; i++)\n  {\n    _pos = 0;\n    sendData(charmap[i]);\n  }\n  _pos = tmp;\n}\n\n\nsize_t I2C_LCD::write(uint8_t c)\n{\n  size_t n = 0;\n  if (c == (uint8_t)'\\t')  //  handle TAB char\n  {\n    while (((_pos % 4) != 0) && (_pos < _cols))\n    {\n      moveCursorRight();   //  increases _pos.\n      n++;\n    }\n    return n;\n  }\n  if (_pos < _cols)   //  overflow protect.\n  {\n    sendData(c);\n    _pos++;\n    return 1;\n  }\n  //  not allowed to print beyond display, so return 0.\n  return 0;\n};\n\n\nsize_t I2C_LCD::center(uint8_t row, const char * message)\n{\n  uint8_t len = strlen(message) + 1;\n  setCursor((_cols - len) / 2, row);\n  return print(message);\n}\n\n\nsize_t I2C_LCD::right(uint8_t col, uint8_t row, const char * message)\n{\n  uint8_t len = strlen(message);\n  setCursor(col - len, row);\n  return print(message);\n}\n\n\nsize_t I2C_LCD::repeat(uint8_t c, uint8_t times)\n{\n  size_t n = 0;\n  while((times--) && (_pos < _cols)) \n  {\n    n += write(c);\n  }\n  return n;\n}\n\n\n//////////////////////////////////////////////////////////\n//\n//  PRIVATE\n//\nvoid I2C_LCD::sendCommand(uint8_t value)\n{\n  send(value, false);\n}\n\n\nvoid I2C_LCD::sendData(uint8_t value)\n{\n  send(value, true);\n}\n\n\nvoid I2C_LCD::send(uint8_t value, bool dataFlag)\n{\n  //  calculate both \n  //  MSN == most significant nibble and \n  //  LSN == least significant nibble\n  uint8_t MSN = 0;\n  if (dataFlag)   MSN = _registerSelect;\n  if (_backLight) MSN |= _backLightPin;\n  uint8_t LSN = MSN;\n\n  if (_pin4567)  //  4,5,6,7 only == most used.\n  {\n    MSN |= value & 0xF0;\n    LSN |= value << 4;\n  }\n  else  //  ~ 1.7% slower UNO.  (adds 4 us / char)\n  {\n    for ( uint8_t i = 0; i < 4; i++ )\n    {\n      if ( value & 0x01 ) LSN |= _dataPin[i];\n      if ( value & 0x10 ) MSN |= _dataPin[i];\n      value >>= 1;\n    }\n  }\n\n  _wire->beginTransmission(_address);\n  _wire->write(MSN | _enable);\n  _wire->write(MSN);\n  _wire->write(LSN | _enable);\n  _wire->write(LSN);\n  _wire->endTransmission();\n  if (I2C_LCD_CHAR_DELAY) delayMicroseconds(I2C_LCD_CHAR_DELAY);\n}\n\n\n//  needed for setup\nvoid I2C_LCD::write4bits(uint8_t value)\n{\n  uint8_t cmd = 0;\n\n  for ( uint8_t i = 0; i < 4; i++ )\n  {\n    if ( value & 0x01 ) cmd |= _dataPin[i];\n    value >>= 1;\n  }\n\n  _wire->beginTransmission(_address);\n  _wire->write(cmd | _enable);\n  _wire->endTransmission();\n  _wire->beginTransmission(_address);\n  _wire->write(cmd);\n  _wire->endTransmission();\n}\n\n\n//  -- END OF FILE --\n\n"
    }, {
      filename: "I2C_LCD/I2C_LCD_custom_chars.h",
      code: "#pragma once\n//\n//    FILE: I2C_LCD_custom_chars.h\n//  AUTHOR: Rob.Tillaart\n// VERSION: see library.properties\n// PURPOSE: Arduino library for I2C_LCD\n//     URL: https://github.com/RobTillaart/I2C_LCD\n//          https://maxpromer.github.io/LCD-Character-Creator/\n//\n//  See examples for some more\n\n\n////////////////////////////////////\n//\n//  Special\n//\n\n//  one-liners easier to search?\n//  uint8_t paragraph[] = { 0x06, 0x09, 0x04, 0x10, 0x04, 0x12, 0x0E, 0x00 };\n\nuint8_t paragraph[] = {\n  B00110,\n  B01001,\n  B00100,\n  B01010,\n  B00100,\n  B10010,\n  B01110,\n  B00000\n};\n\nuint8_t copyRight[] = {\n  B00000,\n  B11111,\n  B10001,\n  B10111,\n  B10111,\n  B10001,\n  B11111,\n  B00000\n};\n\n\n////////////////////////////////////\n//\n//  Math\n//\nuint8_t lessThan[] = {\n  B00000,\n  B00010,\n  B00100,\n  B01000,\n  B00100,\n  B00010,\n  B00000,\n  B11111\n};\n\nuint8_t moreThan[] = {\n  B00000,\n  B01000,\n  B00100,\n  B00010,\n  B00100,\n  B01000,\n  B00000,\n  B11111\n};\n\nuint8_t notEqual[] = {\n  B00000,\n  B00010,\n  B00010,\n  B11111,\n  B00100,\n  B11111,\n  B01000,\n  B01000\n};\n\n////////////////////////////////////\n//\n//  ARROWS\n//\nuint8_t doubleUP[] = {\n  B00100,\n  B01110,\n  B11111,\n  B00000,\n  B00100,\n  B01110,\n  B11111,\n  B00000\n};\n\nuint8_t doubleDOWN[] = {\n  B11111,\n  B01110,\n  B00100,\n  B00000,\n  B11111,\n  B01110,\n  B00100,\n  B00000\n};\n\nuint8_t openUP[] = {\n  B00000,\n  B00100,\n  B01010,\n  B01010,\n  B10001,\n  B10001,\n  B11111,\n  B00000\n};\n\nuint8_t openDown[] = {\n  B00000,\n  B11111,\n  B10001,\n  B10001,\n  B01010,\n  B01010,\n  B00100,\n  B00000\n};\n\n////////////////////////////////////\n//\n//  BRACKETS   --[]--\n//\nuint8_t bracketRight[] = {\n  B11100,\n  B00100,\n  B00100,\n  B00111,\n  B00100,\n  B00100,\n  B11100,\n  B00000\n};\n\nuint8_t bracketLeft[] = {\n  B00111,\n  B00100,\n  B00100,\n  B11100,\n  B00100,\n  B00100,\n  B00111,\n  B00000\n};\n\nuint8_t singleLine[] = {\n  B00000,\n  B00000,\n  B00000,\n  B11111,\n  B00000,\n  B00000,\n  B00000,\n  B00000\n};\n\nuint8_t doubleLine[] = {\n  B11111,\n  B00000,\n  B00000,\n  B00000,\n  B00000,\n  B00000,\n  B11111,\n  B00000\n};\n\n\n////////////////////////////////////\n//\n//  Other\n//\nuint8_t OnOff[] = {\n  B00100,\n  B00100,\n  B01110,\n  B10101,\n  B10101,\n  B10001,\n  B01110,\n  B00000\n};\n\nuint8_t smiley[] = {\n  B00000,\n  B00000,\n  B01010,\n  B00000,\n  B10001,\n  B01110,\n  B00000,\n  B00000\n};\n\nuint8_t heart[] = {\n  B00000,\n  B01010,\n  B10101,\n  B10001,\n  B01010,\n  B00100,\n  B00000,\n  B00000\n};\n\n\n//  -- END OF FILE --\n\n"
    }]
  };
  const extFacePanels = {
    "cd72e514": {
      "guid": "cd72e514",
      "colorIndex": 1,
      "name": "LCD custom char",
      "multiColor": false,
      "showNumber": true,
      "colors": ["#FFFFFF", "#000000"],
      "ftype": 0,
      "startNumber": 0,
      "size": {
        "width": 32,
        "height": 32
      },
      "interval": 0,
      "boxspacing": 0,
      "defaultFaces": ["0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0", "0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,0,0", "0,0,0,1,1,1,0,0,0,0,1,1,0,1,1,0,0,0,1,0,0,0,1,0,0,0,1,1,0,1,1,0,0,0,0,1,1,1,0,0"],
      "actions": ["DRAW", "ERASE", "CLEAN", "RULER", "SAVE"],
      "bgimg": "",
      "rows": 8,
      "columns": 5,
      "radius": 12,
      "id": "1371",
      "sort": 999,
      "create_time": 1691566161,
      "modify_time": 1713210900,
      "uid": 2276715,
      "type": "facePanel",
      "defaultValue": "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
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

  class ExtLeptonLcdI2C {
    constructor() {
      this.checkFirmwareInForce = typeof checkFirmwareInForce !== 'undefined' ? checkFirmwareInForce : false;
      const handlerProxyUrl = window.MbApi.getExtResPath('lepton_lcd_i2c/handlerProxy.js', 'lepton_lcd_i2c');
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
        'BLOCK_1713207948139': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713207948139', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713209371216': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713209371216', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713210277889': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713210277889', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713210091134': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713210091134', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713210132755': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713210132755', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713210192368': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713210192368', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713210317522': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713210317522', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713208634623': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713208634623', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713210693769': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713210693769', 'onRun', device.id, {
              id: block.id,
              opcode: block.opcode,
              arguments: block.arguments
            }, Object.assign({}, args));
          }
        },
        'BLOCK_1713211789499': {
          onRun: (args, app, device, block) => {
            return this.worker.remote.runBlock('BLOCK_1713211789499', 'onRun', device.id, {
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
        "id": "lepton_lcd_i2c",
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
          "name": "cate_135a2adc",
          "colors": ["#008080", "#007373", "#006666"],
          "menuIconURI": window.MbApi.getExtResPath('lepton_lcd_i2c/imgs/aeef3c51_desktop-solid.svg', 'lepton_lcd_i2c'),
          "blockIcon": {
            "type": "image",
            "width": 28,
            "height": 26,
            "src": window.MbApi.getExtResPath('lepton_lcd_i2c/imgs/e54a98bd_desktop-solid (1).svg', 'lepton_lcd_i2c')
          },
          "blocks": [{
            "opcode": "BLOCK_1713207948139",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "port": {
                "type": "fieldMenu",
                "defaultValue": "0x27",
                "menu": "BLOCK_1713207948139_PORT"
              },
              "columns": {
                "type": "number",
                "defaultValue": 16
              },
              "rows": {
                "type": "number",
                "defaultValue": 2
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "sections": {
                  "include": ["\"I2C_LCD/I2C_LCD.h\"", "\"I2C_LCD/I2C_LCD_special_chars.h\""],
                  "declare": `I2C_LCD lepton_lcd(/*{port}*/);\n\nuint8_t lepton_lcd_custom_char[8]; // Fixed size for 8 elements\n\nvoid lepton_lcd_panel(const char* binaryStr) {\n    // Reset the array to all zeroes\n    for (int i = 0; i < 8; ++i) {\n        lepton_lcd_custom_char[i] = 0;\n    }\n\n    for (int i = 0; i < 40; i++) {\n        // Calculate the row and column indices\n        int row = i % 8;\n        int col = 4 - i / 8;\n\n        // Convert the character '0' or '1' to a bit\n        uint8_t bit = (binaryStr[i] == '1') ? 1 : 0;\n\n        // Set the corresponding bit in the result array\n        lepton_lcd_custom_char[row] |= (bit << col);\n    }\n}`,
                  "setup": `lepton_lcd.begin(/*{columns}*/, /*{rows}*/);`
                }
              }
            },
            "handler": this.funcs.BLOCK_1713207948139
          }, {
            "opcode": "BLOCK_1713209371216",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "command": {
                "type": "fieldMenu",
                "defaultValue": "clear",
                "menu": "BLOCK_1713209371216_COMMAND"
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_lcd./*{command}*/();`
              }
            },
            "handler": this.funcs.BLOCK_1713209371216
          }, {
            "opcode": "BLOCK_1713210277889",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "row": {
                "type": "number",
                "defaultValue": 1
              },
              "column": {
                "type": "number",
                "defaultValue": 1
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_lcd.setCursor(/*{column}*/-1, /*{row}*/-1);`
              }
            },
            "handler": this.funcs.BLOCK_1713210277889
          }, {
            "opcode": "BLOCK_1713210091134",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "string": {
                "type": "string",
                "defaultValue": "text"
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_lcd.print(/*{string}*/);`
              }
            },
            "handler": this.funcs.BLOCK_1713210091134
          }, {
            "opcode": "BLOCK_1713210132755",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "string": {
                "type": "string",
                "defaultValue": "text"
              },
              "row": {
                "type": "number",
                "defaultValue": 1
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_lcd.center(/*{row}*/-1, /*{string}*/);`
              }
            },
            "handler": this.funcs.BLOCK_1713210132755
          }, {
            "opcode": "BLOCK_1713210192368",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "string": {
                "type": "string",
                "defaultValue": "text"
              },
              "row": {
                "type": "number",
                "defaultValue": 1
              },
              "column": {
                "type": "number",
                "defaultValue": 16
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_lcd.right(/*{column}*/, /*{row}*/-1, /*{string}*/);`
              }
            },
            "handler": this.funcs.BLOCK_1713210192368
          }, {
            "opcode": "BLOCK_1713210317522",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "direction": {
                "type": "fieldMenu",
                "defaultValue": "Right",
                "menu": "BLOCK_1713210317522_DIRECTION"
              },
              "n": {
                "type": "number",
                "defaultValue": 1
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_lcd.moveCursor/*{direction}*/(/*{n}*/);`
              }
            },
            "handler": this.funcs.BLOCK_1713210317522
          }, {
            "opcode": "BLOCK_1713208634623",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "char": {
                "type": "fieldMenu",
                "defaultValue": "DEGREE",
                "menu": "BLOCK_1713208634623_CHAR"
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_lcd.print(LCD_/*{char}*/);`
              }
            },
            "handler": this.funcs.BLOCK_1713208634623
          }, {
            "opcode": "BLOCK_1713210693769",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "n": {
                "type": "fieldMenu",
                "defaultValue": "1",
                "menu": "BLOCK_1713210693769_N"
              },
              "panel": extFacePanels['cd72e514']
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_lcd_panel(\"/*{panel}*/\");\nlepton_lcd.createChar(/*{n}*/-1, lepton_lcd_custom_char);\nlepton_lcd.setCursor(0, 0); // required after createChar, for some reason, otherwise no display`
              }
            },
            "handler": this.funcs.BLOCK_1713210693769
          }, {
            "opcode": "BLOCK_1713211789499",
            "blockType": "command",
            "checkboxInFlyout": false,
            "hidden": false,
            "gap": 12,
            "arguments": {
              "n": {
                "type": "fieldMenu",
                "defaultValue": "1",
                "menu": "BLOCK_1713210693769_N"
              }
            },
            "branchCount": 0,
            "platform": ["mblockpc", "mblockweb"],
            "codes": {
              "arduinoc": {
                "code": `lepton_lcd.special(/*{n}*/-1);`
              }
            },
            "handler": this.funcs.BLOCK_1713211789499
          }],
          "menus": {
            "BLOCK_1713207948139_PORT": [{
              "text": "BLOCK_1713207948139_PORT_0",
              "value": "0x20"
            }, {
              "text": "BLOCK_1713207948139_PORT_1",
              "value": "0x27"
            }, {
              "text": "BLOCK_1713207948139_PORT_2",
              "value": "0x30"
            }, {
              "text": "BLOCK_1713207948139_PORT_3",
              "value": "0x38"
            }, {
              "text": "BLOCK_1713207948139_PORT_4",
              "value": "0x3F"
            }],
            "BLOCK_1713209371216_COMMAND": [{
              "text": "BLOCK_1713209371216_COMMAND_0",
              "value": "clear"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_1",
              "value": "clearEOL"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_2",
              "value": "backlight"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_3",
              "value": "noBacklight"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_4",
              "value": "display"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_5",
              "value": "noDisplay"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_6",
              "value": "blink"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_7",
              "value": "noBlink"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_8",
              "value": "cursor"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_9",
              "value": "noCursor"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_10",
              "value": "scrollDisplayLeft"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_11",
              "value": "scrollDisplayRight"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_12",
              "value": "autoscroll"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_13",
              "value": "noAutoscroll"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_14",
              "value": "leftToRight"
            }, {
              "text": "BLOCK_1713209371216_COMMAND_15",
              "value": "rightToLeft"
            }],
            "BLOCK_1713210317522_DIRECTION": [{
              "text": "BLOCK_1713210317522_DIRECTION_0",
              "value": "Right"
            }, {
              "text": "BLOCK_1713210317522_DIRECTION_1",
              "value": "Left"
            }],
            "BLOCK_1713208634623_CHAR": [{
              "text": "BLOCK_1713208634623_CHAR_0",
              "value": "ALPHA"
            }, {
              "text": "BLOCK_1713208634623_CHAR_1",
              "value": "BETA"
            }, {
              "text": "BLOCK_1713208634623_CHAR_2",
              "value": "EPSILON"
            }, {
              "text": "BLOCK_1713208634623_CHAR_3",
              "value": "MU"
            }, {
              "text": "BLOCK_1713208634623_CHAR_4",
              "value": "RHO"
            }, {
              "text": "BLOCK_1713208634623_CHAR_5",
              "value": "SQROOT"
            }, {
              "text": "BLOCK_1713208634623_CHAR_6",
              "value": "THETA"
            }, {
              "text": "BLOCK_1713208634623_CHAR_7",
              "value": "INFINITY"
            }, {
              "text": "BLOCK_1713208634623_CHAR_8",
              "value": "OHM"
            }, {
              "text": "BLOCK_1713208634623_CHAR_9",
              "value": "SIGMA"
            }, {
              "text": "BLOCK_1713208634623_CHAR_10",
              "value": "PI"
            }, {
              "text": "BLOCK_1713208634623_CHAR_11",
              "value": "XAVG"
            }, {
              "text": "BLOCK_1713208634623_CHAR_12",
              "value": "DEGREE"
            }, {
              "text": "BLOCK_1713208634623_CHAR_13",
              "value": "DIVIDE"
            }],
            "BLOCK_1713210693769_N": [{
              "text": "BLOCK_1713210693769_N_0",
              "value": "1"
            }, {
              "text": "BLOCK_1713210693769_N_1",
              "value": "2"
            }, {
              "text": "BLOCK_1713210693769_N_2",
              "value": "3"
            }, {
              "text": "BLOCK_1713210693769_N_3",
              "value": "4"
            }, {
              "text": "BLOCK_1713210693769_N_4",
              "value": "5"
            }, {
              "text": "BLOCK_1713210693769_N_5",
              "value": "6"
            }, {
              "text": "BLOCK_1713210693769_N_6",
              "value": "7"
            }, {
              "text": "BLOCK_1713210693769_N_7",
              "value": "8"
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

  var _default = ExtLeptonLcdI2C;
  _exports.default = _default;
});