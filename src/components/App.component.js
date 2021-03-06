import React from "react";
import Form from "./Form.component";
import {GenerateButton} from "./GenerateButton.component";
import {AddButton} from "./AddButton.component";
import {EventPlanGenerator} from "../generate_script/EventPlanGenerator";
import {Col, Container, Row} from 'reactstrap';
import {LanguageProvider, Text} from '../containers/Language';
import LanguageSelector from './LanguageSelector.component';
import About from './About.component';
import {Flip, toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

/**
 * Initialisation of main component of React application
 */
export function App() {
    const [appState, setAppState] = React.useState({
        drugs: [{
            id: Date.now(),
        }],
        numOfForms: 1,
        timeSet: new Map(),
        lang: 'eng'
    });


    /**
     * Handler for the form onChange
     */
    function handleFormChange(index, values) {
        let drugs = appState.drugs.slice();

        /* Get id in array: */
        let arrIndex = 0;
        for (arrIndex; arrIndex < appState.numOfForms; arrIndex++){
            if (appState.drugs[arrIndex].id === index){
                break;
            }
        }

        /* Prediction time set: */
        let newDosage = values.dosage;
        if (newDosage > 12){
            newDosage = 12;
        }
        else if (newDosage < 1){
            newDosage = 1;
        }

        if (newDosage !== drugs[arrIndex].dosage){
            if (appState.timeSet.has(newDosage)){
                values.timeList = appState.timeSet.get(newDosage);
            }else{
                values.timeList = [];
                let startHour = 0;
                let interval = Math.ceil(24 / newDosage);
                for (let i = 0; i < newDosage; i++, startHour+=interval) {
                    let curHour = startHour % 24;
                    values.timeList.push((curHour < 10 ? "0" + curHour : curHour) + ":" + "00");
                }
            }
        }

        /* Save time set */
        appState.timeSet.set(values.dosage, values.timeList);

        /* Change values in state: */
        drugs[arrIndex] = {
            ...values,
            id: drugs[arrIndex].id,
        };
        setAppState({
            drugs: drugs,
            numOfForms: appState.numOfForms,
            timeSet: appState.timeSet,
            lang: appState.lang
        });
    }

    /**
     * Function for form validation
     */
    function validForm(form) {
        if (!form.drugName || !form.dateFrom || !form.dateTo || form.dateTo < form.dateFrom) {
            return false;
        }else {
            for (let ind = 0; ind < form.timeList.length; ind++){
                if (form.timeList[ind] === ""){
                    return false;
                }
            }
            return true;
        }
    }

    /**
     * Handler for the submit button
     */
    function handleSubmit() {
        /* Click all submit buttons for validaton: */
        let formButtons = document.getElementsByClassName('med-form__submit');
        for (let button of formButtons){
            button.click();
        }
        let readyToGenerate = false;
        for (let form of appState.drugs){
            readyToGenerate = validForm(form);
            if (!readyToGenerate){
                return;
            }
        }
        EventPlanGenerator.createNewPlan(appState);
        let FileSaver = require('file-saver');
        const file = new File([EventPlanGenerator.eventList], "MedSched.ics", {type: "Application/octet-stream;charset=utf-8"});
        FileSaver.saveAs(file);
        if (appState.lang === 'eng') {
            toast('Downloaded successfully');
        }else {
            toast('Успешно загружено');
        }
    }

    /**
     * Handler for the addition button
     */
    function handleAddMore(){
        setAppState(appState => ({
            drugs: [...appState.drugs, {id: Date.now()}],
            numOfForms: (appState.numOfForms += 1),
            timeSet: appState.timeSet,
            lang: appState.lang
        }))
    }

    /**
     * Handler for the delete button
     */
    function handleDeleteForm(index){
        let form = appState.drugs;

        /* Get id in array: */
        let arrIndex = 0;
        for (arrIndex; arrIndex < appState.numOfForms; arrIndex++){
            if (appState.drugs[arrIndex].id === index){
                break;
            }
        }
        /* Delete form in state: */
        form.splice(arrIndex, 1);
        setAppState(appState => ({
            drugs: form,
            numOfForms: (appState.numOfForms -= 1),
            timeSet: appState.timeSet,
            lang: appState.lang
        }));
    }

    /**
     * Handler for the language selector
     */
    function handleChangeLang(newLang){
        setAppState(appState => ({
            drugs: appState.drugs,
            numOfForms: appState.numOfForms,
            timeSet: appState.timeSet,
            lang: newLang
        }));
    }


    /* Render current number of forms: */
    let forms = [];
    for (let i = 0; i < appState.numOfForms; i++) {
        forms.push(
            <Form onChange={handleFormChange}
                  onClickDelete={handleDeleteForm}
                  keyValue={appState.drugs[i].id}
                  key={appState.drugs[i].id}
                  numOfForms={appState.numOfForms}
                  values = {appState.drugs[i]}
            />
        );
    }


    return (
        <LanguageProvider>

            <div className="header">
                <h1 id="header__text"><Text tid="siteName" /></h1>
                <div id="header__button">
                    <LanguageSelector
                        onChange={handleChangeLang}
                    />
                    <About text={<Text tid="about" />}/>
                </div>
            </div>

            <Container>
                <Row>
                    <Col md={12}>

                        <h1 id={'header__text-' + appState.lang}><Text tid="slogan" /></h1>
                    </Col>
                </Row>

                {forms}

                <Row>
                    <Col>
                        <AddButton onClick = {handleAddMore}
                                   name = <Text tid="addMore" />
                        />
                    </Col>
                    <Col>
                        <GenerateButton onClick = {handleSubmit}
                                        name = <Text tid="download" />
                        />
                    </Col>
                </Row>
                <ToastContainer
                    position="bottom-right"
                    autoClose={2000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    pauseOnFocusLoss={false}
                    pauseOnHover={false}
                    transition={Flip}
                    closeButton={false}
                />
            </Container>

        </LanguageProvider>

    );
}