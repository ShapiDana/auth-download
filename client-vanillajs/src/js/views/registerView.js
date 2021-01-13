const _parentEl = document.querySelector('.register');
    
const _togglePasswordDivDisplay = () => {
    const passwordDiv = _parentEl.querySelector('.password')
    passwordDiv.style.display = passwordDiv.style.display === 'none' ? '' : 'none';
};

const _renderMsg = (msg, isError = false) => {
    const passwordLabel = document.getElementById('register-password');
    passwordLabel.innerHTML = msg;

    if (isError) {
        passwordLabel.style.color = 'red';
    } else {
        passwordLabel.style.color = 'green';
    }
    _togglePasswordDivDisplay();
}

class RegisterView {
    getInput() {
        try {
            const name = _parentEl.getElementsByTagName('input').namedItem('name').value;
            return name;
        } catch(err) {
            console.error(`RegisterView.getInput --> ${error}`);
            return null;
        }
    }

    addHandlerRegister(handler) {
        _parentEl.addEventListener('submit', (e) => {
            e.preventDefault();
            handler();
        });
    }

    renderError(errorMsg) {
        _renderMsg(errorMsg, true);
    }

    renderPassword(password) {
        _renderMsg(password);
    }

    hideRegisterForm() {
        _parentEl.style.display = 'none';
    }

    showRegisterForm() {
        _parentEl.style.display = 'block';
    }
}

export default new RegisterView();