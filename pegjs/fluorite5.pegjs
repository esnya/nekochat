/*
 * Fluorite 5.9.0
 * ==============
 */

{

  function createCodeFromLiteral(type, value)
  {
    return function(vm, context, args) {
      return vm.createLiteral(type, value, context, args);
    };
  }

  function createCodeFromMethod(operator, codes)
  {
    return function(vm, context, args) {
      return vm.callOperator(operator, codes, context, args);
    };
  }

  function operatorLeft(head, tail)
  {
    var result = head, i;
    for (i = 0; i < tail.length; i++) {
      var operator = tail[i][1];
      if ((typeof operator) === "string") {
        result = createCodeFromMethod("operator" + operator, [result, tail[i][3]]);
      } else {
        result = createCodeFromMethod("operator" + operator[0], [result, operator[1], tail[i][3]]);
      }
    }
    return result;
  }

  function operatorRight(head, tail)
  {
    var result = tail, i;
    for (i = head.length - 1; i >= 0; i--) {
      var operator = head[i][2];
      if ((typeof operator) === "string") {
        result = createCodeFromMethod("operator" + operator, [head[i][0], result]);
      } else {
        result = createCodeFromMethod("operator" + operator[0], [head[i][0], operator[1], result]);
      }
    }
    return result;
  }

  function left(head, tail)
  {
    var result = tail, i;
    for (i = head.length - 1; i >= 0; i--) {
      var operator = head[i][0];
      if ((typeof operator) === "string") {
        result = createCodeFromMethod("left" + operator, [result]);
      } else {
        result = createCodeFromMethod("left" + operator[0], [operator[1], result]);
      }
    }
    return result;
  }

  function right(head, tail)
  {
    var result = head, i;
    for (i = 0; i < tail.length; i++) {
      var args = [result];
      Array.prototype.push.apply(args, tail[i][1][1]);
      result = createCodeFromMethod(tail[i][1][0], args);
    }
    return result;
  }

  function enumerate(head, tail, operator)
  {
    if (tail.length == 0) return head;
    var result = [head], i;
    for (i = 0; i < tail.length; i++) {
      result.push(tail[i][3]);
    }
    return createCodeFromMethod("enumerate" + operator, result);
  }

  function getVM(name)
  {
    if (name === "classic") {
      return function() {
        var vm = this;

        function dice(count, faces)
        {
          var t = 0, i, value, values = [];
          for (i = 0; i < count; i++) {
            value = Math.floor(Math.random() * faces) + 1;
            t += value;
            values.push(value);
          }
          vm.dices.push({ faces: faces, results: values });
          return t;
        }

        this.dices = [];
        this.callOperator = function(operator, codes, context, args) {

          if (context === "get") {

            if (operator === "operatorPlus") return codes[0](vm, "get", []) + codes[1](vm, "get", []);
            if (operator === "operatorMinus") return codes[0](vm, "get", []) - codes[1](vm, "get", []);
            if (operator === "operatorAsterisk") return codes[0](vm, "get", []) * codes[1](vm, "get", []);
            if (operator === "operatorSlash") return codes[0](vm, "get", []) / codes[1](vm, "get", []);
            if (operator === "leftPlus") return codes[0](vm, "get", []);
            if (operator === "leftMinus") return -codes[0](vm, "get", []);
            if (operator === "bracketsRound") return codes[0](vm, "get", []);
            if (operator === "operatorComposite") return dice(codes[0](vm, "get", []), codes[2](vm, "get", []));

            throw "Unknown operator: " + operator;
          } else {
            throw "Unknown context: " + context;
          }
        };
        this.toString = function(value) {
          return "" + value;
        };
        this.toNative = function(value) {
          return value;
        };
        this.toBoolean = function(value) {
          return value;
        };
        this.createLiteral = function(type, value, context, args) {
          return value;
        };
      };
    } else if (name === "standard") {
      return (function() {

        function getProperty(hash, name)
        {
          var variable = Object.getOwnPropertyDescriptor(hash, name);
          if (variable != undefined) variable = variable.value;
          return variable;
        }

        var Scope = (function() {

          function Scope(parent, isFrame, UNDEFINED)
          {
            this.variables = {};
            this.parent = parent;
            this.isFrame = isFrame;
            this.UNDEFINED = UNDEFINED;

            this.id = Scope.id;
            Scope.id++;
          }
          Scope.id = 0;
          function getVariable(scope, name) 
          {
            var variable = getProperty(scope.variables, name);
            if (variable != undefined) {
              return variable;
            } else {
              if (scope.parent != undefined) {
                return getVariable(scope.parent, name);
              } else {
                return undefined;
              }
            }
          }
          Scope.prototype.define = function(name) {
            if (getVariable(this, name) != undefined) {
              throw "Duplicate variable definition: " + name;
            } else {
              this.variables[name] = {
                value: this.UNDEFINED,
              };
            }
          };
          Scope.prototype.get = function(name) {
            var variable = getVariable(this, name);
            if (variable != undefined) {
              return variable.value;
            } else {
              throw "Unknown variable: " + name;
            }
          };
          Scope.prototype.getOrUndefined = function(name) {
            var variable = getVariable(this, name);
            if (variable != undefined) {
              return variable.value;
            } else {
              return this.UNDEFINED;
            }
          };
          Scope.prototype.set = function(name, value) {
            var variable = getVariable(this, name);
            if (variable != undefined) {
              variable.value = value;
            } else {
              throw "Unknown variable: " + name;
            }
          };
          Scope.prototype.setOrDefine = function(name, value) {
            var variable = getVariable(this, name);
            if (variable != undefined) {
              variable.value = value;
            } else {
              this.variables[name] = {
                value: value,
              };
            }
          };
          Scope.prototype.defineOrSet = function(name, value) {
            var variable = getProperty(this.variables, name);
            if (variable != undefined) {
              variable.value = value;
            } else {
              this.variables[name] = {
                value: value,
              };
            }
          };
          Scope.prototype.getParentFrame = function(name, value) {
            if (this.parent.isFrame) {
              return this.parent;
            } else {
              return this.parent.getParentFrame();
            }
          };

          return Scope;
        })();

        var VMSFunction = (function() {

          /**
           * @param args example: [["a", vm.types.typeValue], ["b", vm.types.typeValue]]
           */
          function VMSFunction(args, code, scope)
          {
            this.args = args;
            this.code = code;
            this.scope = scope;
          }
          VMSFunction.create = function(vm, args, code, scope) {
            return vm.createObject(vm.types.typeFunction, new VMSFunction(args, code, scope));
          };
          VMSFunction.prototype.isCallable = function(vm, blessedsArgs) {
            for (var i = 0; i < this.args.length; i++) {
              if (!vm.instanceOf(blessedsArgs[i] || vm.UNDEFINED, this.args[i][1])) return false;
            }
            return true;
          };
          VMSFunction.prototype.call = function(vm, blessedsArgs) {
            vm.pushStack(this.scope);
            vm.pushFrame();
            for (var i = 0; i < this.args.length; i++) {
              vm.scope.defineOrSet(this.args[i][0], blessedsArgs[i] || vm.UNDEFINED);
            }
            vm.scope.defineOrSet("_", vm.packVector(blessedsArgs.slice(i, blessedsArgs.length)));
            var res;
            try {
              res = this.code(vm, "get", []);
            } finally {
              vm.popFrame();
              vm.popStack();
            }
            return res;
          };
          VMSFunction.prototype.toStringVMS = function() {
            if (this.args.length === 0) return "<Function>";
            return "<Function: " + this.args.map(function(arg) {
              return "" + arg[0] + " : " + arg[1].value.name;
            }).join(", ") + ">";
          };

          return VMSFunction;
        })();

        var VMSFunctionNative = (function() {

          /**
           * @param args example: [vm.types.typeValue, vm.types.typeValue]
           */
          function VMSFunctionNative(args, code)
          {
            this.args = args;
            this.code = code;
          }
          VMSFunctionNative.create = function(vm, args, code) {
            return vm.createObject(vm.types.typeFunction, new VMSFunctionNative(args, code));
          };
          VMSFunctionNative.prototype.isCallable = function(vm, blessedsArgs) {
            for (var i = 0; i < this.args.length; i++) {
              if (!vm.instanceOf(blessedsArgs[i] || vm.UNDEFINED, this.args[i])) return false;
            }
            return true;
          };
          VMSFunctionNative.prototype.call = function(vm, blessedsArgs) {
            return this.code(vm, blessedsArgs);
          };
          VMSFunctionNative.prototype.toStringVMS = function() {
            if (this.args.length === 0) return "<FunctionNative>";
            return "<FunctionNative: " + this.args.map(function(arg) {
              return "" + arg.value.name;
            }).join(", ") + ">";
          };

          return VMSFunctionNative;
        })();

        var VMSPointer = (function() {

          function VMSPointer(code, scope)
          {
            this.code = code;
            this.scope = scope;
          }
          VMSPointer.create = function(vm, code, scope) {
            return vm.createObject(vm.types.typePointer, new VMSPointer(code, scope));
          };
          VMSPointer.createFromBlessed = function(vm, blessed, scope) {
            return VMSPointer.create(vm, function(vm, context, args) {
              if (context === "get") return blessed;
              throw "Illegal context: " + context;
            }, scope);
          };
          VMSPointer.prototype.call = function(vm, context, args) {
            vm.pushStack(this.scope);
            var res;
            try {
              res = this.code(vm, context, args);
            } finally {
              vm.popStack();
            }
            return res;
          };

          return VMSPointer;
        })();

        function VMStandard()
        {
          var vm = this;

          vm.initBootstrap();
          vm.initLibrary();
        }
        VMStandard.prototype.callOperator = function(operator, codes, context, args) {
          var vm = this;
          vm.consumeLoopCapacity();

          function tryCallFromScope(name)
          {
            var blessedFunction = vm.scope.getOrUndefined(name);
            if (vm.instanceOf(blessedFunction, vm.types.typeUndefined)) return false;
            if (vm.instanceOf(blessedFunction, vm.types.typeFunction)) {
              var array = [vm.createObject(vm.types.typeHash, {
                context: vm.createObject(vm.types.typeString, context),
                args: vm.createObject(vm.types.typeArray, args.slice(0)),
                scope: vm.createObject(vm.types.typeScope, vm.scope),
              })];
              Array.prototype.push.apply(array, codes.map(function(code) { return vm.createObject(vm.types.typeCode, code); }));
              var blessedPointer = blessedFunction.value.call(vm, array);
              if (!vm.instanceOf(blessedPointer, vm.types.typePointer)) throw "Illegal type of operation result: " + blessedPointer.type.value.name + " != Pointer";
              return blessedPointer.value.call(vm, context, args);
            } else {
              throw "`" + name + "` is not a function";
            }
          }

          var res;

          res = tryCallFromScope("_" + context + "_core_" + operator);
          if (res !== false) return res;

          res = tryCallFromScope("_core_" + operator);
          if (res !== false) return res;

          res = tryCallFromScope("_" + context + "_core");
          if (res !== false) return res;

          //############################################################## TODO ###############################################################
          if (context === "get") {

            if (operator === "statement") {
              var command = codes[0](vm, "get", []);
              if (!vm.instanceOf(command, vm.types.typeKeyword)) throw "Type Error: " + command.type.value.name + " != String";
              if (command.value === "typeof") {
                var value = codes[1](vm, "get", []);
                return value.type;
              }
              if (command.value === "var") {
                var array = codes[1](vm, "arguments").value;
                array.map(function(item) {
                  if (!vm.instanceOf(item[0], vm.types.typeKeyword)) throw "Type Error: " + item[0].type.value.name + " != Keyword";
                  vm.scope.defineOrSet(item[0].value, vm.UNDEFINED);
                });
                return vm.UNDEFINED;
              }
              if (command.value === "console_scope") {
                console.log(vm.scope);
                return vm.UNDEFINED;
              }
              if (command.value === "console_log") {
                var value = codes[1](vm, "get", []);
                console.log(value);
                return vm.UNDEFINED;
              }
              if (command.value === "call") {
                var blessedOperator = codes[1](vm, "get", []);
                if (!vm.instanceOf(blessedOperator, vm.types.typeString)) throw "Type Error: " + blessedOperator.type.value.name + " != String";
                var array = codes.slice(2, codes.length).map(function(item) {
                  return VMSPointer.create(vm, item, vm.scope);
                })
                return vm.callOperator(blessedOperator.value, array.map(function(item) {
                  return function(vm, context, args) {
                    return item.value.call(vm, context, args);
                  };
                }), "get", []);
              }
              if (command.value === "instanceof") {
                if (codes.length != 3) throw "Illegal command argument: " + command.value;
                var value = codes[1](vm, "get", []);
                var type = codes[2](vm, "get", []);
                if (!vm.instanceOf(type, vm.types.typeType)) throw "Type Error: " + type.type.value.name + " != Type";
                return vm.getBoolean(vm.instanceOf(value, type));
              }
              if (command.value === "length") {
                var value = codes[1](vm, "get", []);
                if (vm.instanceOf(value, vm.types.typeArray)) return vm.createObject(vm.types.typeNumber, value.value.length);
                if (vm.instanceOf(value, vm.types.typeVector)) return vm.createObject(vm.types.typeNumber, value.value.length);
                if (vm.instanceOf(value, vm.types.typeString)) return vm.createObject(vm.types.typeNumber, value.value.length);
                throw "Illegal Argument: " + value.type.value;
              }
              if (command.value === "keys") {
                var value = codes[1](vm, "get", []);
                if (!vm.instanceOf(value, vm.types.typeHash)) throw "Type Error: " + value.type.value.name + " != Hash";
                return vm.packVector(Object.keys(value.value).map(function(key) {
                  return vm.createObject(vm.types.typeKeyword, key);
                }));
              }
              if (command.value === "entry_key") {
                var value = codes[1](vm, "get", []);
                if (!vm.instanceOf(value, vm.types.typeEntry)) throw "Type Error: " + value.type.value.name + " != Entry";
                return value.value.key;
              }
              if (command.value === "entry_value") {
                var value = codes[1](vm, "get", []);
                if (!vm.instanceOf(value, vm.types.typeEntry)) throw "Type Error: " + value.type.value.name + " != Entry";
                return value.value.value;
              }
              if (command.value === "size") {
                var value = codes[1](vm, "get", []);
                return vm.createObject(vm.types.typeNumber, vm.unpackVector(value).length);
              }
              if (command.value === "loopCount") {
                return vm.createObject(vm.types.typeNumber, vm.loopCount);
              }
              if (command.value === "loopCapacity") {
                return vm.createObject(vm.types.typeNumber, vm.loopCapacity);
              }
              if (command.value === "li") {
                var array = [];
                for (var i = 1; i < codes.length; i++) {
                  array.push(codes[i](vm, "get", []));
                }
                return vm.packVector(array);
              }
              if (command.value === "array") {
                var array = [];
                for (var i = 1; i < codes.length; i++) {
                  array.push(codes[i](vm, "get", []));
                }
                return vm.createObject(vm.types.typeArray, vm.unpackVector(vm.packVector(array)));
              }
              if (command.value === "throw") {
                var i = 1, value;
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                if (!(value !== undefined)) throw "Illegal command argument";
                var blessedValue = value[3](vm, "get", []);
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                if (value !== undefined) throw "Illegal command argument: " + value[0];

                // parse end

                throw blessedValue;
              }
              if (command.value === "try") {
                var i = 1, value;
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                if (!(value !== undefined && value[0] === "curly")) throw "Illegal command argument";
                var codeTry = value[1];
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                if (!(value !== undefined && value[0] === "keyword" && value[2] === "catch")) throw "Illegal command argument";
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                if (!(value !== undefined && value[0] === "round")) throw "Illegal command argument";
                var arg = value[1](vm, "arguments").value;
                if (arg.length != 1) throw "Illegal number of arguments: " + arg.length + " != 1";
                arg = arg[0];
                arg = [arg[0].value, arg[1]];
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                if (!(value !== undefined && value[0] === "curly")) throw "Illegal command argument";
                var codeCatch = value[1];
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                if (value !== undefined) throw "Illegal command argument: " + value[0];

                // parse end

                var blessedResult;
                try {
                  vm.pushFrame();
                  try {
                    blessedResult = codeTry(vm, "get", []);
                  } finally {
                    vm.popFrame();
                  }
                } catch (e) {
                  if (vm.instanceOf(e, arg[1])) {
                    vm.pushFrame();
                    vm.scope.defineOrSet(arg[0], e);
                    try {
                      blessedResult = codeCatch(vm, "get", []);
                    } finally {
                      vm.popFrame();
                    }
                  } else {
                    throw e;
                  }
                }

                return blessedResult;
              }
              if (command.value === "class") {
                var i = 1, value;
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                var blessedName;
                var isNamed;
                if (value !== undefined && !((value[0] === "keyword" && value[2] === "extends") || value[0] === "curly")) {
                  blessedName = value[1](vm, "get", []);
                  if (!vm.instanceOf(blessedName, vm.types.typeKeyword)) throw "Type Error: " + blessedName.type.value.name + " != Keyword";
                  value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                  isNamed = true;
                } else {
                  blessedName = vm.createObject(vm.types.typeKeyword, "Class" + Math.floor(Math.random() * 90000000 + 10000000));
                  isNamed = false;
                }

                var blessedExtends;
                if (value !== undefined && value[0] === "keyword" && value[2] === "extends") {

                  // dummy
                  value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                  blessedExtends = value[1](vm, "get", [vm.createObject(vm.types.typeKeyword, "class")]);
                  if (!vm.instanceOf(blessedExtends, vm.types.typeType)) throw "Type Error: " + blessedExtends.type.value.name + " != Type";
                  value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                } else {
                  blessedExtends = vm.types.typeHash;
                }

                var blessedResult = vm.createType(blessedName.value, blessedExtends);

                if (value !== undefined && value[0] === "curly") {
                  vm.pushFrame();
                  vm.scope.defineOrSet("class", blessedResult);
                  vm.scope.defineOrSet("super", blessedExtends);
                  try {
                    value[1](vm, "invoke")
                  } finally {
                    vm.popFrame();
                  }
                  value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;
                }

                if (value !== undefined) throw "Illegal command argument: " + value[0];

                // parse end

                if (isNamed) vm.scope.defineOrSet("class_" + blessedName.value, blessedResult);
                return blessedResult;
              }
              if (command.value === "new") {

                function getMethodsOfTypeTree(keyword, blessedType)
                {
                  var f;
                  var functions = [];

                  while (blessedType !== null) {

                    f = getProperty(blessedType.value.members, keyword) || vm.UNDEFINED;
                    if (!vm.instanceOf(f, vm.types.typeUndefined)) {
                      functions.push(f);
                    }

                    blessedType = blessedType.value.supertype;
                  }

                  return functions;
                }

                var i = 1, value;
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                var blessedType = value[1](vm, "get", [vm.createObject(vm.types.typeKeyword, "class")]);
                if (!vm.instanceOf(blessedType, vm.types.typeType)) throw "Type Error: " + blessedType.type.value.name + " != Type";
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                var blessedArguments = value[1](vm, "get", []);
                value = codes[i] !== undefined ? codes[i](vm, "contentStatement") : undefined; i++;

                if (value !== undefined) throw "Illegal command argument: " + value[0];

                // parse end

                var blessedsNew = getMethodsOfTypeTree("new", blessedType);

                for (i = 0; i < blessedsNew.length; i++) {
                   blessedArguments = blessedsNew[i].value.call(vm, vm.unpackVector(blessedArguments));
                }

                blessedArguments.type = blessedType;

                var blessedsInit = getMethodsOfTypeTree("init", blessedType);
                for (i = blessedsInit.length - 1; i >= 0; i--) {
                  blessedsInit[i].value.call(vm, vm.unpackVector(blessedArguments));
                }

                return blessedArguments;
              }
              throw "Unknown command: " + command.value;
            }
            if (operator === "operatorMinus2Greater"
              || operator === "operatorEqual2Greater") 	{
              var minus = operator == "operatorMinus2Greater";
              if (minus) {
                return vm.packVector(vm.unpackVector(codes[0](vm, "get", [])).map(function(scalar) {
                  return VMSFunction.create(vm, [], codes[1], vm.scope).value.call(vm, [scalar]);
                }));
              } else {
                return VMSFunction.create(vm, [], codes[1], vm.scope).value.call(vm, vm.unpackVector(codes[0](vm, "get", [])));
              }
            }
            if (operator === "operatorMinusGreater"
              || operator === "operatorEqualGreater") 	{
              var minus = operator == "operatorMinusGreater";
              var right = codes[1](vm, "get", []);
              if (minus) {
                return vm.packVector(vm.unpackVector(codes[0](vm, "get", [])).map(function(scalar) {
                  if (vm.instanceOf(right, vm.types.typeString)) {
                    return vm.callMethodOfBlessed(scalar, ["method", "function"], right.value, vm.VOID);
                  } else if (vm.instanceOf(right, vm.types.typeFunction)) {
                    return right.value.call(vm, [scalar]);
                  } else {
                    throw "Type Error: " + right.type.value.name + " != String, Function";
                  }
                }));
              } else {
                if (vm.instanceOf(right, vm.types.typeString)) {
                  return vm.callMethodOfBlessed(codes[0](vm, "get", []), ["method", "function"], right.value, vm.VOID);
                } else if (vm.instanceOf(right, vm.types.typeFunction)) {
                  return right.value.call(vm, [codes[0](vm, "get", [])]);
                } else {
                  throw "Type Error: " + right.type.value.name + " != String, Function";
                }
              }
              throw "Type Error: " + operator + "/" + right.type.value.name;
            }
            if (operator === "operatorPeriod") {
              var right = codes[1](vm, "get", []);
              if (vm.instanceOf(right, vm.types.typeString)) {
                var left = codes[0](vm, "get", []);
                return VMSFunction.create(vm, [], function(vm, context, args) {
                    return vm.callMethodOfBlessed(left, ["method", "function"], right.value, vm.scope.getOrUndefined("_"));
                }, vm.scope)
              } else if (vm.instanceOf(right, vm.types.typeFunction)) {
                var left = codes[0](vm, "get", []);
                return VMSFunction.create(vm, [], function(vm, context, args) {
                    var array = vm.unpackVector(vm.scope.getOrUndefined("_"));
                    array.unshift(left);
                    return right.value.call(vm, array);
                }, vm.scope)
              } else {
                throw "Type Error: " + right.type.value.name + " != String, Function";
              }
            }
            if (operator === "operatorExclamation") {
              var right = codes[1](vm, "get", []);
              if (vm.instanceOf(right, vm.types.typeString)) {
                var left = codes[0](vm, "get", []);
                return VMSFunction.create(vm, [], function(vm, context, args) {
                    return vm.callMethodOfBlessed(left, ["method", "function"], right.value, vm.scope.getOrUndefined("_"));
                }, vm.scope)
              } else if (vm.instanceOf(right, vm.types.typeFunction)) {
                var left = codes[0](vm, "get", []);
                return VMSFunction.create(vm, [], function(vm, context, args) {
                    var array = vm.unpackVector(vm.scope.getOrUndefined("_"));
                    array.push(left);
                    return right.value.call(vm, array);
                }, vm.scope)
              } else {
                throw "Type Error: " + right.type.value.name + " != String, Function";
              }
            }
          } else if (context === "set") {
            if (operator === "leftDollar") {
              var value = args[0];
              vm.scope.setOrDefine(codes[0](vm, "get", []).value, value);
              return value;
            }
            if (operator === "operatorColon2") {
              var hash = codes[0](vm, "get", [vm.createObject(vm.types.typeKeyword, "class")]);
              var key = codes[1](vm, "get", []);
              if (vm.instanceOf(hash, vm.types.typeHash)) {
                if (vm.instanceOf(key, vm.types.typeString)) return hash.value[key.value] = args[0];
                if (vm.instanceOf(key, vm.types.typeKeyword)) return hash.value[key.value] = args[0];
              }
              if (vm.instanceOf(hash, vm.types.typeType)) {
                if (vm.instanceOf(key, vm.types.typeString)) return hash.value.members[key.value] = args[0];
                if (vm.instanceOf(key, vm.types.typeKeyword)) return hash.value.members[key.value] = args[0];
              }
              throw "Type Error: " + hash.type.value.name + "[" + key.type.value.name + "]";
            }
          } else if (context === "invoke") {
            if (operator === "bracketsCurly") {
              codes[0](vm, "invoke");
              return;
            }
            vm.callOperator(operator, codes, "get", []);
            return;
          } else if (context === "get_line") {
            return vm.callOperator(operator, codes, "get", args);
          } else if (context === "contentStatement") {
            if (operator === "bracketsRound") return ["round", codes[0], undefined, createCodeFromMethod(operator, codes)];
            if (operator === "bracketsSquare") return ["square", codes[0], undefined, createCodeFromMethod(operator, codes)];
            if (operator === "bracketsCurly") return ["curly", codes[0], undefined, createCodeFromMethod(operator, codes)];
            return ["normal", createCodeFromMethod(operator, codes), undefined, createCodeFromMethod(operator, codes)];
          } else if (context === "arguments") {
            if (operator === "leftDollar") return vm.createObject(vm.types.typeObject, [[codes[0](vm, "argumentName"), vm.types.typeValue]]);
            if (operator === "operatorColon") return vm.createObject(vm.types.typeObject, [[codes[0](vm, "argumentName"), codes[1](vm, "get", [vm.createObject(vm.types.typeKeyword, "class")])]]);
            if (operator === "enumerateComma") return vm.createObject(vm.types.typeObject, codes.map(function(code) { return code(vm, "argument").value; }));
          } else if (context === "argument") {
            if (operator === "leftDollar") return vm.createObject(vm.types.typeObject, [codes[0](vm, "argumentName"), vm.types.typeValue]);
            if (operator === "operatorColon") return vm.createObject(vm.types.typeObject, [codes[0](vm, "argumentName"), codes[1](vm, "get", [vm.createObject(vm.types.typeKeyword, "class")])]);
          } else if (context === "argumentName") {
            if (operator === "leftDollar") return codes[0](vm, "argumentName");
          }

          if (operator === "leftAsterisk") {
            var value = codes[0](vm, "get", []);
            if (vm.instanceOf(value, vm.types.typePointer)) return value.value.call(vm, context, args);
            throw "Type Error: " + operator + "/" + value.type.value.name;
          }
          if (operator === "ternaryQuestionColon") return codes[vm.toBoolean(codes[0](vm, "get", [])) ? 1 : 2](vm, context, args);
          if (operator === "bracketsRound") return vm.callInFrame(codes[0], vm, context, args);
          //############################################################## TODO ###############################################################

          var blessedsArgs = codes.map(function(code) { return code(vm, "get", []); });
          blessedsArgs.unshift(vm.createObject(vm.types.typeString, context));
          var blessedsTypes = blessedsArgs.map(function(blessed) { return blessed.type; });

          res = vm.tryCallMethodOfOperator("_" + context + "_" + operator, blessedsArgs);
          if (res !== false) return res;

          res = vm.tryCallMethodOfOperator("_" + operator, blessedsArgs);
          if (res !== false) return res;

          throw "Unknown operator: " + operator + "/" + context;
        };
        VMStandard.prototype.toString = function(value) {
          this.consumeLoopCapacity();
          if (this.instanceOf(value, this.types.typeValue)) {
            return "" + this.callMethodOfBlessed(value, ["method", "function"], "toString", this.VOID).value;
          } else {
            return "" + value;
          }
        };
        VMStandard.prototype.toNative = function(value) {
          this.consumeLoopCapacity();
          var vm = this;
          if (this.instanceOf(value, this.types.typeVector)) {
            return value.value.map(function(scalar) { return vm.toNative(scalar); });
          }
          if (this.instanceOf(value, this.types.typeArray)) {
            return value.value.map(function(scalar) { return vm.toNative(scalar); });
          }
          return value.value;
        };
        VMStandard.prototype.toBoolean = function(value) {
          this.consumeLoopCapacity();
          if (this.instanceOf(value, this.types.typeValue)) {
            return !!this.callMethodOfBlessed(value, ["method", "function"], "toBoolean", this.VOID).value;
          } else {
            return !!value;
          }
        };
        VMStandard.prototype.createLiteral = function(type, value, context, args) {
          var vm = this;
          vm.consumeLoopCapacity();
          //############################################################## TODO ###############################################################
          if (context === "get") {
            if (type === "Integer") return vm.createObject(vm.types.typeNumber, value);
            if (type === "Float") return vm.createObject(vm.types.typeNumber, value);
            if (type === "String") return vm.createObject(vm.types.typeString, value);
            if (type === "Affix" || type === "Identifier") {
              if (value === "true") return vm.TRUE;
              if (value === "false") return vm.FALSE;
              if (value === "undefined") return vm.UNDEFINED;
              if (value === "null") return vm.NULL;
              if (value === "Infinity") return vm.createObject(vm.types.typeNumber, Infinity);
              if (value === "NaN") return vm.createObject(vm.types.typeNumber, NaN);

              if (args.length > 0) {
                var accesses = args.map(function(arg) { return arg.value; });
                var variable;

                for (var i = 0; i < accesses.length; i++) {
                  variable = vm.scope.getOrUndefined(accesses[i] + "_" + value);
                  if (!vm.instanceOf(variable, vm.types.typeUndefined)) return variable;
                }

                variable = vm.scope.getOrUndefined(value);
                if (!vm.instanceOf(variable, vm.types.typeUndefined)) return variable;

              }
              return vm.createObject(vm.types.typeKeyword, value);
            }
            if (type === "Void") return vm.VOID;
            if (type === "HeredocumentVoid") return vm.NULL;
            if (type === "Boolean") return vm.getBoolean(value);
          } else if (context === "invoke") {
            return vm.createLiteral(type, value, "get", []);
          } else if (context === "get_line") {
            if (type === "Void") return vm.createObject(vm.types.typeObject, "VOID");
            return vm.createLiteral(type, value, "get", args);
          } else if (context === "contentStatement") {
            if (type === "Identifier") return ["keyword", createCodeFromLiteral(type, value), value, createCodeFromLiteral(type, value)];
            return ["normal", createCodeFromLiteral(type, value), undefined, createCodeFromLiteral(type, value)];
          } else if (context === "arguments") {
            if (type === "Identifier") return vm.createObject(vm.types.typeObject, [[vm.createObject(vm.types.typeKeyword, value), vm.types.typeValue]]);
            if (type === "Void") return vm.createObject(vm.types.typeObject, []);
          } else if (context === "argument") {
            if (type === "Identifier") return vm.createObject(vm.types.typeObject, [vm.createObject(vm.types.typeKeyword, value), vm.types.typeValue]);
          } else if (context === "argumentName") {
            if (type === "Identifier") return vm.createObject(vm.types.typeKeyword, value);
          }
          //############################################################## TODO ###############################################################
          throw "Unknown Literal Type: " + context + "/" + type;
        };
        VMStandard.prototype.pushScope = function() {
          this.scope = new Scope(this.scope, false, this.UNDEFINED);
        };
        VMStandard.prototype.pushFrame = function() {
          this.scope = new Scope(this.scope, true, this.UNDEFINED);
        };
        VMStandard.prototype.popFrame = function() {
          this.scope = this.scope.getParentFrame();
        };
        VMStandard.prototype.pushStack = function(scope2) {
          this.stack.push(this.scope);
          this.scope = scope2;
        };
        VMStandard.prototype.popStack = function() {
          this.scope = this.stack.pop();
        };

        VMStandard.prototype.createObject = function(type, value) {
          return {
            type: type,
            value: value,
          };
        };
        VMStandard.prototype.getBoolean = function(value) {
          return value ? this.TRUE : this.FALSE;
        };
        VMStandard.prototype.createException = function(message) {
          return this.createObject(this.types.typeException, {
            message: message,
          });
        };
        VMStandard.prototype.createType = function(name, supertype) {
          return this.createObject(this.types.typeType, {
            name: name,
            supertype: supertype,
            members: {},
          });
        };
        VMStandard.prototype.packVector = function(array) {
          var vm = this;

          function visitScalar(array, blessed)
          {
            if (vm.instanceOf(blessed, vm.types.typeVector)) {
              for (var i = 0; i < blessed.value.length; i++) {
                visitScalar(array, blessed.value[i]);
              }
            } else {
              array.push(blessed);
            }
          }

          var array2 = [];
          array.forEach(function(item) { visitScalar(array2, item); });
          if (array2.length == 1) return array2[0];
          return this.createObject(this.types.typeVector, array2);
        };
        VMStandard.prototype.unpackVector = function(blessed) {
          if (this.instanceOf(blessed, this.types.typeVector)) return blessed.value.concat();
          return [blessed];
        };
        VMStandard.prototype.callInFrame = function(code, vm, context, args) {
          this.pushFrame();
          var res;
          try {
            res = code(this, context, args);
          } finally {
            this.popFrame();
          }
          return res;
        };
        VMStandard.prototype.instanceOf = function(blessed, blessedType2) {
          if ((typeof blessed) !== "object") return false;
          if (blessed.type === undefined) return false;

          var blessedType = blessed.type;

          while (blessedType !== null) {
            if (blessedType == blessedType2) return true;
            blessedType = blessedType.value.supertype;
          }

          return false;
        };
        VMStandard.prototype.getMethodOfCall = function(name, accesses, blessedsTypes, predicate) {
          var res;

          for (var i = 0; i < blessedsTypes.length; i++) {
            var blessedType = blessedsTypes[i];
            while (blessedType !== null) {

              res = getProperty(blessedType.value.members, name) || this.UNDEFINED;
              if (this.instanceOf(res, this.types.typeFunction)) if (predicate(res)) return res;
              if (this.instanceOf(res, this.types.typeVector)) {
                for (var i = 0; i < res.value.length; i++) {
                  if (this.instanceOf(res.value[i], this.types.typeFunction)) if (predicate(res.value[i])) return res.value[i];
                }
              }

              blessedType = blessedType.value.supertype;
            }
          }

          for (var i = 0; i < accesses.length; i++) {

            res = this.scope.getOrUndefined(accesses[i] + "_" + name);
            if (this.instanceOf(res, this.types.typeFunction)) if (predicate(res)) return res;
            if (this.instanceOf(res, this.types.typeVector)) {
              for (var i = 0; i < res.value.length; i++) {
                if (this.instanceOf(res.value[i], this.types.typeFunction)) if (predicate(res.value[i])) return res.value[i];
              }
            }

          }

          res = this.scope.getOrUndefined(name);
          if (this.instanceOf(res, this.types.typeFunction)) if (predicate(res)) return res;
          if (this.instanceOf(res, this.types.typeVector)) {
            for (var i = 0; i < res.value.length; i++) {
              if (this.instanceOf(res.value[i], this.types.typeFunction)) if (predicate(res.value[i])) return res.value[i];
            }
          }

          return this.UNDEFINED;
        };
        VMStandard.prototype.tryCallMethod = function(name, accesses, blessedsTypes, blessedsArgs) {
          var vm = this;
          var res = this.getMethodOfCall(name, accesses, blessedsTypes, function(blessedFunction) {
            return blessedFunction.value.isCallable(vm, blessedsArgs);
          });
          if (this.instanceOf(res, this.types.typeFunction)) {
            return res.value.call(this, blessedsArgs);
          }
          return false;
        };
        VMStandard.prototype.tryCallMethodOfOperator = function(name, blessedsArgs) {
          return this.tryCallMethod(name, [], blessedsArgs.map(function(blessedArg) { return blessedArg.type; }), blessedsArgs);
        };
        VMStandard.prototype.callMethod = function(name, accesses, blessedsTypes, blessedsArgs) {
          var vm = this;
          var res = this.getMethodOfCall(name, accesses, blessedsTypes, function(blessedFunction) {
            return blessedFunction.value.isCallable(vm, blessedsArgs);
          });
          if (this.instanceOf(res, this.types.typeFunction)) {
            return res.value.call(this, blessedsArgs);
          }
          throw "No such method: " + name + "(" + blessedsArgs.map(function(blessedArg) { return blessedArg.type.value.name; }).join(", ") + ")/"
            + blessedsTypes.map(function(blessedType) { return blessedType.value.name; }).join(", ");
        };
        VMStandard.prototype.callMethodOfBlessed = function(blessedObject, accessess, name, blessedArgs) {
          var blesseds = this.unpackVector(blessedArgs);
          blesseds.unshift(blessedObject);
          return this.callMethod(name, accessess, [blessedObject.type], blesseds);
        };

        VMStandard.prototype.initBootstrap = function() {
          var vm = this;
          var listeners = [];

          function createConstructor(blessedType)
          {
            return function() {
              blessedType.value.members["new"] = VMSFunction.create(vm, [["type", vm.types.typeValue]], function(vm, context) {
                var blessedValue = vm.scope.getOrUndefined("type");
                if (vm.instanceOf(blessedValue, blessedType)) return blessedValue;
                throw "Construct Error: Expected " + blessedType.value.name + " but " + blessedValue.type.value.name;
              }, vm.scope);
            };
          }

          this.types = {};
          this.types.typeType = this.createType("Type", null); // 先頭でなければcreateTypeが失敗する
          this.types.typeType.type = this.types.typeType;

           this.types.typeValue = this.createType("Value", null);
             this.types.typeUndefined = this.createType("Undefined", this.types.typeValue);
             this.types.typeDefined = this.createType("Defined", this.types.typeValue);
               this.types.typeType.value.supertype = this.types.typeDefined;
               this.types.typeNull = this.createType("Null", this.types.typeDefined);
               this.types.typeNumber = this.createType("Number", this.types.typeDefined); listeners.push(createConstructor(this.types.typeNumber));
               this.types.typeString = this.createType("String", this.types.typeDefined); listeners.push(createConstructor(this.types.typeString));
                 this.types.typeKeyword = this.createType("Keyword", this.types.typeString);
                 this.types.typeText = this.createType("Text", this.types.typeString);
               this.types.typeBoolean = this.createType("Boolean", this.types.typeDefined); listeners.push(createConstructor(this.types.typeBoolean));
               this.types.typeFunction = this.createType("Function", this.types.typeDefined); listeners.push(createConstructor(this.types.typeFunction));
               // this.types.typeFunctionNative = this.createType("FunctionNative", this.types.typeDefined); TODO
               this.types.typePointer = this.createType("Pointer", this.types.typeDefined); listeners.push(createConstructor(this.types.typePointer));
               this.types.typeArray = this.createType("Array", this.types.typeDefined); listeners.push(createConstructor(this.types.typeArray));
                 this.types.typeVector = this.createType("Vector", this.types.typeArray);
               this.types.typeObject = this.createType("Object", this.types.typeDefined); listeners.push(createConstructor(this.types.typeObject));
                 this.types.typeHash = this.createType("Hash", this.types.typeObject);
                 this.types.typeEntry = this.createType("Entry", this.types.typeObject);
                 this.types.typeException = this.createType("Exception", this.types.typeObject);
               this.types.typeCode = this.createType("Code", this.types.typeDefined);
               this.types.typeScope = this.createType("Scope", this.types.typeDefined);

          this.UNDEFINED = this.createObject(this.types.typeUndefined, undefined);
          this.NULL = this.createObject(this.types.typeNull, null);
          this.VOID = this.packVector([]);
          this.TRUE = this.createObject(this.types.typeBoolean, true);
          this.FALSE = this.createObject(this.types.typeBoolean, false);
          this.NAN = this.createObject(this.types.typeNumber, NaN);
          this.INFINITY = this.createObject(this.types.typeNumber, Infinity);

          this.scope = new Scope(null, true, vm.UNDEFINED);
          this.stack = [];

          listeners.map(function(a) { a(); })

          this.dices = [];
          this.loopCapacity = 50000;
          this.loopCount = 0;

        };
        VMStandard.prototype.consumeLoopCapacity = function() {
          this.loopCount++;
          if (this.loopCount >= this.loopCapacity) {
            throw "Internal Fluorite Error: Too many calculation(>= " + this.loopCapacity + " steps)";
          }
        };

        VMStandard.prototype.initLibrary = function() {
          var vm = this;

          vm.types.typeValue.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, "<" + blessedsArgs[0].type.value.name + ">");
          });
          vm.types.typeNumber.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, "" + blessedsArgs[0].value);
          });
          vm.types.typeString.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeString], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, blessedsArgs[0].value);
          });
          vm.types.typeBoolean.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeBoolean], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, "" + blessedsArgs[0].value);
          });
          vm.types.typeArray.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeArray], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, "[" + blessedsArgs[0].value.map(function(scalar) { return vm.toString(scalar); }).join(", ") + "]");
          });
          vm.types.typeHash.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeHash], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, "{" + Object.keys(blessedsArgs[0].value).map(function(key) {
              return key + ": " + vm.toString(blessedsArgs[0].value[key]);
            }).join(", ") + "}");
          });
          vm.types.typeEntry.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeEntry], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, vm.toString(blessedsArgs[0].value.key) + ": " + vm.toString(blessedsArgs[0].value.value));
          });
          vm.types.typeVector.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeVector], function(vm, blessedsArgs) {
            if (blessedsArgs[0].value.length == 0) return vm.createObject(vm.types.typeString, "<Void>");
            return vm.createObject(vm.types.typeString, blessedsArgs[0].value.map(function(scalar) { return vm.toString(scalar); }).join(", "));
          });
          vm.types.typeType.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeType], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, "<Type: " + blessedsArgs[0].value.name + ">");
          });
          vm.types.typeFunction.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeFunction], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, blessedsArgs[0].value.toStringVMS());
          });
          vm.types.typeException.value.members["toString"] = VMSFunctionNative.create(vm, [vm.types.typeException], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, "<Exception: '" + blessedsArgs[0].value.message + "'>");
          });

          vm.types.typeValue.value.members["toBoolean"] = VMSFunctionNative.create(vm, [vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.TRUE;
          });
          vm.types.typeUndefined.value.members["toBoolean"] = VMSFunctionNative.create(vm, [vm.types.typeUndefined], function(vm, blessedsArgs) {
            return vm.FALSE;
          });
          vm.types.typeNull.value.members["toBoolean"] = VMSFunctionNative.create(vm, [vm.types.typeNull], function(vm, blessedsArgs) {
            return vm.FALSE;
          });
          vm.types.typeNumber.value.members["toBoolean"] = VMSFunctionNative.create(vm, [vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.getBoolean(blessedsArgs[0].value != 0);
          });
          vm.types.typeString.value.members["toBoolean"] = VMSFunctionNative.create(vm, [vm.types.typeString], function(vm, blessedsArgs) {
            return vm.getBoolean(blessedsArgs[0].value !== "");
          });
          vm.types.typeBoolean.value.members["toBoolean"] = VMSFunctionNative.create(vm, [vm.types.typeBoolean], function(vm, blessedsArgs) {
            return blessedsArgs[0];
          });
          vm.types.typeArray.value.members["toBoolean"] = VMSFunctionNative.create(vm, [vm.types.typeArray], function(vm, blessedsArgs) {
            return vm.getBoolean(blessedsArgs[0].value.length > 0);
          });

          {
            var hash = {};
            Object.keys(vm.types).forEach(function(key) {
              hash[vm.types[key].value.name] = vm.types[key];
            });
            vm.scope.setOrDefine("fluorite", vm.createObject(vm.types.typeHash, {
              "type": vm.createObject(vm.types.typeHash, hash),
            }));
          }
          Object.keys(vm.types).forEach(function(key) {
            vm.scope.setOrDefine("class_" + vm.types[key].value.name, vm.types[key]);
          });
          function createNativeBridge(restype, args, func)
          {
            return VMSFunctionNative.create(vm, args, function(vm, blessedsArgs) {
              return vm.createObject(restype, func.apply(vm, blessedsArgs.map(function (item) { return item.value; })));
            });
          }
          vm.scope.setOrDefine("Math", vm.createObject(vm.types.typeHash, {
            "PI": vm.createObject(vm.types.typeNumber, Math.PI),
            "E": vm.createObject(vm.types.typeNumber, Math.E),
            "abs": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.abs),
            "sin": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.sin),
            "cos": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.cos),
            "tan": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.tan),
            "asin": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.asin),
            "acos": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.acos),
            "atan": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.atan),
            "atan2": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber, vm.types.typeNumber], Math.atan2),
            "log": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.log),
            "ceil": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.ceil),
            "floor": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.floor),
            "exp": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.exp),
            "pow": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber, vm.types.typeNumber], Math.pow),
            "random": vm.packVector([
              createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber, vm.types.typeNumber], function(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
              }),
              createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], function(patterns) {
                return Math.floor(Math.random() * patterns);
              }),
              createNativeBridge(vm.types.typeNumber, [], Math.random),
            ]),
            "sqrt": createNativeBridge(vm.types.typeNumber, [vm.types.typeNumber], Math.sqrt),
          }));

          vm.scope.setOrDefine("_get_core_operatorQuestionColon", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode, vm.types.typeCode], function(vm, blessedsArgs) {
            var a = blessedsArgs[1].value(vm, "get", []);
            return vm.toBoolean(a) ? VMSPointer.createFromBlessed(vm, a, vm.scope) : VMSPointer.create(vm, blessedsArgs[2].value, vm.scope);
          }));
          vm.scope.setOrDefine("_get_core_operatorQuestion2", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode, vm.types.typeCode], function(vm, blessedsArgs) {
            var a = blessedsArgs[1].value(vm, "get", []);
            return !vm.instanceOf(a, vm.types.typeUndefined) ? VMSPointer.createFromBlessed(vm, a, vm.scope) : VMSPointer.create(vm, blessedsArgs[2].value, vm.scope);
          }));

          vm.scope.setOrDefine("_get_core_rightPlus2", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode], function(vm, blessedsArgs) {
            var res = blessedsArgs[1].value(vm, "get", []);
            if (!vm.instanceOf(res, vm.types.typeNumber)) throw "Illegal type: " + res.type.value.name + " != Number";
            blessedsArgs[1].value(vm, "set", [vm.createObject(vm.types.typeNumber, res.value + 1)]);
            return VMSPointer.createFromBlessed(vm, res, vm.scope);
          }));
          vm.scope.setOrDefine("_get_core_rightMinus2", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode], function(vm, blessedsArgs) {
            var res = blessedsArgs[1].value(vm, "get", []);
            if (!vm.instanceOf(res, vm.types.typeNumber)) throw "Illegal type: " + res.type.value.name + " != Number";
            blessedsArgs[1].value(vm, "set", [vm.createObject(vm.types.typeNumber, res.value - 1)]);
            return VMSPointer.createFromBlessed(vm, res, vm.scope);
          }));

          vm.scope.setOrDefine("_get_hereDocumentFunction", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeString, vm.types.typeValue, vm.types.typeText], function(vm, blessedsArgs) {
            return vm.callMethod(blessedsArgs[1].value, ["decoration", "function"], [], vm.unpackVector(vm.packVector([blessedsArgs[3], blessedsArgs[2]])));
          }));
          vm.scope.setOrDefine("_get_core_leftMultibyte", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode, vm.types.typeCode], function(vm, blessedsArgs) {
            return VMSPointer.createFromBlessed(vm, vm.callOperator("leftMultibyte_" + blessedsArgs[1].value(vm, "get", []).value, [blessedsArgs[2].value], "get", []), vm.scope);
          }));
          vm.scope.setOrDefine("_get_core_operatorMultibyte", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode, vm.types.typeCode, vm.types.typeCode], function(vm, blessedsArgs) {
            return VMSPointer.createFromBlessed(vm, vm.callOperator("operatorMultibyte_" + blessedsArgs[2].value(vm, "get", []).value, [blessedsArgs[1].value, blessedsArgs[3].value], "get", []), vm.scope);
          }));
          vm.scope.setOrDefine("_get_leftWord", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeString, vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.callMethod(blessedsArgs[1].value, ["leftWord", "word", "function"], [blessedsArgs[2].type], [blessedsArgs[2]]);
          }));
          vm.scope.setOrDefine("_get_operatorWord", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue, vm.types.typeString, vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.callMethod(blessedsArgs[2].value, ["operatorWord", "word", "function"], [blessedsArgs[1].type, blessedsArgs[3].type], [blessedsArgs[1], blessedsArgs[3]]);
          }));
          vm.scope.setOrDefine("_get_rightComposite", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue, vm.types.typeString], function(vm, blessedsArgs) {
            return vm.callMethod(blessedsArgs[2].value, ["rightComposite", "composite", "function"], [blessedsArgs[1].type], [blessedsArgs[1]]);
          }));
          vm.scope.setOrDefine("_get_operatorComposite", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue, vm.types.typeString, vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.callMethod(blessedsArgs[2].value, ["operatorComposite", "composite", "function"], [blessedsArgs[1].type, blessedsArgs[3].type], [blessedsArgs[1], blessedsArgs[3]]);
          }));
          vm.scope.setOrDefine("_get_leftDollar", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeString], function(vm, blessedsArgs) {
            return vm.scope.getOrUndefined(blessedsArgs[1].value);
          }));
          vm.scope.setOrDefine("_get_core_leftAmpersand", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode], function(vm, blessedsArgs) {
            return VMSPointer.createFromBlessed(vm, VMSPointer.create(vm, blessedsArgs[1].value, vm.scope), vm.scope);
          }));
          vm.scope.setOrDefine("_get_core_operatorColonGreater", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode, vm.types.typeCode], function(vm, blessedsArgs) {
            var array = blessedsArgs[1].value(vm, "arguments").value.map(function(item) { return [item[0].value, item[1]]; });
            return VMSPointer.createFromBlessed(vm, VMSFunction.create(vm, array, blessedsArgs[2].value, vm.scope), vm.scope);
          }));
          vm.scope.setOrDefine("_get_core_operatorEqual", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode, vm.types.typeCode], function(vm, blessedsArgs) {
            return VMSPointer.createFromBlessed(vm, blessedsArgs[1].value(vm, "set", [blessedsArgs[2].value(vm, "get", [])]), vm.scope);
          }));

          vm.scope.setOrDefine("_get_core_operatorColon2", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode, vm.types.typeCode], function(vm, blessedsArgs) {
            var hash = blessedsArgs[1].value(vm, "get", [vm.createObject(vm.types.typeKeyword, "class"), vm.createObject(vm.types.typeKeyword, "hash")]);
            var key = blessedsArgs[2].value(vm, "get", []);
            if (vm.instanceOf(hash, vm.types.typeHash)) {
              if (vm.instanceOf(key, vm.types.typeString)) return VMSPointer.createFromBlessed(vm, getProperty(hash.value, key.value) || vm.UNDEFINED, vm.scope);
            }
            if (vm.instanceOf(hash, vm.types.typeType)) {
              if (vm.instanceOf(key, vm.types.typeString)) return VMSPointer.createFromBlessed(vm, getProperty(hash.value.members, key.value) || vm.UNDEFINED, vm.scope);
            }
            throw "Type Error: " + hash.type.value.name + "::" + key.type.value.name;
          }));
          vm.scope.setOrDefine("_get_core_rightbracketsSquare", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode, vm.types.typeCode], function(vm, blessedsArgs) {
            var hash = blessedsArgs[1].value(vm, "get", [vm.createObject(vm.types.typeKeyword, "array")]);
            var key = blessedsArgs[2].value(vm, "get", []);
            if (vm.instanceOf(hash, vm.types.typeArray)) {
              if (vm.instanceOf(key, vm.types.typeNumber)) return VMSPointer.createFromBlessed(vm, hash.value[key.value] || vm.UNDEFINED, vm.scope);
            }
            if (vm.instanceOf(hash, vm.types.typeHash)) {
              if (vm.instanceOf(key, vm.types.typeString)) return VMSPointer.createFromBlessed(vm, getProperty(hash.value, key.value) || vm.UNDEFINED, vm.scope);
            }
            throw "Type Error: " + hash.type.value.name + "[" + key.type.value.name + "]";
          }));
          vm.scope.setOrDefine("_get_core_operatorHash", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode, vm.types.typeCode], function(vm, blessedsArgs) {
            var hash = blessedsArgs[1].value(vm, "get", [vm.createObject(vm.types.typeKeyword, "class")]);
            var key = blessedsArgs[2].value(vm, "get", []);
            if (vm.instanceOf(hash, vm.types.typeType)) {
              if (vm.instanceOf(key, vm.types.typeString)) {
                var value;
                while (hash != null) {
                  value = getProperty(hash.value.members, key.value) || vm.UNDEFINED;
                  if (!vm.instanceOf(value, vm.types.typeUndefined)) return VMSPointer.createFromBlessed(vm, value, vm.scope);
                  hash = hash.value.supertype;
                }
                return VMSPointer.createFromBlessed(vm, vm.UNDEFINED, vm.scope);
              }
            }
            throw "Type Error: " + hash.type.value.name + "#" + key.type.value.name;
          }));
          vm.scope.setOrDefine("_get_core_rightbracketsRound", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeCode, vm.types.typeCode], function(vm, blessedsArgs) {
            var hash = blessedsArgs[1].value(vm, "get", [vm.createObject(vm.types.typeKeyword, "function")]);
            var key = blessedsArgs[2].value(vm, "get", []);
            if (vm.instanceOf(hash, vm.types.typeFunction)) {
              return VMSPointer.createFromBlessed(vm, hash.value.call(vm, vm.unpackVector(key)), vm.scope);
            }
            if (vm.instanceOf(hash, vm.types.typeVector)) {
              var array = vm.unpackVector(key);
              for (var i = 0; i < hash.value.length; i++) {
                if (hash.value[i].value.isCallable(vm, array)) {
                  return VMSPointer.createFromBlessed(vm, hash.value[i].value.call(vm, array), vm.scope);
                }
              }
            }
            throw "Type Error: " + hash.type.value.name + "(" + key.type.value.name + ")";
          }));

          vm.scope.setOrDefine("_get_core_enumerateSemicolon", VMSFunctionNative.create(vm, [vm.types.typeValue], function(vm, blessedsArgs) {
            var result = vm.VOID;
            for (var i = 1; i < blessedsArgs.length; i++) {
              var res = blessedsArgs[i].value(vm, "get_line", []);
              if (vm.instanceOf(res, vm.types.typeObject)) {
                if (res.value === "VOID") {
                  continue;
                }
              }
              result = res;
            }
            return VMSPointer.createFromBlessed(vm, result, vm.scope);
          }));

          vm.scope.setOrDefine("_get_operatorPlus", vm.packVector([
            VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
              return vm.createObject(vm.types.typeNumber, blessedsArgs[1].value + blessedsArgs[2].value);
            }),
            VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeString, vm.types.typeValue], function(vm, blessedsArgs) {
              return vm.createObject(vm.types.typeString, blessedsArgs[1].value + vm.toString(blessedsArgs[2]));
            }),
            VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue, vm.types.typeString], function(vm, blessedsArgs) {
              return vm.createObject(vm.types.typeString, vm.toString(blessedsArgs[1]) + blessedsArgs[2].value);
            }),
          ]));
          vm.scope.setOrDefine("_get_operatorMinus", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeNumber, blessedsArgs[1].value - blessedsArgs[2].value);
          }));
          vm.scope.setOrDefine("_get_operatorAsterisk", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeNumber, blessedsArgs[1].value * blessedsArgs[2].value);
          }));
          vm.scope.setOrDefine("_get_operatorPercent", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeNumber, blessedsArgs[1].value % blessedsArgs[2].value);
          }));
          vm.scope.setOrDefine("_get_operatorSlash", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeNumber, blessedsArgs[1].value / blessedsArgs[2].value);
          }));
          vm.scope.setOrDefine("_get_operatorCaret", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeNumber, Math.pow(blessedsArgs[1].value, blessedsArgs[2].value));
          }));

          vm.scope.setOrDefine("_get_leftPlus", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue], function(vm, blessedsArgs) {
            return blessedsArgs[1];
          }));
          vm.scope.setOrDefine("_get_leftMinus", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeNumber, -blessedsArgs[1].value);
          }));
          vm.scope.setOrDefine("_get_leftExclamation", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeBoolean, !vm.toBoolean(blessedsArgs[1]));
          }));

          vm.scope.setOrDefine("_get_operatorGreater", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeBoolean, blessedsArgs[1].value > blessedsArgs[2].value);
          }));
          vm.scope.setOrDefine("_get_operatorGreaterEqual", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeBoolean, blessedsArgs[1].value >= blessedsArgs[2].value);
          }));
          vm.scope.setOrDefine("_get_operatorLess", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeBoolean, blessedsArgs[1].value < blessedsArgs[2].value);
          }));
          vm.scope.setOrDefine("_get_operatorLessEqual", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeBoolean, blessedsArgs[1].value <= blessedsArgs[2].value);
          }));
          vm.scope.setOrDefine("_get_operatorEqual2", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue, vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeBoolean, blessedsArgs[1].value === blessedsArgs[2].value);
          }));
          vm.scope.setOrDefine("_get_operatorExclamationEqual", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue, vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeBoolean, blessedsArgs[1].value !== blessedsArgs[2].value);
          }));
          vm.scope.setOrDefine("_get_operatorPipe2", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue, vm.types.typeValue], function(vm, blessedsArgs) {
            return blessedsArgs[vm.toBoolean(blessedsArgs[1]) ? 1 : 2];
          }));
          vm.scope.setOrDefine("_get_operatorAmpersand2", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue, vm.types.typeValue], function(vm, blessedsArgs) {
            return blessedsArgs[!vm.toBoolean(blessedsArgs[1]) ? 1 : 2];
          }));

          vm.scope.setOrDefine("_get_operatorTilde", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            var array = [];
            if (blessedsArgs[1].value < blessedsArgs[2].value) {
              for (var i = blessedsArgs[1].value; i <= blessedsArgs[2].value; i++) {
                array.push(vm.createObject(vm.types.typeNumber, i));
              }
            } else {
              for (var i = blessedsArgs[1].value; i >= blessedsArgs[2].value; i--) {
                array.push(vm.createObject(vm.types.typeNumber, i));
              }
            }
            return vm.packVector(array);
          }));
          vm.scope.setOrDefine("_get_enumerateComma", VMSFunctionNative.create(vm, [vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.packVector(blessedsArgs.slice(1));
          }));
          vm.scope.setOrDefine("_get_bracketsSquare", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeArray, vm.unpackVector(blessedsArgs[1]));
          }));
          /* TODO
          vm.scope.setOrDefine("_get_operatorColon2", vm.packVector([
            VMSFunction.create(vm, [["env", vm.types.typeValue], ["a", vm.types.typeArray], ["b", vm.types.typeNumber]], function(vm, context) {
              var a = vm.scope.getOrUndefined("a");
              var b = vm.scope.getOrUndefined("b");
              return a.value[b.value];
            }, vm.scope),
            VMSFunction.create(vm, [["env", vm.types.typeValue], ["a", vm.types.typeHash], ["b", vm.types.typeValue]], function(vm, context) {
              var a = vm.scope.getOrUndefined("a");
              var b = vm.scope.getOrUndefined("b");
              return a.value[vm.toString(b)];
            }, vm.scope),
          ]));
          */
          vm.scope.setOrDefine("_get_leftAtsign", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeArray], function(vm, blessedsArgs) {
            return vm.packVector(blessedsArgs[1].value);
          }));
          vm.scope.setOrDefine("_get_operatorColon", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue, vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeEntry, {
              key: vm.createObject(vm.types.typeKeyword, vm.toString(blessedsArgs[1])),
              value: blessedsArgs[2],
            });
          }));
          vm.scope.setOrDefine("_get_bracketsCurly", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeValue], function(vm, blessedsArgs) {
            var hash = {};
            vm.unpackVector(blessedsArgs[1]).forEach(function(item) {
              if (vm.instanceOf(item, vm.types.typeEntry)) {
                hash[item.value.key.value] = item.value.value;
                return;
              }
              throw "Type Error: " + item.type.value.name + " is not a Entry";
            });
            return vm.createObject(vm.types.typeHash, hash);
          }));
          vm.scope.setOrDefine("_get_concatenateLiteral", VMSFunctionNative.create(vm, [vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, blessedsArgs.slice(1).map(function(item) { return vm.toString(item); }).join(""));
          }));
          vm.scope.setOrDefine("_get_concatenateHereDocument", VMSFunctionNative.create(vm, [vm.types.typeValue], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeText, blessedsArgs.slice(1).map(function(item) { return vm.toString(item); }).join(""));
          }));

          function dice(count, faces)
          {
            var t = 0, i, value, values = [];
            for (i = 0; i < count; i++) {
              value = Math.floor(Math.random() * faces) + 1;
              t += value;
              values.push(value);
            }
            vm.dices.push({ faces: faces, results: values });
            return t;
          }
          vm.scope.setOrDefine("rightComposite_d", VMSFunctionNative.create(vm, [vm.types.typeNumber], function(vm, blessedsArgs) {
            if (blessedsArgs[0].value > 20) throw vm.createException("Illegal argument[0]: " + blessedsArgs[0].value + " > 20");
            return vm.createObject(vm.types.typeNumber, dice(blessedsArgs[0].value, 6));
          }));
          vm.scope.setOrDefine("function_d", VMSFunctionNative.create(vm, [vm.types.typeNumber, vm.types.typeNumber], function(vm, blessedsArgs) {
            if (blessedsArgs[0].value > 20) throw vm.createException("Illegal argument[0]: " + blessedsArgs[0].value + " > 20");
            return vm.createObject(vm.types.typeNumber, dice(blessedsArgs[0].value, blessedsArgs[1].value));
          }));
          vm.types.typeArray.value.members.random = vm.packVector([
            VMSFunctionNative.create(vm, [vm.types.typeArray, vm.types.typeNumber], function(vm, blessedsArgs) {
              var array = blessedsArgs[0].value.slice(0);
              while (array.length > blessedsArgs[1].value) {
                array.splice(Math.floor(Math.random() * array.length), 1);
              }
              return vm.createObject(vm.types.typeArray, array);
            }),
            VMSFunctionNative.create(vm, [vm.types.typeArray], function(vm, blessedsArgs) {
              return blessedsArgs[0].value[Math.floor(Math.random() * blessedsArgs[0].value.length)];
            }),
          ]);
          vm.types.typeCode.value.members.bind = VMSFunctionNative.create(vm, [vm.types.typeCode, vm.types.typeScope], function(vm, blessedsArgs) {
            return VMSPointer.create(vm, blessedsArgs[0].value, blessedsArgs[1].value);
          });
          vm.types.typePointer.value.members.code = VMSFunctionNative.create(vm, [vm.types.typePointer], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeCode, blessedsArgs[0].value.code);
          });
          vm.types.typePointer.value.members.scope = VMSFunctionNative.create(vm, [vm.types.typePointer], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeScope, blessedsArgs[0].value.scope);
          });
          vm.types.typeEntry.value.members.key = VMSFunctionNative.create(vm, [vm.types.typeEntry], function(vm, blessedsArgs) {
            return blessedsArgs[0].value.key;
          });
          vm.types.typeEntry.value.members.value = VMSFunctionNative.create(vm, [vm.types.typeEntry], function(vm, blessedsArgs) {
            return blessedsArgs[0].value.value;
          });
          vm.types.typeArray.value.members.length = VMSFunctionNative.create(vm, [vm.types.typeArray], function(vm, blessedsArgs) {
            return blessedsArgs[0].value.length;
          });
          vm.types.typeString.value.members.length = VMSFunctionNative.create(vm, [vm.types.typeString], function(vm, blessedsArgs) {
            return blessedsArgs[0].value.length;
          });
          vm.types.typeHash.value.members.keys = VMSFunctionNative.create(vm, [vm.types.typeHash], function(vm, blessedsArgs) {
            return vm.packVector(Object.keys(blessedsArgs[0].value).map(function(key) {
              return vm.createObject(vm.types.typeKeyword, key);
            }));
          });
          vm.types.typeType.value.members.super = VMSFunctionNative.create(vm, [vm.types.typeType], function(vm, blessedsArgs) {
            var result = blessedsArgs[0].value.supertype;
            return result === null ? vm.NULL : result;
          });
          vm.types.typeType.value.members.name = VMSFunctionNative.create(vm, [vm.types.typeType], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeString, blessedsArgs[0].value.name);
          });

          vm.scope.setOrDefine("_get_leftMultibyte_√", VMSFunctionNative.create(vm, [vm.types.typeValue, vm.types.typeNumber], function(vm, blessedsArgs) {
            return vm.createObject(vm.types.typeNumber, Math.sqrt(blessedsArgs[1].value));
          }));
          function joinImpl(vm, separator, blesseds)
          {
            return vm.createObject(vm.types.typeString, blesseds.map(function(item) {
              return vm.unpackVector(item).map(function(item2) {
                return vm.toString(item2);
              }).join(separator);
            }).join(separator));
          }
          vm.scope.setOrDefine("function_join", VMSFunctionNative.create(vm, [vm.types.typeString], function(vm, blessedsArgs) {
            return joinImpl(vm, blessedsArgs[0].value, blessedsArgs.slice(1));
          }));
          vm.scope.setOrDefine("function_join1", VMSFunctionNative.create(vm, [], function(vm, blessedsArgs) {
            return joinImpl(vm, "", blessedsArgs);
          }));
          vm.scope.setOrDefine("function_join2", VMSFunctionNative.create(vm, [], function(vm, blessedsArgs) {
            return joinImpl(vm, ", ", blessedsArgs);
          }));
          vm.scope.setOrDefine("function_join3", VMSFunctionNative.create(vm, [], function(vm, blessedsArgs) {
            return joinImpl(vm, "\n", blessedsArgs);
          }));
          vm.scope.setOrDefine("function_sum", VMSFunctionNative.create(vm, [], function(vm, blessedsArgs) {
            var value = 0;
            blessedsArgs.forEach(function(item) {
              return vm.unpackVector(item).forEach(function(item2) {
                if (!vm.instanceOf(item2, vm.types.typeNumber)) throw "Type Error: " + item2.type.value.name + " is not a Number";
                value += item2.value;
              });
            });
            return vm.createObject(vm.types.typeNumber, value);
          }));
          vm.scope.setOrDefine("function_average", VMSFunctionNative.create(vm, [], function(vm, blessedsArgs) {
            var value = 0;
            var count = 0;
            blessedsArgs.forEach(function(item) {
              return vm.unpackVector(item).forEach(function(item2) {
                if (!vm.instanceOf(item2, vm.types.typeNumber)) throw "Type Error: " + item2.type.value.name + " is not a Number";
                value += item2.value;
                count++;
              });
            });
            if (count == 0) return vm.NAN;
            return vm.createObject(vm.types.typeNumber, value / count);
          }));
          vm.scope.setOrDefine("function_count", VMSFunctionNative.create(vm, [], function(vm, blessedsArgs) {
            var count = 0;
            blessedsArgs.forEach(function(item) {
              count += vm.unpackVector(item).length;
            });
            return vm.createObject(vm.types.typeNumber, count);
          }));
          vm.scope.setOrDefine("function_and", VMSFunctionNative.create(vm, [], function(vm, blessedsArgs) {
            for (var i = 0; i < blessedsArgs.length; i++) {
              var item = vm.unpackVector(blessedsArgs[i]);
              for (var j = 0; j < item.length; j++) {
                if (!vm.toBoolean(item[j])) return vm.FALSE;
              }
            }
            return vm.TRUE;
          }));
          vm.scope.setOrDefine("function_or", VMSFunctionNative.create(vm, [], function(vm, blessedsArgs) {
            for (var i = 0; i < blessedsArgs.length; i++) {
              var item = vm.unpackVector(blessedsArgs[i]);
              for (var j = 0; j < item.length; j++) {
                if (vm.toBoolean(item[j])) return vm.TRUE;
              }
            }
            return vm.FALSE;
          }));
          vm.scope.setOrDefine("function_max", VMSFunctionNative.create(vm, [], function(vm, blessedsArgs) {
            var value;
            blessedsArgs.forEach(function(item) {
              return vm.unpackVector(item).forEach(function(item2) {
                if (!vm.instanceOf(item2, vm.types.typeNumber)) throw "Type Error: " + item2.type.value.name + " is not a Number";
                if (value === undefined || value < item2.value) value = item2.value;
              });
            });
            if (value === undefined) return vm.UNDEFINED;
            return vm.createObject(vm.types.typeNumber, value);
          }));
          vm.scope.setOrDefine("function_min", VMSFunctionNative.create(vm, [], function(vm, blessedsArgs) {
            var value;
            blessedsArgs.forEach(function(item) {
              return vm.unpackVector(item).forEach(function(item2) {
                if (!vm.instanceOf(item2, vm.types.typeNumber)) throw "Type Error: " + item2.type.value.name + " is not a Number";
                if (value === undefined || value > item2.value) value = item2.value;
              });
            });
            if (value === undefined) return vm.UNDEFINED;
            return vm.createObject(vm.types.typeNumber, value);
          }));
        };

        return VMStandard;
      })();
    } else {
      throw "Unknown VM name: " + name;
    }
  }

}

