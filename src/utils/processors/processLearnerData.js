import _ from 'lodash';
import moment from 'moment';
import { EPATextToNumber } from '../convertEPA';
import { decodeHtmlEntity } from '../genericUtility';

export default function (username, residentInfo, learnerDataDump) {

    let { dashboard_epas = [], rating_scale_map = [],
        assessments = [], course_name = '',
        contextual_variables = [], contextual_variables_map = [], rotation_schedule = [] } = learnerDataDump,
        { fullname, epaProgress } = residentInfo;

    let assessments_fixed = _.map(assessments, (e) => ({ ...e, 'comments': JSON.parse(e.comments), 'mapped_epas': JSON.parse(e.mapped_epas) }));

    // Create an empty resusable epa map that maps the objective code of every epa with its training stage index and epa
    // this info is used in the covertEPA.js function
    window.dynamicDashboard.epa_map = {};
    // process and set the source map  
    const programInfo = getProgramInfo(dashboard_epas, epaProgress, course_name);

    // process the rating scale map
    // records come tagged with descriptor ID, we need to group the ratings by scale ID and then rate them by order.
    let scale_map = _.groupBy(rating_scale_map, (d) => d.scale_id), scale_title_map = {};
    // Order the ratings in a single scale so that they are in order based on the order tag
    _.map(scale_map, (scale, scale_id) => {
        scale_map[scale_id] = _.map(_.sortBy(scale, d => d.order), (e) => e.text);
        scale_title_map[scale_id] = scale[0].rating_scale_title;
    });


    // This info is used in the GraphRow.jsx component
    window.dynamicDashboard.contextual_variable_map = _.groupBy(contextual_variables_map, (d) => d.form_id);

    // Group the contextual variables by item code first 
    const groupedContextualVariables = _.groupBy(contextual_variables, (d) => d.item_code);
    // Get the contextual_variables alone for now 
    // TODO add patient and safety concerns 
    // Then group by form ID for easy access 
    const subGroupedContextualVariables = _.groupBy(groupedContextualVariables['CBME_contextual_variables'] || [], (d) => d.form_id);
    // For each form ID then further sub group by assessment ID
    _.map(subGroupedContextualVariables, (values, formID) => {
        subGroupedContextualVariables[formID] = _.groupBy(values, (d) => d.dassessment_id);
    });

    var processedData = _.map(assessments_fixed, (record) => {

        const contextual_variables_by_form = subGroupedContextualVariables[record.form_id] || {},
            situationContextCollection = contextual_variables_by_form[record.dassessment_id] || [];

        // Map the rating for the record based on the descriptor ID
        const rating = _.find(rating_scale_map, d => d.descriptor_id == record.selected_descriptor_id) || { 'order': 1 };

        return {
            username,
            Date: moment(record.encounter_date, 'MMM DD, YYYY').format('YYYY-MM-DD'),
            EPA: recordEPAtoNumber(record),
            Assessor_Name: record.assessor,
            Feedback: processComments(record),
            Assessor_Group: getAssessorType(record['assessor_group'], record['assessor_role']),
            Professionalism_Safety: '',
            Rating: rating.order,
            Rating_Text: '(' + rating.order + ') ' + (rating.text || ''),
            Resident_Name: fullname,
            Situation_Context: _.map(situationContextCollection, (e) => e.item_text + " : " + e.text).join("\n"),
            Type: record.form_type,
            situationContextCollection,
            formID: record.form_id,
            formTitle: record.title,
            Academic_Year: getAcademicYear(moment(record.encounter_date, 'MMM DD, YYYY').format('YYYY-MM-DD')),
            scale: scale_map[rating.scale_id] || ['Resident Entrustment'],
            scaleTitle: scale_title_map[rating.scale_id] || ['No Matching Scale'],
            progress: record.progress,
            Expiry_Date: record.expiry_date,
            isExpired: ((record.progress == 'inprogress') && (moment().isAfter(moment(record.expiry_date, 'MMM DD, YYYY'))))
        }
    });

    // remove unmapped assessments
    let validAssessmentData = processedData.filter((d) => d.EPA != 'unmapped');

    // Group assessments by progress type and only consider the complete assessments 
    const assessmentDataGroup = _.groupBy(validAssessmentData, d => d.progress),
        residentData = assessmentDataGroup['complete'] || [],
        expiredData = _.filter(assessmentDataGroup['inprogress'], d => d.isExpired);

    // process the rotation schedule data 
    var rotationSchedule = processRotationSchedule(rotation_schedule, course_name);

    return { programInfo, residentData, rotationSchedule, expiredData };
}

