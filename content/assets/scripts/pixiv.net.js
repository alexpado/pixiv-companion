const REGEXES = {
    ARTWORK: /https:\/\/www\.pixiv\.net\/.*\/artworks\/\d+/
}

/**
 * Extract the current page data.
 *
 * @returns {ChromeTabQuery}
 *      Result of the extraction
 */
const extractPageData = () => {

    if (!REGEXES.ARTWORK.test(document.location.href)) {
        return {
            success: false,
            message: 'Please open an artwork.',
            data:    null
        };
    }

    const artwork         = document.querySelector('main a[href^="https://i.pximg.net/img-original/img"]')
    const preview         = artwork.querySelector('img');
    const artistContainer = document.querySelector('aside section h2')
    const artistImg       = artistContainer.querySelector('img');

    if (!(artwork && preview && artistContainer && artistImg)) {
        return {
            success: false,
            message: 'Incompatible artwork: Only static image are supported.',
            data:    null
        };
    }

    const data = {
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

    return {
        success: true,
        message: null,
        data
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'get-data':
            sendResponse(extractPageData())
            break;
        default:
            sendResponse(
                {
                    success: false,
                    message: 'Unknown action',
                    data:    null
                }
            );
    }
});