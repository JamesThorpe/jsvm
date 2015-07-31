(function(window, ko, undefined) {
    'use strict';

    var jsvm = {};

(function (jsvm, ko) {
    jsvm.instructions = {};

    jsvm.machine = function () {
        //Stack
        this.stack = ko.observableArray([]);

        //Current instruction pointer
        this.ci = ko.observable(0);

        //Stack pointer
        this.sp = ko.computed({
            read: function() {
                return this.stack().length - 1;
            }.bind(this),
            write: function(v) {
                if ((this.stack().length - 1) > v) {
                    while (this.stack().length - 1 > v)
                        this.stack.pop();
                } else if ((this.stack().length - 1) < v) {
                    while (this.stack().length - 1 < v)
                        this.stack.push(ko.observable({}));
                }
            }.bind(this)
        });

        //Frame base
        this.fb = ko.observable(0);
    };

    jsvm.machine.prototype.loadProgram = function (program) {
        var lines = program.split(/\n/);
        var labels = {};
        var instructions = [];
        var nil = null;
        for (var i in lines) {
            var m = lines[i].match(/^ *(_)?([a-z]+)(?:\.([a-z]+))? *(.*)? *$/);
            if (m) {
                if (m[1] === undefined) {
                    //instruction
                    var ins = {
                        i: m[2],
                        d: ''
                    };
                    if (m[3] !== undefined)
                        ins.p = m[3];
                    else
                        ins.p = null;

                    if (m[4] !== undefined)
                        ins.o = m[4];
                    else
                        ins.o = null;

                    if (nil !== null) {
                        ins.d = '(' + nil + ')';
                        nil = null;
                    }

                    ins.toString = function() {
                        var r = this.i;
                        if (this.p)
                            r += "." + this.p;
                        if (this.o)
                            r += " " + this.o;
                        if (this.d)
                            r += " " + this.d;
                        return r;
                    }.bind(ins);

                    instructions.push(ko.observable(ins));
                } else {
                    //begins with _ - label
                    labels['_' + m[2]] = instructions.length;
                    nil = m[2];
                }
            }
        }
        for (var x = 0; x < instructions.length; x++) {
            if (labels[instructions[x]().o] !== undefined) {
                instructions[x]().d = '(->' + instructions[x]().o + ')';
                instructions[x]().o = labels[instructions[x]().o];
            }
        }
        this.stack(instructions);
        this.fb(this.sp());
        this.ci(0);
    };

    jsvm.machine.prototype.step = function() {
        var instruction = this.stack()[this.ci()]();
        this.ci(this.ci() + 1);
        jsvm.instructions[instruction.i].execute(this, instruction.o);
    };

    jsvm.machine.prototype.decodeOperand = function(operand) {
        if (/^-?\d+(\.\d+)?$/.test(operand)) {
            //Number
            return +operand;
        }
        if (/^".*"|'.*'$/.test(operand)) {
            //string
            return operand.substr(1, operand.length - 2);
        }
        var m = operand.match(/^(?:~)(\d+)+$/);
        if (m !== null) {
            //Specific location
            return this.stack()[+m[1]]();
        }

        m = operand.match(/^\[\s*([a-z]+)\s*(?:(\+|-)\s*)?(\d+)?\s*\]$/);
        if (m !== null) {
            //offset from register value
            var o = 0;
            if (m[3] !== undefined)
                o = +m[3];
            if (m[2] === '-')
                o = -o;
            return this.stack()[this[m[1]]() + o]();
        }

        m = operand.match(/^[a-z]+$/);
        if (m !== null) {
            //register
            return this[operand]();
        }

        
        throw new Error("Unknown/unsupported operand: " + operand);
    };

    jsvm.machine.prototype.storeAtOperand = function (operand, value) {
        if (/^(?:~)(\d+)$/.test(operand)) {
            //Specific location
            this.stack()[+(operand.replace('~', ''))](value);
            return;
        }

        var m = operand.match(/^\[\s*([a-z]+)\s*(?:(\+|-)\s*)?(\d+)?\s*\]$/);
        if (m !== null) {
            //offset from register value
            var o = 0;
            if (m[3] !== undefined)
                o = +m[3];
            if (m[2] === '-')
                o = -o;
            this.stack()[this[m[1]]() + o](value);
            return;
        }

        m = operand.match(/^[a-z]+$/);
        if (m !== null) {
            //register
            this[operand](value);
            return;
        }

        throw new Error("Unknown/unsupported operand: " + operand);
    };

})(jsvm, ko);
(function (jsvm) {
    jsvm.util = {};
    jsvm.util.interpretStack = function(data) {
        if (typeof data === "number" || typeof data === "string") {
            return {
                type: 'val',
                data: data
            };
        } else if (typeof data === "object") {
            if (data.hasOwnProperty("i") && data.hasOwnProperty("o") && data.hasOwnProperty("p")) {
                //instruction
                return {
                    type: 'ins',
                    data: data.toString()
                };
            } else {
                return {
                    type: '-',
                    data: '-'
                };
            }
        } else {
            return {
                type: '-',
                data: '-'
            };
        }
    };

    jsvm.util.pointersForStack = function (machine, index) {
        var ret = '';
        function append(register) {
            if (machine[register]() === index) {
                ret += register + '&nbsp;';
            } else {
                ret += Array(register.length + 2).join('&nbsp');
            }
        }

        append('ci');
        append('fb');
        append('sp');

        return ret;
    };

}(jsvm));
(function (jsvm) {
    jsvm.instructions.add = {
        execute: function (machine, operand) {
            var b = machine.stack.pop();
            var a = machine.stack.pop();
            machine.stack.push(ko.observable(a() + b()));
        }
    };
})(jsvm);
(function (jsvm) {
    jsvm.instructions.div = {
        execute: function (machine, operand) {
            var b = machine.stack.pop();
            var a = machine.stack.pop();
            machine.stack.push(ko.observable(a() / b()));
        }
    };
})(jsvm);
(function (jsvm) {
    jsvm.instructions.mul = {
        execute: function (machine, operand) {
            var b = machine.stack.pop();
            var a = machine.stack.pop();
            machine.stack.push(ko.observable(a() * b()));
        }
    };
})(jsvm);
(function (jsvm) {
    jsvm.instructions.nop = {
        execute: function (machine, operand) {

        }
    };
})(jsvm);
(function (jsvm) {
    jsvm.instructions.pop = {
        execute: function (machine, operand) {
            var v = machine.stack.pop()();
            if (operand !== null)
                machine.storeAtOperand(operand, v);
        }
    };
})(jsvm);
(function(jsvm) {
    jsvm.instructions.push = {
        execute: function(machine, operand) {
            machine.stack.push(ko.observable(machine.decodeOperand(operand)));
        }
    };
})(jsvm);
(function (jsvm) {
    jsvm.instructions.sub = {
        execute: function (machine, operand) {
            var b = machine.stack.pop();
            var a = machine.stack.pop();
            machine.stack.push(ko.observable(a() - b()));
        }
    };
})(jsvm);

    window.jsvm = jsvm;
})(this || (0, eval)('this'), ko); // jshint ignore:line