const fs = require('fs');

module.exports = class ConfigFile {
    constructor(filePath) {
        this.filePath = filePath;
    }

    read() { }

    write(data) {
        fs.writeFileSync(this.filePath, data);
    }
}
