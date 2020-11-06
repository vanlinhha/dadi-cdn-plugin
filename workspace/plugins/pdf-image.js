const convert = require('../convert-pdf/convert')


module.exports = ({assetStore, cache, req, setHeader}) => {
    console.log(req.url)
    const pdf_file = req.url.replace('/pdf-image/', '').split('?')[0]
    const query_string = require('querystring').parse(req.url.replace('/pdf-image/', '').split('?')[1])
    const pageNumber = query_string.page || 1
    const scale = query_string.scale || 2
    const mimeType = query_string.mimeType || 'image/png'

    const cacheKey = pdf_file + pageNumber + scale + mimeType
    const pdf_url = 'http://localhost:8001/pdf/' + pdf_file

    return cache.get(cacheKey).then(cached => {
        if (cached) return  cached
        return new Promise((resolve, reject) => {
            convert({
                mimeType : mimeType,
                pageNumber: Number(pageNumber),
                scale: Number(scale),
                source: { url: pdf_url }
            }).then(buffer => {
                resolve(buffer)
            }).catch(error => {
                console.log(error.message)
                reject(error)
            })
        })
    })
}
