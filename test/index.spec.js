let subject = require("../src/index");
let fs = require("fs");
const path = require("path");

let exampleDir = path.join(__dirname, "../example");
let exampleDist = path.join(__dirname, "../example/dist");
let exampleTmpl = path.join(__dirname, "../example/s.yaml");
let outputDir = path.join(__dirname, "../src/code/public");

test('props.codeUri not present', async function () {
    try {
        await subject({}, {});
        fail();
    } catch (e) {
        expect(e.message).toBe("props.code not found.");
    }

});

test('path.cwd not present', async function () {
    let result = await subject({
        props: {
            code: exampleDist
        }
    }, {});
    expect(result.props.code).toBe(path.join(__dirname, "../src/code"));
});

test('default index.html', async function () {
    let result = await subject({
        cwd: exampleDir,
        props: {
            code: exampleDist
        }
    }, {});

    // content are copied from exampleDist to outputDir
    expect(fs.readdirSync(outputDir)).toStrictEqual(fs.readdirSync(exampleDist));

    expect(result.props.runtime).toBe("custom");
    expect(result.props.code).toBe(path.join(__dirname, "../src/code"));
    expect(result.props.caPort).toBe(9000);
    expect(result.props.customRuntimeConfig.command).toStrictEqual(["node"]);
    expect(result.props.customRuntimeConfig.args).toStrictEqual(["/code/index.js"]);

    let generatedIndexContent = fs.readFileSync(path.join(__dirname, "../src/code/index.js")).toString();
    expect(generatedIndexContent.includes("index.html")).toBeTruthy();
});

test('relative codeUri', async function () {
    let originCodeUri = "./dist";
    let inputs = {
        cwd: exampleDir,
        props: {
            code: originCodeUri
        }
    };
    let result = await subject(inputs, {});

    expect(result.props.code).toBe(path.join(__dirname, "../src/code"));
});

test('custom index.htm', async function () {
    await subject({
        cwd: exampleDir,
        props: {
            code: exampleDist
        }
    }, {
        index: "index.htm"
    });

    let generatedIndexContent = fs.readFileSync(path.join(__dirname, "../src/code/index.js")).toString();
    expect(generatedIndexContent.includes("index.htm")).toBeTruthy();
});

test('should prioritize user-provided runtime over default', async function () {
    let result = await subject({
        cwd: exampleDir,
        props: {
            code: exampleDist
        }
    }, {
        runtime: "custom.debian11"
    });

    expect(result.props.runtime).toBe("custom.debian11");
    expect(result.props.code).toBe(path.join(__dirname, "../src/code"));
    expect(result.props.caPort).toBe(9000);
});


