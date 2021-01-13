const _parentEl = document.querySelector('.download');

class DownloadView{
    hideDownloadForm() {
        _parentEl.style.display = 'none';
    }

    showDownloadForm() {
        _parentEl.style.display = 'block';

    }
    updateNameLabel(name) {
        const label = _parentEl.getElementsByTagName('input').namedItem('name');
        console.log(label);
        label.value = name;
    }
    getUser() {
        return {
            name: _parentEl.getElementsByTagName('input').namedItem('name').value,
            password: _parentEl.getElementsByTagName('input').namedItem('password').value
        }
    }
}

export default new DownloadView();