// If group and role are same just return group, if not add the role type to the group
let getAssessorType = (group = '', role = '') => (group == role) ? group : group + ' (' + role + ')';

function getProgramInfo(epa_list, epaProgress, course_name) {

    let defaultSourceMap = {};

    let epa_map_grouped_stage = _.groupBy(epa_list, d => d.stage_code);

    // Loop over every training stage and for each stage create an empty reference map
    _.map(dashboard_options.dashboard_stages, (training_stage, training_stage_index) => {

        const training_stage_source_map_index = training_stage_index + 1;

        defaultSourceMap[training_stage_source_map_index] = {
            'ID': training_stage.target_code,
            'topic': training_stage.target_label,
            subRoot: {},
            maxObservation: {},
            observed: {},
            completed: {},
            achieved: {},
            objectiveID: {},
            assessmentInfo: {},
            filterValuesDict: {}
        }

        // Map over each EPA in a training stage and append it to its corresponding entry in the sourcemap 
        _.map(epa_map_grouped_stage[training_stage.target_code] || [], (epa, epa_index) => {

            // first find the corresponding EPA from the progess list 
            let matchingEPA = _.find(epaProgress, (d) => d.objective_id == epa.target_id);

            // If a matchine EPA is not found stub it
            if (!matchingEPA) {
                matchingEPA = {};
            }

            // The epas are remapped into the older naming convention of 1.1, 1.2, 2.1,2.2 etc depending on training stage and epa index
            // this is to ensure compatibility with older code
            const epa_id = `${training_stage_source_map_index}.${epa_index + 1}`;

            try {
                // set the EPA label
                defaultSourceMap[training_stage_source_map_index].subRoot[epa_id] = decodeHtmlEntity(epa.target_title);
                // set the EPA required observation count 
                defaultSourceMap[training_stage_source_map_index].maxObservation[epa_id] = matchingEPA.total_assessments_required || 0;
                // set the EPA achieved count 
                defaultSourceMap[training_stage_source_map_index].observed[epa_id] = matchingEPA.total_assessment_attempts || 0;
                // set the observed count 
                defaultSourceMap[training_stage_source_map_index].achieved[epa_id] = matchingEPA.total_requirement_met_assessments || 0;
                // set the completed flag 
                defaultSourceMap[training_stage_source_map_index].completed[epa_id] = matchingEPA.completed || false;
                // set the EPA objective ID 
                defaultSourceMap[training_stage_source_map_index].objectiveID[epa_id] = matchingEPA.objective_id || false;
                // store the objective code as reusable reference
                window.dynamicDashboard.epa_map[epa.target_code] = epa_id;

            } catch (error) {
                console.log(error);
            }
        });
    });


    return {
        programName: course_name,
        'epaSourceMap': { ...defaultSourceMap }
    }
}

function recordEPAtoNumber(record) {
    if (record.mapped_epas.length > 0) {
        return EPATextToNumber(record.mapped_epas[0].objective_code || 'unmapped');
    }
    else { return 'unmapped' };
}

function processComments(record) {
    // if comments exists parse them
    if (record.comments && record.comments.length > 0) {
        // The comments can be of multiple types
        // the comment of the type label: "Based on this..."
        // are the regular feedback so add them in first
        // sometimes there are multiple entries of this type, which can happen
        // if they enter a comment first and then edit it and save it
        // so get the longest comment 
        let groupedComments = _.partition(record.comments, (d) => d.label.indexOf('Based on this') > -1);
        // the grouped comments is an array the first index contains all comments which are the feedback type
        // usually this is just one comment but sometimes the same entry gets
        // written multiple times so in those cases reduce it to the longest one.
        let comment = _.reduce(groupedComments[0], (acc, d) => d.text.length > acc.length ? d.text : acc, '');

        // if the comment is non empty add an empty line after it.
        comment = comment.length > 0 ? comment + '\n\n' : comment;

        // loop over any other comments if they exist
        _.map(groupedComments[1] || [], (d) => {
            // for each , first add an empty line and then a gap line
            // Also capitalize the item title
            comment += d.label.toLocaleUpperCase() + ": " + d.text + '\n\n';
        });

        return comment;
    }
    return '';
}


function processRotationSchedule(rotationList, courseName) {

    // Filter rotation schedules that are set by the course schedule group
    // and ignore other schedule groups. 
    let releventRotationScheduleList = _.filter(rotationList, s => courseName.indexOf(s.schedule_group) > -1);

    return releventRotationScheduleList.map((r, rotationID) => ({
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