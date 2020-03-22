import {withFormik} from "formik";
import React from "react";
import PropTypes from 'prop-types';
import { Col, Row, Form, FormGroup, Label, Input } from 'reactstrap';

/**
 * React form component
 * @param props - React properties for component
 */
export function FormikForms(props) {
    // const validate = values => {
    //     const errors = {};
    //     if (!values.drugName) {
    //         errors.drugName = 'Required';
    //     }
    //     if (!values.startDate) {
    //         errors.startDate = 'Required';
    //     }
    //     if (!values.endDate) {
    //         errors.endDate = 'Required';
    //     }
    //     if (values.endDate < values.startDate) {
    //         errors.endDate = 'Ending date must be later than starting';
    //     }
    //     if (!values.freq) {
    //         errors.freq = 'Required';
    //     }
    //     return errors;
    // };

    const { values, handleChange, onChange } = props;
    React.useEffect(() => {
        if (onChange) {
            onChange(props.index, values);
        }
    }, [values]);


    /* Time-input tags: */
    const curTimeList = [];
    for (let i = 0; i < values.dosage; i++) {
        curTimeList.push("timeList[" + i + "]");
    }

    /* Create layout of time list tag: */
    const timeListTag = curTimeList.map((item, index) => {
        return (
            <Col md={4}>
                <Input key={index} name={item} type="time" value={values.timeList[index]} onChange={handleChange} />
            </Col>
        )
    });
    let layoutTimeListTag = null;
    if (values.dosage <= 3){
        layoutTimeListTag = <Row>{timeListTag.slice(0,3)}</Row>;
    }
    else{
        layoutTimeListTag = (
            <div>
                <Row>{timeListTag.slice(0,3)}</Row>
                <Row>{timeListTag.slice(3,6)}</Row>
            </div>
         );
    }

    /* Enable/disable select reminder time: */
    let statusSelect = {};
    if (!values.notifications){
        statusSelect["disabled"] = "disabled";
    }else{
        statusSelect = {}
    }

    return (
        <Form>
            <Row form>
                <Col md={12}>
                    <FormGroup>
                        <Label>Name </Label>
                        <Input name="drugName"
                               value={values.drugName}
                               onChange={handleChange} />
                    </FormGroup>
                </Col>
            </Row>
            <Row form>
                <Col md={5}>
                    <FormGroup>
                        <Label>From </Label>
                        <Input name="dateFrom"
                               type="date"
                               onChange={handleChange}
                               value={values.dateFrom}
                        />

                    </FormGroup>
                </Col>
                <Col md={5}>
                     <FormGroup>
                        <Label>To </Label>
                        <Input name="dateTo"
                               type="date"
                               onChange={handleChange}
                               value={values.dateTo}
                        />
                    </FormGroup>
                </Col>
                <Col md={5}>
                    <FormGroup>
                        <Label>Dosage </Label>
                        <Input type="select"
                               name="dosage"
                               onChange={handleChange}
                               value={values.dosage}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>6</option>
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
            {layoutTimeListTag}
            <Row form>
                <Col md={6}>
                    <FormGroup check>
                        <Input name = "notifications"
                               type="checkbox"
                               onChange={handleChange}
                               value={values.notification}
                               />
                        <Label>Remind me in</Label>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <Input type="select"
                           name="remindTime"
                           onChange={handleChange}
                           value={values.remindTime}
                           {...statusSelect}>
                        <option value={0}>Immediately</option>
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>half-hour</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hour</option>
                    </Input>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <FormGroup>
                        <Label>Comment</Label>
                        <Input type="textarea"
                               name="description"
                               onChange={handleChange}
                               rows={4} cols={48}>
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    );
}

/**
 * Formik form state initialization
 */
export default withFormik({
    mapPropsToValues: () => {
        /* Setting initial date: */
        let startDate = new Date().toISOString().substring(0,10);
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 5);
        endDate = endDate.toISOString().substring(0,10);

        return {
            drugName: "",
            dateFrom: startDate,
            dateTo: endDate,
            dosage: "3",
            timeList: [""],
            notifications: false,
            remindTime: "0",
            description: ""

        };
    }
})(FormikForms);

// const formik = useFormik({
//     initialValues: {
//         drugName: '',
//         startDate: null,
//         endDate: null,
//         freq: ''
//     },
//     validate,
//     onSubmit: values => {
//         alert(JSON.stringify(values, null, 2));
//     },
// });
// return (
//     <form onSubmit={formik.handleSubmit}>
//         <label htmlFor="drugName">Name of drug</label>
//         <input
//             id="drugName"
//             name="drugName"
//             type="text"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.drugName}
//         />
//         {formik.touched.drugName && formik.errors.drugName ? (
//             <div>{formik.errors.drugName}</div>
//         ) : null}
//
//         <br></br>
//         <label htmlFor="startDate">Since</label>
//         <input
//             id="startDate"
//             name="startDate"
//             type="date"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.startDate}
//         />
//         {formik.touched.startDate && formik.errors.startDate ? (
//             <div>{formik.errors.startDate}</div>
//         ) : null}
//
//         <label htmlFor="endDate">Till</label>
//         <input
//             id="endDate"
//             name="endDate"
//             type="date"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.endDate}
//         />
//         {formik.touched.endDate && formik.errors.endDate ? (
//             <div>{formik.errors.endDate}</div>
//         ) : null}
//
//         <br></br>
//         <label htmlFor="freq">Take per day</label>
//         <input
//             id="freq"
//             name="freq"
//             type="text"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.email}
//         />
//         {formik.touched.freq && formik.errors.freq ? (
//             <div>{formik.errors.freq}</div>
//         ) : null}
//         <br></br>
//         <GenerateButton/>
//     </form>
// );


Form.propTypes = {
    children: PropTypes.node,
    inline: PropTypes.bool,
    // Pass in a Component to override default element
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]), // default: 'form'
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
    className: PropTypes.string,
    cssModule: PropTypes.object,
};

FormGroup.propTypes = {
    children: PropTypes.node,
    // Applied the row class when true, does nothing when false
    row: PropTypes.bool,
    // Applied the form-check class when true, form-group when false
    check: PropTypes.bool,
    inline: PropTypes.bool,
    // Applied the disabled class when the check and disabled props are true, does nothing when false
    disabled: PropTypes.bool,
    // Pass in a Component to override default element
    tag: PropTypes.string, // default: 'div'
    className: PropTypes.string,
    cssModule: PropTypes.object,
};