/**
* Gets the directory of the code file.
* 获取代码文件的目录。
*/
export const getCodeFileDir = (codeFile: string): string => {
    const regexMatch = codeFile.match(/(.*[\/\\]).*/);
    return regexMatch ? regexMatch[1] : codeFile;
}
/**
* Gets the base name of the code file, that is without its directory.
* 获取代码文件的基名称，即不包含其目录
*/
export const getCodeBaseFile = (codeFile: string): string => {
    const regexMatch = codeFile.match(/.*[\/\\](.*)/);
    return regexMatch ? regexMatch[1] : codeFile;
}

/**
  * Includes double quotes around a given file name.
  * 加双引号
  */
export const quoteFileName = (fileName: string): string => {
    return '"' + fileName + '"';
}
/**
 * Gets the code file name without its directory and extension.
 * 获取不带目录和扩展名的代码文件名。
 */
export const getCodeFileWithoutDirAndExt = (codeFile: string): string => {
    const regexMatch = codeFile.match(/.*[\/\\](.*(?=\..*))/);
    return regexMatch ? regexMatch[1] : codeFile;
}

/**
  * Gets the directory of the code file without a trailing slash.
  * 获取不带尾随斜杠的代码文件的目录。
  */
export const getCodeFileDirWithoutTrailingSlash = (codeFileDir: string): string => {
    return codeFileDir.replace(/[\/\\]$/, "");
}


/**
 * Gets the drive letter of the code file.
 * 获取代码驱动文件
 */
export const getDriveLetter = (codeFile): string => {
    const regexMatch = codeFile.match(/^([A-Za-z]:).*/);
    return regexMatch ? regexMatch[1] : "$driveLetter";
}
/**
 * 描述 随机命名
 */
export const rndName = (pre): string => {
    const rnd= Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
return `${pre}${rnd}`
}