let subject = require("../src/index");
let fs = require("fs");
const path = require("path");

let exampleDist = path.join(__dirname, "../example/dist");
let exampleTmpl = path.join(__dirname, "../example/s.yaml");


test('props.function.codeUri not present', async function () {
    let result = await subject({}, {});
    expect(result).toBeUndefined();
});

test('path.configPath not present', async function () {
    let catchTriggered = false;
    try {
        await subject({
            props: {
                function: {
                    codeUri: exampleDist
                }
            }
        }, {});
    } catch (e) {
        expect(e.code).toBe("ERR_INVALID_ARG_TYPE");
        expect(e.message).toBe("The \"path\" argument must be of type string. Received undefined");
        catchTriggered = true;
    }
    expect(catchTriggered).toBeTruthy();
});

test('default index.html', async function () {
    let result = await subject({
        path: {
            configPath: exampleTmpl
        },
        props: {
            function: {
                codeUri: exampleDist
            }
        }
    }, {});

    expect(result.props.function.runtime).toBe("custom");
    expect(result.props.function.codeUri).toBe(path.join(__dirname, "../src/code"));
    expect(result.props.function.customRuntimeConfig.command).toStrictEqual(["node"]);
    expect(result.props.function.customRuntimeConfig.args).toStrictEqual(["/code/index.js"]);

    let generatedIndexContent = fs.readFileSync(path.join(__dirname, "../src/code/index.js")).toString();
    expect(generatedIndexContent.includes("index.html")).toBeTruthy();
});

test('custom index.htm', async function () {
    let result = await subject({
        path: {
            configPath: exampleTmpl
        },
        props: {
            function: {
                codeUri: exampleDist
            }
        }
    }, {
        index: "index.htm"
    });

    expect(result.props.function.runtime).toBe("custom");
    expect(result.props.function.codeUri).toBe(path.join(__dirname, "../src/code"));
    expect(result.props.function.customRuntimeConfig.command).toStrictEqual(["node"]);
    expect(result.props.function.customRuntimeConfig.args).toStrictEqual(["/code/index.js"]);

    let generatedIndexContent = fs.readFileSync(path.join(__dirname, "../src/code/index.js")).toString();
    expect(generatedIndexContent.includes("index.htm")).toBeTruthy();
});


