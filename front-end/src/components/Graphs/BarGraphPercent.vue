<template>
  <div class="bargraphpercent">
    <canvas :id="'bar-graph-percent-' + title"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js';

export default {
    name: 'bargraphpercent',
    props: {
        title: String,
        data: Array,
        xAxis: String,
        yAxis: String,
    },
    methods: {
        createData() {
            let chartData = {
                type: 'bar',
                data: {
                    datasets: [
                        
                    ]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: this.title,
                    },
                    scales: {
                        xAxis: [{
                            type: "linear",
                        }],
                        yAxis: [{
                            type: "linear",
                        }]
                    }
                }
            }
            return chartData;
        },
        createChart(chartId, chartData) {
            const ctx = document.getElementById(chartId);
            const myChart = new Chart(ctx, {
                type: chartData.type,
                data: chartData.data,
                options: chartData.options,
            });
        }
    },
    computed: {
        labels() {
            return this.data.map(bar => bar.label);
        },
        values() {
            return this.data.map(bar => bar.value);
        }
    },
    mounted() {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bargraphpercent {

}
</style>