import React, { Component } from 'react';
import FacultyGraph from './FacultyGraph';
import _ from 'lodash';
import { withTranslation } from "react-i18next";
class FacultyGraphGroup extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const { width, processedRecords, selectFaculty, currentFaculty, t } = this.props;

        // format the data into the required format for a graph component
        const data_epa_count = _.map(processedRecords, (d) => [d.faculty_name, d.epa_count]);
        // format the data into the required format for a graph component
        const data_expired_rate = _.map(processedRecords, (d) => [d.faculty_name, d.expiry_rate]);
        // entrustment_score data
        // for entrustment scores since we cannot show EPA scores that havent been graded we remove the expired ones
        const data_entrustment_score = _.map(processedRecords, (d) => [d.faculty_name, d.entrustment_score]);
        // words_per_comment data
        const data_words_per_comment = _.map(processedRecords, (d) => [d.faculty_name, d.words_per_comment]);

        const currentFacultyData = _.find(processedRecords, (d) => d.faculty_name == currentFaculty) || false;

        return (<div>
            {processedRecords.length > 0 && <div className='text-center'>
                <FacultyGraph
                    tooltipRef={t("facultyDevlopment-totalEPAsObserved")}
                    tooltipID={'faculty-epacount-infotip'}
                    title={t('Total EPAs Observed')}
                    titleValue={!!currentFacultyData ? currentFacultyData.epa_count : ''}
                    currentFaculty={currentFaculty}
                    trackType={'epa_count'}
                    data={data_epa_count}
                    selectFaculty={selectFaculty}
                    width={(width / 2) - 50} />
                <FacultyGraph
                    tooltipRef={t("facultyDevlopment-EPAExpiryRate")}
                    tooltipID={'faculty-expired-rate-infotip'}
                    title={t("EPA Expiry Rate")}
                    titleValue={!!currentFacultyData ? currentFacultyData.expiry_rate : ''}
                    currentFaculty={currentFaculty}
                    trackType={'expiry_rate'}
                    data={data_expired_rate}
                    selectFaculty={selectFaculty}
                    width={(width / 2) - 50} />
                <FacultyGraph
                    tooltipRef={t("facultyDevlopment-averageEntrustmentScore")}
                    tooltipID={'faculty-epascore-infotip'}
                    title={t("Average Entrustment Score")}
                    titleValue={!!currentFacultyData ? currentFacultyData.entrustment_score : ''}
                    currentFaculty={currentFaculty}
                    trackType={'entrustment_score'}
                    data={data_entrustment_score}
                    selectFaculty={selectFaculty}
                    width={(width / 2) - 50} />
                <FacultyGraph
                    tooltipRef={t("facultyDevlopment-averageWordsPerComment")}
                    tooltipID={'faculty-comment-infotip'}
                    title={t("Average Words Per Comment")}
                    titleValue={!!currentFacultyData ? currentFacultyData.words_per_comment : ''}
                    currentFaculty={currentFaculty}
                    trackType={'words_per_comment'}
                    data={data_words_per_comment}
                    selectFaculty={selectFaculty}
                    width={(width / 2) - 50} />
            </div>}
        </div>

        );
    }
}

export default withTranslation()(FacultyGraphGroup);