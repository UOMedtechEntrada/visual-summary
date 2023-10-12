import _ from 'lodash';
import moment from 'moment';
import { EPATextToNumber } from '../convertEPA';
export default function (username, residentInfo, learnerDataDump) {

    let { dashboard_epas = [], rating_scale_map = [],
        assessments = [], course_name = '',
        contextual_variables = [], contextual_variables_map = [], rotation_schedule = [] } = learnerDataDump,
        { fullname, epaProgress } = residentInfo;

    // process and set the source map  
    const programInfo = getProgramInfo(dashboard_epas, epaProgress, course_name);

    // process the rating scale map
    // records come tagged with descriptor ID, we need to group the ratings by scale ID and then rate them by order.
    let scale_map = _.groupBy(rating_scale_map, (d) => d.scale_id), scale_title_map = {};
    // Order the ratings in a single scale so that they are in order based on the order tag
    _.map(scale_map, (scale, scale_id) => {
        scale_map[scale_id] = _.map(_.sortBy(scale, d => d.order), (e) => e.text);
        scale_title_map[scale_id] = scale[0].rating_scale_title || '';
    });
    // This info is used in the GraphRow.jsx component
    window.dynamicDashboard.contextual_variable_map = _.groupBy(contextual_variables_map, (d) => d.form_id);

    // Group the contextual variables by item code first 
    const groupedContextualVariables = _.groupBy(contextual_variables, (d) => d.item_code);
    // Get the contextual_variables alone for now 
    // Then group by form ID for easy access 
    const subGroupedContextualVariables = _.groupBy(groupedContextualVariables['CBME_contextual_variables'] || [], (d) => d.form_id);
    // For each form ID then further sub group by assessment ID
    _.map(subGroupedContextualVariables, (values, formID) => {
        subGroupedContextualVariables[formID] = _.groupBy(values, (d) => d.dassessment_id);
    });

    var processedData = _.map(assessments, (record) => {

        const contextual_variables_by_form = subGroupedContextualVariables[record.form_id] || {},
            situationContextCollection = contextual_variables_by_form[record.dassessment_id] || [];

        // Map the rating for the record based on the descriptor ID
        const rating = _.find(rating_scale_map, d => d.descriptor_id == record.selected_descriptor_id) || { 'order': 1 };

        return {
            username,
            recordID: record.dassessment_id,
            Date: moment(record.encounter_date, 'MMM DD, YYYY').format('YYYY-MM-DD'),
            EPA: recordEPAtoNumber(record),
            Assessor_Name: record.assessor,
            Feedback: processComments(record),
            Assessor_Group: getAssessorType(record['assessor_group'], record['assessor_role']),
            Rating: rating.order,
            Rating_Text: '(' + rating.order + ') ' + (rating.text || ''),
            Resident_Name: fullname,
            Situation_Context: _.map(situationContextCollection, (e) => e.item_text + " : " + e.text).join("\n"),
            Type: record.form_type,
            situationContextCollection,
            formID: record.form_id,
            formTitle: record.title,
            Academic_Year: getAcademicYear(moment(record.encounter_date, 'MMM DD, YYYY').format('YYYY-MM-DD')),
            scale: scale_map[rating.scale_id] || ['No Resident Entrustment Found'],
            scaleTitle: scale_title_map[rating.scale_id] || ['No Matching Scale'],
            concernFlagged: flagConcerns(record)
        }
    });

    var residentData = processedData.filter((d) => d.EPA != 'unmapped');

    // process the rotation schedule data 
    var rotationSchedule = processRotationSchedule(rotation_schedule);

    return { programInfo, residentData, rotationSchedule };
}

// If group and role are same just return group, if not add the role type to the group
let getAssessorType = (group = '', role = '') => (group == role) ? group : group + ' (' + role + ')';

