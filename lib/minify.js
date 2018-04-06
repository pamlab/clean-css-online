import hrtime from 'browser-process-hrtime';
import CleanCSS from 'clean-css';
import hljs from 'highlight.js/lib/highlight.js';
import hljsCss from 'highlight.js/lib/languages/css.js';

hljs.registerLanguage('css', hljsCss);

// hack
if(!process) process = {};
process.hrtime = hrtime;

const cleanCss = new CleanCSS({
    processImport: false,
    debug: true
});

export default data => {
    const minified = cleanCss.minify(data);
    
    minified.highlighted = hljs.highlight('css', minified.styles);
    return minified;
}