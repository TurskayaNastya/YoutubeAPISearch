import View from '../View/View';
import PaginationItem from '../PaginationItem/PaginationItem';
import globalData from '../../globalData';

import template from './template';

import './style.scss';

class Pagination extends View {

    className() {
        return [View.prototype.className.apply(this, arguments), 'view-pagination'].join(' ');
    }

    init() {
        this.ui.prevBtn = this.find('.prev')[0];
        this.ui.nextBtn = this.find('.next')[0];
        this.ui.bullets = this.find('.bullets')[0];
        this.bullets = [];

        this.ui.prevBtn.addEventListener("click", this.onPrevBtnClick, false);
        this.ui.nextBtn.addEventListener("click", this.onNextBtnClick, false);

        this.updateView();
    }

    destroy() {
        View.prototype.destroy.apply(this, arguments);
        this.ui.prevBtn.addEventListener("click", this.onPrevBtnClick, false);
        this.ui.nextBtn.addEventListener("click", this.onNextBtnClick, false);
    }

    updateView() {
        if (this.bullets.length > 0)
            this.destroyBulletsList();
        this.updatePaginationList();
        this.updateCurrentPage();
        this.updatePrevNextBtns();
    }

    addRow(start, finish) {
        for (var i = start; i < finish; i++) {
            this.bullets.push(new PaginationItem(i, this.emitter, 'a').attachTo(this.ui.bullets));
        }
    }

    last() {
        this.bullets.push(new PaginationItem("...", this.emitter, 'i').attachTo(this.ui.bullets));
        this.bullets.push(new PaginationItem(globalData.totalPages, this.emitter, 'a').attachTo(this.ui.bullets));
    }

    first() {
        this.bullets.push(new PaginationItem("1", this.emitter, 'a').attachTo(this.ui.bullets));
        this.bullets.push(new PaginationItem("...", this.emitter, 'i').attachTo(this.ui.bullets));
    }

    updatePaginationList() {
        const STEP = 2;
        let total = globalData.totalPages;
        let curr = globalData.currPage;
        if (total < STEP * 2 + 6) {
            this.addRow(1, total + 1);
        }
        else if (curr < STEP * 2 + 1) {
            this.addRow(1, STEP * 2 + 4);
            this.last();
        }
        else if (curr > total - STEP * 2) {
            this.first();
            this.addRow(total - STEP * 2 - 2, total + 1);
        }
        else {
            this.first();
            this.addRow(curr - STEP, curr + STEP + 1);
            this.last();
        }
    }

    destroyBulletsList() {
        for (var i = 0, len = this.bullets.length; i < len; i++) {
            this.bullets[i].destroy();
        }
        this.bullets = [];
    }

    updateCurrentPage() {
        for (let i = 0, len = this.bullets.length; i < len; i++) {
            if (this.bullets[i].data == globalData.currPage) {
                this.ui.bullets.children[i].setAttribute("class", "current");
            }
            else
                this.ui.bullets.children[i].setAttribute("class", 'bullets.a');
        }
    }

    updatePrevNextBtns() {
        if (globalData.currPage == 1)
            this.ui.prevBtn.setAttribute("class", "arrDisabled");
        else
            this.ui.prevBtn.setAttribute("class", "prev");
        if (globalData.currPage == this.data.totalPages)
            this.ui.nextBtn.setAttribute("class", "arrDisabled");
        else
            this.ui.nextBtn.setAttribute("class", "next");
    }

    onPrevBtnClick(event) {
        if (globalData.currPage != 1)
            this.trigger('swipeToPage', globalData.currPage - 1);
    }

    onNextBtnClick(event) {
        (globalData.currPage != this.data.totalPages)
        this.trigger('swipeToPage', globalData.currPage + 1);
    }
}

Pagination.prototype.binds = ['onPrevBtnClick', 'onNextBtnClick'];

Pagination.TEMPLATE = template;

export default Pagination;
