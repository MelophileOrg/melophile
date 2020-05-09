import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
		iconfont: 'mdi',
	},
  theme: {
		light: true,
		themes: {
			light: {
				dark1: '#1D1D1D',
				dark2: '#3F3F3F',
				dark3: '#444444',
				dark4: '#5D5D5D',
				dark5: '#747474',
				dark6: '#7E7E7E',
				dark7: '#818181',
				dark8: '#848484',
				dark9: '#999999',
				dark10: '#BFBFBF',
				dark11: '#D9D9D9',
				dark13: '#EEEEEE',
			},
		},
	},
});
