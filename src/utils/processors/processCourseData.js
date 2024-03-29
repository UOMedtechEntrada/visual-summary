import _ from 'lodash';

export default function (learnerListDataDump, dashboardMode = 'faculty') {

    let [learnerList, learnerMetricsList = [], learner_assessment_counts = []] = learnerListDataDump;

    // The following info is fetched only during course load 
    // to prevent repeated hits on server for the same info and stored locally
    const stageMap = getStageMap();
    window.dynamicDashboard = window.dynamicDashboard || {};
    // First remap the metrics in metrics list into arrays from strings
    _.map(learnerMetricsList, (d, key) => { learnerMetricsList[key] = JSON.parse(d) });

    // In resident dashboard mode, the course data only consists of info of one learner
    if (dashboardMode == 'resident') {
        // Then map these metrics` into the main learner list 
        return _.map(learnerList, (learner, learnerIndex) => {
            // Get the total assessment count from all available EPAs
            // If a value is not available sub in the value from the learner metrics
            const totalAssessmentCount = learner.total_assessments;

            const total_completed_assessments = getCompletedAssessmentCount(learner.learner_epa_progress);

            // update the achievement rate to reflect these new numbers
            let achievementRate = totalAssessmentCount !== 0 ? total_completed_assessments / totalAssessmentCount : 0;
            // force the achievement rate to be zero 
            if (isNaN(achievementRate)) {
                achievementRate = 0;
            }

            return ({
                "username": learner.proxy_id,
                "fullname": 'learner_dummy_name',
                "currentPhase": stageMap[learner.active_stage] || _.values(stageMap)[0],
                "stageProgress": learner.stage_data,
                "epaProgress": _.map(learner.learner_epa_progress, (d) => JSON.parse(d) || '{}'),
                "totalValidAssessments": learner.total_assessments,
                "totalAssessments": totalAssessmentCount,
                "totalProgress": learner.total_progress,
                "completedAssessments": total_completed_assessments,
                "achievementRate": Math.round(achievementRate * 100)
            })
        });
    }
    else {
        // Then map these metrics` into the main learner list 
        return _.map(learnerList, (learner, learnerIndex) => {
            // Get the total assessment count for learner count list 
            const matchingLearner = _.find(learner_assessment_counts, (e) => e['proxy_id'] == learner.proxy_id);
            // If a value is not available sub in the value from the learner metrics
            const totalAssessmentCount = matchingLearner ? +matchingLearner.assessment_count : (learner.total_assessments || 0);

            // update the achievement rate to reflect these new numbers
            const achievementRate = totalAssessmentCount !== 0 ? learnerMetricsList['completed_assessments'][learnerIndex] / totalAssessmentCount : 0;

            return ({
                "username": learner.proxy_id,
                "fullname": learnerMetricsList['resident_names'][learnerIndex].split(',').join(''),
                "currentPhase": stageMap[learner.active_stage] || _.values(stageMap)[0],
                "stageProgress": learner.stage_data,
                "epaProgress": _.map(learner.learner_epa_progress, (d) => JSON.parse(d) || '{}'),
                "totalValidAssessments": learner.total_assessments,
                "totalAssessments": totalAssessmentCount,
                "totalProgress": learner.total_progress,
                "completedAssessments": learnerMetricsList['completed_assessments'][learnerIndex] || 0,
                "achievementRate": Math.round(achievementRate * 100)
            })
        });
    }
}


function getStageMap() {
    // remap training stages into easily accessible object by stage code
    let stageMap = {};
    _.map(dashboard_options.dashboard_stages, (stage) => {
        stageMap[stage.target_id] = stage.target_label.toLowerCase().split(' ').join("-")
    });
    return stageMap;
}

function getCompletedAssessmentCount(learner_epa_progress) {
    var learner_epa_list = _.map(learner_epa_progress, (d) => JSON.parse(d) || '{}');
    return _.sumBy(learner_epa_list, d => d.max_requirement_met_assessments);
}
