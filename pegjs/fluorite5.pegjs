/*
 * Fluorite 5.7.0
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
      return vm.callMethod(operator, codes, context, args);
    };
  }

  function operatorLeft(head, tail)
  {
    var result = head, i;
    for (i = 0; i < tail.length; i++) {
      result = createCodeFromMethod("_operator" + tail[i][1], [result, tail[i][3]]);
    }
    return result;
  }

  function operatorRight(head, tail)
  {
    var result = tail, i;
    for (i = head.length - 1; i >= 0; i--) {
      var operator = head[i][2];
      if ((typeof operator) === "string") {
        result = createCodeFromMethod("_operator" + operator, [head[i][0], result]);
      } else {
        result = createCodeFromMethod("_operator" + operator[0], [head[i][0], operator[1], result]);
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
        result = createCodeFromMethod("_left" + operator, [result]);
      } else {
        result = createCodeFromMethod("_left" + operator[0], [operator[1], result]);
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
    return createCodeFromMethod("_enumerate" + operator, result);
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
          vm.dices.push(values);
          return t;
        }

        this.dices = [];
        this.callMethod = function(operator, codes, context, args) {

          if (context === "get") {

            if (operator === "_operatorPlus") return codes[0](vm, "get") + codes[1](vm, "get");
            if (operator === "_operatorMinus") return codes[0](vm, "get") - codes[1](vm, "get");
            if (operator === "_operatorAsterisk") return codes[0](vm, "get") * codes[1](vm, "get");
            if (operator === "_operatorSlash") return codes[0](vm, "get") / codes[1](vm, "get");
            if (operator === "_leftPlus") return codes[0](vm, "get");
            if (operator === "_leftMinus") return -codes[0](vm, "get");
            if (operator === "_bracketsRound") return codes[0](vm, "get");
            if (operator === "d") return dice(codes[0](vm, "get"), codes[1](vm, "get"));

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
        this.allTrue = function(array) {
          for (var i = 0; i < array.length; i++) {
            if (!array[i]) return false;
          }
          return true;
        };
        this.createLiteral = function(type, value, context, args) {
          return value;
        };
      };
    } else if (name === "standard") {
      return function() {
        var vm = this;

        function getVariable(name)
        {
          return scope.getOrUndefined(name)
        }
        function setVariable(name, value)
        {
          scope.setOrDefine(name, value);
        }
        function pushScope()
        {
          scope = new Scope(scope, false);
        }
        function pushFrame()
        {
          scope = new Scope(scope, true);
        }
        function popFrame()
        {
          scope = scope.getParentFrame();
        }
        function pushStack(scope2)
        {
          stack.push(scope);
          scope = scope2;
        }
        function popStack()
        {
          scope = stack.pop();
        }
        function callInFrame(code, vm, context, args)
        {
          pushFrame();
          var res = code(vm, context, args);
          popFrame();
          return res;
        }
        function createObject(type, value)
        {
          return {
            type: type,
            value: value,
          };
        }
        function dice(count, faces)
        {
          var t = 0, i, value, values = [];
          for (i = 0; i < count; i++) {
            value = Math.floor(Math.random() * faces) + 1;
            t += value;
            values.push(value);
          }
          vm.dices.push(values);
          return t;
        }
        function visitScalar(array, blessed)
        {
          if (instanceOf(blessed, typeVector)) {
            for (var i = 0; i < blessed.value.length; i++) {
              visitScalar(array, blessed.value[i]);
            }
          } else {
            array.push(blessed);
          }
        }
        function packVector(array)
        {
          var array2 = [];
          array.forEach(function(item) { visitScalar(array2, item); });
          if (array2.length == 1) return array2[0];
          return createObject(typeVector, array2);
        }
        function unpackVector(blessed)
        {
          if (instanceOf(blessed, typeVector)) return blessed.value;
          return [blessed];
        }
        function instanceOf(blessed, type)
        {
          return blessed.type === type;
        }
        function createFunction(args, code, scope)
        {
          return createObject(typeFunction, {
            args: args,
            code: code,
            scope: scope,
          });
        }
        function createPointer(code, scope)
        {
          return createObject(typePointer, {
            code: code,
            scope: scope,
          });
        }
        function callFunction(blessedFunction, blessedArgs)
        {
          var i;
          var array = unpackVector(blessedArgs);
          pushStack(blessedFunction.value.scope);
          pushFrame();
          for (i = 0; i < blessedFunction.value.args.length; i++) {
            setVariable(blessedFunction.value.args[i], array[i] || UNDEFINED);
          }
          setVariable("_", packVector(array.slice(i, array.length)));
          var res = blessedFunction.value.code(vm, "get");
          popFrame();
          popStack();
          return res;
        }
        function callPointer(blessedPointer, context, args)
        {
          pushStack(blessedPointer.value.scope);
          var res = blessedPointer.value.code(vm, context, args);
          popStack();
          return res;
        }
        function searchVariable(accesses, blessedKeyword)
        {
          var variable;

          for (var i = 0; i < accesses.length; i++) {
            variable = getVariable("_" + accesses[i] + "_" + blessedKeyword.value);
            if (!instanceOf(variable, typeUndefined)) return variable;
          }

          variable = getVariable(blessedKeyword.value);
          if (!instanceOf(variable, typeUndefined)) return variable;

          return UNDEFINED;
        }

        function Scope(parent, isFrame)
        {
          this.variables = {};
          this.parent = parent;
          this.isFrame = isFrame;
        }
        Scope.prototype.getVariable = function(name) {
          var variable = this.variables[name];
          if (variable != undefined) {
            return variable;
          } else {
            if (this.parent != undefined) {
              return this.parent.getVariable(name);
            } else {
              return undefined;
            }
          }
        };
        Scope.prototype.define = function(name) {
          if (this.getVariable(name) != undefined) {
            throw "Duplicate variable definition: " + name;
          } else {
            this.variables[name] = {
              value: UNDEFINED,
            };
          }
        };
        Scope.prototype.get = function(name) {
          var variable = this.getVariable(name);
          if (variable != undefined) {
            return variable.value;
          } else {
            throw "Unknown variable: " + name;
          }
        };
        Scope.prototype.getOrUndefined = function(name) {
          var variable = this.getVariable(name);
          if (variable != undefined) {
            return variable.value;
          } else {
            return UNDEFINED;
          }
        };
        Scope.prototype.set = function(name, value) {
          var variable = this.getVariable(name);
          if (variable != undefined) {
            variable.value = value;
          } else {
            throw "Unknown variable: " + name;
          }
        };
        Scope.prototype.setOrDefine = function(name, value) {
          var variable = this.getVariable(name);
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

        var typeType = createObject(null, "Type"); typeType.type = typeType;
        var typeUndefined = createObject(typeType, "Undefined");
        var typeNumber = createObject(typeType, "Number");
        var typeString = createObject(typeType, "String");
        var typeKeyword = createObject(typeType, "Keyword");
        var typeBoolean = createObject(typeType, "Boolean");
        var typeFunction = createObject(typeType, "Function");
        var typePointer = createObject(typeType, "Pointer");
        var typeArray = createObject(typeType, "Array");
        var typeVector = createObject(typeType, "Vector");
        var typeEntry = createObject(typeType, "Entry");
        var typeHash = createObject(typeType, "Hash");

        var UNDEFINED = createObject(typeUndefined, undefined);

        var scope = new Scope(null, true);
        var stack = [];
        setVariable("pi", createObject(typeNumber, Math.PI));
        setVariable("sin", createFunction(["x"], function(vm, context) {
          return createObject(typeNumber, Math.sin(getVariable("x").value));
        }, scope));
        setVariable("d", createFunction(["count", "faces"], function(vm, context) {
          var count = callPointer(getVariable("count"), "get");
          var faces = getVariable("faces");
          if (instanceOf(faces, typeUndefined)) {
            return createObject(typeNumber, dice(count.value, 6));
          } else {
            faces = callPointer(faces, "get");
            return createObject(typeNumber, dice(count.value, faces.value));
          }
        }, scope));
        setVariable("√", createFunction(["x"], function(vm, context) {
          return createObject(typeNumber, Math.sqrt(callPointer(getVariable("x"), "get").value));
        }, scope));
        setVariable("_function_join", createFunction(["separator"], function(vm, context) {
          var separator = getVariable("separator");
          var vector = getVariable("_");
          return createObject(typeString, unpackVector(vector).map(function(blessed) {
            return vm.toString(blessed);
          }).join(separator.value));
        }, scope));
        setVariable("_function_join1", createFunction([], function(vm, context) {
          var vector = getVariable("_");
          return createObject(typeString, unpackVector(vector).map(function(blessed) {
            return vm.toString(blessed);
          }).join(""));
        }, scope));
        setVariable("_function_join2", createFunction([], function(vm, context) {
          var vector = getVariable("_");
          return createObject(typeString, unpackVector(vector).map(function(blessed) {
            return vm.toString(blessed);
          }).join(", "));
        }, scope));
        setVariable("_function_join3", createFunction([], function(vm, context) {
          var vector = getVariable("_");
          return createObject(typeString, unpackVector(vector).map(function(blessed) {
            return vm.toString(blessed);
          }).join("\n"));
        }, scope));
        setVariable("_function_sum", createFunction([], function(vm, context) {
          var value = 0;
          unpackVector(getVariable("_")).forEach(function(blessed) {
            value += blessed.value;
          });
          return createObject(typeNumber, value);
        }, scope));
        setVariable("_function_average", createFunction([], function(vm, context) {
          var array = unpackVector(getVariable("_"));
          if (array.length == 0) return UNDEFINED;
          var value = 0;
          array.forEach(function(blessed) {
            value += blessed.value;
          });
          return createObject(typeNumber, value / array.length);
        }, scope));
        setVariable("_function_count", createFunction([], function(vm, context) {
          return createObject(typeNumber, unpackVector(getVariable("_")).length);
        }, scope));
        setVariable("_function_and", createFunction([], function(vm, context) {
          var value = true;
          unpackVector(getVariable("_")).forEach(function(blessed) {
            value = value && blessed.value;
          });
          return createObject(typeBoolean, value);
        }, scope));
        setVariable("_function_or", createFunction([], function(vm, context) {
          var value = false;
          unpackVector(getVariable("_")).forEach(function(blessed) {
            value = value || blessed.value;
          });
          return createObject(typeBoolean, value);
        }, scope));
        setVariable("_function_max", createFunction([], function(vm, context) {
          var array = unpackVector(getVariable("_"));
          if (array.length == 0) return UNDEFINED;
          var value = array[0].value;
          for (var i = 1; i < array.length; i++) {
            if (value < array[i].value) value = array[i].value;
          }
          return createObject(typeNumber, value);
        }, scope));
        setVariable("_function_min", createFunction([], function(vm, context) {
          var array = unpackVector(getVariable("_"));
          if (array.length == 0) return UNDEFINED;
          var value = array[0].value;
          for (var i = 1; i < array.length; i++) {
            if (value > array[i].value) value = array[i].value;
          }
          return createObject(typeNumber, value);
        }, scope));

        this.dices = [];
        this.callMethod = function(operator, codes, context, args) {

          {
            var name = operator;
            var func = getVariable(name);
            if (func !== undefined) {
              if (!instanceOf(func, typeUndefined)) {
                if (instanceOf(func, typeFunction)) {
                  var array = [createObject(typeString, context)];
                  Array.prototype.push.apply(array, codes.map(function(code) { return createPointer(code, scope); }));
                  return callFunction(func, packVector(array));
                } else {
                  throw "`" + name + "` is not a function";
                }
              }
              }
          }

          {
            var name = "_" + context + operator;
            var func = getVariable(name);
            if (func !== undefined) {
              if (!instanceOf(func, typeUndefined)) {
                if (instanceOf(func, typeFunction)) {
                  var array = [];
                  Array.prototype.push.apply(array, codes.map(function(code) { return createPointer(code, scope); }));
                  return callFunction(func, packVector(array));
                } else {
                  throw "`" + name + "` is not a function";
                }
              }
            }
          }

          if (operator === "_leftAsterisk") {
            var value = codes[0](vm, "get");
            if (instanceOf(value, typePointer)) return callPointer(value, context, args);
            throw "Type Error: " + operator + "/" + value.type.value;
          }
          if (operator === "_ternaryQuestionColon") return codes[codes[0](vm, "get").value ? 1 : 2](vm, context, args);
          if (operator === "_bracketsRound") return callInFrame(codes[0], vm, context, args);
          if (context === "get") {

            if (operator === "_operatorPlus") {
              var left = codes[0](vm, "get");
              var right = codes[1](vm, "get");
              if (instanceOf(left, typeNumber)) {
                if (instanceOf(right, typeNumber)) {
                  return createObject(typeNumber, left.value + right.value);
                }
              }
              return createObject(typeString, vm.toString(left) + vm.toString(right));
            }
            if (operator === "_operatorMinus") return createObject(typeNumber, codes[0](vm, "get").value - codes[1](vm, "get").value);
            if (operator === "_operatorAsterisk") return createObject(typeNumber, codes[0](vm, "get").value * codes[1](vm, "get").value);
            if (operator === "_operatorPercent") return createObject(typeNumber, codes[0](vm, "get").value % codes[1](vm, "get").value);
            if (operator === "_operatorSlash") return createObject(typeNumber, codes[0](vm, "get").value / codes[1](vm, "get").value);
            if (operator === "_operatorCaret") return createObject(typeNumber, Math.pow(codes[0](vm, "get").value, codes[1](vm, "get").value));
            if (operator === "_leftPlus") return createObject(typeNumber, codes[0](vm, "get").value);
            if (operator === "_leftMinus") return createObject(typeNumber, -codes[0](vm, "get").value);
            if (operator === "_operatorGreater") return createObject(typeBoolean, codes[0](vm, "get").value > codes[1](vm, "get").value);
            if (operator === "_operatorGreaterEqual") return createObject(typeBoolean, codes[0](vm, "get").value >= codes[1](vm, "get").value);
            if (operator === "_operatorLess") return createObject(typeBoolean, codes[0](vm, "get").value < codes[1](vm, "get").value);
            if (operator === "_operatorLessEqual") return createObject(typeBoolean, codes[0](vm, "get").value <= codes[1](vm, "get").value);
            if (operator === "_operatorEqual2") return createObject(typeBoolean, codes[0](vm, "get").value == codes[1](vm, "get").value);
            if (operator === "_operatorExclamationEqual") return createObject(typeBoolean, codes[0](vm, "get").value != codes[1](vm, "get").value);
            if (operator === "_operatorPipe2") return createObject(typeBoolean, codes[0](vm, "get").value || codes[1](vm, "get").value);
            if (operator === "_operatorTilde") {
              var left = codes[0](vm, "get").value;
              var right = codes[1](vm, "get").value;
              var array = [];
              for (var i = left; i <= right; i++) {
                array.push(createObject(typeNumber, i));
              }
              return packVector(array);
            }
            if (operator === "_operatorAmpersand2") return createObject(typeBoolean, codes[0](vm, "get").value && codes[1](vm, "get").value);
            if (operator === "_enumerateComma") return packVector(codes.map(function(code) { return code(vm, "get"); }));
            if (operator === "_bracketsSquare") {
              return createObject(typeArray, unpackVector(callInFrame(codes[0], vm, "get")));
            }
            if (operator === "_rightbracketsSquare") {
              var value = codes[0](vm, "get");
              if (instanceOf(value, typeKeyword)) value = searchVariable(["array"], value);
              if (instanceOf(value, typeArray)) return value.value[callInFrame(codes[1], vm, "get").value] || UNDEFINED;
              throw "Type Error: " + operator + "/" + value.type.value;
            }
            if (operator === "_leftAtsign") {
              var value = codes[0](vm, "get");
              if (instanceOf(value, typeArray)) return createObject(typeVector, value.value);
              throw "Type Error: " + operator + "/" + value.type.value;
            }
            if (operator === "_operatorMinus2Greater"
              || operator === "_operatorEqual2Greater") 	{
              var minus = operator == "_operatorMinus2Greater";
              if (minus) {
                return packVector(unpackVector(codes[0](vm, "get")).map(function(scalar) {
                  return callFunction(createFunction([], codes[1], scope), scalar);
                }));
              } else {
                return callFunction(createFunction([], codes[1], scope), codes[0](vm, "get"));
              }
            }
            if (operator === "_operatorMinusGreater"
              || operator === "_operatorEqualGreater") 	{
              var minus = operator == "_operatorMinusGreater";
              var right = codes[1](vm, "get");
              if (instanceOf(right, typeKeyword)) right = searchVariable(["collector", "function"], right);
              if (instanceOf(right, typeFunction)) {
                if (minus) {
                  return packVector(unpackVector(codes[0](vm, "get")).map(function(scalar) {
                    return callFunction(right, scalar);
                  }));
                } else {
                  return callFunction(right, codes[0](vm, "get"));
                }
              }
              throw "Type Error: " + operator + "/" + right.type.value;
            }
            if (operator === "_operatorColon") return createObject(typeEntry, {
              key: codes[0](vm, "get"),
              value: codes[1](vm, "get"),
            });
            if (operator === "_leftDollar") return getVariable(codes[0](vm, "get").value);
            if (operator === "_rightbracketsRound") {
              var value = codes[0](vm, "get");
              if (instanceOf(value, typeKeyword)) value = searchVariable(["function"], value);
              if (instanceOf(value, typeFunction)) return callFunction(value, callInFrame(codes[1], vm, "get"));  
              throw "Type Error: " + operator + "/" + value.type.value;
            }
            if (operator === "_statement") {
              var command = codes[0](vm, "get");
              if (command.value === "typeof") {
                var value = codes[1](vm, "get");
                return value.type;
              }
              if (command.value === "length") {
                var value = codes[1](vm, "get");
                if (instanceOf(value, typeArray)) return createObject(typeNumber, value.value.length);
                if (instanceOf(value, typeVector)) return createObject(typeNumber, value.value.length);
                if (instanceOf(value, typeString)) return createObject(typeNumber, value.value.length);
                throw "Illegal Argument: " + value.type.value;
              }
              if (command.value === "size") {
                var value = codes[1](vm, "get");
                return createObject(typeNumber, unpackVector(value).length);
              }
              throw "Unknown command: " + command.value;
            }
            if (operator === "_leftAmpersand") return createPointer(codes[0], scope);
            if (operator === "_bracketsCurly") {
              var hash = {};
              unpackVector(callInFrame(codes[0], vm, "get")).forEach(function(item) {
                if (instanceOf(item, typeEntry)) {
                  hash[item.value.key.value] = item.value.value;
                  return;
                }
                throw "Type Error: " + item.type.value + " is not a Entry";
              });
              return createObject(typeHash, hash);
            }
            if (operator === "_operatorColon2") {
              var hash = codes[0](vm, "get");
              if (instanceOf(hash, typeKeyword)) hash = searchVariable(["hash"], hash);
              var key = codes[1](vm, "get");
              if (instanceOf(hash, typeHash)) {
                if (instanceOf(key, typeString)) return hash.value[key.value] || UNDEFINED;
                if (instanceOf(key, typeKeyword)) return hash.value[key.value] || UNDEFINED;
              }
              throw "Type Error: " + hash.type.value + "[" + key.type.value + "]";
            }
            if (operator === "_operatorPeriod") {
              var left = codes[0](vm, "get");
              var right = codes[1](vm, "get");
              if (instanceOf(right, typeKeyword)) right = searchVariable(["method", "function"], right);
              if (instanceOf(right, typeFunction)) {
                var code2 = function(vm, context, args) {
                  var array = unpackVector(getVariable("_"));
                  array.unshift(left);
                  return callFunction(right, packVector(array));
                };
                return createFunction([], code2, scope);
              }
              throw "Type Error: " + left.type.value + "." + right.type.value;
            }
            if (operator === "_operatorColonGreater") {
              var array = unpackVector(codes[0](vm, "arguments")).map(function(item) { return item.value; });
              return createFunction(array, codes[1], scope);
            }
            if (operator === "_concatenate") {
              return createObject(typeString, codes.map(function(code) { return vm.toString(code(vm, "get")); }).join(""));
            }
            if (operator === "_enumerateSemicolon") {
              for (var i = 0; i < codes.length - 1; i++) {
                codes[i](vm, "invoke");
              }
              return codes[codes.length - 1](vm, "get");
            }
            if (operator === "_operatorEqual") {
              var value = codes[1](vm, "get");
              codes[0](vm, "set", value);
              return value;
            }
            if (operator === "_operatorQuestionColon") {
              var res = codes[0](vm, "get");
              return res.value ? res : codes[1](vm, "get");
            }
            if (operator === "_operatorQuestion2") {
              var res = codes[0](vm, "get");
              return !instanceOf(res, typeUndefined) ? res : codes[1](vm, "get");
            }
            if (operator === "_hereDocumentFunction") {
              var value = codes[0](vm, "get");
              if (instanceOf(value, typeKeyword)) value = searchVariable(["decoration", "function"], value);
              if (instanceOf(value, typeFunction)) return callFunction(value, callInFrame(function(vm, context, args) {
                return packVector([createPointer(codes[1], scope), createPointer(codes[2], scope)]);
              }, vm, "get"));
              throw "Type Error: " + operator + "/" + value.type.value;
            }
            if (operator === "_leftMultibyte") {
              var value = codes[0](vm, "get");
              if (instanceOf(value, typeKeyword)) value = searchVariable(["multibyte", "function"], value);
              if (instanceOf(value, typeFunction)) return callFunction(value, callInFrame(function(vm, context, args) {
                return createPointer(codes[1], scope);
              }, vm, "get"));
              throw "Type Error: " + operator + "/" + value.type.value;
            }
            if (operator === "_operatorMultibyte") {
              var value = codes[1](vm, "get");
              if (instanceOf(value, typeKeyword)) value = searchVariable(["multibyte", "function"], value);
              if (instanceOf(value, typeFunction)) return callFunction(value, callInFrame(function(vm, context, args) {
                return packVector([createPointer(codes[0], scope), createPointer(codes[2], scope)]);
              }, vm, "get"));
              throw "Type Error: " + operator + "/" + value.type.value;
            }
            if (operator === "_rightComposite") {
              var value = codes[1](vm, "get");
              if (instanceOf(value, typeKeyword)) value = searchVariable(["composite", "function"], value);
              if (instanceOf(value, typeFunction)) return callFunction(value, callInFrame(function(vm, context, args) {
                return createPointer(codes[0], scope);
              }, vm, "get"));
              throw "Type Error: " + operator + "/" + value.type.value;
            }
            if (operator === "_operatorComposite") {
              var value = codes[1](vm, "get");
              if (instanceOf(value, typeKeyword)) value = searchVariable(["composite", "function"], value);
              if (instanceOf(value, typeFunction)) return callFunction(value, callInFrame(function(vm, context, args) {
                return packVector([createPointer(codes[0], scope), createPointer(codes[2], scope)]);
              }, vm, "get"));
              throw "Type Error: " + operator + "/" + value.type.value;
            }
          } else if (context === "set") {
            if (operator === "_leftDollar") {
              setVariable(codes[0](vm, "get").value, args);
              return;
            }
          } else if (context === "invoke") {
            this.callMethod(operator, codes, "get", args);
            return;
          } else if (context === "arguments") {
            if (operator === "_leftDollar") return codes[0](vm, "arguments");
            if (operator === "_enumerateComma") return packVector(codes.map(function(code) { return code(vm, "arguments"); }));
          }
          throw "Unknown operator: " + operator + "/" + context;
        };
        this.toString = function(value) {
          var vm = this;
          if (instanceOf(value, typeUndefined)) {
            return "<Undefined>";
          }
          if (instanceOf(value, typeVector)) {
            if (value.value.length == 0) return "<Void>";
            return value.value.map(function(scalar) { return vm.toString(scalar); }).join(", ");
          }
          if (instanceOf(value, typeArray)) {
            return "[" + value.value.map(function(scalar) { return vm.toString(scalar); }).join(", ") + "]";
          }
          if (instanceOf(value, typeEntry)) {
            return vm.toString(value.value.key) + ": " + vm.toString(value.value.value);
          }
          if (instanceOf(value, typeHash)) {
            return "{" + Object.keys(value.value).map(function(key) {
              return key + ": " + vm.toString(value.value[key]);
            }).join(", ") + "}";
          }
          if (instanceOf(value, typeFunction)) {
            if (value.value.args.length === 0) return "<Function>";
            return "<Function: " + value.value.args.join(", ") + ">";
          }
          if (instanceOf(value, typePointer)) {
            return "<Pointer>";
          }
          if (instanceOf(value, typeType)) {
            return "<Type: " + value.value + ">";
          }
          return "" + value.value;
        };
        this.toNative = function(value) {
          var vm = this;
          if (instanceOf(value, typeVector)) {
            return value.value.map(function(scalar) { return vm.toNative(scalar); });
          }
          if (instanceOf(value, typeArray)) {
            return value.value.map(function(scalar) { return vm.toNative(scalar); });
          }
          return value.value;
        };
        this.allTrue = function(array) {
          for (var i = 0; i < array.length; i++) {
            if (!array[i].value) return createObject(typeBoolean, false);
          }
          return createObject(typeBoolean, true);
        };
        this.createLiteral = function(type, value, context, args) {
          if (context === "get") {
            if (type === "Integer") return createObject(typeNumber, value);
            if (type === "Float") return createObject(typeNumber, value);
            if (type === "String") return createObject(typeString, value);
            if (type === "Identifier") {
              if (value === "true") return createObject(typeBoolean, true);
              if (value === "false") return createObject(typeBoolean, false);
              if (value === "undefined") return UNDEFINED;
              return createObject(typeKeyword, value);
            }
            if (type === "Void") return packVector([]);
          } else if (context === "arguments") {
            if (type === "Identifier") return createObject(typeKeyword, value);
            if (type === "Void") return packVector([]);
          }
          throw "Unknown Literal Type: " + context + "/" + type;
        };
      };
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
          texts.push(vm.toString(main[i][1](vm, "get")));
        } catch (e) {
          texts.push("[Error: " + e + "][" + main[i][0] + "]");
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
  = head:MessageText tail:("\\" _ MessageFormula _ "\\" MessageText)* {
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
    / "\\\\" { return "\\"; }
    )* { return main.join(""); }

MessageFormula
  = main:Formula {
      return [text(), main];
    }

Formula
  = Line

Line
  = head:Arrows tail:(_ (";") _ Arrows)* (_ ";")? { return enumerate(head, tail, "Semicolon"); }

Arrows
  = head:(
      (
        main:Vector _ "-->" _ { return ["Minus2Greater", main]; }
      / main:Vector _ "->" _ (! ":") { return ["MinusGreater", main]; }
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
          result2 = createCodeFromMethod("_operator" + head[i][j - 1][0], [result2, head[i][j][1]]);
        }
        result = createCodeFromMethod("_operator" + head[i][head[i].length - 1][0], [result2, result]);
      }
      return result;
    }

Vector
  = head:Entry tail:(_ (",") _ Entry)* (_ ",")? { return enumerate(head, tail, "Comma"); }

Entry
  = head:Iif tail:(_ (
      ":" { return "Colon"; }
    ) _ Iif)* { return operatorLeft(head, tail); }

Iif
  = head:Range _ "?" _ body:Iif _ ":" _ tail:Iif { return createCodeFromMethod("_ternaryQuestionColon", [head, body, tail]); }
  / head:Range _ "?:" _ tail:Iif { return createCodeFromMethod("_operatorQuestionColon", [head, tail]); }
  / head:Range _ "??" _ tail:Iif { return createCodeFromMethod("_operatorQuestion2", [head, tail]); }
  / Range

Range
  = head:Or tail:(_ (
      "~" { return "Tilde"; }
    / ".." { return "Period2"; }
    ) _ Or)* { return operatorLeft(head, tail); }

Or
  = head:And tail:(_ (
      "||" { return "Pipe2"; }
    ) _ And)* { return operatorLeft(head, tail); }

And
  = head:Compare tail:(_ (
      "&&" { return "Ampersand2"; }
    ) _ Compare)* { return operatorLeft(head, tail); }

Compare
  = head:Add tail:(_ (
      ">=" { return "GreaterEqual"; }
    / ">" { return "Greater"; }
    / "<=" { return "LessEqual"; }
    / "<" { return "Less"; }
    / "!=" { return "ExclamationEqual"; }
    / "==" { return "Equal2"; }
    ) _ Add)* {
      if (tail.length == 0) return head;
      var codes = [], left = head, right, i;

      for (i = 0; i < tail.length; i++) {
        right = tail[i][3];
        codes.push(createCodeFromMethod("_operator" + tail[i][1], [left, right]));
        left = right;
      }

      return function(vm, context, args) {
        if (context === "get") {
          return vm.allTrue(codes.map(function(code) { return code(vm, "get"); }));
        } else {
          throw "Unknown context: " + context;
        }
      };
    }

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
  = head:(Left _ (
      CharacterMultibyteSymbol { return ["Multibyte", createCodeFromLiteral("Identifier", text())]; }
    ) _)* tail:Left { return operatorRight(head, tail); }

Left
  = head:((
      "+" { return "Plus"; }
    / "-" { return "Minus"; }
    / "@" { return "Atsign"; }
    / "&" { return "Ampersand"; }
    / "*" { return "Asterisk"; }
    / CharacterMultibyteSymbol { return ["Multibyte", createCodeFromLiteral("Identifier", text())]; }
    ) _)* tail:Right { return left(head, tail); }

Right
  = Statement
  / RightBrackets

Statement
  = "/" main:(_ ContentStatement)+ {
      return createCodeFromMethod("_statement", main.map(function(item) { return item[1]; }));
    }

ContentStatement
  = head:Variable tail:(_ (",") _ Variable)* { return enumerate(head, tail, "Comma"); }
  / Statement

RightBrackets
  = head:Variable tail:(_ (
      "(" _ main:Formula _ ")" { return ["_rightbracketsRound", [main]]; }
    / "[" _ main:Formula _ "]" { return ["_rightbracketsSquare", [main]]; }
    / "{" _ main:Formula _ "}" { return ["_rightbracketsCurly", [main]]; }
    / "(" _ ")" { return ["_rightbracketsRound", [createCodeFromLiteral("Void", "void")]]; }
    / "[" _ "]" { return ["_rightbracketsSquare", [createCodeFromLiteral("Void", "void")]]; }
    / "{" _ "}" { return ["_rightbracketsCurly", [createCodeFromLiteral("Void", "void")]]; }
    / "::" _ main:Variable { return ["_operatorColon2", [main]]; }
    / "." _ main:Variable { return ["_operatorPeriod", [main]]; }
    ))* { return right(head, tail); }

Variable
  = head:((
      "$" { return "Dollar"; }
    ) _)* tail:Factor { return left(head, tail); }

Factor
  = "(" _ main:Formula _ ")" { return createCodeFromMethod("_bracketsRound", [main]); }
  / "[" _ main:Formula _ "]" { return createCodeFromMethod("_bracketsSquare", [main]); }
  / "{" _ main:Formula _ "}" { return createCodeFromMethod("_bracketsCurly", [main]); }
  / "(" _ ")" { return createCodeFromMethod("_bracketsRound", [createCodeFromLiteral("Void", "void")]); }
  / "[" _ "]" { return createCodeFromMethod("_bracketsSquare", [createCodeFromLiteral("Void", "void")]); }
  / "{" _ "}" { return createCodeFromMethod("_bracketsCurly", [createCodeFromLiteral("Void", "void")]); }
  / Composite
  / Identifier
  / String
  / StringReplaceable
  / HereDocument

Composite
  = head:Number body:BodyComposite tail:Composite { return createCodeFromMethod("_operatorComposite", [head, body, tail]); }
  / head:Number body:BodyComposite { return createCodeFromMethod("_rightComposite", [head, body]); }
  / head:Number { return head; }

Number
  = Float
  / Integer

Float "Float"
  = [0-9]+ ("." [0-9]+)? [eE] [+-]? [0-9]+ { return createCodeFromLiteral("Float", parseFloat(text())); }
  / [0-9]+ "." [0-9]+ { return createCodeFromLiteral("Float", parseFloat(text())); }

Integer "Integer"
  = [0-9]+ { return createCodeFromLiteral("Integer", parseInt(text(), 10)); }

BodyComposite
  = CharacterIdentifier+ { return createCodeFromLiteral("Identifier", text()); }

Identifier "Identifier"
  = CharacterIdentifier ([0-9] / CharacterIdentifier)* { return createCodeFromLiteral("Identifier", text()); }

String
  = "'" main:ContentString* "'" { return createCodeFromLiteral("String", main.join("")); }

ContentString
  = "\\\\" { return "\\"; }
  / "\\'" { return "'"; }
  / [^']

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
      return createCodeFromMethod("_concatenate", codes);
    }

ContentStringReplaceableText
  = main:(
      "\\\\" { return "\\"; }
    / "\\\"" { return "\""; }
    / "\\$" { return "$"; }
    / "\\r" { return "\r"; }
    / "\\n" { return "\n"; }
    / "\\t" { return "\t"; }
    / [^"$]
    )* { return createCodeFromLiteral("String", main.join("")); }

ContentStringReplaceableReplacement
  = "$" "(" main:Formula ")" { return main; }
  / "$" "{" main:Formula "}" { return createCodeFromMethod("_leftDollar", [main]); }
  / "$" main:(Integer / Identifier) { return createCodeFromMethod("_leftDollar", [main]); }

HereDocument
  = "%" head:(
      head:Identifier "(" _ tail:Formula _ ")" { return [head, tail]; }
    / head:Identifier "(" _ ")" { return [head, createCodeFromLiteral("Void", "void")]; }
    )? tail:(
      ";" { return createCodeFromLiteral("Void", "void"); }
    / (
        begin:HereDocumentDelimiter main:(
          "{" main:(

            main:(! ("}" end:HereDocumentDelimiter & { return begin === end; }) main:(
              "%%" { return "%"; }
            / [^%]
            ) { return main; })+ { return createCodeFromLiteral("String", main.join("")); }
          / HereDocument

          )* "}" { return createCodeFromMethod("_concatenate", main); }
        / "[" main:(

            main:(! ("]" end:HereDocumentDelimiter & { return begin === end; }) main:(
              .
            ) { return main; })+ { return createCodeFromLiteral("String", main.join("")); }

          )* "]" { return createCodeFromMethod("_concatenate", main); }
        ) HereDocumentDelimiter { return main; }
      / (
          "{" main:(

            main:(! ("}") main:(
              "%%" { return "%"; }
            / [^%]
            ) { return main; })+ { return createCodeFromLiteral("String", main.join("")); }
          / HereDocument

          )* "}" { return createCodeFromMethod("_concatenate", main); }
        / "[" main:(

            main:(! ("]") main:(
              .
            ) { return main; })+ { return createCodeFromLiteral("String", main.join("")); }

          )* "]" { return createCodeFromMethod("_concatenate", main); }
        )
      )
    ) {
      if (head !== null) {
        return createCodeFromMethod("_hereDocumentFunction", [head[0], head[1], tail]);
      } else {
        return tail;
      }
    }
  / "%" head:(
      "(" _ tail:Formula _ ")" { return tail; }
    / "(" _ ")" { return createCodeFromLiteral("Void", "void"); }
    ) {
      return head;
    }

HereDocumentDelimiter
  = CharacterIdentifier+ { return text(); }

_ "Comments"
  = (
      "/*" ((! "*/") .)* "*/"
    / "//" [^\n\r]*
    / CharacterBlank+
    )*

CharacterMultibyteSymbol
  = (! (CharacterSymbol / CharacterNumber / CharacterAlphabet / CharacterIdentifier / CharacterBlank)) .

CharacterSymbol
  = (! (CharacterNumber / CharacterAlphabet / CharacterSymbolIdentifier)) [!-~]

CharacterIdentifier
  = CharacterAlphabet
  / CharacterSymbolIdentifier
  / CharacterHiragana
  / CharacterKatakana
  / CharacterCJKUnifiedIdeographsExtensionA
  / CharacterCJKUnifiedIdeographs

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

CharacterBlank
  = [ \t\n\r　]
