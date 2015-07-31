(function (jsvm) {
    jsvm.instructions.div = {
        execute: function (machine, operand) {
            var b = machine.stack.pop();
            var a = machine.stack.pop();
            machine.stack.push(ko.observable(a() / b()));
        }
    };
})(jsvm);