ExpressionPlain
  = main:Expression {
      var vm = new (getVM("standard"))();
      var texts = [main[0]];
      var i;
      for (i = 1; i < main.length; i += 2) {
        try {
          texts.push(vm.toString(main[i][1](vm, "get", [])));
        } catch (e) {
          try {
            texts.push("[Error: " + vm.toString(e) + "][" + main[i][0] + "]");
          } catch (e) {
            texts.push("[Error: " + e + "][" + main[i][0] + "]");
          }
        }
        texts.push(main[i + 1]);
      }
      return texts.join("");
    }

VMFactory
  = name:([a-zA-Z0-9_]+ { return text(); }) { return getVM(name); }

Expression
  = Message

Message
  = ("#!" [^\n\r]* ([\r\n] / "\r\n"))? head:MessageText tail:("\\" _ MessageFormula _ "\\" MessageText)* {
      var result = [head], i;

      for (i = 0; i < tail.length; i++) {
        result.push(tail[i][2]);
        result.push(tail[i][5]);
      }

      return result;
    }

MessageText
  = main:(
      [^\\]
    / "\\" _ "\\" { return "\\"; }
    )* { return main.join(""); }

MessageFormula
  = main:Formula {
      return [text(), main];
    }

Formula
  = Line

Line
  = head:Arrows tail:(_ (";") _ (Arrows / Void))* { return enumerate(head, tail, "Semicolon"); }
  / head:Void tail:(_ (";") _ (Arrows / Void))+ { return enumerate(head, tail, "Semicolon"); }

