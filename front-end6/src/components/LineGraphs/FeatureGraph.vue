<template>
    <div class="FeatureGraph" :style="{'--red': + color.r, '--green': + color.r, '--blue': + color.r, width: graph_data.width}">
        <h1 class="graph-title">{{graph_data.title}}</h1>
        <div class="canvasWrap" :style="{height: graph_data.height + 'px', width: graph_data.width + 'px'}">
            <canvas :id="'feature-graph-' + graph_data.title" class="canvas"></canvas>
            <div class="flex flex-space-between labels" :style="{'--red': + color.r,'--green': + color.g,'--blue': + color.b, }">
                <h2>{{audioFeatures[graph_data.feature].xAxis.minValue}}</h2>
                <h2>{{audioFeatures[graph_data.feature].xAxis.maxValue}}</h2>
            </div>

        </div>
    </div>
</template>

<script>
import Chart from "chart.js";

export default {
    name: "FeatureGraph",
    props: {
        graph_data: Object
    },
    data() {
        return {
            audioFeatures: {
                acousticness: {
                    color: 'rgba(237, 201, 72,',
                    xAxis: {
                        title: "Acousticness",
                        minValue: "Synthasized",
                        maxValue: "Acoustic",
                    },
                },
                danceability: {
                    color: 'rgba(78, 121, 167,',
                    xAxis: {
                        title: "Danceability",
                        minValue: "Couch Potato",
                        maxValue: "Let's Dance!",
                    },
                },
                energy: {
                    color: 'rgba(89, 161, 79,',
                    xAxis: {
                        title: "Energy",
                        minValue: "Peaceful",
                        maxValue: "Hyper",
                    },
                },
                instrumentalness: {
                    color: 'rgba(255, 157, 167,',
                    xAxis: {
                        title: "Instrumentalness",
                        minValue: "Singing",
                        maxValue: "Instrumental",
                    },
                },
                liveness: {
                    color: 'rgba(176, 122, 161,',
                    xAxis: {
                        title: "Liveness",
                        minValue: "Recorded",
                        maxValue: "Live",
                    },
                },
                loudness: {
                    color: 'rgba(242, 142, 43,',
                    xAxis: {
                        title: "Loudness",
                        minValue: "Quiet",
                        maxValue: "Loud",
                    },
                },
                speechiness: {
                    color: 'rgba(156, 117, 95,',
                    xAxis: {
                        title: "Speechiness",
                        minValue: "Singing",
                        maxValue: "Talking",
                    },
                },
                valence: {
                    color: 'rgba(242, 142, 43,',
                    xAxis: {
                        title: "Happiness",
                        minValue: "Depressing",
                        maxValue: "Happy",
                    },
                },
                tempo: {
                    color: 'rgba(225, 87, 89,',
                    xAxis: {
                        title: "Tempo",
                        minValue: "Slow",
                        maxValue: "Fast",
                    },
                },
                banger: {
                    color: 'rgba(225, 87, 89,',
                    xAxis: {
                        title: "Bangerable",
                        minValue: "*Snore*",
                        maxValue: "Bangers",
                    },
                },
            },
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
            return this.graph_data.bars;
        },
        color() {
            let re = RegExp(/\d+/i, 'g');
            let r = parseInt(re.exec(this.audioFeatures[this.graph_data.feature].color), 10);
            let g = parseInt(re.exec(this.audioFeatures[this.graph_data.feature].color), 10);
            let b = parseInt(re.exec(this.audioFeatures[this.graph_data.feature].color), 10);
            console.log("SDKLJF:SDF");
            console.log(r, g , b);
            return { r: r,  g: g,  b: b }
        },
    },
    methods: {
        graphLabels(value) {
            if (value == this.audioFeatures[this.graph_data.feature].xAxis.title + ": 0%") {
                return this.audioFeatures[this.graph_data.feature].xAxis.minValue;
            }
            if (value == this.audioFeatures[this.graph_data.feature].xAxis.title + ": 100%") {
                return this.audioFeatures[this.graph_data.feature].xAxis.maxValue;
            }
            return "";
        },
        labels() {
            let labels = [];
            for (let i = 0; i < 11; i++) {
                labels.push(this.audioFeatures[this.graph_data.feature].xAxis.title + ": " + (i * 10) + "%");
            }
            return labels;
        },
        //updating chart to new trend
        renderChart() {
            let color1 = this.audioFeatures[this.graph_data.feature].color + ' 0.2)';
            let color2 = this.audioFeatures[this.graph_data.feature].color + ' 0.8)';
            let color3 = this.audioFeatures[this.graph_data.feature].color + ' 0.6)';
            var options = {
                type: "line",
                data: {
                    labels: this.labels(),
                    datasets: [
                        {
                            label: "Songs",
                            data: this.values,
                            backgroundColor: color1,
                            borderColor: color3,
                            pointBackgroundColor: color2,
                            borderWidth: 2.5,
                            pointBorderWidth: 0.1,
                            hitRadius: 8,
                            pointRadius: 3.5,
                            pointHoverRadius: 5,
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
                                    display: false,
                                    labelString: "Number of Songs",
                                    fontColor: 'rgba(255,255,255,.15)',
                                    padding: 0,
                                },
                                ticks: {
                                    min: 0,
                                    autoSkip: true,
                                    autoSkipPadding: this.graph_data.height / 4,
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
                .getElementById("feature-graph-" + this.graph_data.title)
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

<style scoped>
.FeatureGraph {
    --red: 255;
    --green: 255;
    --blue: 255;
    display: block;
    background-color: rgba(226, 226, 226, 0.041);
    padding-top: 18px;

}

.wrap {
    width: 100%;
    height: 100%;
}

.canvasWrap {
    display: block;
    padding-bottom: 22px;
    position: relative;
}

.canvas{
    width: 100%;
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
    color: rgba(var(--red), var(--green), var(--blue), 0.8);
    margin: 0;
    font-size: 15px;
    font-weight: lighter;
    cursor: default;
}
    
.graph-title {
    color: rgba(255, 255, 255, 0.877);
    font-size: 22px;
    font-weight: lighter;
    width: 100%;
    margin-bottom: 30px;
}
</style>