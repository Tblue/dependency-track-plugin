

/**
 * Renders a trend chart in the specified div using ECharts.
 *
 * @param {String} chartDivId - the ID of the div where the chart should be shown in
 * @param {JSON} chartModel - the line chart model
 */
function renderTrendChart(chartDivId, chartModel) {
    var chart = echarts.init(document.getElementById(chartDivId));

    var builds = [];
    var critical = [];
    var high = [];
    var medium = [];
    var low = [];
    var info = [];
    var unassigned = [];
    for (var i=0; i<chartModel.length; i++) {
        builds.unshift("#" + chartModel[i].buildNumber);
        critical.unshift(chartModel[i].critical);
        high.unshift(chartModel[i].high);
        medium.unshift(chartModel[i].medium);
        low.unshift(chartModel[i].low);
        info.unshift(chartModel[i].info);
        unassigned.unshift(chartModel[i].unassigned);
    }

    var options = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Critical', 'High', 'Medium', 'Low'],
            orient: 'horizontal',
            x: 'center',
            y: 'bottom'
        },
        grid: {
            left: '20',
            right: '10',
            bottom: '20',
            top: '10',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : builds
            }
        ],
        yAxis : [
            {
                name: 'vulnerabilities',
                nameLocation: 'center',
                boundaryGap : false,
                nameGap: '30',
                nameRotate: '90',
                type: 'value'
            }
        ],
        color: ['#dc0000', '#fd8c00', '#fdc500', '#4cae4c'],
        series : [
            {
                name: 'Critical',
                type: 'line',
                data: critical
            },
            {
                name: 'High',
                type: 'line',
                data: high
            },
            {
                name: 'Medium',
                type: 'line',
                data: medium
            },
            {
                name: 'Low',
                type: 'line',
                data: low
            }
        ]
    };

    chart.setOption(options);
    chart.resize();
    window.onresize = function() {
        chart.resize();
    };
}

/**
 * Renders a ecosystem chart in the specified div using ECharts.
 *
 * @param {String} chartDivId - the ID of the div where the chart should be shown in
 * @param {JSON} chartModel - the line chart model
 */
function renderEcosystemChart(chartDivId, chartModel) {
    var chart = echarts.init(document.getElementById(chartDivId));
    var options = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            y: '250px',
            data:['npm','maven']
        },
        series: [
            {
                name:'Vulnerabilities',
                type:'pie',
                radius: ['100%', '0%'],
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show: false,
                    },
                    emphasis: {
                        show: false,
                    }
                },

                data:[
                    {value:30, name:'npm'},
                    {value:50, name:'maven'},
                ]
            }
        ]
    };

    chart.setOption(options);
    chart.resize();
    window.onresize = function() {
        chart.resize();
    };
}

/**
 * Generates a responsive progress bar consisting of all severities.
 *
 * @param targetId the ID of the element to insert the bar in
 * @param label the label to give the bar
 * @param critical the number of critical severity vulnerabilities
 * @param high the number of high severity vulnerabilities
 * @param medium the number of medium severity vulnerabilities
 * @param low the number of low severity vulnerabilities
 * @param info the number of info-level issues
 * @param unassigned the number of issues with unassigned severity
 */
function generateSeverityDistributionBar(targetId, label, critical, high, medium, low, info, unassigned) {
    var percentCritical = (critical/(critical+high+medium+low+info+unassigned))*100;
    var percentHigh = (high/(critical+high+medium+low+info+unassigned))*100;
    var percentMedium = (medium/(critical+high+medium+low+info+unassigned))*100;
    var percentLow = (low/(critical+high+medium+low+info+unassigned))*100;
    var percentInfo = (info/(critical+high+medium+low+info+unassigned))*100;
    var percentUnassigned = (unassigned/(critical+high+medium+low+info+unassigned))*100;
    var block = '<span class="dtrack-section-label ">' + label + '</span><div class="severity-distribution">';
    if (critical > 0) {
        block += '<div class="severity-distribution-bar severity-critical-bg dtrack-tooltip" title="Critical: ' + critical + ' (' + Math.round(percentCritical*10)/10 + '%)" style="width:' + percentCritical+ '%">' + critical + '</div>';
    }
    if (high > 0) {
        block += '<div class="severity-distribution-bar severity-high-bg dtrack-tooltip" title="High: ' + high + ' (' + Math.round(percentHigh*10)/10 + '%)" style="width:' + percentHigh + '%">' + high + '</div>';
    }
    if (medium > 0) {
        block += '<div class="severity-distribution-bar severity-medium-bg dtrack-tooltip" title="Medium: ' + medium + ' (' + Math.round(percentMedium*10)/10 + '%)" style="width:' + percentMedium + '%">' + medium + '</div>';
    }
    if (low > 0) {
        block += '<div class="severity-distribution-bar severity-low-bg dtrack-tooltip" title="Low: ' + low + ' (' + Math.round(percentLow*10)/10 + '%)" style="width:' + percentLow + '%">' + low + '</div>';
    }
    if (info > 0) {
        block += '<div class="severity-distribution-bar severity-info-bg dtrack-tooltip" title="Info: ' + info + ' (' + Math.round(percentInfo*10)/10 + '%)" style="width:' + percentInfo + '%">' + info + '</div>';
    }
    if (unassigned > 0) {
        block += '<div class="severity-distribution-bar severity-unassigned-bg dtrack-tooltip" title="Unassigned: ' + unassigned + ' (' + Math.round(percentUnassigned*10)/10 + '%)" style="width:' + percentUnassigned + '%">' + unassigned + '</div>';
    }
    if (critical === 0 && high === 0 && medium === 0 && low === 0 && info === 0 && unassigned === 0) {
        block += '<div class="severity-distribution-bar severity-info-bg dtrack-tooltip" title="No Vulnerabilities Found" style="width:100%">No Vulnerabilities Found</div>';
    }
    block += '</div>';
    document.getElementById(targetId).innerHTML = block;
    Tipped.create('.dtrack-tooltip');
}