Arrows
  = head:(
      (
        main:Vector _ "-->" _ { return ["Minus2Greater", main]; }
      / main:Vector _ "->" _ { return ["MinusGreater", main]; }
      / main:Vector _ "==>" _ { return ["Equal2Greater", main]; }
      / main:Vector _ "=>" _ { return ["EqualGreater", main]; }
      )+
    / main:Vector _ ":>" _ { return [["ColonGreater", main]]; }
    / main:Vector _ "=" _ { return [["Equal", main]]; }
    )* tail:Vector {
      var result = tail, i, j;
      for (i = head.length - 1; i >= 0; i--) {
        var result2 = head[i][0][1];
        for (j = 1; j < head[i].length; j++) {
          result2 = createCodeFromMethod("operator" + head[i][j - 1][0], [result2, head[i][j][1]]);
        }
        result = createCodeFromMethod("operator" + head[i][head[i].length - 1][0], [result2, result]);
      }
      return result;
    }

Vector
  = head:Entry tail:(_ (",") _ (Entry / Void))* { return enumerate(head, tail, "Comma"); }
  / head:Void tail:(_ (",") _ (Entry / Void))+ { return enumerate(head, tail, "Comma"); }

Entry
  = head:Iif tail:(_ (
      ":" { return "Colon"; }
    ) _ Iif)* { return operatorLeft(head, tail); }

