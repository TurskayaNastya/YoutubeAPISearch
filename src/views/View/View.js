import template from './template';

import './style.scss';

class View {
	constructor (data, emitter, tag) {
		this.data = data;
		this.emitter = emitter; // use emitter for trigger events inside the app
        this.tag = tag || 'div';

		this.ui = {}; // box for all inner elements
	
		this.binds && this.bindAll(...this.binds); // bind short-cuts binds: ['func1', 'func2', ...]
	
		this.element = this.createElement();

		this.construct();

		this.render();

		this.init();
		this.subscribe();
	}

	on (...args) {
		return this.emitter.on(...args);
	}
	
	off (...args) {
		return this.emitter.off(...args);
	}
	
	trigger (...args) {
		return this.emitter.trigger(...args);
	}

	bind (name, ...args) {
		return this[name] = this[name].bind(this, ...args);
	}

	bindAll (...list) {
		for (let i = 0, len = list.length; i < len; i++) {
			this.bind(list[i]);
		}

		return this;
	}

	createElement () {
		let element = document.createElement(this.tag);

		element.setAttribute('class', this.className());

		return element;
	}

	className () {
		return 'view';
	}

	find (selector) {
		return this.element.querySelectorAll(selector);
	}

	render () {
		this.element.innerHTML = this.template();
	}
	
	template () {
		return this.constructor.TEMPLATE.call(this);
	}

	attachTo (target) {
		target.appendChild(this.element);
	
		return this;
	}

	detach () {
		var parent = this.element.parentNode;

		if (!parent) return;

		parent.removeChild(this.element);
	}
	
	destroy () {
		this.detach();
	}

	style(){
	    return getComputedStyle(this.element);
    }
	// Empty funct for remove checking of his existings in constructor
	construct () {}
	init () {}
	subscribe () {}
}

View.TEMPLATE = template;

export default View;
