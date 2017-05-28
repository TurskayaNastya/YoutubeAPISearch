import View from '../View/View';

import Search from '../Search/Search';
import List from '../List/List';

import template from './template';

import './style.scss';

class Main extends View {
	className () {
		return [View.prototype.className.apply(this, arguments), 'view-main'].join(' '); // extend classes
	}

	render () {
		View.prototype.render.apply(this, arguments);

		this.ui.search = this.find('.search')[0];
		this.ui.list = this.find('.list')[0];

		this.search = new Search({}, this.emitter).attachTo(this.ui.search);

	}

    subscribe () {
        this.on('updateData', this.updateData);
    }

    updateData(){
        if (this.list)
            this.list.destroy();

        this.list = new List({}, this.emitter).attachTo(this.ui.list);
        this.list.createView();
    }
}

Main.prototype.binds = ['updateData'];
Main.TEMPLATE = template;

export default Main;
