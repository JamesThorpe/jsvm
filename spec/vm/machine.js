describe("Core VM functions", function() {
    var vm = new jsvm.machine();
    vm.stack.push(ko.observable(0));
    vm.stack.push(ko.observable(5));
    it("decode operand - number", function() {
        expect(vm.decodeOperand("5")).toBe(5);
    });

    it("decode operand - string single", function() {
        expect(vm.decodeOperand("'abc'")).toBe('abc');
    });

    it("decode operand - string double", function() {
        expect(vm.decodeOperand('"abc"')).toBe('abc');
    });

    it("decode operand - fb", function() {
        expect(vm.decodeOperand("[fb]")).toBe(0);
    });

    it("decode operand - fb offset", function() {
        expect(vm.decodeOperand("[  fb  + 1]")).toBe(5);
    });

    it("decode operand - register", function() {
        expect(vm.decodeOperand("fb")).toBe(0);
    });

    it("store at operand - fb offset", function() {
        vm.stack()[0](ko.observable(0));
        vm.stack()[1](ko.observable(5));
        vm.storeAtOperand("[fb+1]", 3);
        expect(vm.stack()[1]()).toBe(3);
    });

    it("store at operand - register", function() {
        vm.storeAtOperand("fb", 42);
        expect(vm.fb()).toBe(42);
    });
});

describe("Program loading", function() {
    it("load a program", function() {
        var vm = new jsvm.machine();
        vm.loadProgram("push 5\n" +
            "push [fb]\n" +
            "pop.l");
        expect(vm.stack()[0]().i).toBe("push");
        expect(vm.stack()[1]().i).toBe("push");
        expect(vm.stack()[2]().i).toBe("pop");

        expect(vm.stack()[0]().p).toBe(null);
        expect(vm.stack()[1]().p).toBe(null);
        expect(vm.stack()[2]().p).toBe("l");

        expect(vm.stack()[0]().o).toBe("5");
        expect(vm.stack()[1]().o).toBe("[fb]");
        expect(vm.stack()[2]().o).toBe(null);
    });
});

describe("Basic execution", function () {
    it("Basic addition", function() {
        var vm = new jsvm.machine();
        vm.loadProgram("push 21\npush 21\nadd");
        vm.step();
        vm.step();
        vm.step();
        expect(vm.stack().length).toBe(4);
        expect(vm.stack()[3]()).toBe(42);
    });
});