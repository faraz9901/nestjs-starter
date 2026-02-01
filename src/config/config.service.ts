require('dotenv').config();

// Central place for reading and validating environment variables
export enum ENV_VARIABLES {
    PORT = 'PORT',
    NODE_ENV = 'NODE_ENV',
}

class ConfigService {

    constructor(private env: { [key: string]: string | undefined }) { }

    // Read a single environment variable and optionally throw if it is missing
    getValue(key: ENV_VARIABLES, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value || "";
    }

    // Ensure that all required keys exist when the app boots
    public ensureValues(keys: ENV_VARIABLES[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    // Port used by the HTTP server
    public getPort() {
        return this.getValue(ENV_VARIABLES.PORT);
    }

    // Mode helpers for checking current environment
    public isProduction() {
        const mode = this.getValue(ENV_VARIABLES.NODE_ENV, false);
        return mode === 'production';
    }

    public isDevelopment() {
        const mode = this.getValue(ENV_VARIABLES.NODE_ENV, false);
        return mode === 'development';
    }

}

const configService = new ConfigService(process.env)
    .ensureValues([
        ENV_VARIABLES.PORT
    ]);


export { configService };

