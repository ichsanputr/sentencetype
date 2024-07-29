import sentences from "../languages/sentences.json";

function findSentence(id: number, category: string) {
    let categoryWords: Array<{
        text: string,
    }> = [];

    if (category == "common") {
        categoryWords = sentences.common.words.filter((v) => v.id == id)
    } else if (category == "story") {
        categoryWords = sentences.story.words.filter((v) => v.id == id)
    } else if (category == "news") {
        categoryWords = sentences.news.words.filter((v) => v.id == id)
    }

    return categoryWords[0]
}

export default findSentence