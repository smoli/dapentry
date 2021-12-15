export class DependencyTracker {

    private _depdendencies: { [key: string]: Array<any> } = {};

    constructor() {
    }

    public reset(): void {
        this._depdendencies = {};
    }

    public addDependency(name: string, dependency: any): void {
        let bucket = this._depdendencies[name];

        if (!bucket) {
            bucket = this._depdendencies[name] = [];
        }
        if (bucket.indexOf(dependency) === -1) {
            bucket.push(dependency);
        }
    }

    public removeDependency(name: string, dependency: any): void {
        if (this._depdendencies[name]) {
            const i = this._depdendencies[name].indexOf(dependency);
            if (i !== -1) {
                this._depdendencies[name].splice(i, 1);
            }
        }
    }

    public getDependencies(name): Array<any> {
        return this._depdendencies[name] || [];
    }

    public get registerNames():Array<string> {
        return Object.keys(this._depdendencies);
    }

}