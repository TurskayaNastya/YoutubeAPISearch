import View from '../View/View';

import template from './template';

import './style.scss';

class ListItem extends View {
    className () {
        return [View.prototype.className.apply(this, arguments), 'view-list-item'].join(' ');
    }

    destroy () {
        View.prototype.destroy.apply(this, arguments);
    }
}

ListItem.TEMPLATE = template;

export default ListItem;

