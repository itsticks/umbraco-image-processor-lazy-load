String.prototype.queryStringParamaterValue = function (key) {
    key = key.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp(`[?&]${key}(=([^&#]*)|&|#|$)`),
    results = regex.exec(this);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

String.prototype.updateQueryStringParameter = function (key, value) {
    var regex = new RegExp(`([?&])${key}=.*?(&|$)`, "i");
    var separator = this.indexOf('?') !== -1 ? "&" : "?";
    if (this.match(regex)) return this.replace(regex, `$1${key}=${value}$2`);
    return this + separator + key + "=" + value;
}

document.addEventListener("DOMContentLoaded",
    function () {

        var backgrounds = [].slice.call(document.querySelectorAll('*[style]'))
            .filter(function (x) { return x.style.backgroundImage != "" && x.style.backgroundImage.includes('pixelate=') });
        var srcsets = [].slice.call(document.querySelectorAll('source[srcset]'))
            .filter(function (x) { return x.srcset != "" && x.srcset.includes('pixelate=') });
        var pictures = [].slice.call(document.getElementsByTagName('picture'));


        backgrounds.forEach(function (x) {
            x.style.filter = "blur(10px)";
            var lazyImageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var url = x.style.backgroundImage.match(/\((.*?)\)/)[1].replace(/('|")/g, '');
                        if (url.queryStringParamaterValue('pixelate') != null) {
                            var newImage = new Image();
                            newImage.src = url.updateQueryStringParameter('pixelate', 1);
                            newImage.onload = function () {
                                x.style.backgroundImage = `url('${newImage.src}')`;
                                x.style.filter = "";
                            }
                        }
                        lazyImageObserver.unobserve(x);
                    }
                });
            });
            lazyImageObserver.observe(x);
        });

        srcsets.forEach(function (x) {
            x.parentNode.style.filter = "blur(10px)";
            var lazyImageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var url = x.srcset;
                        if (url.queryStringParamaterValue('pixelate') != null) {
                            var newImage = new Image();
                            newImage.src = url.updateQueryStringParameter('pixelate', 1);
                            newImage.onload = function () {
                                x.srcset = newImage.src;
                                x.parentNode.style.filter = "";
                            }
                        }
                        lazyImageObserver.unobserve(x);
                    }
                });
            });
            lazyImageObserver.observe(x);
        });

    });
