
/**
 * @returns {PixivArtwork|null}
 */
const extractPageData = () => {
    const artwork         = document.querySelector('main a[href^="https://i.pximg.net/img-original/img"]')
    const preview         = artwork.querySelector('img');
    const artistContainer = document.querySelector('aside section h2')
    const artistImg       = artistContainer.querySelector('img');

    if (!(artwork && preview && artistContainer && artistImg)) {
        return null;
    }

    return {
        artwork: {
            sources:     {
                full:    artwork.href,
                preview: preview.src,
            },
            description: preview.alt
        },
        author:  {
            name:    artistContainer.innerText,
            profile: artistImg.src
        },
        url:     document.location.href
    };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPixivData") {
        sendResponse(extractPageData());
    }
});