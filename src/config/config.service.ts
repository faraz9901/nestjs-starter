require('dotenv').config();

export enum ENV_VARIABLES {
    PORT = 'PORT',
    NODE_ENV = 'NODE_ENV',
}

class ConfigService {

    constructor(private env: { [key: string]: string | undefined }) { }

    getValue(key: ENV_VARIABLES, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value || "";
    }

    public ensureValues(keys: ENV_VARIABLES[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getPort() {
        return this.getValue(ENV_VARIABLES.PORT);
    }

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

