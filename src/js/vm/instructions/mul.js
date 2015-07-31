(function (jsvm) {
    jsvm.instructions.mul = {
        execute: function (machine, operand) {
            var b = machine.stack.pop();
            var a = machine.stack.pop();
            machine.stack.push(ko.observable(a() * b()));
        }
    };
})(jsvm);