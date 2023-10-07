const phaseList = dashboard_options.dashboard_stages.map((d) => d.target_code);

export function EPATextToNumber(epa = '  ') {
    let epaParts = epa.split('');
    let value = ((epaParts[0] == phaseList[0] ? '1' :
        epaParts[0] == phaseList[1] ? '2' :
            epaParts[0] == phaseList[2] ? '3' : '4') + '.' + epaParts.slice(1).join(''));
    return value ? value : '';
};

export function NumberToEPAText(epa = '.') {
    let epaParts = epa.split('.');
    let value = ((epaParts[0] == '1' ? phaseList[0] :
        epaParts[0] == '2' ? phaseList[1] :
            epaParts[0] == '3' ? phaseList[2] : phaseList[3]) + epaParts[1]);
    return value ? value : '';
}; 
