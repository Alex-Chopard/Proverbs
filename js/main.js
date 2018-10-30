new Alba({
	el: '#app',
	mounted: (el) => {
		el.loadList(el)
	},
	data: {
		proverbs: [],
		newValue: ''
	},
	methods:{
		async deleteProverb (el, id) {
			console.log('dellllllllllllllllllllet', el, id)
			if (id) {
				await fetch(`service.php?action=delete&id=${id}`, {
					credentials: 'same-origin',
				})
				el.loadList(el)
			}
		},
		async addProverb (el) {
			if (el.data.newValue && el.data.newValue.length > 0) {
				await fetch(`service.php?action=add&value=${el.data.newValue}`, {
					credentials: 'same-origin',
				})
				el.data.newValue = ''
				el.loadList(el)
			}
		},
		async loadList (el) {
			const response = await fetch('service.php?action=list', {
				credentials: 'same-origin',
			})
			
			if (response) {
				el.data.proverbs = await response.json()
			}
		}
	}
})
