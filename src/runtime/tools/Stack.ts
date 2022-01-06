export class Stack<T> extends Array<T> {
    get top(): T {
        if (this.length === 0) {
            return null;
        }
        return this[this.length - 1];
    }
}