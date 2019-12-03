<template>
    <div class="TraitGraph">
        <div class="canvasWrap">
            <canvas id="trait-graph" class="canvas"></canvas>
        </div>
    </div>
</template>

<script>
import Chart from "chart.js";

export default {
    name: "TraitGraph",
    data() {
        return {
            audioFeatures: {
                valence: {
                    color: 'rgba(242, 142, 43,',
                    title: "Happiness",
                },
                energy: {
                    color: 'rgba(89, 161, 79,',
                    title: "Energy",
                },
                danceability: {
                    color: 'rgba(78, 121, 167,',
                    title: "Danceability",
                },
                banger: {
                    color: 'rgba(225, 87, 89,',
                    title: "Bangerable",
                },
            },
            graph: null,
            current: this.current,
            tooltip: null,
        };
    },
    methods: {
        //updating chart to new trend
        renderChart() {
            var options = {
                type: "radar",
                data: {
                    labels: ['Happiness', 'Energy', 'Danceability', ['Banger','Level']],
                    datasets: [
                        {
                            label: "Averages",
                            data: this.values,
                            borderWidth: 2.5,
                            pointBorderWidth: 0.1,
                            hitRadius: 8,
                            pointRadius: 3.5,
                            pointHoverRadius: 5,
                            borderColor: 'rgba(242, 142, 43,.8)',
                            backgroundColor: 'rgba(242, 142, 43,.4)',
                            lineTension: .5,
                            pointBackgroundColor: 'rgba(242, 142, 43,.8)',
                            borderCapStyle: 'butt',
                            fill: true,
                            pointHoverBorderColor: 'rgb(255,255,255)',
                            pointHoverBackgroundColor: 'rgb(255,255,255)',
                        }
                    ]
                },
                options: {
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
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
                    scale: {
                        pointLabels: {
                            display: true,
                        },
                        angleLines: {
                            display: true,
                            color: 'rgba(200,200,200, .2)',
                            lineWidth: 2,
                        },
                        gridLines: {
                            color: 'rgba(200,200,200, .1)',
                        },
                        ticks: {
                            display: false,
                            max: 100,
                            min: 0,
                        }
                    }
                }
            };
            console.log(options);
            var ctx = document
                .getElementById("trait-graph")
                .getContext("2d");
            this.graph = new Chart(ctx, options);
        }
    },
    computed: {
        values() {
            let keys = Object.keys(this.audioFeatures);
            let valueSet = [];
            for (let i = 0; i < keys.length; i++) {
                console.log(keys[i]);
                if (keys[i] == 'tempo') {
                    console.log("FOUND TEMPO");
                    valueSet.push(Math.round(this.audioFeaturesStore[keys[i]].value - 92));
                }
                else if (keys[i] == 'loudness') {
                    valueSet.push(Math.round((1 + this.audioFeaturesStore[keys[i]].value / 50) * 100));
                }
                else {
                    valueSet.push(Math.round(this.audioFeaturesStore[keys[i]].value * 100));
                }
            }
            return valueSet;
        },
        audioFeaturesStore() {
            return this.$store.state.audioFeatures;
        }
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
.TraitGraph {
    display: block;
    background-color: rgba(226, 226, 226, 0);
}

.wrap {
    width: 100%;
    height: 100%;
}

.canvasWrap {
    display: block;
    position: relative;
}

.canvas{
    width: 100%;
    margin: auto;
    height: 100%;
    z-index: 100;
}

</style>