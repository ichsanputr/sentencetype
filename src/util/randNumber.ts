function getRandomInt(max: number) {
    const min = Math.ceil(0);
    max = Math.floor(max-1);
    return Math.floor(Math.random() * (max - min + 1));
}

export default getRandomInt