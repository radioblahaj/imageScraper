const path = require('path');
const fs = require('fs').promises; // Use the promises API for async/await
let filePaths = [];
async function exploreDir(dir) {
    // console.log(dir);
    try {
        const files = await fs.readdir(dir);
        for (const filename of files) {
            const filePath = path.join(dir, filename);
            // console.log(filePath);
            if (await isDir(filePath) && filename != "node_modules" && filename != "appwrite-docs") {
              // console.log("START | About to be explored! " + filePath);
                await exploreDir(filePath); // Wait for the directory to be fully explored
                // console.log("END | Dir explored! " + filePath);
            } else if (['.png', '.jpg', '.svg'].includes(path.extname(filename))) {
                console.log("IMAGE FOUND: " + filePath)
                filePaths.push(filePath);
            }
        }
    } catch (err) {
        console.error(`Unable to read directory: ${dir}`, err);
    }
}
async function isDir(item) {
    try {
        const stats = await fs.stat(item);
        return stats.isDirectory();
    } catch (err) {
        console.error(`Unable to get stats for: ${item}`, err);
        return false;
    }
}

console.log("It's running!")
exploreDir(__dirname).then(() => {
  console.log(filePaths);
  fs.writeFile(__dirname + "/images.json", JSON.stringify(filePaths, "  "))
});