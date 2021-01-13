const _parentEl = document.querySelector('.stepper');

class StepperView{
    enableNext() {
        const nextButton = document.getElementById('btnNext');
        nextButton.disabled = false;
    }
    
    disableNext() {
        const nextButton = document.getElementById('btnNext');
        nextButton.disabled = true;
    }

    enablePrev() {
        const nextButton = document.getElementById('btnPrev');
        nextButton.disabled = false;
    }
    
    disablePrev() {
        const nextButton = document.getElementById('btnPrev');
        nextButton.disabled = true;
    }

    addHandlerNext(handler) {
        document.getElementById('btnNext').addEventListener('click', (e) => {
            e.preventDefault();
            handler();
        });
    }

    addHandlerPrevious(handler) {
        document.getElementById('btnPrev').addEventListener('click', (e) => {
            e.preventDefault();
            handler();
        });
    }
}

export default new StepperView();