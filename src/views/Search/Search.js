import View from '../View/View';

import template from './template';

import './style.scss';

class Search extends View {
	className () {
		return [View.prototype.className.apply(this, arguments), 'view-search'].join(' '); // extend classes
	}

	onSubmit (event) {
		event.preventDefault();

        console.log(this);

		this.trigger('search', this.ui.field.value);
	}

	init () {
		this.ui.form = this.find('form')[0];
		this.ui.field = this.find('.field')[0];
	}

	subscribe () {
		this.ui.form.addEventListener('submit', this.onSubmit, false);
	}

	destroy () {
		View.prototype.destroy.apply(this, arguments);

		this.ui.form.removeEventListener('submit', this.onSubmit);
	}
}

Search.prototype.binds = ['onSubmit'];

Search.TEMPLATE = template;

export default Search;
