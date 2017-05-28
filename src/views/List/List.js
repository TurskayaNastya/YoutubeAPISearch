import View from '../View/View';
import ListItem from '../ListItem/ListItem';
import globalData from '../../globalData';
import Pagination from '../Pagination/Pagination';
import template from './template';

import './style.scss';

class List extends View {

    className() {
        return [View.prototype.className.apply(this, arguments), 'view-list'].join(' ');
    }

    init() {
        this.data.videosPerPage = 5;

        window.addEventListener('resize', this.onWindowResize);

        this.ui.display = this.find('.display')[0];
        this.ui.slider = this.find('.slider')[0];
        this.ui.listLine = this.find('.line')[0];
        this.ui.pagination = this.find('.pagination')[0];

        this.ui.slider.addEventListener("mousedown", this.onMouseDown, false);
        this.ui.slider.addEventListener("mouseup", this.onMouseUp, false);
        this.ui.slider.addEventListener("mousemove", this.onMouseMove, false);
        this.ui.slider.addEventListener("touchstart", this.onTouchStart, false);
        this.ui.slider.addEventListener("touchmove", this.onTouchMove, false);
        this.ui.slider.addEventListener("touchend", this.onTouchEnd, false);
    }

    subscribe() {
        this.on('swipeToPage', this.swipeToPage);
    }

    destroy() {
        View.prototype.destroy.apply(this, arguments);
        this.ui.slider.removeEventListener("mousedown", this.onMouseDown);
        this.ui.slider.removeEventListener("mouseup", this.onMouseUp);
        this.ui.slider.removeEventListener("mousemove", this.onMouseMove);
        this.ui.slider.removeEventListener("touchstart", this.onTouchStart);
        this.ui.slider.removeEventListener("mouseup", this.onMouseUp);
        this.ui.slider.removeEventListener("touchmove", this.onTouchMove);
        window.removeEventListener('resize', this.onWindowResize);
        this.off('swipeToPage', this.swipeToPage);
    }

    createView() {
        this.createLine(globalData.loadedVideoItems);
        this.updatePagination();
    }

    updatePagination(){
        this.videosPerPage = Math.ceil(this.ui.display.clientWidth / this.ui.listLine.firstChild.clientWidth);
        globalData.totalPages = Math.ceil(this.ui.listLine.children.length / this.videosPerPage);

        if (!this.pagination) {
            this.pagination = new Pagination({totalPages: globalData.totalPages}, this.emitter).attachTo(this.ui.pagination);
        }else{
            this.pagination.data.totalPages = globalData.totalPages;
            this.pagination.updateView();
        }
    }

    createLine(data) {
        for (let i = 0, len = data.length; i < len; i++) {
            new ListItem(data[i], this.emitter, 'li').attachTo(this.ui.listLine);
        }
        this.ui.listLine.style.marginLeft = -100 * (globalData.currPage - 1) + "%";
    }

    onMouseDown(event) {
        event.preventDefault();
        this.prevX = event.clientX;
        this.startDrug = true;
    }

    onMouseUp(event) {
        this.currentX = event.clientX;
        let delta = this.currentX - this.prevX;
        if (globalData.currPage - (Math.sign(delta)) > 0)
            this.swipeToPage(globalData.currPage - (Math.sign(delta)));
        this.startDrug = false;
    }

    onMouseMove(event) {
        event.preventDefault();
        if (this.startDrug)
            this.moveTo(event.clientX - this.currentX);
    }

    onTouchStart(event) {
        if (event.touches.length != 1 || this.started) {
            return;
        }
        this.detecting = true;
        event.changedTouches[0];
        this.startX = event.changedTouches[0].pageX;
        this.startY = event.changedTouches[0].pageY;
    }

    onTouchMove(event) {
        if (!this.started && !this.detecting) {
            return;
        }

        if (this.detecting) {
            this.detect(event);
        }

        if (this.started) {
            this.draw(event);
        }
    }

    detect(event) {
        let touch = event.changedTouches[0];
        if (Math.abs(this.startX - touch.pageX) >= Math.abs(this.startY - touch.pageY)) {
            event.preventDefault();
            this.started = true;
        }

        this.detecting = false;
    }

    draw(event) {
        event.preventDefault();
        let touch = event.changedTouches[0];
        this.delta = this.startX - touch.pageX;

        /*if (this.delta > 0 && (globalData.currPage - 1) > 0 || this.delta < 0 && (globalData.currPage + 1) < globalData.totalPages) {
            this.delta = this.delta / 5;
        }*/

        //this.moveTo(this.delta);
    }

    onTouchEnd(event) {
        if (!this.started) {
            return;
        }

        event.preventDefault();

        if (this.delta > 0 && (globalData.currPage + 1) <= globalData.totalPages || this.delta < 0 && (globalData.currPage - 1) > 0 ) {
            let swipeTo = globalData.currPage + Math.sign(this.delta);
            this.swipeToPage(swipeTo);
        }
    }

    moveTo(delta) {
        this.ui.listLine.style.marginLeft = getComputedStyle(this.ui.listLine).marginLeft + delta;
    }

    swipeToPage(page) {
        globalData.currPage = page;
        if (page <= globalData.totalPages) {
            this.ui.listLine.style.marginLeft = -100 * (page - 1) + "%";
        }
        if (page == globalData.totalPages)  {
            this.trigger("getMoreVideos");
        }

        this.updatePagination();
    }

    onWindowResize(event){
        if (globalData.currPage > globalData.totalPages)
            globalData.currPage = globalData.totalPages;
        this.swipeToPage(globalData.currPage);
    }
}

List.prototype.binds = ['onMouseDown',
    'onMouseUp',
    'onMouseMove',
    'swipeToPage',
    'onTouchStart',
    'onTouchMove',
    'onTouchEnd',
    'moveTo',
    'draw',
    'detect',
    'onWindowResize'];

List.TEMPLATE = template;

export default List;
