// css includes
import './main.css'
import 'highlight.js/styles/default.css'
import 'highlight.js/styles/github.css'

// css as text
import mainCss from '!raw-loader!./main.css'

import { h, render, Component } from 'preact';
/** @jsx h */

import minify from './minify.js'

class Stats extends Component {
    render(props) {
        var stats = props.stats;
        var generatedStr = stats.timeSpent < 2 ? ' Minified instantly.' : ` Minified in ${stats.timeSpent / 1000} seconds.`;
        return <div className="stats">
            Source: {stats.originalSize} characters.
            Minified: {stats.minifiedSize} characters.
            Saved {Math.round(stats.efficiency * 10000) / 100}%.
            {generatedStr}
        </div>;
    }
}

class Warnings extends Component {
    render(props) {
        var ws = props.warnings.map(w => <div key={w} className="warning">Warning: {w}</div>);
        return props.warnings.length > 0 ? <div className="warnings">{ws}</div> : <span/>;
    }
}

class Container extends Component {
    constructor() {
        super();

        this.state = {
            minified: 'Start typing in the other box!',
            warnings: [],
            stats: {},
            worker: Worker ? new Worker('./bin/build-worker.js') : undefined,
            id: 0
        };
    }
    render(props, state) {
        var html = state.highlighted || state.minified;
        return <div className="contents">
            <textarea className="input io" ref={e => this.textArea = e } onInput={e => this.minify(e)} spellCheck="false" placeholder="input" />
            <div className="output io">
              <Stats stats={state.stats} />
              <Warnings warnings={state.warnings} />
              <div className="hljs" dangerouslySetInnerHTML={{__html: html}} contenteditable="true" />
            </div>
        </div>;
    }
    componentDidMount() {
        this.state.worker.onmessage = e => {
            // only update the most recent minified result
            // this might happen if a long string is sent to ww async, and then a short string is processed synchronously
            if(e.data.id != this.state.id) return;

            var data = e.data.data;
            this.setData(data);
        }
        this.textArea.value = mainCss;
        this.minify({
            target: {
                value: mainCss
            }
        });
    }
    minify(e) {
        var id = this.state.id + 1;
        var text = e.target.value;
        if(text.length > 5000 && this.state.worker) {
            //use ww
            this.state.worker.postMessage({ id, text });
        } else {
            var data = minify(text);
            this.setData(data);
        }
        this.setState({ id });
    }
    setData(data) {
        this.setState({ minified: data.styles, warnings: data.warnings, stats: data.stats, highlighted: data.highlighted.value });
    }
}

var container = document.getElementById('container')
render(<Container />, container, container.lastChild);