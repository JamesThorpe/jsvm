(function(jsvm) {
    jsvm.instructions.push = {
        execute: function(machine, operand) {
            machine.stack.push(ko.observable(machine.decodeOperand(operand)));
        }
    };
})(jsvm);