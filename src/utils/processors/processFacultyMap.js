import * as d3 from 'd3';
const phaseList = ['D', 'F', 'C', 'P'];
import { EPATextToNumber } from '../convertEPA';

export default function (allResidentRecords = [], epas = [], currentAcademicYear, minimumRequired, isFamilyMedicine, currentCourse) {

    let allResidentRecordsClone = _.clone(allResidentRecords);

    // For family medicine programs, if the  current course is ALL or not selected then use all resident records as in,
    // if not filter out all records that were completed in that particular course
    if (isFamilyMedicine && currentCourse != 'ALL' && currentCourse != '') {
        allResidentRecordsClone = _.filter(allResidentRecords, (d) => d.Course_Name == currentCourse);
    }

    // if the  current Academic Year is ALL or not selected then use all resident records as in,
    // if not filter out all records that were marked in that year
    if (currentAcademicYear != 'ALL' && currentAcademicYear != '') {
        allResidentRecordsClone = _.filter(allResidentRecords, (d) => d.Academic_Year == currentAcademicYear);
    }

    // now group the records by the faculty name
    let recordsGroupedByFaculty = _.groupBy(allResidentRecordsClone, (d) => d.Assessor_Name),
        epaList = createEPAList(epas);

    // remove faculty that dont meet the required minimum
    _.map(recordsGroupedByFaculty, (records, key) => {
        if (records.length < minimumRequired) {
            delete recordsGroupedByFaculty[key];
        }
    });

    // convert the grouped records into lists such that every group has 
    // a faculty name and then a list of the all required parameters
    return _.map(recordsGroupedByFaculty, (records, faculty_name) => {

        // group records by training phase
        const trainingPhaseGroup = _.groupBy(records, (d) => d.phaseTag);
        // group records by rating
        const ratingGroup = _.groupBy(records, (d) => d.Rating),
            // group records by EPA
            epaGroup = _.groupBy(records, (d) => d.EPA);

        return {
            faculty_name,
            records,
            rating_group: _.map([1, 2, 3, 4, 5], (d) => (ratingGroup[d] ? ratingGroup[d].length : 0)),
            epaGroup: _.map([...epaList], (d) => epaGroup[d.key] ? epaGroup[d.key].length : 0),
            phase_group: _.map(phaseList, (d) => (trainingPhaseGroup[d] ? trainingPhaseGroup[d].length : 0)),
            epa_count: records.length,
            entrustment_score: Math.round((d3.mean(records.map(dd => +dd.Rating || 0)) || 0) * 100) / 100,
            words_per_comment: Math.round(d3.mean(records.map(dd => dd.Feedback.split(" ").length)) || 0)
        }
    })
}

function createEPAList(epas = []) {
    return _.map(epas, (e) => {
        return { 'key': EPATextToNumber(e.target_label.split(':')[0].trim()), 'label': e.target_title };
    });
}
