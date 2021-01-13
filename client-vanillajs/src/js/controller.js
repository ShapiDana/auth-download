import * as model from './model';
import registerView from './views/registerView';
import stepperView from './views/stepperView';
import downloadView from './views/downloadView';
import imageView from './views/imageView';
import * as consts from './config';



const controlRegisterName = async () => {
    const inputName = registerView.getInput();

    const password = await model.registerName(inputName);
    if (!password) {
        registerView.renderError('Could not get password from server');
    } else if (password.includes('Error')) {
        registerView.renderError(password);
        stepperView.disableNext();
    } else {
        registerView.renderPassword(password);
        stepperView.enableNext();
    }
};

const controlStepperNext = () => {
    if (model.state.page === consts.REGISTER_PAGE) {
        registerView.hideRegisterForm();
        downloadView.showDownloadForm();
        downloadView.updateNameLabel(model.state.name);
        stepperView.enablePrev();

        model.state.page = consts.DOWNLOAD_PAGE;
    } else if (model.state.page === consts.DOWNLOAD_PAGE) {
        downloadView.hideDownloadForm();
        imageView.showImagePane();
        /*imageView.renderImage*/(model.downloadImage(downloadView.getUser()));
        stepperView.disableNext();

        model.state.page = consts.IMAGE_PAGE;
    }
};

const controlStepperPrevious = () => {
    if (model.state.page === consts.DOWNLOAD_PAGE) {
        downloadView.hideDownloadForm();
        registerView.showRegisterForm();
        stepperView.disablePrev();
        stepperView.enableNext();

        model.state.page = consts.REGISTER_PAGE;
    }
};

const init = () => {
    registerView.addHandlerRegister(controlRegisterName);
    stepperView.addHandlerNext(controlStepperNext);
    stepperView.addHandlerPrevious(controlStepperPrevious);
};

init();