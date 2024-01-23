import moment from "moment";

const currentYear = moment().month() <= 5 ? moment().year() - 1 : moment().year();
// Go back by 5 years
export const possibleAcademicYears = [4, 3, 2, 1, 0].map(e => {
    let acadYear = currentYear - e;
    return { 'label': acadYear + '-' + (+acadYear + 1), 'value': acadYear };
});

export const currentAcademicYear = possibleAcademicYears[4];

export const getAcademicYearStartDate = function(academicYear) {
    // July 1st
    return new Date(academicYear, 6, 1);
};

export const getAcademicYearEndDate = function(academicYear) {
    // Last day of June
    return new Date(academicYear+1, 6, 0);
};