(function (jsvm) {
    jsvm.instructions.add = {
        execute: function (machine, operand) {
            var b = machine.stack.pop();
            var a = machine.stack.pop();
            machine.stack.push(ko.observable(a() + b()));
        }
    };
})(jsvm);