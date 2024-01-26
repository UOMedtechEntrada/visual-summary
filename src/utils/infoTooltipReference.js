
let isFamilyMedicine = dashboard_options.course_name.toLowerCase().indexOf('family medicine') > -1 || false,
    assessmentIdentifierText = isFamilyMedicine ? 'Field Note' : 'EPA',
    assessmentText = isFamilyMedicine ? 'Field Note' : 'assessment',
    dateFilterText = isFamilyMedicine ? `Click this to enable a date filter that allows users to only view field notes that fall in a time period.` : `Click this to enable a date filter that allows users to highlight assessments that fall in a time period. The assessments in the selected time period turn from regular round points to diamond shaped points.`;

export default {
    residentMetrics: {
        main: `This dashboard organizes the ` + assessmentIdentifierText + `s that have been completed by each of the residents in the program with the goal of informing resident learning and comptence committee assessment.`,
        dateFilter: dateFilterText,
        viewHistory: `This button loads rotation schedules from prior years if available.`,
        viewEPAsBlock: `This button displays the number of EPAs completed during the specified rotation. A heat map (from red to green) indicates whether this is below, at, or above 10 EPAs per block.`,
        rotationSchedule: `A chronological map of the one45 rotation schedule of the resident. Hover the mouse over any block to see additional information about that rotation block.`,
        acquisitionMetricsForResident: `The boxes to the left show the amalgamated metrics for ` + assessmentIdentifierText + `s completed by the selected resident. The chart to the right visualizes the weekly ` + assessmentIdentifierText + ` acquisition rate of the resident for the last six months.`,
        recentEPAs: `This graph displays the most recently completed ` + assessmentIdentifierText + `s by time (oldest to newest on the horizontal axis) and entrustment scores on the vertical axis.  The drop-down menu can load the last 10, last 25, last 1 month, or last 3 months of ` + assessmentIdentifierText + `s. Mousing over each ` + assessmentIdentifierText + ` displays additional ` + assessmentIdentifierText + ` details.`,
        showEPATable: `Clicking the 'open book' icon opens a table displaying detailed information on each assessment. The table is sortable (click column header) and searchable (click in the white box and type). This information can also be seen by mousing-over individual ` + assessmentIdentifierText + `s.`,
        showEPAFilter: `Clicking the 'gears' icon opens a list of drop-down menus for contextual variables. When one or more contextual variable is selected the ` + assessmentIdentifierText + `s containing that variable will turn from black to red.`,
        showObjectiveBreakdown: `Clicking the 'info' icon opens a popup with a breakdown of the completed and required objectives for the given ` + assessmentIdentifierText + `.`
    },
    normativeAssessment: {
        main: `This dashboard compares the ` + assessmentIdentifierText + ` completion of each of the residents in the program with the goal of providing normative context to the competence committee.`,
        stages: `Select a resident stage to chart the ` + assessmentIdentifierText + ` metrics of the residents currently in that stage. By default ` + assessmentIdentifierText + ` metrics are mapped for all stages combined. Additional information can be reviewed by selecting the respective graph using the radio buttons below. Finally residents without any data are filtered out by default but this can be toggled using the checkbox.`
    },
    facultyDevlopment: {
        main: `This dashboard organizes all of the ` + assessmentIdentifierText + `s that have been completed for residents in the program by the Faculty member that completed them with the goal of informing faculty development.`,
        filterCourse: `Select an program site to only look at ` + assessmentText + `s completed in that site.`,
        filterFaculty: `Select a specific faculty member for their metrics to be highlighted. Alternatively you can click on any of the bars in the charts below to select that faculty.`,
        filterYear: `Select an academic year to only look at ` + assessmentText + `s completed in that year.`,
        filterOutFacultyWithMinimumRecords: `Adjust this slider to exclude faculty with less than the selected number of ` + assessmentIdentifierText + `s completed. This helps in excluding external reviewers or reviewers from other programs whose data isnt relevant to this program.`,
        acquisitionMetricsForAllFaculty: `These are the amalgamated metrics for ` + assessmentIdentifierText + `s completed by all Faculty in a given program. Mouse-over the ` + assessmentIdentifierText + ` Rating visual to see the proportion of ` + assessmentIdentifierText + `s rated at each level of entrustment. Mouse-over the Training Stage visual to see the proportion of ` + assessmentIdentifierText + `s completed in each stage of training.`,
        FMacquisitionMetricsForAllFaculty: `These are the amalgamated metrics for ` + assessmentIdentifierText + `s completed by all Faculty at a given site. Mouse-over the ` + assessmentIdentifierText + ` Rating visual to see the proportion of ` + assessmentIdentifierText + `s for each supervisory level. `,
        acquisitionMetricsForSingleFaculty: `These are the metrics for ` + assessmentIdentifierText + `s completed by the selected Faculty. Mouse-over the ` + assessmentIdentifierText + ` Rating visual to see the proportion of ` + assessmentIdentifierText + `s rated at each level of entrustment. Mouse-over the Training Stage visual to see the proportion of ` + assessmentIdentifierText + `s completed in each stage of training.`,
        FMacquisitionMetricsForSingleFaculty: `These are the metrics for ` + assessmentIdentifierText + `s completed by the selected Faculty. Mouse-over the ` + assessmentIdentifierText + ` Rating visual to see the proportion of ` + assessmentIdentifierText + `s for each supervisory level.`, 
        EPADistribution: `This spider plot displays the breadth of the ` + assessmentIdentifierText + `s that the Faculty member completes. A Faculty that fills out ` + assessmentIdentifierText + `s in proportion to the program's requirements would display a perfect circle.`,
        totalEPAsObserved: `This chart displays the number of ` + assessmentIdentifierText + `s observed by each faculty member. Mouse-over for each faculty's name and click to highlight that faculty member's data. If a faculty is selected, their ` + assessmentIdentifierText + ` count is shown in the chart title in red.`,
        EPAExpiryRate: `This chart displays the percentage of ` + assessmentIdentifierText + `s sent to each faculty member that expired before completion. Mouse-over for each faculty's name and click to highlight that faculty member's data. `,
        averageEntrustmentScore: `This chart displays the average entrustment score of ` + assessmentIdentifierText + `s completed by each faculty member. Mouse-over for each faculty's name and click to highlight that faculty member's data. If a faculty is selected, their average entrustment score is shown in the chart title in red. `,
        averageSupervisoryLevel:`This chart displays the average supervisory level rating of ` + assessmentIdentifierText + `s completed by each faculty member. Mouse-over for each faculty's name and click to highlight that faculty member's data. If a faculty is selected, their average supervisory rating level is shown in the chart title in red. `,
        averageWordsPerComment: `This chart displays the average number of words per comment included with the ` + assessmentIdentifierText + `s completed by each faculty member. Mouse-over for each faculty's name and click to highlight that faculty member's data. If a faculty is selected, their average words per comment metric is shown in the chart title in red. `,
        summaryOfEPAsByFacultyName: `This table displays ` + assessmentIdentifierText + `s completed by the selected Faculty. It is searchable (click the white box) and sortable (click the column header).`,
        groupAndRole: `The following pie charts show the distribution of the different assessor roles and groups. If a faculty is selected, their group and role are shown in the chart title in red.`
    }
}