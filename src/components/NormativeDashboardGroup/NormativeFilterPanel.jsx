import React, { Component } from 'react';
import ReactSelect from 'react-select';
import _ from 'lodash';
import { withTranslation } from "react-i18next";

class NormativeFilterPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const { currentStage, removeNoRecords = false,
            onStageChange, onNoRecordChange, t } = this.props;

        const trainingStageList = getTrainingStageList(t),
            currentStageEntry = _.find(trainingStageList, (d) => d.value == currentStage) || trainingStageList[0];

        return (
            <div className='filter-panel text-left p-b'>
                <div className='text-left advanced-filter-box normative-filter-box'>

                    <div className='react-select-root-filter'>
                        <ReactSelect
                            placeholder={t('Select Training Stage...')}
                            value={currentStageEntry}
                            options={trainingStageList}
                            styles={{
                                option: (styles, { isSelected }) => ({
                                    ...styles,
                                    color: isSelected ? 'white' : 'black',
                                    textAlign: 'left'
                                })

                            }}
                            onChange={onStageChange} />
                    </div>

                    <div className="checkbox custom-control text-center custom-checkbox">
                        <label className='filter-label'>
                            {t("Filter Learners with No records")}
                            <input id='filter-dateFilterActive' type="checkbox"
                                checked={removeNoRecords} onChange={onNoRecordChange} />
                            <span className="custom-control-indicator"></span>
                        </label>
                        <i data-for='normative-instant-info' data-tip={t("normativeAssessment-stages")} className="fa fa-info-circle instant-tooltip-trigger"></i>
                    </div>
                </div>
            </div>)
    }

}

function getTrainingStageList(t) {
    // access the training stages 
    // TODO training stages only for one level not multiple
    let stageListCopy = [...dashboard_options.dashboard_stages];
    let remappedStageList = _.map(stageListCopy, (d) => {
        return {
            value: d.target_label.split(' ').join('-').toLowerCase(),
            label: d.target_label,
        };
    })
    // and then add an extra option all to the list
    remappedStageList.unshift({ value: 'all-training-stages', 'label': t('All Training Stages') });
    return remappedStageList;
}

export default withTranslation()(NormativeFilterPanel);