Iif
  = head:Range _ "?" _ body:Iif _ ":" _ tail:Iif { return createCodeFromMethod("ternaryQuestionColon", [head, body, tail]); }
  / head:Range _ "?:" _ tail:Iif { return createCodeFromMethod("operatorQuestionColon", [head, tail]); }
  / head:Range _ "??" _ tail:Iif { return createCodeFromMethod("operatorQuestion2", [head, tail]); }
  / Range

Range
  = head:Or tail:(_ (
      "~" { return "Tilde"; }
    / ".." { return "Period2"; }
    ) _ Or)* { return operatorLeft(head, tail); }

Or
  = head:And tail:(_ (
      "||" { return "Pipe2"; }
    / "|" { return "Pipe"; }
    ) _ And)* { return operatorLeft(head, tail); }

And
  = head:Compare tail:(_ (
      "&&" { return "Ampersand2"; }
    / "&" { return "Ampersand"; }
    ) _ Compare)* { return operatorLeft(head, tail); }

Compare
  = head:Shift tail:(_ (
      ">=" { return "GreaterEqual"; }
    / ">" { return "Greater"; }
    / "<=" { return "LessEqual"; }
    / "<" { return "Less"; }
    / "!=" { return "ExclamationEqual"; }
    / "==" { return "Equal2"; }
    ) _ Shift)* {
      if (tail.length == 0) return head;
      var codes = [], left = head, right, i;

      for (i = 0; i < tail.length; i++) {
        right = tail[i][3];
        codes.push(createCodeFromMethod("operator" + tail[i][1], [left, right]));
        left = right;
      }

      return function(vm, context, args) {
        if (context === "get") {
          var array = codes.map(function(code) { return code(vm, "get", []); });

          for (var i = 0; i < array.length; i++) {
            if (!vm.toBoolean(array[i])) return vm.createLiteral("Boolean", false, context, args);
          }

          return vm.createLiteral("Boolean", true, context, args);
        } else {
          throw "Unknown context: " + context;
        }
      };
    }

