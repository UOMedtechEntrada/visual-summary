import _ from 'lodash';

export default function (learnerListDataDump) {

    let [learnerList, learnerMetricsList] = learnerListDataDump;

    const stageMap = getStageMap();
    // First remap the metrics in metrics list into arrays from strings
    _.map(learnerMetricsList, (d, key) => { learnerMetricsList[key] = JSON.parse(d) });

    // Then map these metrics into the main learner list 
    return _.map(learnerList, (learner, learnerIndex) =>
    ({
        "username": learner.proxy_id,
        "fullname": learnerMetricsList['resident_names'][learnerIndex].split(',').join(''),
        "currentPhase": stageMap[learner.active_stage] || _.values(stageMap)[0],
        "programStartDate": "2020-07-01T06:00:00.000Z",
        "leanerLevel": learner.learner_level,
        "number": learner.number,
        "stageProgress": learner.stage_data,
        "epaProgress": _.map(learner.learner_epa_progress, (d) => JSON.parse(d) || '{}'),
        "totalAssessments": learner.total_assessments,
        "totalProgress": learner.total_progress,
        "completedAssessments": learnerMetricsList['completed_assessments'][learnerIndex],
        "achievementRate": learnerMetricsList['achievement_rate'][learnerIndex],
        "color": learnerMetricsList['total_background_color'][learnerIndex]
    }));
}


function getStageMap() {
    // remap training stages into easily accessible object by stage code
    let stageMap = {};
    _.map(dashboard_filter_options.advanced_search_stages, (stage) => {
        stageMap[stage.target_id] = stage.target_label.toLowerCase().split(' ').join("-")
    });
    return stageMap;
}
