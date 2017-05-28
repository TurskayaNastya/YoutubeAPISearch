import View from '../View/View';
import globalData from '../../globalData';
import template from './template';

import './style.scss';

class PaginationItem extends View {

    className () {
        return [View.prototype.className.apply(this, arguments), 'view-pagination-item'].join(' ');
    }

    init () {
        this.ui.pageBtn = this.find('.bullet')[0];
        this.ui.pageBtn.addEventListener("click", this.onClick, false);
    }

    destroy () {
        View.prototype.destroy.apply(this, arguments);
        this.ui.pageBtn.removeEventListener("click", this.onClick);
    }

    onClick(event){
        event.preventDefault();
        this.trigger("swipeToPage", this.data);
    }
}

PaginationItem.prototype.binds = ['onClick'];

PaginationItem.TEMPLATE = template;

export default PaginationItem;
