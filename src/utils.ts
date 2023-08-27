/** отчет со страницы 0 */
export function getFetchPhotosUrl(page: number) {
    const offset = 10;
    const first = page * offset;
    const ids = new Array(offset)
        .fill(null)
        .map((_, i) => `id=${i + 1 + first}`)
        .join("&");
    const url = "https://jsonplaceholder.typicode.com/photos?";
    return url + ids;
}
