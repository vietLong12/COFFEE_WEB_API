module.exports = {

    generateRandomToken: () => {
        const rand = () => {
            return Math.random().toString(36).substr(2); // remove `0.`
        };
        return rand() + rand() + rand() + "-" + rand() + rand() + rand(); // to make it longer
    }
}