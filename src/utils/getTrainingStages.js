import _ from 'lodash';

export default function () {
    // access the training stages 
    return _.flatten(dashboard_options.dashboard_stages)
        .map((d) => d.target_label.split(" ").join("-").toLowerCase());
}