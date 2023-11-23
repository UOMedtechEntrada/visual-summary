
export function EPATextToNumber(epa_code = '  ') {
    const { epa_map } = window.dynamicDashboard;
    return epa_map[epa_code];
};

export function NumberToEPAText(epa_number = ' ') {
    const { epa_map } = window.dynamicDashboard;
    return Object.keys(epa_map).find(key => epa_map[key] === epa_number);
}; 
