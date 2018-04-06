import minify from './minify.js';

onmessage = e => {
    const id = e.data.id;
    const text = e.data.text;
    const data = minify(text);

    postMessage({id, data});
}