import React from 'react';
import { NumberToEPAText } from "../../../utils/convertEPA";
import { withTranslation } from "react-i18next";

export default withTranslation()((props) =>
    <div className='graph-tooltip' style={{ 'left': props.x, 'top': props.y }}>
        {props.date && <p><b className='text-uppercase'>{props.t("Date")}: </b><span>{props.date}</span> </p>}
        {props.epa && <p><b className='text-uppercase'>{props.t("Epa")}: </b><span>{NumberToEPAText(props.epa)}</span> </p>}
        {props.epaRawText && <p><b className='text-uppercase'>{props.t("Epa")}: </b><span>{props.epaRawText}</span> </p>}
        {props.type && <p><b className='text-uppercase'>{props.t("Form Type")}: </b><span>{props.type}</span> </p>}
        {props.rotation && <p><b className='text-uppercase'>{props.t("Rotation")}: </b><span>{props.rotation}</span></p>}
        {props.context && <p><b className='text-uppercase'>{props.t("Situation Context")}: </b><span>{props.context}</span></p>}
        {props.name && <p><b className='text-uppercase'>{props.t("Assessor Name")}: </b><span>{props.name}</span></p>}
        {props.group && <p className='text-capitalize'><b className='text-uppercase'>{props.t("Assessor Role")}: </b><span>{props.group}</span></p>}
        {props.comments && <p><b className='text-uppercase'>{props.t("Comments")}: </b><span>{props.comments}</span></p>}
        {props.concern && <p><b className='text-uppercase text-danger'>{props.t("Professionalism and safety concern")}: </b><span >{props.concern}</span></p>}
    </div>);


