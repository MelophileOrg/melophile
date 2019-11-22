<template>
    <div class="FeatureGraph wrap">
        <div class="canvasWrap" :style="'height:'+height">
            <canvas :id="'feature-graph-' + title" class="canvas"></canvas>
        </div>
    </div>
</template>

<script>
import Chart from "chart.js";

export default {
    name: "FeatureGraph",
    // props: {
    //     title: String,
    //     data: Array,
    //     xAxis: String,
    //     yAxis: String,
    //     height: Number,
    // },

    data() {
        return {
            title: "Happiness Distribution",
            feature: "Happiness",
            color: 0,
            colors: [    
                'rbga(237, 201, 72,',
                'rbga(78, 121, 167,',
                'rbga(89, 161, 79,',
                'rbga(255, 157, 167,',
                'rbga(176, 122, 161,',
                'rbga(242, 142, 43,',
                'rbga(156, 117, 95,',
                'rbga(242, 142, 43,',
                'rbga(225, 87, 89,',
                'rbga(225, 87, 89,',
                'rbga(74, 189, 180,',
                'rbga(180, 189, 74,',
            ],
            data: [
                {value: 0, label: 0},
                {value: 5, label: 0},
                {value: 10, label: 0},
                {value: 15, label: 0},
                {value: 18, label: 0},
                {value: 20, label: 0},
                {value: 16, label: 0},
                {value: 14, label: 0},
                {value: 10, label: 0},
                {value: 6, label: 0},
                {value: 2, label: 0},
            ],
            xAxis: "Happiness",
            yAxis: "Number of Songs",
            height: 200,

            graph: null,
            current: this.current,
            tooltip: null,
        };
    },
    watch: {
        //activate graph tooltip on element hover
        current: function() {
            if (this.tooltip) {
                var activeValues = this.graph.tooltip._active;
                var requestedValues = this.graph.getDatasetMeta(this.tooltip[0])
                    .data[this.tooltip[1]];
                for (var i = 0; i < activeValues.length; i++) {
                    if (requestedValues._index == activeValues[i]._index) {
                        activeValues.splice(i, 1);
                        break;
                    }
                }
                this.graph.tooltip._active = activeValues;
                this.graph.tooltip.update(true);
                this.graph.draw();
                this.tooltip = null;
            }
            var datasetIndex = 0;
            var pointIndex = this.current.value - 1;
            if (this.graph.tooltip._active == undefined)
                this.graph.tooltip._active = [];
            activeValues = this.graph.tooltip._active;
            requestedValues = this.graph.getDatasetMeta(datasetIndex)
                .data[pointIndex];
            activeValues.push(requestedValues);
            this.graph.tooltip._active = activeValues;
            this.graph.tooltip.update(true);
            this.graph.draw();
            this.tooltip = [datasetIndex, pointIndex];
            
        }
    },
    computed: {
        values() {
            return this.data.map(item => item.value);
        }
    },
    methods: {
        //updating chart to new trend
        renderChart() {
            let color1 = this.colors[this.color] + ' 0.2)';
            let color2 = this.colors[this.color] + ' 0.8)'
            var options = {
                type: "line",
                data: {
                    labels: ["Sad", "","","","","","","","","","Happy"],
                    datasets: [
                        {
                            label: this.feature,
                            data: this.values,
                            backgroundColor: color1,
                            borderColor: color2,
                            pointBackgroundColor: color2,
                            borderWidth: 2.5,
                            pointBorderWidth: 0.1,
                            hitRadius: 5,
                            pointRadius: 2.5,
                            pointHoverRadius: 5
                        }
                    ]
                },
                options: {
                    layout: {
                        padding: {
                            left: 10,
                            right: 10
                        }
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    legend: {
                        display: false
                    },
                    tooltips: {
                        displayColors: false,
                        backgroundColor: "rgba(0, 6, 20, 0)",
                        titleFontStyle: "semi-bold",
                        titleFontFamily: "'Open sans', sans-serif",
                        bodyFontFamily: "'Open sans', sans-serif",
                        bodyFontColor: "rgba(255, 255, 255, 0.7)",
                        xPadding: 10,
                        yPadding: 10,
                        cornerRadius: 0
                    },
                    scales: {
                        xAxes: [
                            {
                                display: true,
                                position: 'bottom',
                                offset: true,
                                gridLines: {
                                    display: false,
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: this.xAxis,
                                },
                                ticks: {

                                }
                            }
                        ],
                        yAxes: [
                            {
                                display: true,
                                position: 'left',
                                offset: true,
                            }
                        ]
                    }
                }
            };
            var ctx = document
                .getElementById("feature-graph-" + this.title)
                .getContext("2d");
            this.graph = new Chart(ctx, options);
            }
        },
    mounted: function() {
        this.renderChart();
        if (this.active) {
            this.graph.config.data.datasets[0]["pointBackgroundColor"][
                this.active - 1
            ] = "white";
            this.graph.update();
        }
    },
};
</script>

<style lang="scss">
.wrap {
    width: 100%;
    height: 100%;
}
.canvasWrap {
    display: block;
    height: 11.8vw;
    margin-top: 0.18vw;
}

.canvas{
    width: 100%;
    margin: auto;
    height: 100%;
    z-index: 100;
}
</style>