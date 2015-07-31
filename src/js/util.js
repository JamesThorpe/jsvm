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