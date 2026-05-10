import path from "path"

export const getAssetPath = (...filePaths: string[]) => {
    return path.resolve(
        __dirname,
        '../assets',
        ...filePaths
    )
}