Shift
  = head:Add tail:(_ (
      "<<" { return "Less2"; }
    / ">>" { return "Greater2"; }
    ) _ Term)* { return operatorLeft(head, tail); }

Add
  = head:Term tail:(_ (
      "+" { return "Plus"; }
    / "-" { return "Minus"; }
    ) _ Term)* { return operatorLeft(head, tail); }

Term
  = head:Power tail:(_ (
      "*" { return "Asterisk"; }
    / "/" { return "Slash"; }
    / "%" { return "Percent"; }
    ) _ Power)* { return operatorLeft(head, tail); }

Power
  = head:(MultibyteOperating _ (
      "^" { return "Caret"; }
    ) _)* tail:MultibyteOperating { return operatorRight(head, tail); }

MultibyteOperating
  = head:Left tail:(_ (
      CharacterMultibyteSymbol { return ["Multibyte", createCodeFromLiteral("Identifier", text())]; }
    / "`" _ main:Formula _ "`" { return ["Word", main]; }
    ) _ Left)* { return operatorLeft(head, tail); }

Left
  = head:((
      "+" { return "Plus"; }
    / "-" { return "Minus"; }
    / "@" { return "Atsign"; }
    / "&" { return "Ampersand"; }
    / "*" { return "Asterisk"; }
    / "!" { return "Exclamation"; }
    / "~" { return "Tilde"; }
    / CharacterMultibyteSymbol { return ["Multibyte", createCodeFromLiteral("Identifier", text())]; }
    / "`" _ main:Formula _ "`" { return ["Word", main]; }
    ) _)* tail:Right { return left(head, tail); }

