export class MockJSONModel {

    public data: any;

    constructor(data = {}) {
        this.data = data;
    }

    setData(data: any) {
        this.data = data;
    }

    getParts(path) {
        if (!path) {
            return null;
        }
        const parts = path.split("/");
        // Remove the leading /
        parts.shift();

        return parts;
    }

    setProperty(path, value) {
        console.log("setting", path)
        const parts = this.getParts(path);
        let data = this.data;
        const last = parts.pop();
        for (const p of parts) {
            data = data[p]
        }

        data[last] = value;
    }

    getProperty(path) {
        console.log("getting", path)
        if (!path) {
            return undefined;
        }
        const parts = this.getParts(path);


        const walk = (n, i) => {
            const part = parts[i];
            if (!n) {
                return undefined;
            }
            const newN = n[part];
            i++;
            if (i < parts.length) {
                return walk(newN, i);
            }
            return newN
        }

        return walk(this.data, 0)
    }

}