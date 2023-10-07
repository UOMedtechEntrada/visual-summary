import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setactivePage } from '../redux/actions/actions';
import {
    ResidentDashboard, NormativeDashboard,
    FacultyDashboard, ProgramDashboard,
    RotationImport, OversightDashboard
} from '../components';
import { withTranslation } from "react-i18next";


class DashboardRoot extends Component {

    constructor(props) {
        super(props);
        this.onTabClick = this.onTabClick.bind(this);
    }

    onTabClick(event) {
        event.preventDefault();
        const boardId = event.target.id.split("-")[0];
        this.props.actions.setactivePage(boardId);
    }

    render() {

        let { activePage = 'resident', isUG = false, t } = this.props,
            { dashboard_mode = 'resident', advanced_mode = 'disabled', user_type = 'non-admin' } = dashboard_options;

        // Determine if the user has access to multiple programs to show the program oversight dashboard
        let showProgramOversight = false;
        // A user needs to have access to atleast 3 programs to be able to see the oversight dashboard and compare them
        const course_picker = document.getElementById('cbme-course-picker');
        if (advanced_mode == 'enabled' && course_picker && course_picker.options.length >= 2) {
            showProgramOversight = true;
        }

        let hideScheduleImport = false, residentLabel = t('Resident Dashboard');
        // for UG change labels and hide rotation schedule import page
        if (isUG) {
            hideScheduleImport = true;
            residentLabel = t('Learner Dashboard');
        }

        return (
            <div className='custom-dashboard-page-root' >
                <div>
                    {dashboard_mode != 'resident' &&
                        <div className='no-printing'>
                            <ul className="dashboard-navigation clearfix">
                                <li className={activePage == 'resident' ? 'active' : ''}>
                                    <a data-tip={t("residentMetrics-main")} id='resident-tab' onClick={this.onTabClick} >{residentLabel}</a>
                                </li>
                                <li className={activePage == 'normative' ? 'active' : ''}>
                                    <a data-tip={t("normativeAssessment-main")} id='normative-tab' onClick={this.onTabClick} > {t('Normative Assessment')}</a>
                                </li>
                                {advanced_mode == 'enabled' && <li className={activePage == 'supervisor' ? 'active' : ''}>
                                    <a data-tip={t("facultyDevlopment-main")} id='supervisor-tab' onClick={this.onTabClick} >{t("Faculty Development")}</a>
                                </li>}
                                {advanced_mode == 'enabled' && <li className={activePage == 'program' ? 'active' : ''}>
                                    <a data-tip={t("programEvaluation-main")} id='program-tab' onClick={this.onTabClick} >{t("Program Evaluation")}</a>
                                </li>}
                                {showProgramOversight && <li className={activePage == 'oversight' ? 'active' : ''}>
                                    <a data-tip={t("programOversight-main")} id='oversight-tab' onClick={this.onTabClick} >{t("Program Oversight")}</a>
                                </li>}
                            </ul>
                            <div className='clearfix'></div>
                        </div>}
                    <div className='control-inner-container'>
                        {(activePage == 'resident') && <ResidentDashboard dashboard_mode={dashboard_mode} />}
                        {(activePage == 'normative') && <NormativeDashboard />}
                        {(activePage == 'supervisor') && <FacultyDashboard />}
                        {(activePage == 'program') && <ProgramDashboard />}
                        {(activePage == 'oversight') && <OversightDashboard />}
                        {/* {(activePage == 'rotation') && <RotationImport />} */}
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        programInfo: state.oracle.programInfo,
        activePage: state.oracle.activePage,
        isUG: state.oracle.isUG
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setactivePage }, dispatch)
    };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(DashboardRoot));