Right
  = head:Variable tail:(_ (
      "(" _ main:(Formula / Void) _ ")" { return ["rightbracketsRound", [main]]; }
    / "[" _ main:(Formula / Void) _ "]" { return ["rightbracketsSquare", [main]]; }
    / "{" _ main:(Formula / Void) _ "}" { return ["rightbracketsCurly", [main]]; }
    / "::" _ main:Variable { return ["operatorColon2", [main]]; }
    / "." _ main:Variable { return ["operatorPeriod", [main]]; }
    / "!" _ main:Variable { return ["operatorExclamation", [main]]; }
    / "#" _ main:Variable { return ["operatorHash", [main]]; }
    / "++" { return ["rightPlus2", []]; }
    / "--" (! ">") { return ["rightMinus2", []]; }
    / "..." { return ["rightPeriod3", []]; }
    ))* { return right(head, tail); }

Variable
  = head:((
      "$" { return "Dollar"; }
    ) _)* tail:Factor { return left(head, tail); }

Factor
  = "(" _ main:(Formula / Void) _ ")" { return createCodeFromMethod("bracketsRound", [main]); }
  / "[" _ main:(Formula / Void) _ "]" { return createCodeFromMethod("bracketsSquare", [main]); }
  / "{" _ main:(Formula / Void) _ "}" { return createCodeFromMethod("bracketsCurly", [main]); }
  / Composite
  / Identifier
  / String
  / StringReplaceable
  / HereDocument
  / Statement

