
class Action {
    constructor(context, parser) {
        this.parser = parser;
        this.context = context;
    }
    parse() {
        throw new Error("Not implemented");
    }
    async performAction() {
        throw new Error("Not implemented");
    }

}
export {Action};