function getProgramInfo(epa_list, epaProgress, course_name) {

    let defaultSourceMap = {
        1: {
            'ID': 'TTD',
            'topic': 'Transition to Discipline (D)',
            subRoot: {},
            maxObservation: {},
            observed: {},
            completed: {},
            achieved: {},
            objectiveID: {},
            assessmentInfo: {},
            filterValuesDict: {}
        },
        2: {
            'ID': 'F',
            'topic': 'Foundations of Discipline (F)',
            subRoot: {},
            maxObservation: {},
            observed: {},
            completed: {},
            achieved: {},
            objectiveID: {},
            assessmentInfo: {},
            filterValuesDict: {}
        },
        3: {
            'ID': 'CORE',
            'topic': 'Core of Discipline (C)',
            subRoot: {},
            maxObservation: {},
            observed: {},
            completed: {},
            achieved: {},
            objectiveID: {},
            assessmentInfo: {},
            filterValuesDict: {}
        },
        4: {
            'ID': 'TP',
            'topic': 'Transition to Practice (P)',
            subRoot: {},
            maxObservation: {},
            observed: {},
            completed: {},
            achieved: {},
            objectiveID: {},
            assessmentInfo: {},
            filterValuesDict: {}
        },
    };

    // Map over each EPA and append it to its corresponding entry in the sourcemap 
    _.map(epa_list, (epa) => {

        // first find the corresponding EPA from the progess list 
        let matchingEPA = _.find(epaProgress, (d) => d.objective_id == epa.target_id),
            EPAID = false;

        // If a matchine EPA is found use that for the EPA ID
        if (matchingEPA) {
            EPAID = EPATextToNumber(matchingEPA.objective_code);
        }
        // If not try to get an EPA ID from the title
        else {
            EPAID = EPATextToNumber(epa.target_label.split(':')[0].trim());
            matchingEPA = {};
        }

        // set the EPA label
        defaultSourceMap[EPAID[0]].subRoot[EPAID] = getEPATitle(epa.target_title);
        // set the EPA required observation count 
        defaultSourceMap[EPAID[0]].maxObservation[EPAID] = matchingEPA.total_assessments_required || 0;
        // set the EPA achieved count 
        defaultSourceMap[EPAID[0]].observed[EPAID] = matchingEPA.total_assessment_attempts || 0;
        // set the observed count 
        defaultSourceMap[EPAID[0]].achieved[EPAID] = matchingEPA.total_requirement_met_assessments || 0;
        // set the completed flag 
        defaultSourceMap[EPAID[0]].completed[EPAID] = matchingEPA.completed || false;
        // set the EPA objective ID 
        defaultSourceMap[EPAID[0]].objectiveID[EPAID] = matchingEPA.objective_id || false;
    });

    return {
        programName: course_name,
        'epaSourceMap': { ...defaultSourceMap }
    }
}


let getEPATitle = (title) => title.slice(3).trim();


function recordEPAtoNumber(record) {
    if (record.mapped_epas.length > 0) {
        return EPATextToNumber(record.mapped_epas[0].objective_code || '');
    }
    else if (record.form_type == 'Supervisor Form') {
        return EPATextToNumber(record.title.split('-')[1].trim());
    }
    else { return 'unmapped' };
}

function processComments(record) {
    // if comments exists parse them
    if (record.comments && record.comments.length > 0) {

        // Since textual comments and rubric concerns items with comments are both reported on the same form
        // we first split them into two groups 
        let [concernComments = [], textualComments = []] = _.partition(record.comments, ({ type = '' }) => type.indexOf('concern') > -1);
      
        // The textual comments can be of multiple types
        // the comment of the type label: "Based on this..."
        // are the regular feedback so add them in first
        // sometimes there are multiple entries of this type, which can happen
        // if they enter a comment first and then edit it and save it
        // so get the longest comment 
        let groupedComments = _.partition(textualComments, (d) => d.label.indexOf('Based on this') > -1);
        // the grouped comments is an array the first index contains all comments which are the feedback type
        // usually this is just one comment but sometimes the same entry gets
        // written multiple times so in those cases reduce it to the longest one.
        let commentCollection = _.reduce(groupedComments[0], (acc, d) => d.text.length > acc.length ? d.text : acc, '');

        // if the comment is non empty add an empty line after it.
        commentCollection = commentCollection.length > 0 ? commentCollection + '\n' : commentCollection;

        // loop over and add any other non feedback comments if they exist
        _.map(groupedComments[1] || [], (d) => {
            // for each , first add an empty line and then a gap line
            // Also capitalize the item title
            commentCollection += d.label + ": " + d.text + '\n';
        });

        // For the concern comments, first check if a concern flag is set to Yes
        // only then consider the comment
        // as there are scenarios where concern comments are made and then the concern flag is set to No
        // so the comment is no longer valid 
        _.map(concernComments, (d) => {
            let { descriptor = '' } = d;
            if (descriptor.toLowerCase().indexOf('yes') > -1) {
                commentCollection += d.label + ": " + d.text + '\n';
            }
        });

        return commentCollection;
    }
    return '';
}

function flagConcerns(record) {
    // if comments exists parse them
    if (record.comments && record.comments.length > 0) {
        // if a comment is of the concern type such as professionalism, safety concern, program review required etc 
        // filter it out and then check if the concern descriptor is Yes 
        let concernedComments = _.filter(record.comments, ({ type = '', descriptor = '' }) => (type.indexOf('concern') > -1) && (descriptor.toLowerCase().indexOf('yes') > -1));;
        return concernedComments.length > 0;
    }
    return false;
}


function processRotationSchedule(rotationList) {
    return rotationList.map((r, rotationID) => ({
        ...r,
        'start_date': moment(r.start_date, 'YYYY-MM-DD'),
        'end_date': moment(r.end_date, 'YYYY-MM-DD'),
        'Academic_Year': getAcademicYear(r.start_date),
        'unique_id': 'rotation-' + rotationID
    }));
}


function getAcademicYear(startDate) {
    const dateObject = moment(startDate, 'YYYY-MM-DD'), year = dateObject.year();
    // The academic year is always the year number when the academic calendar starts
    // so to get the academic year, we first get the year entry of the datapoint
    // then if the datapoint is after July 1st then the academic year is that year number
    // if not then the academic year is the previous year number.
    if (dateObject.isSameOrAfter(moment('07/01/' + (+year), 'MM/DD/YYYY'))) {
        return year;
    }
    return year - 1;
}