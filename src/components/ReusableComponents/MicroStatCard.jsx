import React from 'react';
import { withTranslation } from "react-i18next";

export default withTranslation()((props) => {

    const { title = '', type = 'primary', metric = '', dual = false, secondMetric = '', t } = props;

    return <div className="statcard-root micro-stat text-xs-center">
        <div className={"statcard statcard-" + type}>
            <div className="p-a">
                <span className="statcard-desc">{title}</span>
                {dual ?
                    <div>
                        <h2 className="statcard-number text-center"> {metric}
                            <span className='statcard-inner'>{t("overall")}</span>
                        </h2>
                        <h2 className="statcard-number text-center"> {secondMetric}
                            <span className='statcard-inner'>{t("period")}</span>
                        </h2>
                    </div> :
                    <h2 className="statcard-number "> {metric}</h2>}
            </div>
        </div>
    </div>
});