Statement
  = "/" head:Identifier main:(_ ContentStatement)* (_ "/" (! Identifier))? {
      var array = [head];
      main.map(function(item) { array.push(item[1]); })
      return createCodeFromMethod("statement", array);
    }

ContentStatement
  = head:FactorStatement tail:(_ (",") _ FactorStatement)* { return enumerate(head, tail, "Comma"); }
  / Statement

FactorStatement
  = head:Variable tail:(_ (
      "::" _ main:Variable { return ["operatorColon2", [main]]; }
    / "." _ main:Variable { return ["operatorPeriod", [main]]; }
    / "#" _ main:Variable { return ["operatorHash", [main]]; }
    ))* { return right(head, tail); }

Composite
  = head:Number body:BodyComposite tail:Composite { return createCodeFromMethod("operatorComposite", [head, body, tail]); }
  / head:Number body:BodyComposite { return createCodeFromMethod("rightComposite", [head, body]); }
  / head:Number { return head; }

Number
  = Float
  / Hex
  / Integer

Float "Float"
  = [0-9]+ ("." [0-9]+)? [eE] [+-]? [0-9]+ { return createCodeFromLiteral("Float", parseFloat(text())); }
  / [0-9]+ "." [0-9]+ { return createCodeFromLiteral("Float", parseFloat(text())); }

