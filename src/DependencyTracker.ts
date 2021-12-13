export class DependencyTracker {

    private _depdendencies: { [key: string]: Array<any> } = {};

    constructor() {
    }

    addDependency(name: string, dependency: any): void {
        let bucket = this._depdendencies[name];

        if (!bucket) {
            bucket = this._depdendencies[name] = [];
        }
        if (bucket.indexOf(dependency) === -1) {
            bucket.push(dependency);
        }
    }

    removeDependency(name: string, dependency: any): void {
        if (this._depdendencies[name]) {
            const i = this._depdendencies[name].indexOf(dependency);
            if (i !== -1) {
                this._depdendencies[name].splice(i, 1);
            }
        }
    }

    getDependencies(name): Array<any> {
        return this._depdendencies[name];
    }

}