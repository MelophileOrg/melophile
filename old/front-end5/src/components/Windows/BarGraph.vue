<template>
  <div class="bargraph">
    <canvas :id="'bar-graph-' + title"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js';

export default {
    name: 'bargraph',
    props: {
        title: String,
        data: Array,
        xAxis: 
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
                            type: "",
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
.bargraph {

}
</style>