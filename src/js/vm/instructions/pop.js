(function (jsvm) {
    jsvm.instructions.pop = {
        execute: function (machine, operand) {
            var v = machine.stack.pop()();
            if (operand !== null)
                machine.storeAtOperand(operand, v);
        }
    };
})(jsvm);