<template>
    <div class="LineGraphPercent wrap">
        <div class="canvasWrap" :style="'height:'+height">
            <canvas :id="'line-graph-percent-' + title" class="canvas"></canvas>
        </div>
    </div>
</template>

<script>
import Chart from "chart.js";

export default {
    name: "LineGraphPercent",
    props: {
        title: String,
        data: Array,
        xAxis: String,
        yAxis: String,
        height: Number,
    },
    //handle active element color
    mounted: function() {
        this.renderChart();
        if (this.active) {
            this.graph.config.data.datasets[0]["pointBackgroundColor"][
                this.active - 1
            ] = "white";
            this.graph.update();
        }
    },
    watch: {
        //activate graph tooltip on element hover
        current: function() {
            if (this.tooltip) {
                var activeElements = this.graph.tooltip._active;
                var requestedElem = this.graph.getDatasetMeta(this.tooltip[0])
                    .data[this.tooltip[1]];
                for (var i = 0; i < activeElements.length; i++) {
                    if (requestedElem._index == activeElements[i]._index) {
                        activeElements.splice(i, 1);
                        break;
                    }
                }
                this.graph.tooltip._active = activeElements;
                this.graph.tooltip.update(true);
                this.graph.draw();
                this.tooltip = null;
            }
            if (this.isHoverable()) {
                var datasetIndex = 0;
                var pointIndex = this.current.atomicNumber - 1;
                if (this.trend === "Atomic Radius") {
                    if (
                        this.current.atomicNumber > 70 &&
                        this.current.atomicNumber < 84
                    ) {
                        var pointIndex = this.current.atomicNumber - 14;
                    }
                } else if (this.trend === "Electronegativity") {
                    if (
                        [3, 4, 5, 6, 7, 8, 9].includes(
                            this.current.atomicNumber
                        )
                    ) {
                        var pointIndex = this.current.atomicNumber - 2;
                    } else if (
                        [11, 12, 13, 14, 15, 16, 17].includes(
                            this.current.atomicNumber
                        )
                    ) {
                        var pointIndex = this.current.atomicNumber - 3;
                    } else if (
                        this.current.atomicNumber > 18 &&
                        this.current.atomicNumber < 86
                    ) {
                        var pointIndex = this.current.atomicNumber - 4;
                    } else if (this.current.atomicNumber > 86) {
                        var pointIndex = this.current.atomicNumber - 5;
                    }
                } else if (this.trend === "Density") {
                    if (
                        this.current.atomicNumber > 87 &&
                        this.current.atomicNumber < 96
                    ) {
                        var pointIndex = this.current.atomicNumber - 3;
                    } else if (
                        [96, 97, 98].includes(this.current.atomicNumber)
                    ) {
                        var pointIndex = this.current.atomicNumber - 4;
                    }
                }
                if (this.graph.tooltip._active == undefined)
                    this.graph.tooltip._active = [];
                var activeElements = this.graph.tooltip._active;
                var requestedElem = this.graph.getDatasetMeta(datasetIndex)
                    .data[pointIndex];
                activeElements.push(requestedElem);
                this.graph.tooltip._active = activeElements;
                this.graph.tooltip.update(true);
                this.graph.draw();
                this.tooltip = [datasetIndex, pointIndex];
            }
        }
    },
    data() {
        return {
            graph: null,
            current: this.current,
            tooltip: null,
        };
    },
    methods: {
        //updating chart to new trend
        renderChart() {
            var options = {
                type: "line",
                data: {
                    labels: atomicNumbers,
                    datasets: [
                        {
                            label: label,
                            data: trendToGraph,
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
                            pointBackgroundColor: pointBackgroundColor,
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
                        backgroundColor: "rgba(0, 6, 20, 0.7)",
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
                                display: false
                            }
                        ],
                        yAxes: [
                            {
                                display: false
                            }
                        ]
                    }
                }
            };
            var ctx = document
                .getElementById("line-graph-percent-" + this.title)
                .getContext("2d");
            this.graph = new Chart(ctx, options);
        }
    }
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