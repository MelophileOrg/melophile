<template>
  <div class="TimelineAddedGraph relative window-header-active elevation-2">
        <h1 class="window-header">{{title}}</h1>
        <div class="canvasWrap" :style="{height: height - 8 + 'px', width: width - 8 + 'px'}">
            <canvas :id="'timeline-graph'" class="canvas"></canvas>
            <div class="flex flex-space-between labels" :style="{'--red': + color.red,'--green': + color.green,'--blue': + color.blue, }">
                <h2>Joined Spotify</h2>
                <h2>Today</h2>
            </div>
        </div>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
    name: 'TimelineAddedGraph',
    props: {
        title: { type: String, default: 'Tracks Added Each Month' },
        bars: { type: Array, default: () => { return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0] } },
        width: { type: Number, default: 720 },
        height: { type: Number, default: 300 },
    },
    data: () => ({
        reversedBars: null,
        color: {red: 38, green: 200, blue: 159},
        graph: null,
        current: null,
        tooltip: null,
    }),
    watch: {
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
            return this.bars;
        },
    },
    methods: {
        labels() {
            let labels = [];
            const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let now = new Date();
            let monthIndex = now.getMonth();
            let year = now.getFullYear();
            for (let i = 0; i < this.reversedBars.length; i++) {
                labels.push(MONTHS[monthIndex] + " " + year);
                monthIndex -= 1;
                if (monthIndex < 0) {
                    monthIndex = (MONTHS.length - 1);
                    year -= 1;
                }
            }
            return labels.reverse();
        },
        graphLabels() {
            return "1";
        },
        reverseBars() {
            this.reversedBars = this.bars.reverse();
        },
        //updating chart to new trend
        renderChart() {
            let color1 = "rgba(" + this.color.red + ", " + this.color.green + ", " + this.color.blue + ", " + " 1)";
            let color2 = "rgba(" + this.color.red + ", " + this.color.green + ", " + this.color.blue + ", " + " 1)";
            let color3 = "rgba(" + this.color.red + ", " + this.color.green + ", " + this.color.blue + ", " + " 1)";
            console.log(this.reversedBars);
            var options = {
                type: "line",
                data: {
                    labels: this.labels(),
                    datasets: [
                        {
                            label: "Songs Added",
                            data: this.reversedBars,
                            backgroundColor: color1,
                            borderColor: color3,
                            pointBackgroundColor: color2,
                            borderWidth: 3,
                            pointBorderWidth: 0,
                            hitRadius: 8,
                            pointRadius: 0,
                            pointHoverRadius: 2,
                            pointHoverBorderColor: 'rgb(255,255,255)',
                            pointHoverBackgroundColor: 'rgb(255,255,255)',
                        }
                    ]
                },
                options: {
                    layout: {
                        padding: {
                            left: 12,
                            right: 12,
                            bottom: 0,
                            top: 0,
                        }
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                    legend: {
                        display: false
                    },
                    tooltips: {
                        displayColors: false,
                        backgroundColor: "rgba(0, 6, 20, .8)",
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
                                display: false,
                                position: 'bottom',
                                offset: false,
                                gridLines: {
                                    display: false,
                                },
                                scaleLabel: {
                                    display: false,
                                },
                                ticks: {
                                    min: 0,
                                    autoSkip: false,
                                    maxRotation: 0,
                                    minRotation: 0,
                                    callback: this.graphLabels,
                                    padding: 0,
                                    fontStyle: 'bold',
                                    fontSize: 1,
                                    fontColor: color2,
                                }
                            }
                        ],
                        yAxes: [
                            {
                                display: false,
                                position: 'left',
                                offset: true,
                                gridLines: {
                                    display: true,
                                    drawOnChartArea: false,
                                    color: 'rgba(255,255,255,.3)',
                                    lineWidth: 2,
                                    drawTicks: true,
                                    tickMarkLength: 4,
                                    z: -100,
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: "Number of Songs",
                                    fontColor: 'rgba(255,255,255,.15)',
                                    padding: 0,
                                },
                                ticks: {
                                    min: 0,
                                    autoSkip: true,
                                    autoSkipPadding: this.height / 4,
                                    maxRotation: 0,
                                    minRotation: 0,
                                    padding: 0,
                                    fontColor: 'rgba(255,255,255, .5)',
                                    fontStyle: 'bold',
                                }
                            }
                        ]
                    }
                }
            };
            var ctx = document
                .getElementById("timeline-graph")
                .getContext("2d");
            this.graph = new Chart(ctx, options);
            }
        },
    mounted: async function() {
        await this.reverseBars();
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


<style scoped>
.TimelineAddedGraph {
    --red: 255;
    --green: 255;
    --blue: 255;
    display: block;
    background-color: rgba(226, 226, 226, 0.041);
    padding-top: 16px;
    padding-bottom: 8px;

}

.wrap {
    width: 100%;
    height: 100%;
}

.canvasWrap {
    display: block;
    margin: 0 auto;
    padding-bottom: 22px;
    position: relative;
}

.canvas{
    width: 95%;
    margin: auto;
    height: 100%;
    z-index: 100;
}

.labels {
    --red: 255;
    --green: 255;
    --blue: 255;
    position: absolute;
    left: 0px;
    bottom: 8px;
    margin: 0 14px;
    width: calc(100% - 28px);
}

h2 {
    color: rgba(var(--red), var(--green), var(--blue), 1);
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.151);
    /* color: rgba(255, 255, 255, 0.849); */
    margin: 0;
    font-size: 15px;
    font-weight: normal;
    cursor: default;
}
    
.graph-title {
    color: rgba(255, 255, 255, 0.877);
    font-size: 22px;
    font-weight: lighter;
    width: 100%;
    text-align: left;
    margin: 0 12px;
    margin-bottom: 8px;
}
</style>