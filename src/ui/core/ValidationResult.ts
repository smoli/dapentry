export class ValidationResult {
    errors: { [key: string]: string } = {};

    get valid(): boolean {
        return Object.keys(this.errors).length === 0;
    }

    error(key: string, message: string) {
        this.errors[key] = message;
    }

    get messageFor(): { [key: string]: string } {
        return this.errors;
    }
}