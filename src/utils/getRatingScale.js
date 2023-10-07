import _ from 'lodash';

const PG_SCORE_LIST = [{ "scoreID": "1", "label": "1 - I had to do" },
{ "scoreID": "2", "label": "2 - I had to talk them through" },
{ "scoreID": "3", "label": "3 - I needed to prompt" },
{ "scoreID": "4", "label": "4 - I needed to be there just in case" },
{ "scoreID": "5", "label": "5 - I didn't need to be there" }
];

const UG_SCORE_LIST = [{ "scoreID": "1", "label": "1" },
{ "scoreID": "2", "label": "2" },
{ "scoreID": "3", "label": "3" },
{ "scoreID": "4", "label": "4" },
{ "scoreID": "5", "label": "5" },
{ "scoreID": "6", "label": "6" }
];

const ten_color_scale = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"];

export default function (scaleLength) {
    const scoreList = scaleLength == 6 ? UG_SCORE_LIST : PG_SCORE_LIST;
    const colorScale = ten_color_scale.slice(0, scoreList.length),
        ratingScale = colorScale.map((d, i) => scoreList[i].label);
    return { colorScale, ratingScale };

}