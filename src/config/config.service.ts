import dotenv from 'dotenv';

const isTest = process.env.NODE_ENV === 'test';

if (isTest) {
    dotenv.config({ path: '.env.test', override: true });
} else {
    dotenv.config();
}

// Central place for reading and validating environment variables
const ENV_VARIABLES = {
    PORT: 'PORT',
    NODE_ENV: 'NODE_ENV',
    BASE_URL: 'BASE_URL',
    STRIP_RESPONSES: 'STRIP_RESPONSES',
    VALIDATE_RESPONSES: 'VALIDATE_RESPONSES'
} as const


export type EnvVariableKey = keyof typeof ENV_VARIABLES;

class ConfigService {

    constructor(private env: { [key: string]: string | undefined }) { }

    // Read a single environment variable and optionally throw if it is missing
    getValue(key: EnvVariableKey, throwOnMissing = false): string {

        const value = this.env[ENV_VARIABLES[key]];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value || "";
    }

    // Ensure that all required keys exist when the app boots
    public ensureValues(keys: EnvVariableKey[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    // Port used by the HTTP server
    public getPort() {
        return this.getValue("PORT");
    }

    // Mode helpers for checking current environment
    public isProduction() {
        const mode = this.getValue("NODE_ENV");
        return mode === 'production';
    }

    public isDevelopment() {
        const mode = this.getValue("NODE_ENV");
        return mode === 'development';
    }

    public stripResponses() {
        const mode = this.getValue("STRIP_RESPONSES")
        return mode === 'true';
    }

    public validateResponses() {
        const mode = this.getValue("VALIDATE_RESPONSES")
        return mode === 'true';
    }

}

const configService = new ConfigService(process.env)
    .ensureValues([
        "PORT",
    ]);


export { configService };

