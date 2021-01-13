const _parentEl = document.querySelector('.downloaded-image');

class ImageView {
    hideImagePane() {
        _parentEl.style.display = 'none';
    }

    showImagePane() {
        _parentEl.style.display = 'block';

    }
}

export default new ImageView();
