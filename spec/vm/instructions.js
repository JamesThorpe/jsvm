describe("Basic VM Instructions", function () {
    describe("push", function() {
        it("push - number", function() {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, "42");
            expect(vm.stack()[0]()).toBe(42);
        });

        it("push - string single", function() {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, "'abc'");
            expect(vm.stack()[0]()).toBe("abc");
        });

        it("push - string double", function() {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, '"abc"');
            expect(vm.stack()[0]()).toBe("abc");
        });

        it("push - fb offset", function() {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 42);
            jsvm.instructions.push.execute(vm, "[fb]");
            expect(vm.stack()[1]()).toBe(42);
        });
    });

    describe("pop", function() {
        it("pop - register", function() {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 42);
            jsvm.instructions.pop.execute(vm, "fb");
            expect(vm.fb()).toBe(42);
        });

        if ("pop - fb offset", function() {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 42);
            jsvm.instructions.push.execute(vm, 0);
            jsvm.instructions.pop.execute(vm, "[fb + 1]");
            expect(vm.stack()[1]()).toBe(42);
        });
    });

    describe("add", function() {
        it("add - integers", function() {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 21);
            jsvm.instructions.push.execute(vm, 21);
            jsvm.instructions.add.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(42);
        });

        it("add - floats", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 2.1);
            jsvm.instructions.push.execute(vm, 2.1);
            jsvm.instructions.add.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(4.2);
        });

        it("add - strings", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, "'forty'");
            jsvm.instructions.push.execute(vm, "'two'");
            jsvm.instructions.add.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe("fortytwo");
        });

        it("add - number/string", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 40);
            jsvm.instructions.push.execute(vm, "'two'");
            jsvm.instructions.add.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe("40two");
        });

        it("add - string/number", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, "'forty'");
            jsvm.instructions.push.execute(vm, 2);
            jsvm.instructions.add.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe("forty2");
        });
    });

    describe("sub", function() {
        it("sub - integers", function() {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 42);
            jsvm.instructions.push.execute(vm, 21);
            jsvm.instructions.sub.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(21);
        });

        it("sub - floats", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 4.2);
            jsvm.instructions.push.execute(vm, 2.1);
            jsvm.instructions.sub.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(2.1);
        });
    });

    describe("mul", function () {
        it("mul - integers", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 10);
            jsvm.instructions.push.execute(vm, 10);
            jsvm.instructions.mul.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(100);
        });

        it("mul - floats", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 2.1);
            jsvm.instructions.push.execute(vm, 2.1);
            jsvm.instructions.mul.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(4.41);
        });

        it("mul - integer/float", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 4);
            jsvm.instructions.push.execute(vm, 2.1);
            jsvm.instructions.mul.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(8.4);
        });

        it("mul - float/integer", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 4.2);
            jsvm.instructions.push.execute(vm, 2);
            jsvm.instructions.mul.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(8.4);
        });
    });

    describe("div", function () {
        it("div - integers", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 100);
            jsvm.instructions.push.execute(vm, 10);
            jsvm.instructions.div.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(10);
        });

        it("div - floats", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 4.41);
            jsvm.instructions.push.execute(vm, 2.1);
            jsvm.instructions.div.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(2.1);
        });

        it("div - integer/float", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 10);
            jsvm.instructions.push.execute(vm, 2.5);
            jsvm.instructions.div.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(4);
        });

        it("div - float/integer", function () {
            var vm = new jsvm.machine();
            jsvm.instructions.push.execute(vm, 4.2);
            jsvm.instructions.push.execute(vm, 2);
            jsvm.instructions.div.execute(vm);
            expect(vm.stack().length).toBe(1);
            expect(vm.stack()[0]()).toBe(2.1);
        });
    });
});