Integer "Integer"
  = [0-9]+ { return createCodeFromLiteral("Integer", parseInt(text(), 10)); }

Hex "Hex"
  = "0x" main:([0-9a-zA-Z]+ { return text(); }) { return createCodeFromLiteral("Integer", parseInt(main, 16)); }

BodyComposite
  = CharacterIdentifier+ { return createCodeFromLiteral("Affix", text()); }

Identifier "Identifier"
  = CharacterIdentifier ([0-9] / CharacterIdentifier)* { return createCodeFromLiteral("Identifier", text()); }

String
  = "'" main:ContentString* "'" { return createCodeFromLiteral("String", main.join("")); }

ContentString
  = "\\\\" { return "\\"; }
  / "\\\"" { return "\""; }
  / "\\'" { return "'"; }
  / "\\$" { return "$"; }
  / "\\r" { return "\r"; }
  / "\\n" { return "\n"; }
  / "\\t" { return "\t"; }
  / "\\x" main:([a-zA-Z0-9][a-zA-Z0-9] { return text(); }) { return String.fromCharCode(parseInt(main, 16)); }
  / "\\u" main:([a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9] { return text(); }) { return String.fromCharCode(parseInt(main, 16)); }
  / [^'\\]

StringReplaceable
  = "\"" main:ContentStringReplaceable "\"" { return main; }

ContentStringReplaceable
  = head:ContentStringReplaceableText tail:(ContentStringReplaceableReplacement ContentStringReplaceableText)* {
      var codes = [head];
      var i;
      for (i = 0; i < tail.length; i++) {
        codes.push(tail[i][0]);
        codes.push(tail[i][1]);
      }
      return createCodeFromMethod("concatenateLiteral", codes);
    }

ContentStringReplaceableText
  = main:(
      "\\\\" { return "\\"; }
    / "\\\"" { return "\""; }
    / "\\'" { return "'"; }
    / "\\$" { return "$"; }
    / "\\r" { return "\r"; }
    / "\\n" { return "\n"; }
    / "\\t" { return "\t"; }
    / "\\x" main:([a-zA-Z0-9][a-zA-Z0-9] { return text(); }) { return String.fromCharCode(parseInt(main, 16)); }
    / "\\u" main:([a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9][a-zA-Z0-9] { return text(); }) { return String.fromCharCode(parseInt(main, 16)); }
    / [^"$\\]
    )* { return createCodeFromLiteral("String", main.join("")); }

ContentStringReplaceableReplacement
  = "$" "(" main:(Formula / Void) ")" { return main; }
  / "$" "{" main:(Formula / Void) "}" { return createCodeFromMethod("leftDollar", [main]); }
  / "$" main:(Integer / Identifier) { return createCodeFromMethod("leftDollar", [main]); }

HereDocument
  = "%" head:(head:Identifier "(" _ tail:(Formula / Void) _ ")" { return [head, tail]; })? tail:(
      ";" { return createCodeFromLiteral("HeredocumentVoid", "void"); }
    / (
        begin:HereDocumentDelimiter main:(
          "{" main:(

            main:(! ("}" end:HereDocumentDelimiter & { return begin === end; }) main:(
              "%%" { return "%"; }
            / [^%]
            ) { return main; })+ { return createCodeFromLiteral("String", main.join("")); }
          / HereDocument

          )* "}" { return createCodeFromMethod("concatenateHereDocument", main); }
        / "[" main:(

            main:(! ("]" end:HereDocumentDelimiter & { return begin === end; }) main:(
              .
            ) { return main; })+ { return createCodeFromLiteral("String", main.join("")); }

          )* "]" { return createCodeFromMethod("concatenateHereDocument", main); }
        / begin2:HereDocumentDelimiter2 main:(

            main:(! (end2:HereDocumentDelimiter2 end:HereDocumentDelimiter & { return begin2 === end2 && begin === end; }) main:(
              .
            ) { return main; })+ { return createCodeFromLiteral("String", main.join("")); }

          )* HereDocumentDelimiter2 { return createCodeFromMethod("concatenateHereDocument", main); }
        ) HereDocumentDelimiter { return main; }
      / (
          "{" main:(

            main:(! ("}") main:(
              "%%" { return "%"; }
            / [^%]
            ) { return main; })+ { return createCodeFromLiteral("String", main.join("")); }
          / HereDocument

          )* "}" { return createCodeFromMethod("concatenateHereDocument", main); }
        / "[" main:(

            main:(! ("]") main:(
              .
            ) { return main; })+ { return createCodeFromLiteral("String", main.join("")); }

          )* "]" { return createCodeFromMethod("concatenateHereDocument", main); }
        / begin2:HereDocumentDelimiter2 main:(

            main:(! (end2:HereDocumentDelimiter2 & { return begin2 === end2; }) main:(
              .
            ) { return main; })+ { return createCodeFromLiteral("String", main.join("")); }

          )* HereDocumentDelimiter2 { return createCodeFromMethod("concatenateHereDocument", main); }
        )
      )
    ) {
      if (head !== null) {
        return createCodeFromMethod("hereDocumentFunction", [head[0], head[1], tail]);
      } else {
        return tail;
      }
    }
  / "%" "(" _ tail:(Formula / Void) _ ")" {
      return tail;
    }

HereDocumentDelimiter
  = CharacterIdentifier+ { return text(); }

HereDocumentDelimiter2
  = [!"#$%&'*+,\-./:=?@\\^_`|~] { return text(); }

Void "Void"
  = ((! "a") "a")? { return createCodeFromLiteral("Void", "void"); }

_ "Comments"
  = (
      "/*" ((! "*/") .)* "*/"
    / CommentBlockNested
    / "//" [^\n\r]*
    / "#!" [^\n\r]*
    / CharacterBlank+
    )*

CommentBlockNested
  = "/+" (
      (! ("/+" / "+/")) .
    / CommentBlockNested
    )* "+/"

CharacterMultibyteSymbol
  = CharacterSurrogates
  / (! (CharacterSymbol / CharacterNumber / CharacterIdentifier / CharacterBlank / CharacterContectSurrogates)) .

CharacterSymbol
  = (! (CharacterNumber / CharacterAlphabet / CharacterSymbolIdentifier)) [!-~]

CharacterIdentifier
  = CharacterAlphabet
  / CharacterSymbolIdentifier
  / CharacterHiragana
  / CharacterKatakana
  / CharacterCJKUnifiedIdeographsExtensionA
  / CharacterCJKUnifiedIdeographs
  / CharacterGreekAndCoptic

CharacterNumber
  = [0-9]

CharacterAlphabet
  = [a-zA-Z]

CharacterSymbolIdentifier
  = [_]

CharacterHiragana
  = [\u3040-\u309F]

CharacterKatakana
  = [\u30A0-\u30FF]

CharacterCJKUnifiedIdeographsExtensionA
  = [\u3400-\u4DBF]

CharacterCJKUnifiedIdeographs
  = [\u4E00-\u9FFF]

CharacterGreekAndCoptic
  = [\u0370-\u03FF]

CharacterSurrogates
  = CharacterContectSurrogates CharacterContectSurrogates { return text(); }

CharacterContectSurrogates
  = [\uD800-\uDBFF\uDC00-\uDFFF]

CharacterBlank
  = [ \t\n\r　]
